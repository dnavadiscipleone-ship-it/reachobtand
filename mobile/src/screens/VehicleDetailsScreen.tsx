import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.1.100:5000/api'; // Change this to your computer's IP

interface VehicleDetail {
  id: string;
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: string;
  towedAt: string;
  reason: string;
  fees: {
    towing: number;
    storage: number;
    processing: number;
  };
  totalFees: number;
  hoursInYard: number;
  towYard: {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
}

export default function VehicleDetailsScreen({ route }) {
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles/${vehicleId}`);
      setVehicle(response.data);
    } catch (err) {
      setError('Failed to load vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (vehicle?.towYard.phone) {
      Linking.openURL(`tel:${vehicle.towYard.phone}`);
    }
  };

  const handleDirections = () => {
    if (vehicle?.towYard.address) {
      const address = encodeURIComponent(vehicle.towYard.address);
      Linking.openURL(`https://www.google.com/maps/search/${address}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error || 'Vehicle not found'}</Text>
      </View>
    );
  }

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
        return '🔍 In Yard';
      case 'ready-for-pickup':
        return '✅ Ready for Pickup';
      case 'picked-up':
        return '🚗 Picked Up';
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.vehicleTitle}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.plate}>{vehicle.licensePlate}</Text>
        </View>
        <View
          style={[
            styles.statusBadgeLarge,
            { backgroundColor: getStatusColor(vehicle.status) },
          ]}
        >
          <Text style={styles.statusTextLarge}>
            {getStatusLabel(vehicle.status)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <InfoRow label="License Plate" value={vehicle.licensePlate} />
        <InfoRow label="VIN" value={vehicle.vin} />
        <InfoRow label="Color" value={vehicle.color} />
        <InfoRow label="Tow Reason" value={vehicle.reason} />
        <InfoRow
          label="Towed"
          value={new Date(vehicle.towedAt).toLocaleString()}
        />
        <InfoRow label="Time in Yard" value={`${vehicle.hoursInYard} hours`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fees</Text>
        <FeeRow label="Towing Fee" amount={vehicle.fees.towing} />
        <FeeRow label="Storage Fee" amount={vehicle.fees.storage} />
        <FeeRow label="Processing Fee" amount={vehicle.fees.processing} />
        <View style={styles.totalFeeRow}>
          <Text style={styles.totalFeeLabel}>Total Amount Due</Text>
          <Text style={styles.totalFeeAmount}>${vehicle.totalFees}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tow Yard Location</Text>
        {vehicle.towYard && (
          <>
            <InfoRow label="Name" value={vehicle.towYard.name} />
            <InfoRow label="Address" value={vehicle.towYard.address} />
            <InfoRow
              label="Phone"
              value={vehicle.towYard.phone}
              isLink
              onPress={handleCall}
            />
            <InfoRow label="Email" value={vehicle.towYard.email} />
            <InfoRow label="Hours" value={vehicle.towYard.hours} />
          </>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <MaterialIcons name="phone" size={20} color="white" />
          <Text style={styles.buttonText}>Call Tow Yard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <MaterialIcons name="location-on" size={20} color="white" />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function InfoRow({ label, value, isLink, onPress }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TouchableOpacity onPress={isLink ? onPress : null}>
        <Text
          style={[
            styles.infoValue,
            isLink && styles.linkValue,
          ]}
        >
          {value}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function FeeRow({ label, amount }) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.feeLabel}>{label}</Text>
      <Text style={styles.feeAmount}>${amount}</Text>
    </View>
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
  headerCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  plate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeLarge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusTextLarge: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f7fa',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  linkValue: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f7fa',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  totalFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#ecf0f1',
  },
  totalFeeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  totalFeeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27ae60',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});
