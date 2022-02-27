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

  async function* gen(
    p: Promise<string>[]
  ): AsyncGenerator<string, void, void> {
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
    console.log('catch in top of chain')
    const timeout = 200
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), timeout)
    })
    const c = r.catch((r) => {
      console.log(`catch ${r}`)
    })
    p.splice(4, 0, c as any)
    const g = gen(p)
    try {
      for await (let t of g) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`for await...of ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('catch in another chain')
    const timeout = 200
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), timeout)
    })
    r.catch((r) => {
      console.log(`catch ${r}`)
    })
    p.splice(4, 0, r)
    const g = gen(p)
    try {
      for await (let t of g) {
        console.log(`${t}`)
      }
    } catch (r) {
      console.log(`for await...of ${r}`)
    }
  })()
  console.log('---')
})()

// $ node --loader ts-node/esm examples/memo/for_await_of_catch.ts
// catch in top of chain
// done-0
// done-1
// catch rejected
// done-2
// done-3
// undefined
// done-4
// generator done
// ---
// catch in another chain
// done-0
// done-1
// catch rejected
// done-2
// done-3
// generator catch rejected
// generator done
// ---
