import { validateAlphanumericString } from '.'

describe('validateAlphanumericString', () => {
  it('should pass return false', () => {
    const badData = 'abcd123####'
    expect(validateAlphanumericString(badData)).toBe(false)
  })

  it('should pass return true', () => {
    const goodData = 'abcd efg'
    expect(validateAlphanumericString(goodData)).toBe(true)
  })
})
