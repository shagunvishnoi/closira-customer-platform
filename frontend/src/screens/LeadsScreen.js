import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useData } from "../context/DataContext";
import ChannelBadge from "../components/ChannelBadge";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from "../theme";

const FILTERS = ["All", "new", "qualified", "escalated"];

export default function LeadsScreen({ navigation }) {
  const { enquiries } = useData();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? enquiries
      : enquiries.filter((e) => e.status === activeFilter);

  const renderLead = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, SHADOW.small]}
      onPress={() => navigation.navigate("Conversation", { enquiryId: item.id })}
    >
      <View style={styles.cardTop}>
        <View style={styles.nameRow}>
          <View style={styles.initials}>
            <Text style={styles.initialsText}>
              {item.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text style={styles.name}>{item.customer_name}</Text>
            <Text style={styles.time}>
              {new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric" })} at {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>
        <StatusBadge status={item.status} size="sm" />
      </View>

      <Text style={styles.message} numberOfLines={2}>{item.message}</Text>

      <View style={styles.cardBottom}>
        <ChannelBadge channel={item.channel} size="sm" />
        {item.sop_matched && (
          <View style={styles.sopTag}>
            <Text style={styles.sopText}>🎯 {item.sop_matched}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerArea}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>Leads</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filtered.length} Total</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderLead}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="No matching leads"
              subtitle="Try changing the filter or creating a new enquiry."
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { backgroundColor: COLORS.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#fff" },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  countText: { color: "#fff", fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  content: { flex: 1 },
  filterRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "700" },
  filterTextActive: { color: "#fff" },
  list: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  initials: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { color: COLORS.textPrimary, fontWeight: "700", fontSize: 12 },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  time: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  message: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  cardBottom: { flexDirection: "row", gap: SPACING.sm, alignItems: "center" },
  sopTag: {
    backgroundColor: COLORS.statusQualifiedBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  sopText: { fontSize: 9, color: COLORS.statusQualified, fontWeight: "800" },
});