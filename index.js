const DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const hex2bin = (hex) => {
  return convertBase(hex, 16, 2);
};

function convertBase(str, fromBase, toBase) {
  sign = str[0] == "-" ? -1 : 1;
  const unsigned = sign == 1 ? str : str.substring(1);
  const toDigits = toBase == 58 ? BASE58 : DIGITS;
  const chars = parseToDigitsArray(unsigned, fromBase);

  if (chars === null) return null;

  let outArray = [];
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
  for (i = 0; i < xbin.length; i++) {
    if (xbin[i] > ybin[i]) return x;
    if (xbin[i] < ybin[i]) return y;
  }
};

const min = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  for (i = 0; i < xbin.length; i++) {
    if (xbin[i] > ybin[i]) return y;
    if (xbin[i] < ybin[i]) return x;
  }
};

const sum = (x, y, base) => {
  const [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  let rest = 0;
  let ret = "";
  for (i = xbin.length - 1; i >= 0; i--) {
    const v = parseInt(xbin[i]) + parseInt(ybin[i]) + rest;
    ret = (v % 2) + ret;
    rest = Math.floor(v / 2);
  }
  if (rest) return convertBase(rest + ret, 2, base);
  return convertBase(ret, 2, base);
};

const diff = (x, y, base) => {
  let xbin, ybin;
  if (max(x, y, base) === x) {
    [xbin, ybin] = toFixedLengthBinaryPair(x, y, base);
  } else {
    [xbin, ybin] = toFixedLengthBinaryPair(y, x, base);
  }

  let ret = xbin.split("").map((x) => parseInt(x));
  for (let i = ret.length - 1; i >= 0; i--) {
    let rest = 0;
    for (let j = i; j >= 0; j--) {
      const v = ret[j] - parseInt(ybin[j]) - rest;
      const r = ret[j] - parseInt(ybin[j]) - rest;
      ret[j] = v < 0 ? Math.abs(v % 2) : v;
      rest = r < 0 ? Math.abs(r) : 0;
      console.log({ r: ret[j], x: xbin[j], y: ybin[j], rest, v, j });
      if (rest == 0) break;
    }
    console.log({ i, ret });
  }
  console.log({ xbin, ybin, ret, b: ret.join("") });

  return convertBase(ret.join(""), 2, base);
};

const toFixedLengthBinaryPair = (x, y, base) => {
  const xbin = convertBase(x, base, 2);
  const ybin = convertBase(y, base, 2);
  const len = Math.max(xbin.length, ybin.length);
  return [leadingZeros(xbin, len), leadingZeros(ybin, len)];
};

const leadingZeros = (num, lenght) => {
  return num.toString().padStart(lenght, "0");
};

module.exports = { convertBase, hex2bin, sum, diff, max, min };
