const DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const hex2bin = (hex) => {
  return convertBase(hex, 16, 2);
};

function convertBase(str, fromBase, toBase) {
  const toDigits = toBase == 58 ? BASE58 : DIGITS;
  const chars = parseToDigitsArray(str, fromBase);

  if (chars === null) return null;

  let outArray = [];
  let power = [1];
  for (let i = 0; i < chars.length; i++) {
    chars[i] &&
      (outArray = add(
        outArray,
        multiplyByNumber(chars[i], power, toBase),
        toBase
      ));
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = "";
  for (let i = outArray.length - 1; i >= 0; i--) out += toDigits[outArray[i]];

  return out;
}

const add = (x, y, base) => {
  let z = [];
  const n = Math.max(x.length, y.length);
  let carry = 0;
  let i = 0;
  while (i < n || carry) {
    const xi = i < x.length ? x[i] : 0;
    const yi = i < y.length ? y[i] : 0;
    const zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
};

const multiplyByNumber = (num, x, base) => {
  if (num < 0) return null;
  if (num == 0) return [];

  let result = [];
  let power = x;
  while (true) {
    num & 1 && (result = add(result, power, base));
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
};

const parseToDigitsArray = (str, base) => {
  const digits = base == 58 ? BASE58 : DIGITS;
  const chars = str.split("");
  let arr = [];
  for (let i = chars.length - 1; i >= 0; i--) {
    const n = digits.indexOf(chars[i]);
    if (n == -1) return null;
    arr.push(n);
  }
  return arr;
};

module.exports = { convertBase, hex2bin };
