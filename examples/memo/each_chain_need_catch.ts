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
// (node:2186001) UnhandledPromiseRejectionWarning: rejected
// (node:2186001) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
// (node:2186001) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
