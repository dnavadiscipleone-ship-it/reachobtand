import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SegmentedControlIOS,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.1.181:5000/api';

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('plate');
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/vehicles/search`, {
        params: {
          query: searchQuery.toUpperCase(),
          type: searchType,
        },
      });

      setResults(response.data.vehicles || []);
      setSearched(true);

      if (!response.data.found) {
        Alert.alert('Not Found', `No vehicles found matching "${searchQuery}"`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search vehicles. Make sure the backend is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-yard':
        return '#f39c12';
      case 'ready-for-pickup':
        return '#27ae60';
      case 'picked-up':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-yard':
        return 'In Yard';
      case 'ready-for-pickup':
        return 'Ready for Pickup';
      case 'picked-up':
        return 'Picked Up';
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚗 Search Vehicle</Text>
        <Text style={styles.subtitle}>Find your towed vehicle</Text>
      </View>

      <View style={styles.searchSection}>
        {Platform.OS === 'ios' ? (
          <View style={styles.segmentContainer}>
            <SegmentedControlIOS
              values={['License Plate', 'VIN']}
              selectedIndex={searchType === 'plate' ? 0 : 1}
              onChange={(event) => {
                setSearchType(event.nativeEvent.selectedSegmentIndex === 0 ? 'plate' : 'vin');
              }}
              style={styles.segmentControl}
            />
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                searchType === 'plate' && styles.typeButtonActive,
              ]}
              onPress={() => setSearchType('plate')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  searchType === 'plate' && styles.typeButtonTextActive,
                ]}
              >
                License Plate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                searchType === 'vin' && styles.typeButtonActive,
              ]}
              onPress={() => setSearchType('vin')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  searchType === 'vin' && styles.typeButtonTextActive,
                ]}
              >
                VIN
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder={
            searchType === 'plate' ? 'Enter license plate (ABC1234)' : 'Enter VIN'
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#95a5a6"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {searched && results.length === 0 && !loading && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No vehicles found</Text>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Found {results.length} Vehicle(s)</Text>
          {results.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() => {
                navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.vehicleTitle}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.plate}>{vehicle.licensePlate}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(vehicle.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusLabel(vehicle.status)}</Text>
                </View>
              </View>
              <Text style={styles.viewDetailsText}>View Details →</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
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
  searchSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  segmentContainer: {
    marginBottom: 15,
  },
  segmentControl: {
    height: 32,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  typeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  typeButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#3498db',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
  },
  resultsSection: {
    padding: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  plate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailsText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
});
