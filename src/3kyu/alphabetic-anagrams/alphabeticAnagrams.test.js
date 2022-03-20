const listPosition = require('./alphabeticAnagrams');

it('returns 2 when given BA', () => {
  expect(listPosition('BA')).toBe(2)
})

it('returns 1 when given AB', () => {
  expect(listPosition('AB')).toBe(1)
})

it('returns 4 when given BAAA', () => {
  expect(listPosition('BAAA')).toBe(4)
})

it('returns 2 when given ABAB', () => {
  expect(listPosition('ABAB')).toBe(2)
})

it('returns 9 when given BCAA', () => {
  expect(listPosition('BCAA')).toBe(9)
})

it('returns 15 when given BCBAC', () => {
  expect(listPosition('BCBAC')).toBe(15)
})

it('returns 24572 when given QUESTION', () => {
  expect(listPosition('QUESTION')).toBe(24572)
})

it('returns 10743 when given BOOKKEEPER', () => {
  expect(listPosition('BOOKKEEPER')).toBe(10743)
})
