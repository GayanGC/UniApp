'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Conversation, ChatMessage } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { Send, User as UserIcon } from 'lucide-react';

function ChatContent() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch Conversations on Mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await apiService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoadingConv(false);
      }
    };
    fetchConversations();
  }, []);

  // 2. Fetch Messages when activeUserId changes
  useEffect(() => {
    if (!activeUserId) return;

    const fetchHistory = async () => {
      setLoadingMsgs(true);
      try {
        const history = await apiService.getChatHistory(activeUserId);
        setMessages(history);
        
        // Clear unread count locally for this conversation
        setConversations(prev => prev.map(c => 
          c.user.userId === activeUserId ? { ...c, unreadCount: 0 } : c
        ));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoadingMsgs(false);
      }
    };
    fetchHistory();
  }, [activeUserId]);

  // Scroll after messages load
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Socket Listeners for Real-Time Messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      // If the message belongs to the currently active conversation, append it
      if (
        (message.senderId === activeUserId && message.receiverId === user?.userId) ||
        (message.senderId === user?.userId && message.receiverId === activeUserId)
      ) {
        setMessages(prev => [...prev, message]);
      } else {
        // Otherwise, update the unread count on the inbox list if we are the receiver
        if (message.receiverId === user?.userId) {
          setConversations(prev => {
            const exists = prev.find(c => c.user.userId === message.senderId);
            if (exists) {
              return prev.map(c => 
                c.user.userId === message.senderId 
                  ? { ...c, latestMessage: message, unreadCount: c.unreadCount + 1 }
                  : c
              );
            } else {
              // If it's a completely new conversation, refetch the inbox to get user details
              apiService.getConversations().then(data => setConversations(data));
              return prev;
            }
          });
        }
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeUserId, user?.userId]);

  // 4. Send Message Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId || !socket || !isConnected) return;

    // Emit via socket
    socket.emit('send_message', {
      receiverId: activeUserId,
      message: newMessage.trim(),
    });

    setNewMessage('');
    // The server will broadcast 'receive_message' back to us, which appends it to the list.
  };

  const activeConversation = conversations.find(c => c.user.userId === activeUserId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BrandHeader subtitle="Messages" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex overflow-hidden min-h-[600px] max-h-[80vh]">
          
          {/* ── Left Sidebar: Inbox ── */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loadingConv ? (
                <div className="p-6 text-center text-gray-400 text-sm">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No active conversations.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {conversations.map((conv) => (
                    <li key={conv.user.userId}>
                      <button
                        onClick={() => setActiveUserId(conv.user.userId)}
                        className={`w-full text-left p-4 hover:bg-gray-100 transition flex items-start gap-3 ${
                          activeUserId === conv.user.userId ? 'bg-teal-50 border-l-4 border-teal-500' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white shrink-0">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conv.user.fullName}
                            </h3>
                            {conv.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.latestMessage?.message || 'No messages yet'}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Right Window: Chat Stream ── */}
          <div className="w-2/3 flex flex-col bg-white relative">
            {activeUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeConversation?.user.fullName}
                    </h2>
                    <p className="text-xs text-gray-500 capitalize">
                      {activeConversation?.user.role.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {/* Connection Status indicator */}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {isConnected ? 'Connected' : 'Reconnecting...'}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {loadingMsgs ? (
                    <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-400 text-sm flex-col gap-2">
                      <p>No messages yet.</p>
                      <p className="text-xs">Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user?.userId;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                              isMe
                                ? 'bg-teal-600 text-white rounded-br-sm'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                            <span
                              className={`text-[10px] block mt-1.5 ${
                                isMe ? 'text-teal-100' : 'text-gray-400'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={!isConnected}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || !isConnected}
                      className="w-11 h-11 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-50 transition shadow-sm"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">Your Messages</h3>
                <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}
