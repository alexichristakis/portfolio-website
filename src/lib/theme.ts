// Generally follows the ideas/schema documented here:
// https://system-ui.com/theme/

const regularWeight = 400;
const mediumWeight = 500;

const robotoFontStack = "Roboto, sans-serif;";
const robotoRegularFontWeight = regularWeight;
export const robotoMediumFontWeight = mediumWeight;

const robotoMonoFont = "Roboto Mono, monospace";

const foundersFontStack = "Founders Grotesk, sans-serif;";
const foundersMediumFontWeight = mediumWeight;

export const theme = {
  space: {
    0: 0,
    4: 4,
    8: 8,
    16: 16,
    32: 32,
    64: 64,
    128: 128,
  },
  sizes: {
    0: 0,
    8: 8,
    16: 16,
    32: 32,
    64: 64,
  },
  colors: {
    // blues
    blue10: "#EBEFF9",
    blue20: "#B4C5E9",
    blue30: "#829EDB",
    blue: "#1E50BE",
    blue60: "#184098",
    blue70: "#123072",
    blue80: "#0C204C",
    // reds
    red10: "#FCECEC",
    red: "#DF3232",
    red60: "#BD1D1D",
    red70: "#8E1616",
    red80: "#5E0F0F",
    // greens
    green: "#25B590",
    green60: "#1E9173",
    green70: "#166D56",
    green80: "#0F483A",
    // grays
    transparent: "transparent",
    white: "#FFFFFF",
    slate10: "#F8F9FA",
    slate20: "#EBEDF0",
    slate30: "#D8DCE1",
    slate40: "#BAC1CB",
    silver: "#939EAD", // aka slate50
    slate60: "#6F7D91",
    slate70: "#535E6D",
    slate80: "#373F49",
    charcoal: "#1C1F24", // aka slate90
  },
  fontFamilies: {
    roboto: robotoFontStack,
    robotoMono: robotoMonoFont,
    founders: foundersFontStack,
  },
  fontStyles: {
    h1: {
      fontFamily: foundersFontStack,
      fontWeight: foundersMediumFontWeight,
      fontSize: "40px",
      letterSpacing: "0.01em",
      lineHeight: "48px",
    },
    h2: {
      fontFamily: foundersFontStack,
      fontWeight: foundersMediumFontWeight,
      fontSize: "32px",
      letterSpacing: "0.01em",
      lineHeight: "40px",
    },
    h3: {
      fontFamily: foundersFontStack,
      fontWeight: foundersMediumFontWeight,
      fontSize: "28px",
      letterSpacing: "0.02em",
      lineHeight: "36px",
    },
    body: {
      fontFamily: robotoFontStack,
      fontWeight: robotoRegularFontWeight,
      fontSize: "16px",
      letterSpacing: "0.02em",
      lineHeight: "24px",
    },
    bodySmall: {
      fontFamily: robotoFontStack,
      fontWeight: robotoRegularFontWeight,
      fontSize: "14px",
      letterSpacing: "0.01em",
      lineHeight: "20px",
    },
  },
  radii: [0, 2, 4, 6, 8],
} as const;

export type Theme = typeof theme;
export type FontStyle = Theme["fontStyles"][keyof Theme["fontStyles"]];
