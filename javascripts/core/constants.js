"use strict";

const PRESTIGE_EVENT = {
  DIMENSION_BOOST: 0,
  ANTIMATTER_GALAXY: 1,
  INFINITY: 2,
  ETERNITY: 3,
  REALITY: 4,
};

const DC = {
  // Naming Scheme:
  // D[0-9]: Decimal mantissa variable
  // _: decimal (.) part of the mantissa
  // E[0-9]: Decimal exponent variable
  // EM[0-9]: indicates Decimal exponent variable is negative
  // C: Calculation. D - .div, P - .pow

  DM1: new Decimal("-1"),
  D0: new Decimal("0"),

  // This block of constants is exclusively used in statistics
  D4_22419EM105: new Decimal("4.22419e-105"),
  EM72: new Decimal("1e-72"),
  EM63: new Decimal("1e-63"),
  EM54: new Decimal("1e-54"),
  D2_82EM45: new Decimal("2.82e-45"),
  EM42: new Decimal("1e-42"),
  D7_23EM30: new Decimal("7.23e-30"),
  D5EM21: new Decimal("5e-21"),
  D9EM17: new Decimal("9e-17"),
  D6_2EM11: new Decimal("6.2e-11"),
  D5EM8: new Decimal("5e-8"),
  D3_555EM6: new Decimal("3.555e-6"),
  D7_5EM4: new Decimal("7.5e-4"),
  D2_5E3: new Decimal("2.5e3"),
  D2_6006E6: new Decimal("2.6006e6"),
  D3_3E8: new Decimal("3.3e8"),
  D5E12: new Decimal("5e12"),
  D4_5E17: new Decimal("4.5e17"),
  D1_08E21: new Decimal("1.08e21"),
  D1_53E24: new Decimal("1.53e24"),
  D1_41E27: new Decimal("1.41e27"),
  D5E32: new Decimal("5e32"),
  D8E36: new Decimal("8e36"),
  D1_7E45: new Decimal("1.7e45"),
  D1_7E48: new Decimal("1.7e48"),
  D3_3E55: new Decimal("3.3e55"),
  D3_3E61: new Decimal("3.3e61"),
  D5E68: new Decimal("5e68"),
  D3_4E80: new Decimal("3.4e80"),

  D1EM2: new Decimal("0.01"),
  D5_5EM1: new Decimal("0.55"),
  D1EM1: new Decimal("0.1"),
  D4EM1: new Decimal("0.4"),
  D0_8446303389034288: new Decimal("0.8446303389034288"),
  D0_95: new Decimal("0.95"),
  D0_965: new Decimal("0.965"),
  D1: new Decimal("1"),
  D1_0000109: new Decimal("1.0000109"),
  D1_0004: new Decimal("1.0004"),
  D1_0025: new Decimal("1.0025"),
  D1_02: new Decimal("1.02"),
  D1_0285: new Decimal("1.0285"),
  D1_2: new Decimal("1.2"),
  D1_3: new Decimal("1.3"),
  D2: new Decimal("2"),
  D4: new Decimal("4"),
  D5: new Decimal("5"),
  D6_66: new Decimal("6.66"),
  D15: new Decimal("15"),
  D16: new Decimal("16"),
  D3E4: new Decimal("30000"),
  D2E5: new Decimal("2e5"),
  D2E6: new Decimal("2e6"),
  D5E7: new Decimal("5e7"),
  D5E9: new Decimal("5e9"),
  D2E25: new Decimal("2e25"),
  D2E22222: new Decimal("2e22222"),
  D9_99999E999: new Decimal("9.99999e999"),
  D9_9999E9999: new Decimal("9.9999e9999"),

  // Calculations for precise numbers.
  C1D1_1245: Decimal.div(1, 1.1245),
  D2P30D0_61: Decimal.pow(2, 30 / 0.61),
  C2P30: Decimal.pow(2, 30),
  C2P1024: Decimal.pow(2, 1024),
  C10P16000D3: Decimal.pow(10, 16000 / 3),

  // 1e1 is 10
  E1: new Decimal("1e1"),
  E2: new Decimal("1e2"),
  E3: new Decimal("1e3"),
  E6: new Decimal("1e6"),
  E8: new Decimal("1e8"),
  E9: new Decimal("1e9"),
  E10: new Decimal("1e10"),
  E12: new Decimal("1e12"),
  E20: new Decimal("1e20"),
  E25: new Decimal("1e25"),
  E29: new Decimal("1e29"),
  E30: new Decimal("1e30"),
  E31: new Decimal("1e31"),
  E40: new Decimal("1e40"),
  E45: new Decimal("1e45"),
  E50: new Decimal("1e50"),
  E58: new Decimal("1e58"),
  E60: new Decimal("1e60"),
  E63: new Decimal("1e63"),
  E70: new Decimal("1e70"),
  E73: new Decimal("1e73"),
  E75: new Decimal("1e75"),
  E80: new Decimal("1e80"),
  E90: new Decimal("1e90"),
  E100: new Decimal("1e100"),
  E113: new Decimal("1e113"),
  E140: new Decimal("1e140"),
  E150: new Decimal("1e150"),
  E160: new Decimal("1e160"),
  E170: new Decimal("1e170"),
  E175: new Decimal("1e175"),
  E200: new Decimal("1e200"),
  E250: new Decimal("1e250"),
  E260: new Decimal("1e260"),
  E280: new Decimal("1e280"),
  E300: new Decimal("1e300"),
  E308: new Decimal("1e308"),
  E309: new Decimal("1e309"),
  E310: new Decimal("1e310"),
  E315: new Decimal("1e315"),
  E320: new Decimal("1e320"),
  E349: new Decimal("1e349"),
  E400: new Decimal("1e400"),
  E450: new Decimal("1e450"),
  E500: new Decimal("1e500"),
  E530: new Decimal("1e530"),
  E550: new Decimal("1e550"),
  E600: new Decimal("1e600"),
  E616: new Decimal("1e616"),
  E650: new Decimal("1e650"),
  E750: new Decimal("1e750"),
  E850: new Decimal("1e850"),
  E900: new Decimal("1e900"),
  E975: new Decimal("1e975"),
  E1000: new Decimal("1e1000"),
  E1100: new Decimal("1e1100"),
  E1200: new Decimal("1e1200"),
  E1300: new Decimal("1e1300"),
  E1750: new Decimal("1e1750"),
  E1800: new Decimal("1e1800"),
  E1900: new Decimal("1e1900"),
  E2000: new Decimal("1e2000"),
  E2350: new Decimal("1e2350"),
  E2400: new Decimal("1e2400"),
  E2500: new Decimal("1e2500"),
  E2650: new Decimal("1e2650"),
  E2750: new Decimal("1e2750"),
  E3000: new Decimal("1e3000"),
  E3350: new Decimal("1e3350"),
  E4000: new Decimal("1e4000"),
  E5000: new Decimal("1e5000"),
  E6000: new Decimal("1e6000"),
  E8000: new Decimal("1e8000"),
  E9000: new Decimal("1e9000"),
  E10000: new Decimal("1e10000"),
  E10500: new Decimal("1e10500"),
  E11111: new Decimal("1e11111"),
  E12000: new Decimal("1e12000"),
  E13000: new Decimal("1e13000"),
  E14000: new Decimal("1e14000"),
  E16500: new Decimal("1e16500"),
  E17500: new Decimal("1e17500"),
  E18000: new Decimal("1e18000"),
  E20000: new Decimal("1e20000"),
  E22500: new Decimal("1e22500"),
  E23000: new Decimal("1e23000"),
  E27000: new Decimal("1e27000"),
  E28000: new Decimal("1e28000"),
  E30000: new Decimal("1e30000"),
  E45000: new Decimal("1e45000"),
  E54000: new Decimal("1e54000"),
  E60000: new Decimal("1e60000"),
  E65000: new Decimal("1e65000"),
  E100000: new Decimal("1e100000"),
  E110000: new Decimal("1e110000"),
  E164000: new Decimal("1e164000"),
  E200000: new Decimal("1e200000"),
  E201600: new Decimal("1e201600"),
  E210000: new Decimal("1e210000"),
  E300000: new Decimal("1e300000"),
  E320000: new Decimal("1e320000"),
  E500000: new Decimal("1e500000"),
  E1E6: new Decimal("1e1000000"),
  E3E6: new Decimal("1e3000000"),
  E6E6: new Decimal("1e6000000"),
  E1E7: new Decimal("1e10000000"),
  E2E7: new Decimal("1e20000000"),
  E4E7: new Decimal("1e40000000"),
  E6E7: new Decimal("1e60000000"),
  E1E8: new Decimal("1e100000000"),
  E1E15: new Decimal("1e1000000000000000"),
};

