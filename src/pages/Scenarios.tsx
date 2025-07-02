import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, Sliders, Target, DollarSign } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

const Scenarios = () => {
  const { state } = useFinancial();
  const [scenarios, setScenarios] = useState({
    income: state.profile?.income || 50000,
    expenses: state.profile?.expenses || 30000,
    savingsRate: 20,
    investmentReturn: 12,
    inflationRate: 6
  });

  const calculateProjections = () => {
    const monthlySavings = (scenarios.income - scenarios.expenses);
    const annualSavings = monthlySavings * 12;
    const realReturn = scenarios.investmentReturn - scenarios.inflationRate;
    
    const projections = [];
    let currentValue = 0;
    
    for (let year = 1; year <= 30; year++) {
      currentValue = currentValue * (1 + realReturn / 100) + annualSavings;
      projections.push({
        year,
        value: Math.round(currentValue),
        savings: annualSavings * year,
        returns: Math.round(currentValue - (annualSavings * year))
      });
    }
    
    return projections;
  };

  const projections = calculateProjections();

  const scenarioComparisons = [
    {
      name: 'Conservative',
      income: scenarios.income,
      expenses: scenarios.expenses * 1.1,
      return: 8,
      color: '#10b981'
    },
    {
      name: 'Current',
      income: scenarios.income,
      expenses: scenarios.expenses,
      return: scenarios.investmentReturn,
      color: '#3b82f6'
    },
    {
      name: 'Optimistic',
      income: scenarios.income * 1.2,
      expenses: scenarios.expenses * 0.9,
      return: 15,
      color: '#8b5cf6'
    }
  ];

  const calculateScenarioValue = (scenario: any, years: number) => {
    const monthlySavings = scenario.income - scenario.expenses;
    const annualSavings = monthlySavings * 12;
    const realReturn = scenario.return - scenarios.inflationRate;
    
    let value = 0;
    for (let year = 1; year <= years; year++) {
      value = value * (1 + realReturn / 100) + annualSavings;
    }
    return Math.round(value);
  };

  const comparisonData = scenarioComparisons.map(scenario => ({
    ...scenario,
    value10: calculateScenarioValue(scenario, 10),
    value20: calculateScenarioValue(scenario, 20),
    value30: calculateScenarioValue(scenario, 30)
  }));

  const goalAnalysis = state.profile?.goals?.map(goal => {
    const monthlySavings = scenarios.income - scenarios.expenses;
    const requiredMonthlySavings = goal.amount / (goal.timeline * 12);
    const feasibility = requiredMonthlySavings <= monthlySavings;
    
    return {
      ...goal,
      requiredMonthlySavings,
      feasibility,
      timelineAdjustment: feasibility ? goal.timeline : Math.ceil(goal.amount / (monthlySavings * 12))
    };
  }) || [];

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Scenario Modeling</h1>
            </div>
            <p className="text-indigo-100">
              Explore different financial scenarios and see how changes impact your future wealth
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Scenario Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sliders className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Adjust Parameters</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income: ₹{scenarios.income.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={scenarios.income}
                  onChange={(e) => setScenarios({ ...scenarios, income: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses: ₹{scenarios.expenses.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="2500"
                  value={scenarios.expenses}
                  onChange={(e) => setScenarios({ ...scenarios, expenses: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Return: {scenarios.investmentReturn}%
                </label>
                <input
                  type="range"
                  min="6"
                  max="20"
                  step="0.5"
                  value={scenarios.investmentReturn}
                  onChange={(e) => setScenarios({ ...scenarios, investmentReturn: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inflation Rate: {scenarios.inflationRate}%
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.5"
                  value={scenarios.inflationRate}
                  onChange={(e) => setScenarios({ ...scenarios, inflationRate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Current Scenario</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Monthly Surplus:</span>
                  <span className="font-semibold text-blue-900">
                    ₹{(scenarios.income - scenarios.expenses).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Annual Savings:</span>
                  <span className="font-semibold text-blue-900">
                    ₹{((scenarios.income - scenarios.expenses) * 12).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Real Return:</span>
                  <span className="font-semibold text-blue-900">
                    {(scenarios.investmentReturn - scenarios.inflationRate).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wealth Projection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Wealth Projection</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}Cr`} />
                <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} name="Total Value" />
                <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Total Savings" />
                <Line type="monotone" dataKey="returns" stroke="#8b5cf6" strokeWidth={2} name="Investment Returns" />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{(projections[9]?.value / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-600">10 Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{(projections[19]?.value / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-600">20 Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{(projections[29]?.value / 10000000).toFixed(1)}Cr
                </div>
                <div className="text-sm text-gray-600">30 Years</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scenario Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Scenario Comparison</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {comparisonData.map((scenario) => (
              <div key={scenario.name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{scenario.name} Scenario</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income:</span>
                    <span>₹{scenario.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses:</span>
                    <span>₹{scenario.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return:</span>
                    <span>{scenario.return}%</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>30-year value:</span>
                      <span style={{ color: scenario.color }}>
                        ₹{(scenario.value30 / 10000000).toFixed(1)}Cr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { period: '10 Years', ...comparisonData.reduce((acc, s) => ({ ...acc, [s.name]: s.value10 }), {}) },
              { period: '20 Years', ...comparisonData.reduce((acc, s) => ({ ...acc, [s.name]: s.value20 }), {}) },
              { period: '30 Years', ...comparisonData.reduce((acc, s) => ({ ...acc, [s.name]: s.value30 }), {}) }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}Cr`} />
              <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
              {comparisonData.map((scenario) => (
                <Bar key={scenario.name} dataKey={scenario.name} fill={scenario.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Goal Impact Analysis */}
        {goalAnalysis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Goal Impact Analysis</h2>
            </div>

            <div className="space-y-4">
              {goalAnalysis.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.feasibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {goal.feasibility ? 'Achievable' : 'Needs Adjustment'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Target Amount</span>
                      <div className="font-semibold">₹{goal.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Required Monthly</span>
                      <div className="font-semibold">₹{goal.requiredMonthlySavings.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Available Monthly</span>
                      <div className="font-semibold">₹{(scenarios.income - scenarios.expenses).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Adjusted Timeline</span>
                      <div className="font-semibold">{goal.timelineAdjustment} years</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Scenarios;