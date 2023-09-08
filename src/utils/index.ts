export const validateAlphanumericString = (string: string) => {
  if (string.length === 0) return true
  /**
   * FIXME: Assigning this to a variable causes it to alternate between error and ok
   * eg:
   *  const PATTERN = /^[a-zA-Z0-9 ]+$/g
   *  PATTERN.test(v)
   * */
  return /^[a-zA-Z0-9 ]+$/g.test(string)
}
