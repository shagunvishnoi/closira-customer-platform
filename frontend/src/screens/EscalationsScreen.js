import React from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import ChannelBadge from "../components/ChannelBadge";
import EmptyState from "../components/EmptyState";
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from "../theme";

export default function EscalationsScreen({ navigation }) {
  const { enquiries, resolvedIds, resolveEscalation } = useData();

  const handleResolve = (id) => {
    const message = "Confirm this escalation is resolved?";

    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(message)) resolveEscalation(id);
    } else {
      Alert.alert("Resolve Escalation", message, [
        { text: "Cancel", style: "cancel" },
        { text: "Resolve", style: "destructive", onPress: () => resolveEscalation(id) },
      ]);
    }
  };

  const escalations = enquiries.filter(
    (e) => e.status === "escalated" && !resolvedIds.includes(e.id)
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, SHADOW.small]}
      onPress={() => navigation.navigate("Conversation", { enquiryId: item.id })}
    >
      <View style={[styles.urgencyStrip, {
        backgroundColor: item.urgency === "high" ? COLORS.statusEscalated : COLORS.call
      }]} />

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View style={styles.nameRow}>
            <View style={[styles.initials, {
              backgroundColor: item.urgency === "high" ? COLORS.statusEscalatedBg : COLORS.callBg
            }]}>
              <Text style={[styles.initialsText, {
                color: item.urgency === "high" ? COLORS.statusEscalated : COLORS.call
              }]}>
                {item.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={styles.name}>{item.customer_name}</Text>
              <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={[styles.urgencyBadge, {
            backgroundColor: item.urgency === "high" ? COLORS.statusEscalatedBg : COLORS.callBg
          }]}>
            <Text style={[styles.urgencyText, {
              color: item.urgency === "high" ? COLORS.statusEscalated : COLORS.call
            }]}>{item.urgency === "high" ? "High" : "Medium"}</Text>
          </View>
        </View>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonText}>{item.escalation_reason}</Text>
        </View>

        <View style={styles.cardBottom}>
          <ChannelBadge channel={item.channel} size="sm" />
          <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolve(item.id)}>
            <Text style={styles.resolveBtnText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerArea}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>Escalations</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{escalations.length} Active</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <FlatList
        data={escalations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🎉"
            title="All Clear!"
            subtitle="No pending escalations right now."
          />
        }
      />
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
  countBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 4 },
  countText: { color: "#fff", fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  list: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingVertical: SPACING.lg, paddingBottom: SPACING.xxxl },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, flexDirection: "row", overflow: "hidden" },
  urgencyStrip: { width: 5 },
  cardContent: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  initials: { width: 34, height: 34, borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center" },
  initialsText: { fontWeight: "800", fontSize: 12 },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  time: { fontSize: 10, color: COLORS.textMuted },
  urgencyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
  urgencyText: { fontSize: 9, fontWeight: "900", textTransform: "uppercase" },
  reasonBox: { backgroundColor: COLORS.borderLight, borderRadius: RADIUS.sm, padding: SPACING.md },
  reasonText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  resolveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: RADIUS.sm },
  resolveBtnText: { color: "#fff", fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
});