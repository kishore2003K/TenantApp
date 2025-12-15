// src/PaymentHistory.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GreetingCard from "./GreetingCard";

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Fetch profile data (same API as Profile.jsx)
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://residentapi.strata-global.com/api/get-approved-client?userId=752329"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!isMounted) return;

        setProfile(data);
      } catch (err) {
        if (isMounted) {
          console.log("PaymentHistory profile error:", err.message);
          setError("Failed to load profile.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const p = profile || {};
  const customerName = p.FirstName || "—";
  const buildingName = p.BuildingName || "—";
  const unitName = p.UnitName || "";
  const buildingLabel =
    buildingName && unitName ? `${buildingName} - ${unitName}` : buildingName;

  if (loading) {
    // 🔹 Skeleton view (including GreetingCard skeleton)
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* GreetingCard skeleton */}
        <GreetingCard loading={true} name=" " building=" " />

        {/* Header skeleton */}
        <View style={[styles.headerStrip, styles.skeleton]} />

        {/* Payment card skeleton */}
        <View style={[styles.paymentCard, styles.skeletonCard]}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.paymentRow}>
              <View style={[styles.skelLine, { width: "40%" }]} />
              <View style={[styles.skelLine, { width: "30%" }]} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting from backend */}
      <GreetingCard
        loading={false}
        name={customerName}
        building={buildingLabel}
      />

      {/* Optional small error text if profile failed but we still show page */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {/* PAYMENT HISTORY HEADER */}
      <View style={styles.headerStrip}>
        <Text style={styles.headerStripText}>Payment History</Text>
      </View>

      {/* PAYMENT DETAILS CARD (static demo data for now) */}
      <View style={styles.paymentCard}>
        {/* Payment No. */}
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payment No.</Text>
          <Text style={styles.paymentValue}>62</Text>
        </View>

        {/* Received Amount */}
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Received Amount</Text>
          <View style={styles.amountBadge}>
            <Text style={styles.amountBadgeText}>1000 AED</Text>
          </View>
        </View>

        {/* Mode */}
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Mode</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Cash</Text>
          </View>
        </View>

        {/* Bill Type */}
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Bill Type</Text>
          <Text style={styles.paymentValue}>Chiller Security Deposit</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* Header strip */
  headerStrip: {
     backgroundColor: "#F5F5DC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
     marginBottom: 12,
    borderRadius: 6,

  },
  headerStripText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#21098bff",
  },

  /* Payment card */
  paymentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
    flex: 1,
  },
  paymentValue: {
    fontSize: 14,
    color: "#1e1c1cff",
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
  },

  amountBadge: {
    backgroundColor: "#2c5cc7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  amountBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  modeBadge: {
    backgroundColor: "#2cb2c7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modeBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Skeleton styles */
  skeleton: {
    backgroundColor: "#e3e3e3",
  },
  skeletonCard: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
  },
  skelLine: {
    height: 12,
    backgroundColor: "#e3e3e3",
    borderRadius: 6,
  },

  errorText: {
    fontSize: 12,
    color: "#b91c1c",
    marginBottom: 8,
  },
});

export default PaymentHistory;
