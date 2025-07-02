import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, Target, TrendingUp, Save } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

const Profile = () => {
  const { state, dispatch } = useFinancial();
  const [formData, setFormData] = useState({
    income: state.profile?.income || 0,
    expenses: state.profile?.expenses || 0,
    debts: state.profile?.debts || 0,
    savings: state.profile?.savings || 0,
    age: state.profile?.age || 25,
    dependents: state.profile?.dependents || 0,
    riskTolerance: state.profile?.riskTolerance || 'medium',
    taxRegime: state.profile?.taxRegime || 'new',
    deductions: state.profile?.deductions || {
      '80C': 0,
      '80D': 0,
      'HRA': 0,
      'NPS': 0,
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      ...formData,
      goals: state.profile?.goals || [],
    };

    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    
    // Auto-calculate budget using 50/30/20 rule
    const afterTaxIncome = formData.income * 0.7; // Assuming 30% tax
    const budget = {
      essentials: Math.round(afterTaxIncome * 0.5),
      wants: Math.round(afterTaxIncome * 0.3),
      savings: Math.round(afterTaxIncome * 0.2),
    };
    
    dispatch({ type: 'UPDATE_BUDGET', payload: budget });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('deductions.')) {
      const deductionType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deductions: {
          ...prev.deductions,
          [deductionType]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'riskTolerance' || name === 'taxRegime' ? value : parseFloat(value) || 0
      }));
    }
  };

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Financial Profile</h1>
                <p className="text-blue-100 mt-1">
                  Tell us about your financial situation to get personalized advice
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-primary-600" />
                <span>Basic Information</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="18"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Dependents
                  </label>
                  <input
                    type="number"
                    name="dependents"
                    value={formData.dependents}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary-600" />
                <span>Financial Information</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Expenses (₹)
                  </label>
                  <input
                    type="number"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="30000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Debts (₹)
                  </label>
                  <input
                    type="number"
                    name="debts"
                    value={formData.debts}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Savings (₹)
                  </label>
                  <input
                    type="number"
                    name="savings"
                    value={formData.savings}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="200000"
                  />
                </div>
              </div>
            </div>

            {/* Risk & Tax Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span>Investment & Tax Preferences</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    name="riskTolerance"
                    value={formData.riskTolerance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Conservative (Low Risk)</option>
                    <option value="medium">Moderate (Medium Risk)</option>
                    <option value="high">Aggressive (High Risk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Regime
                  </label>
                  <select
                    name="taxRegime"
                    value={formData.taxRegime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="new">New Tax Regime</option>
                    <option value="old">Old Tax Regime</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tax Deductions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Save className="h-5 w-5 text-primary-600" />
                <span>Tax Deductions (Annual)</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    80C Investments (₹)
                  </label>
                  <input
                    type="number"
                    name="deductions.80C"
                    value={formData.deductions['80C']}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    80D Health Insurance (₹)
                  </label>
                  <input
                    type="number"
                    name="deductions.80D"
                    value={formData.deductions['80D']}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HRA (₹)
                  </label>
                  <input
                    type="number"
                    name="deductions.HRA"
                    value={formData.deductions['HRA']}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NPS (₹)
                  </label>
                  <input
                    type="number"
                    name="deductions.NPS"
                    value={formData.deductions['NPS']}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Profile</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;