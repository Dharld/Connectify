/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToasterContext = createContext();

export const ToasterProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  return (
    <ToasterContext.Provider value={{ showSuccess, showError }}>
      <Toaster position="top-right" />
      {children}
    </ToasterContext.Provider>
  );
};

export const useToast = () => useContext(ToasterContext);