const AUTOBUYER_MODE = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

const AUTO_CRUNCH_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_CURRENT: 2
};

const AUTO_ETERNITY_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_CURRENT: 2
};

const AUTO_REALITY_MODE = {
  RM: 0,
  GLYPH: 1,
  EITHER: 2,
  BOTH: 3
};

// Free tickspeed multiplier with TS171. Shared here because formatting glyph effects depends on it
const TS171_MULTIPLIER = 1.25;

// Used as drag and drop data type
const GLYPH_MIME_TYPE = "text/x-ivark-glyph";

// These need to be in descending order for searching over them to work trivially
const GlyphRarities = [
  {
    minStrength: 3.5,
    name: "Celestial",
    color: "#5151ec"
  }, {
    minStrength: 3.25,
    name: "Transcendent",
    color: "#03ffec"
  }, {
    minStrength: 3,
    name: "Mythical",
    color: "#d50000"
  }, {
    minStrength: 2.75,
    name: "Legendary",
    color: "#ff9800"
  }, {
    minStrength: 2.5,
    name: "Epic",
    color: "#9c27b0"
  }, {
    minStrength: 2,
    name: "Rare",
    color: "#2196f3"
  }, {
    minStrength: 1.5,
    name: "Uncommon",
    color: "#43a047"
  }, {
    minStrength: 1,
    name: "Common",
    color: "white"
  },
];

