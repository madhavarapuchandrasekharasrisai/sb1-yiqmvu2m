import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  PieChart,
  Calculator,
  MessageCircle,
  ArrowRight,
  DollarSign,
  Shield,
  Lightbulb
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

const Home = () => {
  const { state } = useFinancial();

  const features = [
    {
      icon: PieChart,
      title: 'Smart Budgeting',
      description: 'AI-powered budget recommendations using proven financial principles',
      link: '/budget',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Goal Planning',
      description: 'Track and achieve your financial goals with personalized strategies',
      link: '/goals',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Get personalized investment recommendations based on your risk profile',
      link: '/investments',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calculator,
      title: 'Financial Calculators',
      description: 'Comprehensive suite of calculators for all your financial needs',
      link: '/calculators',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MessageCircle,
      title: 'AI Financial Advisor',
      description: 'Chat with our AI advisor for personalized financial guidance',
      link: '/chat',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Tax Optimization',
      description: 'Maximize your tax savings with intelligent planning strategies',
      link: '/tax',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { label: 'Users Helped', value: '10,000+', icon: TrendingUp },
    { label: 'Average Savings', value: '₹2.5L', icon: DollarSign },
    { label: 'Financial Goals', value: '15,000+', icon: Target },
    { label: 'AI Consultations', value: '25,000+', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Get personalized financial advice, smart budgeting, and investment strategies 
              powered by artificial intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={state.profile ? '/budget' : '/profile'}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>{state.profile ? 'View Dashboard' : 'Get Started'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/chat"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Try AI Advisor</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-primary-100 to-secondary-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Financial Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to take control of your financial future, 
              powered by cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-lg w-fit mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-200"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who have already improved their financial health with WealthWise
            </p>
            <Link
              to={state.profile ? '/budget' : '/profile'}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2 text-lg"
            >
              <span>{state.profile ? 'Continue Planning' : 'Start Your Journey'}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;