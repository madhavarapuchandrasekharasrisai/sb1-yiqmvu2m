import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 p-2 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <p className="text-center">
          <strong>Disclaimer:</strong> This is an AI-generated financial planning tool. 
          The advice provided is not certified financial advice. Please consult with a 
          licensed financial advisor for personalized guidance.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;