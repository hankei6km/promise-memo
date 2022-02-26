;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = new Promise<string>((resolve, reject) => {
    console.log('cb start')
    setTimeout(() => reject('rejected'), 1000)
  })

  console.log('before settled')
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
})()

// $ node --loader ts-node/esm examples/memo/catch_multiple.ts
// cb start
// before settled
// catch-1: rejected
// await-1: rejected
// catch-2: rejected
// await-2: rejected
// after settled
// catch-1: rejected
// await-1: rejected
// catch-2: rejected
// await-2: rejected
