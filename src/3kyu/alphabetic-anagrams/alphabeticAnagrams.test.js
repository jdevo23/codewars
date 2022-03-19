import { calculatePermutationSortOrder } from './calculatePermutationSortOrder'

it('returns 2 when given BA', () => {
  expect(calculatePermutationSortOrder('BA')).toBe(2)
})

it('returns 1 when given AB', () => {
  expect(calculatePermutationSortOrder('AB')).toBe(1)
})

it('returns 4 when given BAAA', () => {
  expect(calculatePermutationSortOrder('BAAA')).toBe(4)
})

it('returns 2 when given ABAB', () => {
  expect(calculatePermutationSortOrder('ABAB')).toBe(2)
})

it('returns 9 when given BCAA', () => {
  expect(calculatePermutationSortOrder('BCAA')).toBe(9)
})

it('returns 15 when given BCBAC', () => {
  expect(calculatePermutationSortOrder('BCBAC')).toBe(15)
})

it('returns 24572 when given QUESTION', () => {
  expect(calculatePermutationSortOrder('QUESTION')).toBe(24572)
})

it('returns 10743 when given BOOKKEEPER', () => {
  expect(calculatePermutationSortOrder('BOOKKEEPER')).toBe(10743)
})
