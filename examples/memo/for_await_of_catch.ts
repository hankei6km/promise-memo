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
    console.log('catch in top of chain')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 200)
    })
    const c = r.catch((r) => {
      console.log(`catch ${r}`)
    })
    p.splice(4, 0, c as any)
    try {
      for await (let t of p) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`for await...of ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('catch in another chain')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 200)
    })
    r.catch((r) => {
      console.log(`catch ${r}`)
    })
    p.splice(4, 0, r)
    try {
      for await (let t of p) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`for await...of ${r}`)
    }
  })()
  console.log('---')
})()

// $ node --loader ts-node/esm examples/memo/async_generator_catch.ts
// catch in top of chain
// done-0
// done-1
// catch rejected
// done-2
// done-3
// undefined
// done-4
// ---
// catch in another chain
// done-0
// done-1
// catch rejected
// done-2
// done-3
// for await...of rejected
