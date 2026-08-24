import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    initializeMessaging();
  }, []);

  const initializeMessaging = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // Connect to socket
      const newSocket = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to messaging server');
      });

      newSocket.on('new-message', (data) => {
        setConversations((prevConvs) =>
          prevConvs.map((conv) =>
            conv.match_id === data.matchId
              ? { ...conv, last_message: data.content, last_message_at: new Date() }
              : conv
          )
        );
      });

      setSocket(newSocket);

      // Load conversations
      loadConversations();
    } catch (error) {
      console.error('Error initializing messaging:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    // This would fetch from API
    setConversations([]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!conversations.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyText}>Start a conversation with your matches!</Text>
        </View>
      </View>
    );
  }

  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.conversationCard}>
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/60' }}
        style={styles.avatar}
      />
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{item.display_name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message || 'No messages yet'}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timestamp}>
          {item.last_message_at ? formatTime(item.last_message_at) : ''}
        </Text>
        {item.unread_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unread_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.match_id.toString()}
      />
    </View>
  );
}

const formatTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
  return `${Math.floor(diffMins / 1440)}d`;
};

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
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: '#999',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
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
