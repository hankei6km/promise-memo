;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const promiseArray: () => Promise<string>[] = () =>
    new Array(5).fill('').map(
      (_v, i) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`done-${i}`)
          }, 100 * (i + 1))
        })
    )

  async function* gen(timeout: number): AsyncGenerator<string, void, void> {
    const p = promiseArray()
    p.splice(
      4,
      0,
      new Promise<string>((resolve, reject) => {
        setTimeout(() => reject('rejected'), timeout)
      })
    )
    try {
      for await (let t of p) {
        yield t
      }
    } catch (r) {
      console.log(`generator catch ${r}`)
    } finally {
      console.log('generator done')
    }
  }

  await (async () => {
    console.log('timeout = 1000')
    try {
      for await (let t of gen(1000)) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`catch ${r}`)
    }
  })()

  await (async () => {
    console.log('timeout = 200')
    try {
      for await (let t of gen(200)) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`catch ${r}`)
    }
  })()
})()

// $ node --loader ts-node/esm examples/memo/need_chain_catch_reject.ts
// timeout = 1000
// done-0
// done-1
// done-2
// done-3
// generator catch rejected
// generator done
// timeout = 200
// done-0
// done-1
// [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "rejected".] {
//   code: 'ERR_UNHANDLED_REJECTION'
// }
