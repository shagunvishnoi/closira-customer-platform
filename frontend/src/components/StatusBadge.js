import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, SPACING, RADIUS } from "../theme";

const StatusBadge = ({ status, size = "md" }) => {
  const config = {
    new: { label: "New", color: COLORS.statusNew, bg: COLORS.statusNewBg },
    qualified: { label: "Qualified", color: COLORS.statusQualified, bg: COLORS.statusQualifiedBg },
    escalated: { label: "Escalated", color: COLORS.statusEscalated, bg: COLORS.statusEscalatedBg },
    pending: { label: "Pending", color: COLORS.textSecondary, bg: COLORS.borderLight },
    processing: { label: "Processing", color: COLORS.call, bg: COLORS.callBg },
    sop_matched: { label: "SOP Matched", color: COLORS.statusQualified, bg: COLORS.statusQualifiedBg },
  };

  const c = config[status] || { label: status, color: COLORS.textSecondary, bg: COLORS.borderLight };
  const isSmall = size === "sm";

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, isSmall && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: c.color }]} />
      <Text style={[styles.label, { color: c.color }, isSmall && styles.labelSmall]}>{c.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeSmall: { paddingHorizontal: 6, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: FONT_SIZE.sm, fontWeight: "600" },
  labelSmall: { fontSize: FONT_SIZE.xs },
});

export default StatusBadge;