export function getProgressEmoji(progress) {
  const value = Number(progress)

  if (!Number.isFinite(value)) {
    return '😐'
  }

  if (value >= 100) {
    return '🏆'
  }

  if (value > 80) {
    return '😎'
  }

  if (value >= 60) {
    return '🙂'
  }

  if (value >= 30) {
    return '😐'
  }

  return '😠'
}
