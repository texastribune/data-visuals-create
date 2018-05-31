export default function sumValues(arr, key) {
  return arr.reduce((acc, obj) => acc + obj[key], 0);
}
