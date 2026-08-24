import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(response.data.matches || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load matches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(
        `${API_BASE_URL}/block`,
        { blockedUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(matches.filter(m => m.user_id !== userId));
      Alert.alert('User blocked');
    } catch (error) {
      Alert.alert('Error', 'Failed to block user');
    }
  };

  const handleUnmatch = async (userId) => {
    Alert.alert('Unmatch', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Unmatch',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.post(
              `${API_BASE_URL}/matches/${userId}/unmatch`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setMatches(matches.filter(m => m.user_id !== userId));
          } catch (error) {
            Alert.alert('Error', 'Failed to unmatch');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!matches.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>Start discovering to find your perfect match!</Text>
        </View>
      </View>
    );
  }

  const renderMatch = ({ item }) => (
    <View style={styles.matchCard}>
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/100' }}
        style={styles.matchImage}
      />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.display_name}, {item.age}</Text>
        <Text style={styles.matchStatus}>
          {item.last_message_at ? 'Active now' : 'Matched recently'}
        </Text>
      </View>
      <View style={styles.matchActions}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            Alert.alert('Options', 'Choose an action', [
              { text: 'Block', onPress: () => handleBlock(item.user_id) },
              { text: 'Unmatch', onPress: () => handleUnmatch(item.user_id) },
              { text: 'Cancel', onPress: () => {} },
            ]);
          }}
        >
          <Text style={styles.menuButtonText}>•••</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches ({matches.length})</Text>
      </View>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.user_id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 10,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    elevation: 2,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  matchStatus: {
    fontSize: 12,
    color: '#999',
  },
  matchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFE0E6',
    borderRadius: 6,
  },
  messageButtonText: {
    fontSize: 18,
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
