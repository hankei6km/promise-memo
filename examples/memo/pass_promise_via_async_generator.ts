export {}
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

async function* asyncGenArray(
  p: Promise<string>[]
): AsyncGenerator<[Promise<string>], void, void> {
  try {
    for (let t of p) {
      await wait(100)
      yield [t]
    }
    console.log('async generator(array) done')
  } catch (r) {
    console.log(`async generator(array): ${r}`)
  } finally {
    console.log(`async generator(array): finally`)
  }
}

async function* asyncGenFunc(
  p: Promise<string>[]
): AsyncGenerator<() => Promise<string>, void, void> {
  try {
    for (let t of p) {
      await wait(100)
      yield () => t
    }
    console.log('async generator(func) done')
  } catch (r) {
    console.log(`async generator(func): ${r}`)
  } finally {
    console.log(`async generator(func): finally`)
  }
}

async function* asyncGenCatch(
  p: Promise<string>[]
): AsyncGenerator<() => Promise<string>, void, void> {
  try {
    let err: any
    for (let t of p) {
      const c = t.catch((r) => {
        console.log(`async generatro(catch) loop: ${r}`)
        err = r
        return Promise.reject(r)
      })
      if (err) {
        break
      }
      await wait(100)
      yield () => c
    }
    console.log('async generator(catch) done')
  } catch (r) {
    console.log(`async generator(catch): ${r}`)
  } finally {
    console.log(`async generator(catch): finally`)
  }
}

;(async () => {
  await (async () => {
    console.log('wrap appray')
    try {
      for await (let t of asyncGenArray(promiseArray())) {
        console.log(`${t[0]}`)
        console.log(`awaited ${await t[0]}`)
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('wrap func')
    try {
      for await (let t of asyncGenFunc(promiseArray())) {
        const p = t()
        console.log(`${p}`)
        console.log(`awaited ${await p}`)
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('reject')
    const a = promiseArray()
    a.splice(
      4,
      0,
      new Promise<string>((resolve, reject) => {
        setTimeout(() => reject('rejected'), 1000)
      })
    )
    try {
      for await (let t of asyncGenFunc(a)) {
        const p = t()
        console.log(`${p}`)
        console.log(`awaited ${await p}`)
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('reject catch')
    const a = promiseArray()
    a.splice(
      4,
      0,
      new Promise<string>((resolve, reject) => {
        setTimeout(() => reject('rejected'), 1000)
      })
    )
    try {
      for await (let t of asyncGenCatch(a)) {
        const p = t()
        console.log(`${p}`)
        await p
          .then((v) => {
            console.log(`then ${v}`)
          })
          .catch((r) => {
            console.log(`catch: ${r}`)
          })
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
})()

// $ node --loader ts-node/esm examples/memo/pass_promise_via_async_generator.ts
// wrap appray
// [object Promise]
// awaited done-0
// [object Promise]
// awaited done-1
// [object Promise]
// awaited done-2
// [object Promise]
// awaited done-3
// [object Promise]
// awaited done-4
// async generator(array) done
// async generator(array): finally
// ---
// wrap func
// [object Promise]
// awaited done-0
// [object Promise]
// awaited done-1
// [object Promise]
// awaited done-2
// [object Promise]
// awaited done-3
// [object Promise]
// awaited done-4
// async generator(func) done
// async generator(func): finally
// ---
// reject
// [object Promise]
// awaited done-0
// [object Promise]
// awaited done-1
// [object Promise]
// awaited done-2
// [object Promise]
// awaited done-3
// [object Promise]
// async generator(func): finally
// for await...of: rejected
// ---
// reject catch
// [object Promise]
// then done-0
// [object Promise]
// then done-1
// [object Promise]
// then done-2
// [object Promise]
// then done-3
// [object Promise]
// async generatro(catch) loop: rejected
// catch: rejected
// async generator(catch) done
// async generator(catch): finally
