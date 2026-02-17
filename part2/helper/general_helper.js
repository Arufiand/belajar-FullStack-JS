function joinUrl(base = '', path = '') {
  if (!base) throw new Error('MONGOURL is required')
  const b = base.replace(/\/+$/, '')
  const p = path.replace(/^\/+/, '')
  return `${b}/${p}`
}

module.exports = { joinUrl }
