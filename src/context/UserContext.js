// src/context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useSession } from "./SessionContext";

export const UserContext = createContext({
  profile: null,
  loading: true,
  reloadProfile: () => {},
});

export const UserProvider = ({ children }) => {
  const { session } = useSession();          // ✅ get clientId from session
  const clientId = session?.clientId;        // ✅ dynamic ID from login

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!clientId) return;                   // ⛔ stop if not logged in

    try {
      setLoading(true);

      const res = await fetch(
        `https://residentapi.strata-global.com/api/get-approved-client?userId=${clientId}`
      );

      const data = await res.json();
      setProfile(data);

    } catch (err) {
      console.log("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 reload when user logs in OR ID changes
  useEffect(() => {
    loadProfile();
  }, [clientId]);

  return (
    <UserContext.Provider value={{ profile, loading, reloadProfile: loadProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
