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

  await (async () => {
    console.log('timeout = 1000')
    const p = promiseArray()
    p.splice(
      4,
      0,
      new Promise<string>((resolve, reject) => {
        setTimeout(() => reject('rejected'), 1000)
      })
    )
    try {
      for await (let t of p) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`catch ${r}`)
    }
  })()

  await (async () => {
    console.log('timeout = 200')
    const p = promiseArray()
    p.splice(
      4,
      0,
      new Promise<string>((resolve, reject) => {
        setTimeout(() => reject('rejected'), 200)
      })
    )
    try {
      for await (let t of p) {
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
// catch rejected
// timeout = 200
// done-0
// done-1
// (node:2165115) UnhandledPromiseRejectionWarning: rejected
// (node:2165115) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
// (node:2165115) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
// done-2
// done-3
// catch rejected
// (node:2165115) PromiseRejectionHandledWarning: Promise rejection was handled asynchronously (rejection id: 1)
