import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface UserProfile {
  income: number;
  expenses: number;
  debts: number;
  savings: number;
  riskTolerance: 'low' | 'medium' | 'high';
  goals: Goal[];
  age: number;
  dependents: number;
  taxRegime: 'old' | 'new';
  deductions: Record<string, number>;
}

interface Goal {
  id: string;
  name: string;
  amount: number;
  timeline: number;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

interface FinancialState {
  profile: UserProfile | null;
  budget: {
    essentials: number;
    wants: number;
    savings: number;
  } | null;
  chatHistory: ChatMessage[];
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type FinancialAction = 
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_BUDGET'; payload: { essentials: number; wants: number; savings: number } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'LOAD_STATE'; payload: FinancialState };

const initialState: FinancialState = {
  profile: null,
  budget: null,
  chatHistory: [],
};

const FinancialContext = createContext<{
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
} | null>(null);

function financialReducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_BUDGET':
      return { ...state, budget: action.payload };
    case 'ADD_GOAL':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          goals: [...state.profile.goals, action.payload]
        } : null
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          goals: state.profile.goals.map(g => g.id === action.payload.id ? action.payload : g)
        } : null
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('wealthwise-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wealthwise-state', JSON.stringify(state));
  }, [state]);

  return (
    <FinancialContext.Provider value={{ state, dispatch }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}