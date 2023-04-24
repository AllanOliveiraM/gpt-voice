export const safeGetWindow = () => {
  try {
    if (typeof window !== 'undefined') {
      return window
    }

    return null
  } catch {
    return null
  }
}
