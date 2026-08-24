import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    age: '',
    interests: '',
    lookingFor: '',
  });
  const [privacy, setPrivacy] = useState({
    anonymousMode: false,
    discreteMode: false,
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.profile);
      setPhotos(response.data.photos || []);
      setPrivacy({
        anonymousMode: response.data.profile.anonymous_mode,
        discreteMode: response.data.profile.discreet_mode,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadPhoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadPhoto = async (photo) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo-${Date.now()}.jpg`,
      });

      await axios.post(`${API_BASE_URL}/profile/photos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Photo uploaded');
      loadProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/profile`,
        { ...profile, ...privacy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photosGrid}>
          {photos.map((photo, idx) => (
            <Image key={idx} source={{ uri: photo.photo_url }} style={styles.photo} />
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Text style={styles.addPhotoText}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={profile.displayName}
          onChangeText={(text) => setProfile({ ...profile, displayName: text })}
          placeholder="Your name"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={profile.age?.toString()}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
          keyboardType="number-pad"
          placeholder="Age"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={profile.bio}
          onChangeText={(text) => setProfile({ ...profile, bio: text })}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Interests</Text>
        <TextInput
          style={styles.input}
          value={profile.interests}
          onChangeText={(text) => setProfile({ ...profile, interests: text })}
          placeholder="e.g., fitness, travel, music"
        />

        <Text style={styles.label}>Looking For</Text>
        <TextInput
          style={styles.input}
          value={profile.lookingFor}
          onChangeText={(text) => setProfile({ ...profile, lookingFor: text })}
          placeholder="What are you looking for?"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Safety</Text>

        <View style={styles.privacyOption}>
          <View>
            <Text style={styles.optionTitle}>Anonymous Mode</Text>
            <Text style={styles.optionDescription}>Hide your name from others</Text>
          </View>
          <Switch
            value={privacy.anonymousMode}
            onValueChange={(value) => setPrivacy({ ...privacy, anonymousMode: value })}
            trackColor={{ false: '#767577', true: '#FFB3BA' }}
            thumbColor={privacy.anonymousMode ? '#FF6B6B' : '#f4f3f4'}
          />
        </View>

        <View style={styles.privacyOption}>
          <View>
            <Text style={styles.optionTitle}>Discreet Mode</Text>
            <Text style={styles.optionDescription}>Hide photos from non-matches</Text>
          </View>
          <Switch
            value={privacy.discreteMode}
            onValueChange={(value) => setPrivacy({ ...privacy, discreteMode: value })}
            trackColor={{ false: '#767577', true: '#FFB3BA' }}
            thumbColor={privacy.discreteMode ? '#FF6B6B' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>✓ Verify Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photo: {
    width: '48%',
    aspectRatio: 4 / 5,
    borderRadius: 8,
  },
  addPhotoButton: {
    width: '48%',
    aspectRatio: 4 / 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    color: '#999',
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textarea: {
    textAlignVertical: 'top',
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#999',
  },
  verifyButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
});
