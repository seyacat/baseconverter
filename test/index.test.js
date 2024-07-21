const { convertBase, hex2bin } = require("../index");
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
  const result = hex2bin(testString, 10, 2);
  const expected = "100100011010001010110011110001001101010111100110111101111";
  assert.strictEqual(result, expected);

  const result2 = convertBase(result, 2, 16);
  const expected2 = "123456789abcdef";
  assert.strictEqual(result2, expected2);
});
