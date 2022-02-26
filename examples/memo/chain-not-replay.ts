const p = new Promise((resolve) => setTimeout(() => resolve('p')))
const t1 = p.then((v) => {
  console.log('t1')
  return `${v}-t1`
})
const t2 = t1.then((v) => {
  console.log('t2')
  return `${v}-t2`
})
const t3 = t2.then((v) => {
  console.log('t3')
  return `${v}-t3`
})

console.log(await t3)
console.log(await t3)
const t4 = t3.then((v) => {
  console.log('t4')
  return `${v}-t4`
})
console.log(await t4)
console.log(await t2)
export {}

// $ node --loader ts-node/esm examples/memo/chain-not-replay.ts
// t1
// t2
// t3
// p-t1-t2-t3
// p-t1-t2-t3
// t4
// p-t1-t2-t3-t4
// p-t1-t2
