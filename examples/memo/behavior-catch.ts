const p = new Promise((resolve, reject) =>
  setTimeout(() => reject('rejected'), 100)
)

console.log('=== return undefined')
try {
  const v = p.catch((r) => {
    console.log(`catch inner ${r}`)
  })
  console.log(`resolved ${await v}`)
} catch (r) {
  console.log(`catch outer ${r}`)
}
console.log('')

console.log('=== return reject')
try {
  const v = p.catch((r) => {
    console.log(`catch inner ${r}`)
    return Promise.reject(r)
  })
  console.log(`resolved ${await v}`)
} catch (r) {
  console.log(`catch outer ${r}`)
}
console.log('')

console.log('=== return undefined(bare)')
const v1 = p.catch((r) => {
  console.log(`catch inner ${r}`)
})
console.log(`resolved ${await v1}`)
console.log('')

console.log('=== return reject(bare)')
const v2 = p.catch((r) => {
  console.log(`catch inner ${r}`)
  return Promise.reject(r)
})
console.log(`resolved ${await v2}`)
console.log('')

export {}

// $ node --loader ts-node/esm examples/memo/behavior-catch.ts
// === return undefined
// catch inner rejected
// resolved undefined
//
// === return reject
// catch inner rejected
// catch outer rejected
//
// === return undefined(bare)
// catch inner rejected
// resolved undefined
//
// === return reject(bare)
// catch inner rejected
// 'rejected'
// $ echo "$?"
// 1