const AUTO_SORT_MODE = {
  NONE: 0,
  POWER: 1,
  EFFECT: 2,
  SCORE: 3
};

const AUTO_GLYPH_SCORE = {
  LOWEST_SACRIFICE: 0,
  EFFECT_COUNT: 1,
  RARITY_THRESHOLD: 2,
  SPECIFIED_EFFECT: 3,
  ADVANCED_MODE: 4,
  LOWEST_ALCHEMY: 5,
  ALCHEMY_VALUE: 6
};

const AUTO_GLYPH_REJECT = {
  SACRIFICE: 0,
  REFINE: 1,
  REFINE_TO_CAP: 2,
};

const TIME_STUDY_PATH = {
  NONE: 0,
  ANTIMATTER_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
};

const ALCHEMY_RESOURCE = {
  POWER: 0,
  INFINITY: 1,
  TIME: 2,
  REPLICATION: 3,
  DILATION: 4,
  CARDINALITY: 5,
  ETERNITY: 6,
  DIMENSIONALITY: 7,
  INFLATION: 8,
  ALTERNATION: 9,
  EFFARIG: 10,
  SYNERGISM: 11,
  MOMENTUM: 12,
  DECOHERENCE: 13,
  EXPONENTIAL: 14,
  FORCE: 15,
  UNCOUNTABILITY: 16,
  BOUNDLESS: 17,
  MULTIVERSAL: 18,
  UNPREDICTABILITY: 19,
  REALITY: 20
};
