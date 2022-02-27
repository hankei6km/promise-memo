;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = new Promise<string>((resolve, reject) => {
    console.log('cb start')
    setTimeout(() => reject('rejected'), 1000)
  })

  console.log('before sttled')
  ;(async () => {
    p.catch((v) => console.log(`catch-1: ${v}`))
  })()
  ;(async () => {
    try {
      await p
    } catch (r) {
      console.log(`await-1: ${r}`)
    }
  })()
  ;(async () => {
    p.catch((v) => console.log(`catch-2: ${v}`))
  })()
  ;(async () => {
    try {
      await p
    } catch (r) {
      console.log(`await-2: ${r}`)
    }
  })()

  await p.catch((r) => r)

  console.log('after settled')
  // console.log('then only')
  // p.then((v) => v)
  console.log('await only')
  await p
})()

// $ node --loader ts-node/esm examples/memo/each_await_need_catch.ts
// cb start
// before sttled
// catch-1: rejected
// await-1: rejected
// catch-2: rejected
// await-2: rejected
// after settled
// await only
// [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "rejected".] {
//   code: 'ERR_UNHANDLED_REJECTION'
// }
