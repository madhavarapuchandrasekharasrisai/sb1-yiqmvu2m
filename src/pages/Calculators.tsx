import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, Car, CreditCard, TrendingUp, PiggyBank, FileText } from 'lucide-react';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});

  const calculatorCategories = [
    {
      title: 'Loan Calculators',
      icon: Home,
      calculators: [
        { id: 'home-loan', name: 'Home Loan EMI', icon: Home },
        { id: 'car-loan', name: 'Car Loan EMI', icon: Car },
        { id: 'personal-loan', name: 'Personal Loan EMI', icon: CreditCard },
      ]
    },
    {
      title: 'Investment Calculators',
      icon: TrendingUp,
      calculators: [
        { id: 'sip', name: 'SIP Calculator', icon: TrendingUp },
        { id: 'lumpsum', name: 'Lumpsum Calculator', icon: PiggyBank },
        { id: 'fd', name: 'Fixed Deposit Calculator', icon: PiggyBank },
      ]
    },
    {
      title: 'Tax Calculators',
      icon: FileText,
      calculators: [
        { id: 'income-tax', name: 'Income Tax Calculator', icon: FileText },
        { id: 'hra', name: 'HRA Calculator', icon: Home },
        { id: 'capital-gains', name: 'Capital Gains Calculator', icon: TrendingUp },
      ]
    }
  ];

  const EMICalculator = ({ type }: { type: string }) => {
    const [principal, setPrincipal] = useState(1000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    const calculateEMI = () => {
      const monthlyRate = rate / 100 / 12;
      const months = tenure * 12;
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
      const totalAmount = emi * months;
      const totalInterest = totalAmount - principal;

      setResults({
        ...results,
        [type]: {
          emi: Math.round(emi),
          totalAmount: Math.round(totalAmount),
          totalInterest: Math.round(totalInterest)
        }
      });
    };

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenure (years)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={calculateEMI}
          className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          Calculate EMI
        </button>

        {results[type] && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">₹{results[type].emi.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Monthly EMI</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">₹{results[type].totalAmount.toLocaleString()}</div>
              <div className="text-sm text-green-800">Total Amount</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">₹{results[type].totalInterest.toLocaleString()}</div>
              <div className="text-sm text-red-800">Total Interest</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SIPCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [tenure, setTenure] = useState(10);

    const calculateSIP = () => {
      const monthlyRate = expectedReturn / 100 / 12;
      const months = tenure * 12;
      const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const totalInvestment = monthlyInvestment * months;
      const totalReturns = futureValue - totalInvestment;

      setResults({
        ...results,
        sip: {
          futureValue: Math.round(futureValue),
          totalInvestment: Math.round(totalInvestment),
          totalReturns: Math.round(totalReturns)
        }
      });
    };

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Return (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (years)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={calculateSIP}
          className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          Calculate SIP Returns
        </button>

        {results.sip && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">₹{results.sip.futureValue.toLocaleString()}</div>
              <div className="text-sm text-green-800">Future Value</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">₹{results.sip.totalInvestment.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Total Investment</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">₹{results.sip.totalReturns.toLocaleString()}</div>
              <div className="text-sm text-purple-800">Total Returns</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalculator = (calculatorId: string) => {
    switch (calculatorId) {
      case 'home-loan':
      case 'car-loan':
      case 'personal-loan':
        return <EMICalculator type={calculatorId} />;
      case 'sip':
        return <SIPCalculator />;
      default:
        return (
          <div className="text-center py-8">
            <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Calculator coming soon...</p>
          </div>
        );
    }
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
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Financial Calculators</h1>
            </div>
            <p className="text-orange-100">
              Comprehensive suite of calculators for all your financial planning needs
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calculator Menu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Calculator</h2>
              <div className="space-y-4">
                {calculatorCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.title}>
                      <div className="flex items-center space-x-2 mb-2">
                        <CategoryIcon className="h-5 w-5 text-primary-600" />
                        <h3 className="font-medium text-gray-900">{category.title}</h3>
                      </div>
                      <div className="space-y-1 ml-7">
                        {category.calculators.map((calc) => {
                          const CalcIcon = calc.icon;
                          return (
                            <button
                              key={calc.id}
                              onClick={() => setActiveCalculator(calc.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${
                                activeCalculator === calc.id
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <CalcIcon className="h-4 w-4" />
                              <span>{calc.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Calculator Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeCalculator ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {calculatorCategories
                      .flatMap(cat => cat.calculators)
                      .find(calc => calc.id === activeCalculator)?.name}
                  </h2>
                  {renderCalculator(activeCalculator)}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calculator className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Choose a Calculator
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Select any calculator from the menu to start planning your finances. 
                    All calculations are performed instantly with detailed breakdowns.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {calculatorCategories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <div key={category.title} className="bg-gray-50 p-4 rounded-lg">
                          <CategoryIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                          <p className="text-sm text-gray-600">{category.calculators.length} calculators</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;