import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Send, Bot, User, ChefHat, Sparkles } from 'lucide-react-native';

const INITIAL_MESSAGES = [
  {
    id: '1',
    text: "Hello! I'm your SmartChef Assistant. How can I help you today?",
    sender: 'bot',
    timestamp: '9:41 AM',
  },
  {
    id: '2',
    text: "I detected tomato, onion, and garlic in your kitchen. Would you like a recipe for a classic Marinara sauce?",
    sender: 'bot',
    timestamp: '9:42 AM',
  },
];

import { useAppTheme } from '@/hooks/use-app-theme';

export default function ChatScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "That sounds great! Adding it to your preference. Do you want me to list the steps for that?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.botAvatar, { backgroundColor: theme.tint }]}>
            <ChefHat size={20} color="white" />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>SmartChef AI</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.statusText, { color: theme.muted }]}>Online & Ready to Help</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.secondary }]}>
          <Sparkles size={20} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
          ]}>
            {item.sender === 'bot' && (
              <View style={[styles.messageAvatar, { backgroundColor: theme.secondary }]}>
                <ChefHat size={16} color={theme.tint} />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              item.sender === 'user' 
                ? [styles.userBubble, { backgroundColor: theme.tint }] 
                : [styles.botBubble, { backgroundColor: theme.secondary }]
            ]}>
              <Text style={[
                styles.messageText,
                { color: item.sender === 'user' ? 'white' : theme.text }
              ]}>{item.text}</Text>
              <Text style={[
                styles.timestamp,
                { color: item.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.muted }
              ]}>{item.timestamp}</Text>
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputArea}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.secondary }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Ask anything about cooking..."
            placeholderTextColor={theme.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.tint }]}
            onPress={handleSend}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  messageList: {
    padding: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
