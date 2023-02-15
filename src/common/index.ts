export const ToEmptyString = (str: string | undefined) => {
  if (!str || typeof str === undefined) {
    return '-'
  } else {
    return str
  }
}
