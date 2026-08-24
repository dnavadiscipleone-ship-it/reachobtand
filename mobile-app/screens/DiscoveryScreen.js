import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function DiscoveryScreen() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 65,
    radiusKm: 20,
  });

  useEffect(() => {
    initializeDiscovery();
  }, []);

  const initializeDiscovery = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      await fetchNearbyProfiles(userLocation.coords);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyProfiles = async (coords) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/discover`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          radiusKm: filters.radiusKm,
          ageMin: filters.ageMin,
          ageMax: filters.ageMax,
        },
      });

      setProfiles(response.data.profiles || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profiles');
      console.error(error);
    }
  };

  const handleSwipe = async (liked) => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(
        `${API_BASE_URL}/swipe`,
        { profileId: profile.id, liked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (liked) {
        Alert.alert('Liked!', `You liked ${profile.display_name}`);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      Alert.alert('Error', 'Failed to save swipe');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!profiles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No profiles found nearby</Text>
        <TouchableOpacity style={styles.button} onPress={initializeDiscovery}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>You've seen everyone!</Text>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentIndex(0)}>
          <Text style={styles.buttonText}>See More</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: profile.primary_photo || 'https://via.placeholder.com/300' }}
          style={styles.profileImage}
        />

        <View style={styles.cardContent}>
          <Text style={styles.name}>{profile.display_name}, {profile.age}</Text>
          <Text style={styles.distance}>{profile.distance} km away</Text>

          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {profile.interests && (
            <View style={styles.tagsContainer}>
              {profile.interests.split(',').slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}

          {profile.discreet_mode && (
            <Text style={styles.badge}>🔒 Discreet Mode Active</Text>
          )}
          {profile.anonymous_mode && (
            <Text style={styles.badge}>👤 Anonymous Profile</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe(false)}
        >
          <Text style={styles.actionButtonText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe(true)}
        >
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>{currentIndex + 1} / {profiles.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '100%',
  },
  profileImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FFE0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FF6B6B',
    fontSize: 12,
  },
  badge: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#f0f0f0',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  counter: {
    marginTop: 12,
    color: '#999',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});
