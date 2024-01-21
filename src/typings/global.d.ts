import { default as _Decimal } from "./break_infinity";
import playerData from "../core/player-data";
import { DC } from "../core/constants";
import { GameCache as _GameCache } from "../core/cache";
import { GameDatabase } from "../core/secret-formula/game-database";
import {
  calculateRogueEffects as _calculateRogueEffects,
  getRogueEffect as _getRogueEffect,
} from "../core/secret-formula/rogue/items";
import { Currency as _Currency } from "../core/currency";
export {};

declare global {
  interface Window {
    player: typeof playerData;
    GameDatabase: typeof GameDatabase;
  }
  const Decimal = _Decimal;
  const GameCache = _GameCache;
  const Currency = _Currency;
  const Achievement: (x: number) => { isUnlocked: boolean };
  const getRogueEffect = _getRogueEffect;
}
