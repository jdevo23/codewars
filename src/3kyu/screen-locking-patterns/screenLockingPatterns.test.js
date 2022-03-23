const countPatternsFrom = require("./screenLockingPatterns");

it("returns 0 when given A", () => {
  expect(countPatternsFrom("A", 0)).toBe(0);
});

it("returns 0 when given A", () => {
  expect(countPatternsFrom("A", 10)).toBe(0);
});

it("returns 1 when given B", () => {
  expect(countPatternsFrom("B", 1)).toBe(1);
});

it("returns 5 when given C", () => {
  expect(countPatternsFrom("C", 2)).toBe(5);
});

it("returns 37 when given D", () => {
  expect(countPatternsFrom("D", 3)).toBe(37);
});

it("returns 256 when given E", () => {
  expect(countPatternsFrom("E", 4)).toBe(256);
});

it("returns 23280 when given E", () => {
  expect(countPatternsFrom("E", 8)).toBe(23280);
});

