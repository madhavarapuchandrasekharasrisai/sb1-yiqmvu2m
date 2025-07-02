import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, Lightbulb, TrendingUp, PiggyBank, Shield } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

const Chat = () => {
  const { state, dispatch } = useFinancial();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  const quickQuestions = [
    {
      icon: PiggyBank,
      question: "How much should I save each month?",
      category: "Savings"
    },
    {
      icon: TrendingUp,
      question: "What's the best investment strategy for my age?",
      category: "Investment"
    },
    {
      icon: Shield,
      question: "How much life insurance do I need?",
      category: "Insurance"
    },
    {
      icon: Lightbulb,
      question: "How can I reduce my tax liability?",
      category: "Tax Planning"
    }
  ];

  const generateAIResponse = (userMessage: string) => {
    const profile = state.profile;
    
    // Simulate AI responses based on user profile and message content
    const responses = {
      savings: `Based on your monthly income of ₹${profile?.income.toLocaleString()}, I recommend following the 50/30/20 rule. You should aim to save at least 20% of your income, which would be ₹${profile ? Math.round(profile.income * 0.2).toLocaleString() : '0'} per month. Given your current expenses of ₹${profile?.expenses.toLocaleString()}, you have a surplus of ₹${profile ? (profile.income - profile.expenses).toLocaleString() : '0'} monthly that can be allocated to savings and investments.`,
      
      investment: `Given your ${profile?.riskTolerance} risk tolerance and age of ${profile?.age}, I suggest a diversified portfolio. For someone with ${profile?.riskTolerance} risk appetite, consider allocating ${profile?.riskTolerance === 'high' ? '70-80%' : profile?.riskTolerance === 'medium' ? '50-60%' : '30-40%'} to equity mutual funds and the rest to debt instruments. Start with SIP investments of ₹${profile ? Math.round((profile.income - profile.expenses) * 0.7).toLocaleString() : '0'} monthly in diversified equity funds.`,
      
      insurance: `Based on your income and ${profile?.dependents} dependents, you should have life insurance coverage of ₹${profile ? (profile.income * 12 * 10).toLocaleString() : '0'} (10-12 times your annual income). For health insurance, ensure you have coverage of at least ₹5-10 lakhs for yourself and family. Given your age of ${profile?.age}, term insurance premiums would be quite affordable.`,
      
      tax: `Looking at your income of ₹${profile?.income.toLocaleString()} monthly, you can save significant tax by maximizing deductions. You're currently using ₹${profile?.deductions['80C'].toLocaleString()} under 80C - you can invest up to ₹1.5L more. Consider ELSS mutual funds for dual benefit of tax saving and wealth creation. Also, ensure you're claiming HRA if you pay rent, and consider NPS for additional ₹50K deduction under 80CCD(1B).`,
      
      default: `I'm here to help with your financial planning! Based on your profile, I can provide personalized advice on budgeting, investments, tax planning, and more. What specific area would you like to discuss?`
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return responses.savings;
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('investment') || lowerMessage.includes('sip')) {
      return responses.investment;
    } else if (lowerMessage.includes('insurance') || lowerMessage.includes('cover')) {
      return responses.insurance;
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('deduction')) {
      return responses.tax;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      message: textToSend,
      sender: 'user' as const,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(textToSend),
        sender: 'ai' as const,
        timestamp: new Date()
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse });
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="h-8 w-8" />
              <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
            </div>
            <p className="text-purple-100">
              Get personalized financial advice powered by artificial intelligence
            </p>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {state.chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <Bot className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to your AI Financial Advisor!
                </h3>
                <p className="text-gray-600 mb-6">
                  I'm here to help you with personalized financial advice based on your profile. 
                  Ask me anything about budgeting, investments, tax planning, or insurance.
                </p>
                
                <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {quickQuestions.map((q, index) => {
                    const Icon = q.icon;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSendMessage(q.question)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900">{q.category}</div>
                            <div className="text-sm text-gray-600">{q.question}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {state.chatHistory.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-3xl ${
                    chat.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      chat.sender === 'user' ? 'bg-primary-100' : 'bg-purple-100'
                    }`}>
                      {chat.sender === 'user' ? (
                        <User className="h-5 w-5 text-primary-600" />
                      ) : (
                        <Bot className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className={`p-4 rounded-xl ${
                      chat.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap">{chat.message}</p>
                      <div className={`text-xs mt-2 ${
                        chat.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {chat.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your finances..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={2}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!message.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">AI-Generated Advice</h4>
              <p className="text-sm text-amber-800 mt-1">
                This AI advisor provides general financial guidance based on your profile. 
                For complex financial decisions, please consult with a certified financial planner.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;