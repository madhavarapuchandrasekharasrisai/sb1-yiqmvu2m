import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Shield, DollarSign, Target, AlertCircle, TrendingDown } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Link } from 'react-router-dom';

const Investments = () => {
  const { state } = useFinancial();

  if (!state.profile) {
    return (
      <div className="min-h-screen py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile First</h2>
            <p className="text-gray-600 mb-6">
              We need your financial information to provide personalized investment recommendations.
            </p>
            <Link
              to="/profile"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile } = state;
  
  // Generate investment recommendations based on risk tolerance
  const getAssetAllocation = () => {
    switch (profile.riskTolerance) {
      case 'low':
        return {
          equity: 30,
          debt: 50,
          gold: 10,
          reits: 5,
          cash: 5
        };
      case 'medium':
        return {
          equity: 60,
          debt: 25,
          gold: 10,
          reits: 5,
          cash: 0
        };
      case 'high':
        return {
          equity: 80,
          debt: 10,
          gold: 5,
          reits: 5,
          cash: 0
        };
      default:
        return {
          equity: 60,
          debt: 25,
          gold: 10,
          reits: 5,
          cash: 0
        };
    }
  };

  const allocation = getAssetAllocation();
  const availableForInvestment = Math.max(0, profile.income - profile.expenses);

  const pieData = [
    { name: 'Equity', value: allocation.equity, color: '#3b82f6', amount: Math.round(availableForInvestment * allocation.equity / 100) },
    { name: 'Debt', value: allocation.debt, color: '#10b981', amount: Math.round(availableForInvestment * allocation.debt / 100) },
    { name: 'Gold', value: allocation.gold, color: '#f59e0b', amount: Math.round(availableForInvestment * allocation.gold / 100) },
    { name: 'REITs', value: allocation.reits, color: '#8b5cf6', amount: Math.round(availableForInvestment * allocation.reits / 100) },
    { name: 'Cash', value: allocation.cash, color: '#6b7280', amount: Math.round(availableForInvestment * allocation.cash / 100) },
  ].filter(item => item.value > 0);

  const investmentProducts = [
    {
      category: 'Equity',
      products: [
        { name: 'Large Cap Mutual Funds', risk: 'Medium', expectedReturn: '10-12%', minInvestment: '₹500' },
        { name: 'Mid Cap Mutual Funds', risk: 'High', expectedReturn: '12-15%', minInvestment: '₹500' },
        { name: 'Index Funds', risk: 'Medium', expectedReturn: '10-11%', minInvestment: '₹500' },
        { name: 'Direct Equity', risk: 'Very High', expectedReturn: '15-20%', minInvestment: '₹1000' },
      ]
    },
    {
      category: 'Debt',
      products: [
        { name: 'Corporate Bond Funds', risk: 'Low', expectedReturn: '7-9%', minInvestment: '₹1000' },
        { name: 'Government Securities', risk: 'Very Low', expectedReturn: '6-8%', minInvestment: '₹1000' },
        { name: 'Fixed Deposits', risk: 'Very Low', expectedReturn: '5-7%', minInvestment: '₹1000' },
        { name: 'Debt Mutual Funds', risk: 'Low', expectedReturn: '6-8%', minInvestment: '₹500' },
      ]
    },
    {
      category: 'Alternative',
      products: [
        { name: 'Gold ETFs', risk: 'Medium', expectedReturn: '8-10%', minInvestment: '₹500' },
        { name: 'Real Estate Investment Trusts', risk: 'Medium', expectedReturn: '8-12%', minInvestment: '₹5000' },
        { name: 'Commodity Funds', risk: 'High', expectedReturn: '6-10%', minInvestment: '₹1000' },
      ]
    }
  ];

  const riskToleranceInfo = {
    low: {
      title: 'Conservative Investor',
      description: 'Focused on capital preservation with steady returns',
      icon: Shield,
      color: 'text-green-600'
    },
    medium: {
      title: 'Moderate Investor',
      description: 'Balanced approach between growth and stability',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    high: {
      title: 'Aggressive Investor',
      description: 'High growth potential with higher risk tolerance',
      icon: TrendingUp,
      color: 'text-red-600'
    }
  };

  const currentRiskInfo = riskToleranceInfo[profile.riskTolerance];
  const RiskIcon = currentRiskInfo.icon;

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Investment Advisory</h1>
            </div>
            <p className="text-blue-100">
              Personalized investment recommendations based on your risk profile and financial goals
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Asset Allocation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <div className="text-sm text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Risk Profile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <RiskIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentRiskInfo.title}</h3>
                  <p className="text-sm text-gray-600">{currentRiskInfo.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Available</span>
                  <span className="font-semibold">₹{availableForInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level</span>
                  <span className={`font-semibold ${currentRiskInfo.color}`}>
                    {profile.riskTolerance.charAt(0).toUpperCase() + profile.riskTolerance.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return</span>
                  <span className="font-semibold text-green-600">
                    {profile.riskTolerance === 'low' ? '7-9%' : 
                     profile.riskTolerance === 'medium' ? '9-12%' : '12-15%'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Investment Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-8"
        >
          {investmentProducts.map((category, categoryIndex) => (
            <div key={category.category} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{category.category} Investments</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {category.products.map((product, productIndex) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (productIndex * 0.05) }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`font-medium ${
                          product.risk === 'Very Low' ? 'text-green-600' :
                          product.risk === 'Low' ? 'text-green-500' :
                          product.risk === 'Medium' ? 'text-yellow-600' :
                          product.risk === 'High' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {product.risk}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Return:</span>
                        <span className="font-medium text-green-600">{product.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Investment:</span>
                        <span className="font-medium">{product.minInvestment}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tax Implications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Implications & Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-3">Tax-Saving Investments</h3>
              <ul className="text-green-800 space-y-2">
                <li>• ELSS Mutual Funds (80C) - ₹1.5L limit</li>
                <li>• NPS (80CCD) - Additional ₹50K limit</li>
                <li>• Health Insurance (80D) - ₹25K limit</li>
                <li>• Home Loan Interest (24b) - ₹2L limit</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Long-term Capital Gains</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• Equity: 10% tax on gains {'>'} ₹1L</li>
                <li>• Debt: 20% with indexation benefit</li>
                <li>• Gold: 20% with indexation benefit</li>
                <li>• REITs: 10% without indexation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Investments;