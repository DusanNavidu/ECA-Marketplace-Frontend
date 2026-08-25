import React, { createContext, useState, useContext } from 'react';
import Button from '../components/ui/Button';

// 1. Context එක හදනවා
const AlertContext = createContext();

// 2. අනිත් Components වලට ලේසියෙන් පාවිච්චි කරන්න Hook එකක් හදනවා
export const useAlert = () => useContext(AlertContext);

// 3. Provider Component එක
export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' හෝ 'confirm'
    title: '',
    message: '',
    onConfirm: null,
  });

  // සාමාන්‍ය Alert එකක් පෙන්නන්න
  const showAlert = (title, message) => {
    setAlertState({ isOpen: true, type: 'alert', title, message, onConfirm: null });
  };

  // Confirm Alert එකක් පෙන්නන්න (Yes/No)
  const showConfirm = (title, message, onConfirmCallback) => {
    setAlertState({ isOpen: true, type: 'confirm', title, message, onConfirm: onConfirmCallback });
  };

  const close = () => setAlertState({ ...alertState, isOpen: false });

  const handleConfirm = () => {
    if (alertState.onConfirm) alertState.onConfirm();
    close();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* ලස්සන Modal UI එක (Glassmorphism සහ Animations එක්ක) */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 opacity-100 border border-gray-100">
            <div className="p-6">
              
              <h3 className={`text-xl font-extrabold mb-2 ${alertState.type === 'confirm' ? 'text-blue-600' : 'text-red-500'}`}>
                {alertState.title}
              </h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {alertState.message}
              </p>
              
              <div className="flex justify-end space-x-3">
                {alertState.type === 'confirm' && (
                  <Button variant="ghost" onClick={close} className="text-gray-500 hover:bg-gray-100">
                    Cancel
                  </Button>
                )}
                <Button 
                  variant={alertState.type === 'confirm' ? 'primary' : 'primary'} 
                  onClick={handleConfirm}
                  className="shadow-md shadow-blue-200"
                >
                  {alertState.type === 'confirm' ? 'Yes, Continue' : 'Got it'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}