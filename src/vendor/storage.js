const storage = window.localStorage

function canBeFormatted (string) {
  return string === 'true'
    || string === 'false'
    || string === 'null'
    || (string.length && !isNaN(string))
}

export function save (key, value) {
  if (Array.isArray(key)) {
    key.forEach(data => save(data.key, data.value))
    return key
  }

  storage.setItem(key, value)
  return read(key)
}

export function read (key, defaultValue) {
  if (Array.isArray(key)) {
    return key.map(k => read(k))
  }
  if (!storage.hasOwnProperty(key)) { // eslint-disable-line
    return defaultValue
  }

  let r = storage.getItem(key)
  if (canBeFormatted(r)) {
    return JSON.parse(storage.getItem(key))
  }
  return r
}

export default { read, save }
