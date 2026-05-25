import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import ChannelBadge from "../components/ChannelBadge";
import StatusBadge from "../components/StatusBadge";
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from "../theme";

export default function DashboardScreen({ navigation }) {
  const { enquiries, followUps, doneFollowUpIds, addEnquiry } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [newEnq, setNewEnq] = useState({ name: "", message: "", channel: "whatsapp" });

  const totalLeadsToday = enquiries.filter((e) => {
    const d = new Date(e.created_at);
    return d.toDateString() === new Date("2025-05-20").toDateString();
  }).length;

  const missedEnquiries = enquiries.filter((e) => e.status === "escalated" && !e.escalation_reason?.includes("manually")).length;
  const openEscalations = enquiries.filter((e) => e.status === "escalated").length;
  const followUpsDue = followUps.filter(f => !doneFollowUpIds.includes(f.id)).length;

  const stats = [
    { label: "Leads Today", value: totalLeadsToday, icon: "people", color: COLORS.primary, bg: COLORS.statusNewBg },
    { label: "Missed", value: missedEnquiries, icon: "close-circle", color: COLORS.statusEscalated, bg: COLORS.statusEscalatedBg },
    { label: "Escalations", value: openEscalations, icon: "trending-up", color: COLORS.accent, bg: COLORS.statusQualifiedBg },
    { label: "Follow-ups", value: followUpsDue, icon: "time", color: "#F59E0B", bg: "#FFFBEB" },
  ];

  const quickActions = [
    { label: "Add Enquiry", icon: "add-circle", color: COLORS.primary, bg: COLORS.statusNewBg, action: () => setModalVisible(true) },
    { label: "All Leads", icon: "people-outline", color: COLORS.primary, bg: COLORS.statusNewBg, action: () => navigation.navigate("Leads") },
    { label: "Escalations", icon: "alert-circle-outline", color: COLORS.statusEscalated, bg: COLORS.statusEscalatedBg, action: () => navigation.navigate("Escalations") },
    { label: "Follow-ups", icon: "time-outline", color: "#F59E0B", bg: "#FFFBEB", action: () => navigation.navigate("FollowUps") },
  ];

  const handleCreate = () => {
    if (!newEnq.name || !newEnq.message) return;
    const isComplaint = /complaint|upset|problem|refund/i.test(newEnq.message);
    const entry = {
      id: `custom_${Date.now()}`,
      customer_name: newEnq.name,
      message: newEnq.message,
      channel: newEnq.channel,
      status: isComplaint ? "escalated" : "new",
      created_at: new Date().toISOString(),
      summary: isComplaint ? "New complaint detected. Auto-escalated." : "New lead received.",
      urgency: isComplaint ? "high" : null,
      escalation_reason: isComplaint ? "Detected negative sentiment in message." : null,
    };
    addEnquiry(entry);
    setModalVisible(false);
    setNewEnq({ name: "", message: "", channel: "whatsapp" });
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerArea}>
        <SafeAreaView>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.businessName}>Closira CRM</Text>
            </View>
            <TouchableOpacity style={styles.avatar}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={[styles.statCard, SHADOW.small]}>
                <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <View>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Main Actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.actionBtn, SHADOW.small, { backgroundColor: a.bg }]}
                onPress={a.action}
              >
                <Ionicons name={a.icon} size={20} color={a.color} />
                <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.feedContainer}>
            {enquiries.slice(0, 4).map((e) => (
              <TouchableOpacity
                key={e.id}
                style={[styles.feedCard, SHADOW.small]}
                onPress={() => navigation.navigate("Leads", { screen: "Conversation", params: { enquiryId: e.id } })}
              >
                <View style={styles.feedTop}>
                  <Text style={styles.feedName}>{e.customer_name}</Text>
                  <StatusBadge status={e.status} size="sm" />
                </View>
                <Text style={styles.feedMessage} numberOfLines={1}>{e.message}</Text>
                <View style={styles.feedBottom}>
                  <ChannelBadge channel={e.channel} size="sm" />
                  <Text style={styles.feedTime}>{new Date(e.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Inbound Enquiry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Customer Name</Text>
            <TextInput style={styles.input} value={newEnq.name} onChangeText={(t) => setNewEnq({ ...newEnq, name: t })} placeholder="Harry Potter" />
            <Text style={styles.inputLabel}>Message Body</Text>
            <TextInput style={[styles.input, styles.textArea]} value={newEnq.message} onChangeText={(t) => setNewEnq({ ...newEnq, message: t })} placeholder="Describe the enquiry..." multiline />
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.createBtnText}>Create Record</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { backgroundColor: COLORS.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
  greeting: { fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  businessName: { fontSize: 24, fontWeight: "900", color: "#fff", marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md, marginBottom: SPACING.xl },
  statCard: { width: "47.5%", backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, flexDirection: "row", alignItems: "center", gap: SPACING.md },
  statIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: "600", textTransform: "uppercase" },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: COLORS.textPrimary, marginBottom: SPACING.md, marginTop: SPACING.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md, marginBottom: SPACING.xl },
  actionBtn: { width: "47.5%", backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: "center", flexDirection: "row", gap: SPACING.sm },
  actionBtnPrimary: { backgroundColor: COLORS.primary },
  actionLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },
  actionLabelPrimary: { color: "#fff" },
  feedContainer: { gap: SPACING.md, paddingBottom: SPACING.xxxl },
  feedCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  feedTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  feedName: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  feedMessage: { fontSize: 12, color: COLORS.textSecondary },
  feedBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  feedTime: { fontSize: 10, color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg, padding: SPACING.xl, gap: SPACING.md },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  inputLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary, marginTop: 4 },
  input: { backgroundColor: COLORS.borderLight, borderRadius: RADIUS.sm, padding: SPACING.md, fontSize: 14 },
  textArea: { height: 100, textAlignVertical: "top" },
  createBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.sm, alignItems: "center", marginTop: SPACING.md },
  createBtnText: { color: "#fff", fontWeight: "700" },
});