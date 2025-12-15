// src/context/SessionContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SessionContext = createContext(null);
const STORAGE_KEY = "tenantapp_session";

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  /* ---------------------------------------------------------
     LOAD SESSION FROM STORAGE
  --------------------------------------------------------- */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSession(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Failed to load session", e);
      } finally {
        setIsReady(true);
      }
    };

    loadSession();
  }, []);

  /* ---------------------------------------------------------
     SAVE SESSION (BACKEND FIELD NAMES ONLY)
  --------------------------------------------------------- */
  const saveSession = async (data) => {
    if (!data) {
      await clearSession();
      return;
    }

    // 🔒 STRICT BACKEND MAPPING
    const formattedSession = {
      // User info
      name: data.FirstName,
      email: data.EMail,
      mobile: data.MobileNumber,

      // ✅ IDs (CRITICAL)
      clientId: Number(data.ClientId), // 752317
      userId: Number(data.ClientId),   // alias (same)
      officeId: Number(data.unit),     // 204 (USED IN API)

      // Display values
      officeNumber: data.OfficeNumber, // 3402
      buildingName: data.buildingName,

      // Auth
      loginKey: data.loginKey,

      // Meta
      clientTypeId: data.ClientTypeid,
      userTypeId: data.UserTypeId,
      status: data.status,
    };

    console.log("✅ SESSION SAVED (BACKEND ONLY):", formattedSession);

    setSession(formattedSession);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(formattedSession)
      );
    } catch (e) {
      console.warn("Failed to persist session", e);
    }
  };

  /* ---------------------------------------------------------
     CLEAR SESSION
  --------------------------------------------------------- */
  const clearSession = async () => {
    setSession(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear session", e);
    }
  };

  if (!isReady) return null;

  return (
    <SessionContext.Provider
      value={{
        session,
        saveSession,
        clearSession,
        isReady,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

/* ---------------------------------------------------------
   HOOK
--------------------------------------------------------- */
export const useSession = () => useContext(SessionContext);
