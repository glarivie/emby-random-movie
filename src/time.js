exports.ticksToMinutes = ticks => ticks * (1 / 10000000) / 60

exports.humanize = time => {
  const hours = Math.floor(time / 60)
  const minutes = Math.floor(time % 60)

  return `${hours}h${minutes}`
}
