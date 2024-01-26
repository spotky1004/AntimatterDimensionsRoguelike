const MAXN = 2n ** 32n;

export const MAX = Number(MAXN);
/**
 * @param {number | bigint} n
 */
export default function xorshift32(n) {
  let x = BigInt(n) % MAXN;
  x ^= (x << 13n) % MAXN;
  x ^= x >> 17n;
  x ^= (x << 5n) % MAXN;
  return Number(x);
}
