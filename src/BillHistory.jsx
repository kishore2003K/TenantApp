// BillHistoryScreen.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GreetingCard from "./GreetingCard";

const FILTERS = [
  { key: "all", label: "All", icon: "📊" },
  { key: "last6", label: "6 Months", icon: "🗓️" },
];

const BILL_DATA = [
  {
    id: "76",
    billNo: "76",
    billDate: "2025-10-21",
    fromDate: "2025-08-11",
    toDate: "2025-10-21",
    type: "Electricity",
    paymentMethod: "Credit Card",
    amount: "100",
    currency: "AED",
  },
  {
    id: "77",
    billNo: "77",
    billDate: "2025-09-15",
    fromDate: "2025-07-01",
    toDate: "2025-09-15",
    type: "Water",
    paymentMethod: "Direct Debit",
    amount: "250",
    currency: "AED",
  },
  {
    id: "78",
    billNo: "78",
    billDate: "2025-06-10",
    fromDate: "2025-04-01",
    toDate: "2025-06-10",
    type: "Gas",
    paymentMethod: "Standing Instruction",
    amount: "180",
    currency: "AED",
  },
];

function formatDisplayDate(isoStr) {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function monthsDiff(from, to) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

/* ---------------- Skeleton Card ---------------- */

const SkeletonCard = () => (
  <View style={styles.billCard}>
    <View style={styles.cardTopRow}>
      {/* Icon circle */}
      <View style={[styles.iconBox, styles.skeletonBox]} />

      {/* Middle text */}
      <View style={styles.cardTextBlock}>
        <View
          style={[
            styles.skeletonBox,
            { width: "60%", height: 12, marginBottom: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonBox,
            { width: "40%", height: 10, marginBottom: 4 },
          ]}
        />
        <View
          style={[
            styles.skeletonBox,
            { width: "70%", height: 10 },
          ]}
        />
      </View>

      {/* Right side */}
      <View style={styles.cardRightBlock}>
        <View
          style={[
            styles.skeletonBox,
            { width: 70, height: 14, marginBottom: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonBox,
            { width: 60, height: 16, borderRadius: 999, marginBottom: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonBox,
            { width: 80, height: 10 },
          ]}
        />
      </View>
    </View>
  </View>
);

export default function BillHistoryScreen() {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const filteredBills = useMemo(() => {
    const today = new Date();
    return BILL_DATA.filter((bill) => {
      const billDate = new Date(bill.billDate);

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (billDate < start || billDate > end) return false;
      }

      const diff = monthsDiff(billDate, today);
      if (activeFilter === "current") return diff === 0;
      if (activeFilter === "last6") return diff >= 0 && diff < 6;
      return true;
    });
  }, [activeFilter, startDate, endDate]);

  const totalAmount = useMemo(
    () => filteredBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0),
    [filteredBills]
  );

  /* ---------- SKELETON STATE ---------- */
  if (showSkeleton) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
        <View style={styles.root}>
          <View style={styles.mainContent}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <GreetingCard loading />

              {/* fake header bar skeleton */}
              <View style={[styles.header, { marginBottom: 12 }]}>
                <View
                  style={[
                    styles.skeletonBox,
                    { width: 120, height: 18, borderRadius: 8 },
                  ]}
                />
              </View>

              {/* filter skeleton row */}
              <View style={styles.filtersContainer}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={[
                      styles.skeletonBox,
                      {
                        width: 80,
                        height: 30,
                        borderRadius: 999,
                        marginRight: 8,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonBox,
                      {
                        width: 100,
                        height: 30,
                        borderRadius: 999,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* skeleton cards */}
              <View style={styles.listContainer}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- REAL UI ---------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View style={styles.root}>
        <View style={styles.mainContent}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Greeting card same pattern as Profile */}
            <GreetingCard />

            {/* Header bar (yellow) under greeting card */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Bill History</Text>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}
              >
                {FILTERS.map((f) => {
                  const isActive = activeFilter === f.key && !showDateFilter;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      onPress={() => {
                        setActiveFilter(f.key);
                        setStartDate("");
                        setEndDate("");
                        setShowDateFilter(false);
                      }}
                      activeOpacity={0.85}
                      style={[
                        styles.filterPill,
                        isActive && styles.filterPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterPillIcon,
                          isActive && styles.filterPillTextActive,
                        ]}
                      >
                        {f.icon}
                      </Text>
                      <Text
                        style={[
                          styles.filterPillText,
                          isActive && styles.filterPillTextActive,
                        ]}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Date Range pill */}
                <TouchableOpacity
                  onPress={() => {
                    setShowDateFilter((prev) => !prev);
                    setActiveFilter("all");
                  }}
                  activeOpacity={0.85}
                  style={[
                    styles.filterPill,
                    showDateFilter && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillIcon,
                      showDateFilter && styles.filterPillTextActive,
                    ]}
                  >
                    📆
                  </Text>
                  <Text
                    style={[
                      styles.filterPillText,
                      showDateFilter && styles.filterPillTextActive,
                    ]}
                  >
                    Date Range
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Date range card */}
              {showDateFilter && (
                <View style={styles.dateFilterCard}>
                  <Text style={styles.dateFilterTitle}>Select Date Range</Text>
                  <View style={styles.dateRow}>
                    <TouchableOpacity
                      style={styles.dateBox}
                      onPress={() => console.log("Select From Date")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dateBoxLabel}>From Date</Text>
                      <Text style={styles.dateBoxValue}>
                        {startDate ? formatDisplayDate(startDate) : "Any"}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.dateDash}>—</Text>

                    <TouchableOpacity
                      style={styles.dateBox}
                      onPress={() => console.log("Select To Date")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dateBoxLabel}>To Date</Text>
                      <Text style={styles.dateBoxValue}>
                        {endDate ? formatDisplayDate(endDate) : "Any"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {startDate && endDate ? (
                    <TouchableOpacity
                      style={styles.clearDatesBtn}
                      onPress={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.clearDatesText}>Clear Dates</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>

            {/* Bills list */}
            <View style={styles.listContainer}>
              {filteredBills.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyTitle}>No bills found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your filters
                  </Text>
                </View>
              ) : (
                filteredBills.map((bill) => {
                  const typeInitial =
                    bill.type?.charAt(0)?.toUpperCase() || "?";

                  return (
                    <View key={bill.id} style={styles.billCard}>
                      <View style={styles.cardTopRow}>
                        {/* Left circle with type initial */}
                        <View style={styles.iconBox}>
                          <Text style={styles.iconEmoji}>{typeInitial}</Text>
                        </View>

                        {/* Middle: type + chips */}
                        <View style={styles.cardTextBlock}>
                          <Text style={styles.billTitle}>{bill.type} Bill</Text>

                          <View style={styles.tagRow}>
                            <View style={styles.tagChip}>
                              <Text style={styles.tagChipText}>
                                Payment: {bill.paymentMethod}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Right: Paid on + amount + status */}
                        <View style={styles.cardRightBlock}>
  <Text style={styles.paidOnText}>
    Paid on {formatDisplayDate(bill.billDate)}
  </Text>

  <Text style={styles.amountText}>
    {bill.amount} {bill.currency}
  </Text>

  <View style={styles.paidPillBox}>
    <Text style={styles.paidPillText}>PAID</Text>
  </View>
</View>

                      </View>
                    </View>
                  );
                })
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },

  scrollContent: {
    paddingHorizontal: 16,   // same as Profile
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* Skeleton shared box */
  skeletonBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },

  /* Header bar */
  header: {
    marginTop: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5DC",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "space-between",
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "rgb(3,10,112)",
  },

  /* Filters */
  filtersContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  filtersRow: {
    paddingRight: 4,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterPillIcon: {
    fontSize: 14,
    marginRight: 6,
    color: "#4B5563",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },

  /* Date filter card */
  dateFilterCard: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dateFilterTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F9FAFB",
  },
  dateBoxLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  dateBoxValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  dateDash: {
    marginHorizontal: 8,
    fontSize: 20,
    color: "#9CA3AF",
  },
  clearDatesBtn: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  clearDatesText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  /* List */
  listContainer: {
    paddingTop: 4,           // no extra horizontal padding
  },

  emptyWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* Bill card */
  billCard: {
    backgroundColor: "#F9FAFF",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#E0EAFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
    fontWeight: "700",
  },

  cardTextBlock: {
    flex: 1,
    marginTop:20,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  tagChipLight: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  tagChipLightText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1D4ED8",
  },
cardRightBlock: {
  alignItems: "flex-end",
  justifyContent: "space-between",
  height: 60,              // ensures balanced vertical layout
  paddingVertical: 2,
},

paidOnText: {
  fontSize: 11,
  color: "#6B7280",
  marginBottom: 2,
},

amountText: {
  fontSize: 18,
  fontWeight: "900",
  color: "#111827",
  marginVertical: 2,
},

paidPillBox: {
  backgroundColor: "rgba(22,163,74,0.15)",
  paddingHorizontal: 10,
  paddingVertical: 2,
  borderRadius: 999,
  alignSelf: "flex-end",
},

paidPillText: {
  fontSize: 10,
  fontWeight: "700",
  color: "#16A34A",
},
  // leftover detail styles
  detailIconImage: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  detailIconPeriodImage: {
    width: 12,
    height: 12,
    resizeMode: "contain",
  },
  detailsBlock: {
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailTile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailTextWrap: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  periodLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 2,
  },
  periodValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
});
