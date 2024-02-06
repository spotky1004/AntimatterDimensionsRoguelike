import { default as _Decimal } from "./break_infinity";
import playerData from "../core/player-data";
import { DC } from "../core/constants";
import { GameCache as _GameCache } from "../core/cache";
import { GameDatabase } from "../core/secret-formula/game-database";
import {
  calculateRogueEffects as _calculateRogueEffects,
  getRogueEffect as _getRogueEffect,
} from "../core/rogue/items";
import { Currency as _Currency } from "../core/currency";
export {};
import { GAME_EVENT as _GAME_EVENT } from "../core/event-hub";
import { BOSS_ENUM as _BOSS_ENUM, BossDatas as _BossDatas, BOSS_NAMES as _BOSS_NAMES } from "../core/rogue/boss";

declare global {
  interface Window {
    player: typeof playerData;
    GameDatabase: typeof GameDatabase;
  }
  const Decimal = _Decimal;
  const GameCache = _GameCache;
  const Currency = _Currency;
  const Achievement: (x: number) => { isUnlocked: boolean };
  const calculateRogueEffects = _calculateRogueEffects;
  const getRogueEffect = _getRogueEffect;
  const GAME_EVENT = _GAME_EVENT;

  const BOSS_ENUM = _BOSS_ENUM;
  const BOSS_NAMES = _BOSS_NAMES;
  const BossDatas = _BossDatas;
}
