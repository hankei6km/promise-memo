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
// (node:1774651) UnhandledPromiseRejectionWarning: rejected
// (node:1774651) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
// (node:1774651) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
