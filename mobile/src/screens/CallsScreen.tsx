import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:5000/api'; // Change this to your computer's IP

interface Customer {
  id: string;
  name: string;
  phone: string;
  company: string;
  lastCalled?: string;
  callCount?: number;
  status: 'pending' | 'called' | 'interested' | 'not-interested';
}

interface CallLog {
  id: string;
  customerName: string;
  customerPhone: string;
  duration: number;
  notes: string;
  timestamp: string;
  outcome: string;
}

export default function CallsScreen() {
  const [activeTab, setActiveTab] = useState<'find' | 'logs'>('find');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<'interested' | 'not-interested' | 'callback' | null>(null);

  useEffect(() => {
    if (activeTab === 'find') {
      loadCustomers();
    } else {
      loadCallLogs();
    }
  }, [activeTab]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would fetch from your database
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Smith',
          phone: '+1-555-0101',
          company: 'AT&T Mobile',
          status: 'pending',
          callCount: 0,
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          phone: '+1-555-0102',
          company: 'AT&T Wireless',
          status: 'pending',
          callCount: 0,
        },
        {
          id: '3',
          name: 'Mike Davis',
          phone: '+1-555-0103',
          company: 'AT&T Business',
          status: 'called',
          callCount: 1,
          lastCalled: '2024-08-20',
        },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadCallLogs = async () => {
    setLoading(true);
    try {
      // Mock call logs
      const mockLogs: CallLog[] = [
        {
          id: '1',
          customerName: 'Mike Davis',
          customerPhone: '+1-555-0103',
          duration: 5,
          notes: 'Interested in new plan',
          timestamp: '2024-08-20T14:30:00',
          outcome: 'interested',
        },
        {
          id: '2',
          customerName: 'Jane Wilson',
          customerPhone: '+1-555-0104',
          duration: 2,
          notes: 'Not interested at this time',
          timestamp: '2024-08-19T10:15:00',
          outcome: 'not-interested',
        },
      ];
      setCallLogs(mockLogs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load call logs');
    } finally {
      setLoading(false);
    }
  };

  const handleCallCustomer = (phone: string, name: string) => {
    setSelectedCustomer({
      id: name,
      name,
      phone,
      company: 'AT&T',
      status: 'pending',
    });
    // Initiate the call
    Linking.openURL(`tel:${phone}`);
  };

  const saveCallLog = () => {
    if (!selectedCustomer) return;

    const newLog: CallLog = {
      id: Date.now().toString(),
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      duration: 0,
      notes: callNotes,
      timestamp: new Date().toISOString(),
      outcome: callOutcome || 'callback',
    };

    setCallLogs([newLog, ...callLogs]);
    setSelectedCustomer(null);
    setCallNotes('');
    setCallOutcome(null);
    Alert.alert('Success', 'Call logged successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#95a5a6';
      case 'called':
        return '#3498db';
      case 'interested':
        return '#27ae60';
      case 'not-interested':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'called':
        return '📞 Called';
      case 'interested':
        return '✅ Interested';
      case 'not-interested':
        return '❌ Not Interested';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'find' && styles.activeTab]}
          onPress={() => setActiveTab('find')}
        >
          <MaterialIcons
            name="people"
            size={20}
            color={activeTab === 'find' ? 'white' : '#95a5a6'}
          />
          <Text style={[styles.tabText, activeTab === 'find' && styles.activeTabText]}>
            Find Customers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'logs' && styles.activeTab]}
          onPress={() => setActiveTab('logs')}
        >
          <MaterialIcons
            name="history"
            size={20}
            color={activeTab === 'logs' ? 'white' : '#95a5a6'}
          />
          <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>
            Call Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Find Customers Tab */}
      {activeTab === 'find' && (
        <ScrollView style={styles.content}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#95a5a6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#95a5a6"
            />
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Loading customers...</Text>
            </View>
          ) : customers.length > 0 ? (
            <View style={styles.customersList}>
              {customers
                .filter(c =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.phone.includes(searchQuery)
                )
                .map(customer => (
                  <View key={customer.id} style={styles.customerCard}>
                    <View style={styles.customerInfo}>
                      <View style={styles.customerNameContainer}>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <Text style={styles.customerCompany}>{customer.company}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(customer.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {getStatusLabel(customer.status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.customerPhone}>{customer.phone}</Text>

                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCallCustomer(customer.phone, customer.name)}
                    >
                      <MaterialIcons name="phone" size={18} color="white" />
                      <Text style={styles.callButtonText}>Call Now</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={48} color="#95a5a6" />
              <Text style={styles.emptyText}>No customers found</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Call Logs Tab */}
      {activeTab === 'logs' && (
        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Loading call logs...</Text>
            </View>
          ) : callLogs.length > 0 ? (
            <View style={styles.logsList}>
              {callLogs.map(log => (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <View>
                      <Text style={styles.logName}>{log.customerName}</Text>
                      <Text style={styles.logPhone}>{log.customerPhone}</Text>
                    </View>
                    <View
                      style={[
                        styles.outcomeBadge,
                        {
                          backgroundColor:
                            log.outcome === 'interested'
                              ? '#27ae60'
                              : log.outcome === 'not-interested'
                              ? '#e74c3c'
                              : '#f39c12',
                        },
                      ]}
                    >
                      <Text style={styles.outcomeText}>
                        {log.outcome.replace('-', ' ')}
                      </Text>
                    </View>
                  </View>

                  {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}

                  <Text style={styles.logTime}>
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={48} color="#95a5a6" />
              <Text style={styles.emptyText}>No call logs yet</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Call Log Modal */}
      {selectedCustomer && (
        <View style={styles.callModal}>
          <View style={styles.callModalContent}>
            <Text style={styles.callModalTitle}>Log Call for {selectedCustomer.name}</Text>

            <TextInput
              style={styles.notesInput}
              placeholder="Add call notes..."
              value={callNotes}
              onChangeText={setCallNotes}
              multiline
              placeholderTextColor="#95a5a6"
            />

            <View style={styles.outcomeButtons}>
              <TouchableOpacity
                style={[
                  styles.outcomeButton,
                  callOutcome === 'interested' && styles.outcomeButtonActive,
                ]}
                onPress={() => setCallOutcome('interested')}
              >
                <Text style={styles.outcomeButtonText}>✅ Interested</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.outcomeButton,
                  callOutcome === 'not-interested' && styles.outcomeButtonActive,
                ]}
                onPress={() => setCallOutcome('not-interested')}
              >
                <Text style={styles.outcomeButtonText}>❌ Not Interested</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.outcomeButton,
                  callOutcome === 'callback' && styles.outcomeButtonActive,
                ]}
                onPress={() => setCallOutcome('callback')}
              >
                <Text style={styles.outcomeButtonText}>📞 Callback</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveCallLog}
              >
                <Text style={styles.saveButtonText}>Save Log</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedCustomer(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  customersList: {
    gap: 10,
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerNameContainer: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  customerCompany: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 10,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  callButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#95a5a6',
  },
  logsList: {
    gap: 10,
  },
  logCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  logPhone: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  outcomeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  outcomeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  logNotes: {
    fontSize: 13,
    color: '#666',
    marginVertical: 8,
    fontStyle: 'italic',
  },
  logTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  callModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  callModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  callModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  notesInput: {
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 15,
    fontSize: 14,
  },
  outcomeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  outcomeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    alignItems: 'center',
  },
  outcomeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  outcomeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
