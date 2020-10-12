export default function clone (x) {
  return x === undefined ? undefined : JSON.parse(JSON.stringify(x))
}
