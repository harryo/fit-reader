/* eslint-disable no-bitwise */

function getBits(byte, idx, n) {
  const w = n || 1;
  const mask = (1 << w) - 1;
  return (byte >> idx) & mask;
}

export default getBits;
