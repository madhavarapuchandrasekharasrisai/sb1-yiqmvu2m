import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CreditCard, Plus, Calendar, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

const Debt = () => {
  const [debts, setDebts] = useState([
    { id: 1, name: 'Credit Card', amount: 50000, rate: 18, minPayment: 2500, type: 'credit_card' },
    { id: 2, name: 'Personal Loan', amount: 200000, rate: 12, minPayment: 5000, type: 'personal_loan' },
    { id: 3, name: 'Car Loan', amount: 300000, rate: 8, minPayment: 8000, type: 'car_loan' },
  ]);

  const [extraPayment, setExtraPayment] = useState(5000);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  const calculatePayoffStrategy = () => {
    const monthlyPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0) + extraPayment;
    
    // Avalanche method (highest interest rate first)
    const avalancheDebts = [...debts].sort((a, b) => b.rate - a.rate);
    
    // Snowball method (smallest balance first)
    const snowballDebts = [...debts].sort((a, b) => a.amount - b.amount);
    
    const selectedDebts = strategy === 'avalanche' ? avalancheDebts : snowballDebts;
    
    let totalInterest = 0;
    let totalMonths = 0;
    const payoffSchedule = [];
    
    // Simplified calculation for demonstration
    selectedDebts.forEach((debt, index) => {
      const monthlyRate = debt.rate / 100 / 12;
      const months = Math.ceil(Math.log(1 + (debt.amount * monthlyRate) / debt.minPayment) / Math.log(1 + monthlyRate));
      const interest = (debt.minPayment * months) - debt.amount;
      
      totalInterest += interest;
      totalMonths = Math.max(totalMonths, months);
      
      payoffSchedule.push({
        debt: debt.name,
        months,
        interest,
        totalPaid: debt.amount + interest
      });
    });
    
    return {
      totalInterest,
      totalMonths,
      payoffSchedule,
      monthlySavings: totalInterest > 0 ? Math.round(totalInterest / totalMonths) : 0
    };
  };

  const strategyResults = calculatePayoffStrategy();

  const comparisonData = [
    {
      strategy: 'Avalanche',
      totalInterest: strategyResults.totalInterest,
      months: strategyResults.totalMonths,
      savings: strategy === 'avalanche' ? 0 : 15000
    },
    {
      strategy: 'Snowball',
      totalInterest: strategyResults.totalInterest + 15000,
      months: strategyResults.totalMonths + 3,
      savings: strategy === 'snowball' ? 0 : 15000
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
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Debt Management</h1>
            </div>
            <p className="text-red-100">
              Strategic debt payoff planning to minimize interest and maximize savings
            </p>
          </div>
        </motion.div>

        {/* Current Debts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Current Debts</h2>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              <span>Add Debt</span>
            </button>
          </div>

          <div className="grid gap-4">
            {debts.map((debt) => (
              <div key={debt.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{debt.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    debt.rate > 15 ? 'bg-red-100 text-red-800' :
                    debt.rate > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {debt.rate}% APR
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Balance</span>
                    <div className="font-semibold text-gray-900">₹{debt.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Payment</span>
                    <div className="font-semibold text-gray-900">₹{debt.minPayment.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Interest</span>
                    <div className="font-semibold text-red-600">
                      ₹{Math.round(debt.amount * debt.rate / 100 / 12).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strategy Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payoff Strategy</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Monthly Payment
                </label>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStrategy('avalanche')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      strategy === 'avalanche'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Avalanche</div>
                    <div className="text-sm text-gray-600">Highest interest first</div>
                  </button>
                  <button
                    onClick={() => setStrategy('snowball')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      strategy === 'snowball'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Snowball</div>
                    <div className="text-sm text-gray-600">Smallest balance first</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Strategy Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Interest</span>
                  <div className="font-semibold text-red-600">₹{strategyResults.totalInterest.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Payoff Time</span>
                  <div className="font-semibold text-gray-900">{strategyResults.totalMonths} months</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Debt Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Debt Summary</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ₹{debts.reduce((sum, debt) => sum + debt.amount, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Debt</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-orange-600">
                    ₹{debts.reduce((sum, debt) => sum + debt.minPayment, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Min Monthly Payment</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">
                    {Math.round(debts.reduce((sum, debt) => sum + (debt.amount * debt.rate / 100 / 12), 0) / debts.reduce((sum, debt) => sum + debt.amount, 0) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Interest Rate</div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Debt-to-Income Ratio</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round(debts.reduce((sum, debt) => sum + debt.amount, 0) / (60000 * 12) * 100)}%
                </div>
                <div className="text-sm text-blue-700">Should be below 40%</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strategy Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Strategy Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strategy" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="totalInterest" fill="#ef4444" name="Total Interest" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payoff Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payoff Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Debt</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payoff Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Interest</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Paid</th>
                </tr>
              </thead>
              <tbody>
                {strategyResults.payoffSchedule.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.debt}</td>
                    <td className="py-3 px-4 text-gray-600">{item.months} months</td>
                    <td className="py-3 px-4 text-red-600">₹{item.interest.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-900">₹{item.totalPaid.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tips & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Debt Management Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-3">Quick Wins</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Pay more than the minimum payment</li>
                <li>• Consider debt consolidation for high-interest debts</li>
                <li>• Negotiate with creditors for better terms</li>
                <li>• Use windfalls (bonus, tax refund) for debt payments</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Long-term Strategy</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• Build emergency fund alongside debt payoff</li>
                <li>• Avoid taking on new debt during payoff</li>
                <li>• Consider balance transfers for credit cards</li>
                <li>• Track progress monthly to stay motivated</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Debt;