import React from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { getConversation } from "../mock/conversations";
import ChannelBadge from "../components/ChannelBadge";
import StatusBadge from "../components/StatusBadge";
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from "../theme";

export default function ConversationScreen({ route, navigation }) {
    const { enquiryId } = route.params;
    const { enquiries } = useData();
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    const conversation = getConversation(enquiryId);

    if (!enquiry) {
        return (
            <View style={styles.centered}>
                <Text>Enquiry not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.safe}>
            <StatusBar barStyle="light-content" />
            <View style={styles.headerArea}>
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerName}>{enquiry.customer_name}</Text>
                            <View style={styles.headerStatusRow}>
                                <ChannelBadge channel={enquiry.channel} size="sm" />
                                <Text style={styles.dot}>·</Text>
                                <StatusBadge status={enquiry.status} size="sm" />
                                {enquiry.sop_matched && (
                                    <>
                                        <Text style={styles.dot}>·</Text>
                                        <View style={styles.sopBadge}>
                                            <Text style={styles.sopBadgeText}>{enquiry.sop_matched}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {enquiry.summary && (
                    <View style={[styles.summaryCard, SHADOW.small]}>
                        <View style={styles.summaryHeader}>
                            <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                            <Text style={styles.summaryTitle}>AI SUMMARY</Text>
                        </View>
                        <Text style={styles.summaryText}>{enquiry.summary}</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Conversation</Text>
                <View style={styles.messageList}>
                    {conversation.messages.length > 0 ? (
                        conversation.messages.map((m) => (
                            <View
                                key={m.id}
                                style={[
                                    styles.messageBubble,
                                    m.sender === "ai" ? styles.aiBubble : styles.customerBubble,
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    m.sender === "ai" ? styles.aiText : styles.customerText
                                ]}>
                                    {m.content}
                                </Text>
                                <Text style={[
                                    styles.messageTime,
                                    m.sender === "ai" ? styles.aiTime : styles.customerTime
                                ]}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.customerBubble}>
                            <Text style={styles.customerText}>{enquiry.message}</Text>
                            <Text style={styles.customerTime}>
                                {new Date(enquiry.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Timeline</Text>
                <View style={styles.timelineContainer}>
                    {conversation.timeline.length > 0 ? (
                        conversation.timeline.map((t, idx) => (
                            <View key={idx} style={styles.timelineItem}>
                                <View style={styles.timelineIndicators}>
                                    <View style={[
                                        styles.timelineDot,
                                        idx === 0 ? styles.activeDot : styles.inactiveDot
                                    ]} />
                                    {idx !== conversation.timeline.length - 1 && <View style={styles.timelineLine} />}
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineStatus}>{t.status.toUpperCase()}</Text>
                                    <Text style={styles.timelineNote}>{t.note}</Text>
                                    <Text style={styles.timelineTime}>
                                        {new Date(t.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.timelineItem}>
                            <View style={styles.timelineIndicators}>
                                <View style={[styles.timelineDot, styles.activeDot]} />
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={styles.timelineStatus}>NEW</Text>
                                <Text style={styles.timelineNote}>Inbound message via {enquiry.channel}</Text>
                                <Text style={styles.timelineTime}>
                                    {new Date(enquiry.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    headerArea: { backgroundColor: COLORS.primary },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.md },
    backBtn: { padding: 4 },
    headerInfo: { flex: 1 },
    headerName: { fontSize: 16, fontWeight: "800", color: "#fff" },
    headerStatusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
    dot: { color: "rgba(255,255,255,0.5)", fontSize: 12 },
    scrollContent: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
    summaryCard: { backgroundColor: COLORS.statusNewBg, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary },
    summaryHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
    summaryTitle: { fontSize: 10, fontWeight: "900", color: COLORS.primary, letterSpacing: 1 },
    summaryText: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20 },
    sectionTitle: { fontSize: 12, fontWeight: "800", color: COLORS.textPrimary, marginBottom: SPACING.lg, textTransform: "uppercase" },
    messageList: { gap: SPACING.md },
    messageBubble: { maxWidth: "85%", padding: SPACING.md, borderRadius: RADIUS.md },
    customerBubble: { alignSelf: "flex-start", backgroundColor: COLORS.surface },
    aiBubble: { alignSelf: "flex-end", backgroundColor: COLORS.primary },
    messageText: { fontSize: 13, lineHeight: 20 },
    customerText: { color: COLORS.textPrimary },
    aiText: { color: "#fff" },
    messageTime: { fontSize: 9, marginTop: 4 },
    customerTime: { color: COLORS.textMuted, alignSelf: "flex-end" },
    aiTime: { color: "rgba(255,255,255,0.7)", alignSelf: "flex-end" },
    timelineContainer: { paddingLeft: SPACING.xs },
    timelineItem: { flexDirection: "row", gap: SPACING.md },
    timelineIndicators: { alignItems: "center", width: 12 },
    timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
    activeDot: { backgroundColor: COLORS.primary },
    inactiveDot: { backgroundColor: COLORS.border },
    timelineLine: { width: 1.5, flex: 1, backgroundColor: COLORS.border, marginVertical: 4 },
    timelineContent: { flex: 1, paddingBottom: SPACING.xl },
    timelineStatus: { fontSize: 10, fontWeight: "900", color: COLORS.textPrimary },
    timelineNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    timelineTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
    sopBadge: {
        backgroundColor: COLORS.statusQualifiedBg,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    sopBadgeText: {
        color: COLORS.statusQualified,
        fontSize: 9,
        fontWeight: "900",
        textTransform: "uppercase",
    },
});
