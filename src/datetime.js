const OFFSET = Date.UTC(89, 11, 31, 0, 0, 0) / 1000;

export function int2date(n) {
  return new Date(1000 * (n + OFFSET));
}

export function int2iso(n) {
  const date = new Date(1000 * (n + OFFSET));
  return date.toISOString().replace(/\.000Z$/, 'Z');
}

export function date2int(date) {
  return Math.floor(date.getTime() / 1000) - OFFSET;
}

export function fromOffset(timeOffset, lastTimestamp) {
  let timestamp = (lastTimestamp & 0xffffffe0) + timeOffset; // eslint-disable-line no-bitwise
  if (timestamp < lastTimestamp) {
    timestamp += 0x20;
  }
  return { value: timestamp, type: 'date_time' };
}
