const {
  convertBase,
  hex2bin,
  sum,
  diff,
  max,
  min,
  multiply,
  sumBinaryArray,
} = require("../index");
const assert = require("assert");

it("Baseconverter Basic", function () {
  const testString = "123456789";
  const result = convertBase(testString, 10, 2);
  const expected = "111010110111100110100010101";
  assert.strictEqual(result, expected);

  const result2 = convertBase(result, 2, 10);
  const expected2 = testString;
  assert.strictEqual(result2, expected2);
});

it("hex2bin Basic", function () {
  const testString = "000123456789abcdef";
  const result = hex2bin(testString);
  const expected = "100100011010001010110011110001001101010111100110111101111";
  assert.strictEqual(result, expected);

  const result2 = convertBase(result, 2, 16);
  const expected2 = "123456789abcdef";
  assert.strictEqual(result2, expected2);

  assert.strictEqual(sum("300", "50", 10), "350");
  assert.strictEqual(sum("1111", "1111", 2), "11110");
  assert.strictEqual(sum("ff", "ff", 16), "1fe");
  assert.strictEqual(sum("100101100", "110010", 2), "101011110");

  assert.strictEqual(
    JSON.stringify(
      sumBinaryArray([1, 0, 0, 1, 0, 1, 1, 0, 0], [1, 1, 0, 0, 1, 0])
    ),
    "[0,1,0,1,0,1,1,1,1,0]"
  );

  assert.strictEqual(
    JSON.stringify(sumBinaryArray([1, 1, 1, 1], [1, 1, 1, 1])),
    "[1,1,1,1,0]"
  );

  assert.strictEqual(max("300", "50", 10), "300");
  assert.strictEqual(min("300", "50", 16), "50");

  assert.strictEqual(diff("100101100", "000110010", 2), "11111010");
  assert.strictEqual(diff("300", "50", 10), "250");
  assert.strictEqual(diff("50", "300", 10), "-250");
  assert.strictEqual(diff("45", "45", 8), "0");

  assert.strictEqual(multiply("111", "11", 2), "10101");
  assert.strictEqual(multiply("100000", "10", 2), "1000000");
  assert.strictEqual(multiply("32", "2", 10), "64");
});
