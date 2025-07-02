import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

const Goals = () => {
  const { state, dispatch } = useFinancial();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalForm, setGoalForm] = useState({
    name: '',
    amount: 0,
    timeline: 1,
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  const goals = state.profile?.goals || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal = {
      id: editingGoal || Date.now().toString(),
      ...goalForm,
      progress: editingGoal ? goals.find(g => g.id === editingGoal)?.progress || 0 : 0,
    };

    if (editingGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: newGoal });
      setEditingGoal(null);
    } else {
      dispatch({ type: 'ADD_GOAL', payload: newGoal });
    }

    setGoalForm({ name: '', amount: 0, timeline: 1, priority: 'medium' });
    setShowAddGoal(false);
  };

  const handleEdit = (goal: any) => {
    setGoalForm({
      name: goal.name,
      amount: goal.amount,
      timeline: goal.timeline,
      priority: goal.priority,
    });
    setEditingGoal(goal.id);
    setShowAddGoal(true);
  };

  const calculateMonthlySavings = (amount: number, timeline: number) => {
    return Math.round(amount / (timeline * 12));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">Financial Goals</h1>
                  <p className="text-blue-100 mt-1">
                    Set, track, and achieve your financial milestones
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddGoal(true)}
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Goal</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Target Amount</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{goal.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeline</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{goal.timeline} years</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Savings</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{calculateMonthlySavings(goal.amount, goal.timeline).toLocaleString()}</span>
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by setting your first financial goal. Whether it's buying a home, 
              planning for retirement, or saving for a vacation, we'll help you achieve it.
            </p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
            >
              Set Your First Goal
            </button>
          </motion.div>
        )}

        {/* Goal Statistics */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Goal Statistics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {goals.length}
                </div>
                <div className="text-gray-600">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  ₹{goals.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  ₹{goals.reduce((sum, goal) => sum + calculateMonthlySavings(goal.amount, goal.timeline), 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Monthly Savings Required</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add/Edit Goal Modal */}
        <AnimatePresence>
          {showAddGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowAddGoal(false);
                setEditingGoal(null);
                setGoalForm({ name: '', amount: 0, timeline: 1, priority: 'medium' });
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Buy a house, Emergency fund"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={goalForm.amount}
                      onChange={(e) => setGoalForm({ ...goalForm, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline (years)
                    </label>
                    <input
                      type="number"
                      value={goalForm.timeline}
                      onChange={(e) => setGoalForm({ ...goalForm, timeline: parseFloat(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0.5"
                      step="0.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={goalForm.priority}
                      onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value as 'high' | 'medium' | 'low' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  {goalForm.amount > 0 && goalForm.timeline > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-medium">Monthly Savings Required:</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        ₹{calculateMonthlySavings(goalForm.amount, goalForm.timeline).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddGoal(false);
                        setEditingGoal(null);
                        setGoalForm({ name: '', amount: 0, timeline: 1, priority: 'medium' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
                    >
                      {editingGoal ? 'Update Goal' : 'Add Goal'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Goals;