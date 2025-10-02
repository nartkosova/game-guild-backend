function pick(obj, keys) {
  const out = {}
  keys.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) out[k] = obj[k]
  })
  return out
}

module.exports = pick

