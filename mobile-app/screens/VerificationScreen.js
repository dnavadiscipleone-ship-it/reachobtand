import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function VerificationScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission Required</Text>
        <Text style={styles.description}>
          We need camera access to verify your profile photo
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedPhoto(photo);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const uploadVerificationPhoto = async () => {
    if (!capturedPhoto) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('photo', {
        uri: capturedPhoto.uri,
        type: 'image/jpeg',
        name: `verification-${Date.now()}.jpg`,
      });

      const response = await axios.post(`${API_BASE_URL}/verify`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.verified) {
        Alert.alert('Success', 'Your profile has been verified! ✓');
        navigation.goBack();
      } else {
        Alert.alert('Verification Failed', response.data.message || 'Please try again');
        setCapturedPhoto(null);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Upload failed');
      setCapturedPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Photo</Text>
        <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Photo Guidelines:</Text>
          <Text style={styles.instruction}>• Clear face visible</Text>
          <Text style={styles.instruction}>• Good lighting</Text>
          <Text style={styles.instruction}>• Recent photo</Text>
          <Text style={styles.instruction}>• No filters or edits</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setCapturedPhoto(null)}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={uploadVerificationPhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit for Verification</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.cameraOverlay}>
          <Text style={styles.cameraTitle}>Take a Clear Selfie</Text>
          <View style={styles.faceFrame} />
          <Text style={styles.cameraDescription}>
            Make sure your face is clearly visible
          </Text>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}
        >
          <Text style={styles.flipButtonText}>↻</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  faceFrame: {
    width: 200,
    height: 280,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 20,
  },
  cameraDescription: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#000',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
  },
  spacer: {
    width: 50,
  },
  preview: {
    width: '100%',
    height: '60%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  instructions: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  instructionsTitle: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
