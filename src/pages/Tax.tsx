import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Calculator, TrendingDown, Shield, AlertCircle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Link } from 'react-router-dom';

const Tax = () => {
  const { state } = useFinancial();
  const [selectedRegime, setSelectedRegime] = useState<'old' | 'new'>('new');

  if (!state.profile) {
    return (
      <div className="min-h-screen py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile First</h2>
            <p className="text-gray-600 mb-6">
              We need your financial information to provide personalized tax optimization strategies.
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
  const annualIncome = profile.income * 12;

  // Tax calculation functions
  const calculateOldRegimeTax = () => {
    let taxableIncome = annualIncome;
    let deductions = 0;
    
    // Standard deduction
    deductions += 50000;
    
    // 80C deductions
    deductions += Math.min(profile.deductions['80C'], 150000);
    
    // 80D deductions
    deductions += Math.min(profile.deductions['80D'], profile.age >= 60 ? 50000 : 25000);
    
    // HRA deduction
    deductions += profile.deductions['HRA'];
    
    // NPS 80CCD(1B)
    deductions += Math.min(profile.deductions['NPS'], 50000);
    
    taxableIncome = Math.max(0, taxableIncome - deductions);
    
    let tax = 0;
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.2;
      taxableIncome = 500000;
    }
    if (taxableIncome > 250000) {
      tax += (taxableIncome - 250000) * 0.05;
    }
    
    // Add cess
    tax += tax * 0.04;
    
    return { tax: Math.round(tax), deductions, taxableIncome: annualIncome - deductions };
  };

  const calculateNewRegimeTax = () => {
    let taxableIncome = annualIncome;
    let deductions = 50000; // Standard deduction only
    
    taxableIncome = Math.max(0, taxableIncome - deductions);
    
    let tax = 0;
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3;
      taxableIncome = 1500000;
    }
    if (taxableIncome > 1200000) {
      tax += (taxableIncome - 1200000) * 0.25;
      taxableIncome = 1200000;
    }
    if (taxableIncome > 900000) {
      tax += (taxableIncome - 900000) * 0.2;
      taxableIncome = 900000;
    }
    if (taxableIncome > 600000) {
      tax += (taxableIncome - 600000) * 0.15;
      taxableIncome = 600000;
    }
    if (taxableIncome > 300000) {
      tax += (taxableIncome - 300000) * 0.1;
      taxableIncome = 300000;
    }
    if (taxableIncome > 250000) {
      tax += (taxableIncome - 250000) * 0.05;
    }
    
    // Add cess
    tax += tax * 0.04;
    
    return { tax: Math.round(tax), deductions, taxableIncome: annualIncome - deductions };
  };

  const oldRegimeCalc = calculateOldRegimeTax();
  const newRegimeCalc = calculateNewRegimeTax();

  const comparisonData = [
    {
      regime: 'Old Regime',
      tax: oldRegimeCalc.tax,
      deductions: oldRegimeCalc.deductions,
      takehome: annualIncome - oldRegimeCalc.tax
    },
    {
      regime: 'New Regime',
      tax: newRegimeCalc.tax,
      deductions: newRegimeCalc.deductions,
      takehome: annualIncome - newRegimeCalc.tax
    }
  ];

  const taxSavingOptions = [
    {
      section: '80C',
      title: 'Tax Saving Investments',
      limit: 150000,
      current: profile.deductions['80C'],
      options: [
        'ELSS Mutual Funds',
        'PPF (Public Provident Fund)',
        'NSC (National Savings Certificate)',
        'ULIP',
        'Life Insurance Premium',
        'Home Loan Principal'
      ]
    },
    {
      section: '80D',
      title: 'Health Insurance',
      limit: profile.age >= 60 ? 50000 : 25000,
      current: profile.deductions['80D'],
      options: [
        'Health Insurance Premium',
        'Preventive Health Check-up',
        'Parents Health Insurance (if 60+)'
      ]
    },
    {
      section: '80CCD(1B)',
      title: 'National Pension System',
      limit: 50000,
      current: profile.deductions['NPS'],
      options: [
        'NPS Tier-1 Additional Contribution',
        'Equity-oriented NPS schemes',
        'Government securities in NPS'
      ]
    }
  ];

  const recommendations = [
    {
      title: 'Maximize 80C Investments',
      description: 'Invest remaining ₹' + (150000 - profile.deductions['80C']).toLocaleString() + ' in ELSS or PPF',
      savings: Math.round((150000 - profile.deductions['80C']) * 0.3),
      priority: 'high'
    },
    {
      title: 'Health Insurance Coverage',
      description: 'Increase health insurance to get full ₹25,000 deduction',
      savings: Math.round((25000 - profile.deductions['80D']) * 0.3),
      priority: 'medium'
    },
    {
      title: 'NPS Investment',
      description: 'Additional ₹50,000 deduction with NPS Tier-1',
      savings: Math.round((50000 - profile.deductions['NPS']) * 0.3),
      priority: 'medium'
    }
  ].filter(rec => rec.savings > 0);

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Tax Optimization</h1>
            </div>
            <p className="text-indigo-100">
              Compare tax regimes and discover strategies to minimize your tax liability
            </p>
          </div>
        </motion.div>

        {/* Regime Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Regime Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedRegime === 'old' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Old Tax Regime</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Income</span>
                  <span className="font-semibold">₹{annualIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions</span>
                  <span className="font-semibold text-green-600">₹{oldRegimeCalc.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-semibold">₹{oldRegimeCalc.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Tax Payable</span>
                  <span className="font-bold text-red-600">₹{oldRegimeCalc.tax.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedRegime === 'new' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">New Tax Regime</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Income</span>
                  <span className="font-semibold">₹{annualIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions</span>
                  <span className="font-semibold text-green-600">₹{newRegimeCalc.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-semibold">₹{newRegimeCalc.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Tax Payable</span>
                  <span className="font-bold text-red-600">₹{newRegimeCalc.tax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regime" />
                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="tax" fill="#ef4444" name="Tax" />
                <Bar dataKey="takehome" fill="#10b981" name="Take Home" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Recommendation</h3>
            <p className="text-blue-800">
              {oldRegimeCalc.tax < newRegimeCalc.tax ? 
                `The Old Tax Regime saves you ₹${(newRegimeCalc.tax - oldRegimeCalc.tax).toLocaleString()} annually.` :
                `The New Tax Regime saves you ₹${(oldRegimeCalc.tax - newRegimeCalc.tax).toLocaleString()} annually.`
              }
            </p>
          </div>
        </motion.div>

        {/* Tax Saving Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Saving Opportunities</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {taxSavingOptions.map((option) => (
              <div key={option.section} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{option.section}</h3>
                  <span className="text-sm text-gray-500">₹{option.limit.toLocaleString()} limit</span>
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{option.title}</h4>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Used: ₹{option.current.toLocaleString()}</span>
                    <span>Remaining: ₹{(option.limit - option.current).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(option.current / option.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {option.options.map((opt, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalized Recommendations</h2>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{rec.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">₹{rec.savings.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">annual savings</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tax Planning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Planning Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Smart Strategies</h3>
              </div>
              <ul className="text-green-800 space-y-2">
                <li>• Start tax planning at the beginning of the financial year</li>
                <li>• Spread investments across different tax-saving instruments</li>
                <li>• Consider tax implications before making investment decisions</li>
                <li>• Keep all investment and expense receipts organized</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Advanced Planning</h3>
              </div>
              <ul className="text-blue-800 space-y-2">
                <li>• Use HRA exemption if you pay rent</li>
                <li>• Consider home loan for additional tax benefits</li>
                <li>• Plan charitable donations for 80G deductions</li>
                <li>• Review and optimize your tax strategy annually</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tax;