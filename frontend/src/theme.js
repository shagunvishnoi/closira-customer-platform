export const COLORS = {
  // Brand Colors
  primary: "#4F46E5", // Indigo 600 (Softer than Slate 900)
  primaryDark: "#3730A3", // Indigo 800
  accent: "#10B981", // Emerald 500

  // Neutral Colors (High Contrast)
  background: "#E2E8F0", // Slate 200 (Definitely not white)
  surface: "#FFFFFF",

  // Status Colors
  statusNew: "#6366F1",
  statusNewBg: "#EEF2FF",
  statusQualified: "#10B981",
  statusQualifiedBg: "#ECFDF5",
  statusEscalated: "#EF4444",
  statusEscalatedBg: "#FEF2F2",

  // Typography
  textPrimary: "#1E293B", // Slate 800
  textSecondary: "#475569", // Slate 600
  textMuted: "#94A3B8", // Slate 400
  textInverse: "#FFFFFF",

  // Infrastructure
  border: "#CBD5E1", // Slate 300
  borderLight: "#F1F5F9",

  // Tab Navigation
  tabActive: "#4F46E5",
  tabInactive: "#94A3B8",

  // Channel Specific Colors
  whatsapp: "#10B981",
  whatsappBg: "#ECFDF5",
  email: "#3B82F6",
  emailBg: "#EFF6FF",
  call: "#F59E0B",
  callBg: "#FFFBEB",
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const FONT_SIZE = {
  xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 24, xxxl: 32,
};

export const RADIUS = {
  sm: 6, md: 10, lg: 16, xl: 24, full: 999,
};

export const SHADOW = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
};