;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = new Promise<string>((resolve, reject) => {
    console.log('cb start')
    setTimeout(() => reject('rejected'), 1000)
  })

  const tc1 = p.then((v) => {}).catch((r) => r)
  const tc2 = p.then((v) => {})
  ;(async () => {
    console.log('tc1: then catch -> await chain')
    console.log(`tc1: ${await tc1}`)
  })()
  ;(async () => {
    console.log('tc2: then -> await chain')
    console.log(`tc2: ${await tc2}`)
  })()
})()

// $ node --loader ts-node/esm examples/memo/each_chain_need_catch.ts
// cb start
// tc1: then catch -> await chain
// tc2: then -> await chain
// tc1: rejected
// [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "rejected".] {
//   code: 'ERR_UNHANDLED_REJECTION'
// }
