//@ts-check
const DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const hex2bin = (hex) => {
  return convertBase(hex, 16, 2);
};

/**
 *
 * @param {string} str
 * @param {number} fromBase
 * @param {number} toBase
 * @returns {string}
 */
function convertBase(str, fromBase, toBase) {
  const sign = str[0] == "-" ? -1 : 1;
  const unsigned = sign == 1 ? str : str.substring(1);
  const toDigits = toBase == 58 ? BASE58 : DIGITS;
  const chars = parseToDigitsArray(unsigned, fromBase);

  if (chars === null) return "";

  let outArray = [];
  /**  @type {number[] | null} */
  let power = [1];
  for (let i = 0; i < chars.length; i++) {
    chars[i] &&
      (outArray = _add(
        outArray,
        _multiplyByNumber(chars[i], power, toBase),
        toBase
      ));
    power = _multiplyByNumber(fromBase, power, toBase);
  }

  let out = "";
  for (let i = outArray.length - 1; i >= 0; i--) out += toDigits[outArray[i]];

  return sign == 1 ? out : "-" + out;
}

const _add = (x, y, base) => {
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

/**
 *
 * @param {*} num
 * @param {*} x
 * @param {*} base
 * @returns Array | null
 */
const _multiplyByNumber = (num, x, base) => {
  if (num < 0) return null;
  if (num == 0) return [];

  let result = [];
  let power = x;
  while (true) {
    num & 1 && (result = _add(result, power, base));
    num = num >> 1;
    if (num === 0) break;
    power = _add(power, power, base);
  }

  return result;
};

/**
 *
 * @param {string} str
 * @param {number} base
 * @returns {number[] | null}
 */
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

const max = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  for (let i = 0; i < xbin.length; i++) {
    if (xbin[i] > ybin[i]) return x;
    if (xbin[i] < ybin[i]) return y;
  }
  return null;
};

const min = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  for (let i = 0; i < xbin.length; i++) {
    if (xbin[i] > ybin[i]) return y;
    if (xbin[i] < ybin[i]) return x;
  }
  return null;
};

const sum2 = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  let rest = 0;
  let ret = "";
  for (let i = xbin.length - 1; i >= 0; i--) {
    const v = parseInt(xbin[i]) + parseInt(ybin[i]) + rest;
    ret = (v % 2) + ret;
    rest = Math.floor(v / 2);
  }
  if (rest) return convertBase(rest + ret, 2, base);
  return convertBase(ret, 2, base);
};

/**
 *
 * @param {string} x
 * @param {string} y
 * @param {number} base
 * @returns {string}
 */
const sum = (x, y, base) => {
  const xbin = convertBase(x, base, 2)
    .split("")
    .map((x) => parseInt(x));
  const ybin = convertBase(y, base, 2)
    .split("")
    .map((x) => parseInt(x));
  const ret = sumBinaryArray(xbin, ybin);
  return convertBase(ret.join(""), 2, base);
};

/**
 *
 * @param {number[]} x
 * @param {number[]} y
 * @returns {number[]}
 */
const sumBinaryArray = (x, y) => {
  const len = Math.max(x.length, y.length) + 1;
  const xfixed = leadingZerosArray(x, len);
  const yfixed = leadingZerosArray(y, len);

  let rest = 0;
  let ret = [...xfixed];
  for (let i = len - 1; i >= 0; i--) {
    const v = ret[i] + yfixed[i] + rest;
    ret[i] = v % 2;
    rest = v > 1 ? 1 : 0;
  }
  return ret;
};

/**
 *
 * @param {string} x
 * @param {string} y
 * @param {number} base
 * @returns {string}
 */
const diff = (x, y, base) => {
  let xbin, ybin;
  let sign = "";
  switch (max(x, y, base)) {
    case x:
      [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
      break;
    case y:
      [xbin, ybin] = toFixedLengthBinaryPair(y, x, base);
      sign = "-";
      break;
    default:
      return "0";
  }

  let ret = xbin.split("").map((x) => parseInt(x));
  for (let i = ret.length - 1; i >= 0; i--) {
    const v = ret[i] - parseInt(ybin[i]);
    ret[i] = v == 0 ? 0 : 1;
    if (v < 0) {
      for (let j = i - 1; j >= 0; j--) {
        ret[j] = ret[j] == 0 ? 1 : 0;
        if (ret[j] == 0) break;
      }
    }
  }

  return sign + convertBase(ret.join(""), 2, base);
};

const multiply = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  const sumMatrix = Array(ybin.length)
    .fill(null)
    .map((x) => {
      return Array(xbin.length + ybin.length).fill(0);
    });

  for (let i = 0; i < ybin.length; i++) {
    for (let j = 0; j < xbin.length; j++) {
      sumMatrix[i][ybin.length + xbin.length - j - i - 1] =
        //ybin.length - i + "." + (xbin.length - j);
        parseInt(ybin[ybin.length - i - 1]) *
        parseInt(xbin[xbin.length - j - 1]);
    }
  }
  const ret = sumMatrix.reduce((a, c) => {
    return sumBinaryArray(a, c);
  }, []);
  return convertBase(ret.join(""), 2, base);
};

const toFixedLengthBinaryPair = (x, y, base) => {
  const xbin = convertBase(x, base, 2);
  const ybin = convertBase(y, base, 2);
  const len = Math.max(xbin.length, ybin.length);
  return [leadingZeros(xbin, len), leadingZeros(ybin, len)];
};

const leadingZeros = (num, length) => {
  return num.toString().padStart(length, "0");
};
/**
 *
 * @param {Array} arr
 * @param {number} length
 * @returns {Array}
 */
const leadingZerosArray = (arr, length) => {
  return Array(length - arr.length)
    .fill(0)
    .concat(arr);
};

module.exports = {
  convertBase,
  hex2bin,
  sum,
  diff,
  max,
  min,
  multiply,
  sumBinaryArray,
};
