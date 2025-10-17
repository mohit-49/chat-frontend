"use client";
import React, { createContext, useContext, useState } from "react";
import Loader from "./Loader";

interface LoaderContextType {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  console.log("showLoader called",showLoader)
  const hideLoader = () => setLoading(false);
console.log("LoaderProvider mounted")
  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
