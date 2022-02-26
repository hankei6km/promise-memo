;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = new Promise<string>((resolve) => {
    console.log('cb start')
    setTimeout(() => resolve('done'), 1000)
  })
  console.log('step0')
  await wait(2000)
  console.log('step1')
  await p.then((v) => console.log(v))
  console.log('step2')
})()

// $ node --loader ts-node/esm examples/memo/cb_call_immediately.ts
//
// cb start
// step0
// step1
// done
// step2
