// ---------------------------------------------------------------------------
// Design tokens — "Ignition"
// A confident near-black ink base with a vivid ignition-orange accent for
// actions and prices, and a teal for positive/confirmed states. Everything
// in the app should pull from here rather than hard-coding hex values, so
// the look stays consistent and is easy to retheme later.
// ---------------------------------------------------------------------------

export const Colors = {
  // Core ink & surfaces
  ink: "#14161F",
  inkSoft: "#565A6B",
  surface: "#FFFFFF",
  background: "#F4F3F8",
  border: "#E7E6EF",
  divider: "#EEEDF4",

  // Ignition orange — primary actions, prices, active states
  accent: "#FF5A36",
  accentDark: "#D8431F",
  accentSoft: "#FFE9E0",

  // Teal — success, paid, available
  teal: "#0EA37D",
  tealDark: "#0B7F62",
  tealSoft: "#DEF6EE",

  // Amber — admin badge / payment-pending
  amber: "#B8860B",
  amberSoft: "#FBF3D9",

  // Danger — destructive actions, errors
  danger: "#E5484D",
  dangerDark: "#C23438",
  dangerSoft: "#FCEAEB",

  // Text
  textMuted: "#8A8D9B",
  textBody: "#3E4150",

  white: "#FFFFFF",

  // Back-compat aliases (older screens referenced these directly)
  primary: "#14161F",
  adminBadge: "#B8860B",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const Type = {
  display: { fontSize: 30, fontWeight: "800" as const, letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.3 },
  heading: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  label: { fontSize: 13, fontWeight: "700" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};

export const Shadow = {
  card: {
    shadowColor: "#14161F",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: "#14161F",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
