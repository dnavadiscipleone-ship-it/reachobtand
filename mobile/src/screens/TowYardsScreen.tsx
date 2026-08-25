import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.1.100:5000/api'; // Change this to your computer's IP

interface TowYard {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  acceptedPayment: string[];
  capacity: number;
  currentVehicles: number;
}

export default function TowYardsScreen() {
  const [towYards, setTowYards] = useState<TowYard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTowYards();
  }, []);

  const fetchTowYards = async () => {
    try {
      const response = await axios.get(`${API_URL}/tow-yards`);
      setTowYards(response.data);
    } catch (err) {
      setError('Failed to load tow yards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/${encodedAddress}`);
  };

  const getCapacityStatus = (currentVehicles: number, capacity: number) => {
    const percent = (currentVehicles / capacity) * 100;
    if (percent > 80) return 'high';
    if (percent > 50) return 'medium';
    return 'low';
  };

  const getCapacityColor = (status: string) => {
    switch (status) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading tow yards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tow Yards</Text>
        <Text style={styles.subtitle}>Available services in your area</Text>
      </View>

      {towYards.map((yard) => {
        const capacityStatus = getCapacityStatus(yard.currentVehicles, yard.capacity);
        const capacityColor = getCapacityColor(capacityStatus);

        return (
          <View key={yard.id} style={styles.yardCard}>
            <View style={styles.yardHeader}>
              <View style={styles.yardTitleContainer}>
                <Text style={styles.yardName}>{yard.name}</Text>
              </View>
              <View
                style={[
                  styles.capacityBadge,
                  { backgroundColor: capacityColor },
                ]}
              >
                <Text style={styles.capacityText}>
                  {yard.currentVehicles}/{yard.capacity}
                </Text>
              </View>
            </View>

            <View style={styles.yardDetails}>
              <DetailRow icon="location-on" label="Address" value={yard.address} />
              <DetailRow
                icon="phone"
                label="Phone"
                value={yard.phone}
                isLink
                onPress={() => handleCall(yard.phone)}
              />
              <DetailRow
                icon="email"
                label="Email"
                value={yard.email}
              />
              <DetailRow icon="access-time" label="Hours" value={yard.hours} />
              <DetailRow
                icon="payment"
                label="Payment"
                value={yard.acceptedPayment.join(', ')}
              />
            </View>

            <View style={styles.yardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(yard.phone)}
              >
                <MaterialIcons name="phone" size={18} color="white" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.directionsActionButton]}
                onPress={() => handleDirections(yard.address)}
              >
                <MaterialIcons name="directions" size={18} color="white" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, isLink, onPress }) {
  return (
    <TouchableOpacity
      style={styles.detailRow}
      onPress={isLink ? onPress : null}
      disabled={!isLink}
    >
      <View style={styles.detailIconContainer}>
        <MaterialIcons name={icon} size={18} color="#3498db" />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text
          style={[
            styles.detailValue,
            isLink && styles.linkValue,
          ]}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  yardCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  yardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  yardTitleContainer: {
    flex: 1,
  },
  yardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  capacityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  capacityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  yardDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f7fa',
  },
  detailIconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95a5a6',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  linkValue: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  yardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  directionsActionButton: {
    backgroundColor: '#27ae60',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});
