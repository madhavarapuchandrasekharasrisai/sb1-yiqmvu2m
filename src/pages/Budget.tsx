import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Link } from 'react-router-dom';

const Budget = () => {
  const { state } = useFinancial();

  if (!state.profile) {
    return (
      <div className="min-h-screen py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile First</h2>
            <p className="text-gray-600 mb-6">
              We need your financial information to create a personalized budget recommendation.
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

  const { profile, budget } = state;
  const afterTaxIncome = profile.income * 0.7; // Assuming 30% tax
  
  const budgetData = budget || {
    essentials: Math.round(afterTaxIncome * 0.5),
    wants: Math.round(afterTaxIncome * 0.3),
    savings: Math.round(afterTaxIncome * 0.2),
  };

  const pieData = [
    { name: 'Essentials', value: budgetData.essentials, color: '#ef4444' },
    { name: 'Wants', value: budgetData.wants, color: '#f59e0b' },
    { name: 'Savings', value: budgetData.savings, color: '#10b981' },
  ];

  const comparisonData = [
    {
      category: 'Essentials',
      recommended: budgetData.essentials,
      current: profile.expenses,
      difference: budgetData.essentials - profile.expenses
    },
    {
      category: 'Wants',
      recommended: budgetData.wants,
      current: Math.max(0, profile.expenses - budgetData.essentials),
      difference: budgetData.wants - Math.max(0, profile.expenses - budgetData.essentials)
    },
    {
      category: 'Savings',
      recommended: budgetData.savings,
      current: profile.income - profile.expenses,
      difference: budgetData.savings - (profile.income - profile.expenses)
    }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: 'Savings Rate',
      value: `${Math.round((budgetData.savings / afterTaxIncome) * 100)}%`,
      description: 'of your after-tax income should go to savings',
      color: 'text-green-600'
    },
    {
      icon: DollarSign,
      title: 'Monthly Surplus',
      value: `₹${(profile.income - profile.expenses).toLocaleString()}`,
      description: 'available for additional savings or investments',
      color: profile.income > profile.expenses ? 'text-green-600' : 'text-red-600'
    },
    {
      icon: Target,
      title: 'Emergency Fund',
      value: `₹${(budgetData.essentials * 6).toLocaleString()}`,
      description: 'recommended emergency fund (6 months of essentials)',
      color: 'text-blue-600'
    }
  ];

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
              <PieChartIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Smart Budget Recommendations</h1>
            </div>
            <p className="text-blue-100">
              Based on your financial profile, here's your personalized budget using the 50/30/20 rule
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Budget Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Allocation</h2>
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
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
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
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={insight.title} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <div className={`text-2xl font-bold ${insight.color} mb-2`}>
                        {insight.value}
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Current vs Recommended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current vs Recommended</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="recommended" fill="#3b82f6" name="Recommended" />
              <Bar dataKey="current" fill="#10b981" name="Current" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalized Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Optimize Your Savings</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• Set up automatic transfers to savings account</li>
                <li>• Consider high-yield savings accounts or FDs</li>
                <li>• Review and reduce unnecessary subscriptions</li>
                <li>• Track expenses using budgeting apps</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-3">Investment Opportunities</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Start SIP in equity mutual funds</li>
                <li>• Maximize tax-saving investments (80C)</li>
                <li>• Consider diversifying into debt funds</li>
                <li>• Build emergency fund first (6 months expenses)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Budget;