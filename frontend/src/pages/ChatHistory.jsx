import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, Send, Phone, MoreVertical, User } from 'lucide-react';
import { chatService } from '../services/chatService';
import { leadService } from '../services/leadService';
import { formatTime } from '../utils/dateUtils';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ChatHistory = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedLead) {
      fetchMessages(selectedLead.id);
    }
  }, [selectedLead]);

  const fetchLeads = async () => {
    try {
      const response = await leadService.getAllLeads();
      setLeads(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedLead(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchMessages = async (leadId) => {
    try {
      const response = await chatService.getChatHistory(leadId);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedLead) return;

    try {
      await chatService.sendMessage(selectedLead.id, newMessage);
      setNewMessage('');
      fetchMessages(selectedLead.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactNumber?.includes(searchTerm)
  );

  return (
    <Layout title="Lead Nurturing Application" breadcrumb="CHAT HISTORY">
      <div className="h-[calc(100vh-140px)] flex">
        {/* Left Sidebar - Chats List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search chat, name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-2">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex-1 btn btn-secondary py-2">All Leads</button>
            </div>
          </div>

          {/* Chats Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Chats</h3>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto">
            {filteredLeads.map((lead) => {
              const isActive = selectedLead?.id === lead.id;
              return (
                <motion.div
                  key={lead.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isActive ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {lead.firstName?.charAt(0)}{lead.lastName?.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {lead.firstName} {lead.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">24 min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs">
                          H
                        </span>
                        <span className="truncate">Hero Motors</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center text-xs">
                          M
                        </span>
                        <span className="truncate">Mehul Patel</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {lead.contactNumber}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedLead ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                      {selectedLead.firstName?.charAt(0)}{selectedLead.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">📞 {selectedLead.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone size={20} className="text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => {
                  const isSentByMe = msg.sender === user?.username;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-md ${isSentByMe ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isSentByMe
                                ? 'bg-primary-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-900 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-2">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    😊
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    📎
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>

        {/* Right Panel - Lead Info */}
        {selectedLead && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-semibold mb-3">
                {selectedLead.firstName?.charAt(0)}{selectedLead.lastName?.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">
                {selectedLead.firstName} {selectedLead.lastName}
              </h3>
              <p className="text-sm text-gray-500">+91 {selectedLead.contactNumber}</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Hero Motors</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Mehul Patel</span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl">😊</span>
                <span className="text-sm font-medium">Customer Information</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl">📋</span>
                <span className="text-sm font-medium">Lead Information</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatHistory;
