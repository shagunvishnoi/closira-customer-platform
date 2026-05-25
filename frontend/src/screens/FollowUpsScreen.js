import React from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChannelBadge from "../components/ChannelBadge";
import EmptyState from "../components/EmptyState";
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from "../theme";
import { useData } from "../context/DataContext";

export default function FollowUpsScreen() {
  const { followUps, doneFollowUpIds, markFollowUpDone, isLoaded } = useData();

  if (!isLoaded) return null;

  const pending = followUps.filter((f) => !doneFollowUpIds.includes(f.id));
  const completed = followUps.filter((f) => doneFollowUpIds.includes(f.id));

  const renderItem = ({ item }) => {
    const isDone = doneFollowUpIds.includes(item.id);
    return (
      <View style={[styles.card, SHADOW.small, isDone && styles.cardDone]}>
        <View style={styles.cardTop}>
          <View style={styles.infoCol}>
            <Text style={[styles.customerName, isDone && styles.textDone]}>{item.customer_name}</Text>
            <Text style={styles.date}>Due {new Date(item.scheduled_at).toLocaleDateString()}</Text>
          </View>
          <ChannelBadge channel={item.channel} size="sm" />
        </View>
        <Text style={[styles.task, isDone && styles.textDone]}>{item.message_preview}</Text>
        {!isDone && (
          <TouchableOpacity style={styles.doneBtn} onPress={() => markFollowUpDone(item.id)}>
            <Text style={styles.doneBtnText}>Mark as Done</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerArea}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>Follow-ups</Text>
          </View>
        </SafeAreaView>
      </View>
      <FlatList
        data={[...pending, ...completed]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🏆"
            title="All Done!"
            subtitle="No pending follow-ups for now."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { backgroundColor: COLORS.primary },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: 22, fontWeight: "900", color: "#fff" },
  list: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingVertical: SPACING.lg, paddingBottom: SPACING.xxxl },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  cardDone: { opacity: 0.5, backgroundColor: COLORS.borderLight },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  customerName: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  date: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  task: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  textDone: { textDecorationLine: 'line-through' },
  doneBtn: { backgroundColor: COLORS.primary, paddingVertical: 8, borderRadius: RADIUS.sm, alignItems: "center", marginTop: 4 },
  doneBtnText: { color: "#fff", fontWeight: "800", fontSize: 11, textTransform: "uppercase" },
});