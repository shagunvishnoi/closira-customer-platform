import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_SIZE, SPACING, RADIUS } from "../theme";

const ChannelBadge = ({ channel, size = "md" }) => {
  const config = {
    whatsapp: { label: "WhatsApp", color: COLORS.whatsapp, bg: COLORS.whatsappBg, icon: "logo-whatsapp" },
    email: { label: "Email", color: COLORS.email, bg: COLORS.emailBg, icon: "mail" },
    call: { label: "Call", color: COLORS.call, bg: COLORS.callBg, icon: "call" },
  };

  const c = config[channel] || { label: channel, color: COLORS.textSecondary, bg: COLORS.borderLight, icon: "information-circle" };
  const isSmall = size === "sm";
  const iconSize = isSmall ? 10 : 14;

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, isSmall && styles.badgeSmall]}>
      <Ionicons name={c.icon} size={iconSize} color={c.color} />
      <Text style={[styles.label, { color: c.color }, isSmall && styles.labelSmall]}>{c.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeSmall: { paddingHorizontal: 6, paddingVertical: 2 },
  label: { fontSize: FONT_SIZE.xs, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3 },
  labelSmall: { fontSize: 9 },
});

export default ChannelBadge;