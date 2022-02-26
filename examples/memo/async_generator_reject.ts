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

async function* asyncGen(
  p: Promise<string>[]
): AsyncGenerator<Awaited<string>, void, void> {
  try {
    await wait(100)
    yield p[0]
    await wait(100)
    yield p[1]
    await wait(100)
    yield p[2]
    await wait(100)
    yield p[3]
    await wait(100)
    yield p[4]
    await wait(100)
    yield p[5]
    await wait(100)
    console.log('async generator done')
  } finally {
    console.log(`async generator: finally`)
  }
}

async function* asyncGenCatch(
  p: Promise<string>[]
): AsyncGenerator<Awaited<string>, void, void> {
  try {
    await wait(100)
    yield p[0]
    await wait(100)
    yield p[1]
    await wait(100)
    yield p[2]
    await wait(100)
    yield p[3]
    await wait(100)
    yield p[4]
    await wait(100)
    yield p[5]
    await wait(100)
    console.log('async generator done')
  } catch (r) {
    console.log(`async generator: ${r}`)
  } finally {
    console.log(`async generator: finally`)
  }
}

function* syncGen(
  p: Promise<string>[]
): Generator<Promise<string>, void, void> {
  try {
    yield p[0]
    yield p[1]
    yield p[2]
    yield p[3]
    yield p[4]
    yield p[5]
    console.log('sync generator done')
  } catch (r) {
    console.log(`sync generator: ${r}`)
  } finally {
    console.log(`sync generator: finally`)
  }
}

;(async () => {
  await (async () => {
    console.log('async generator')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 1000)
    })
    r.catch((r) => console.log(`catch ${r}`))
    p.splice(4, 0, r)
    try {
      for await (let t of asyncGen(p)) {
        try {
          console.log(`${t}`)
        } catch (r) {
          console.log(`loop: ${r}`)
          throw r
        }
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('async generator without for await...of')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 1000)
    })
    r.catch((r) => console.log(`catch ${r}`))
    p.splice(4, 0, r)
    try {
      const i = asyncGen(p)
      let t = await i.next()
      while (!t.done) {
        try {
          console.log(`${t.value}`)
          t = await i.next()
        } catch (r) {
          console.log(`loop: ${r}`)
          throw r
        }
      }
    } catch (r) {
      console.log(`while: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('async generator with catch in generator')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 1000)
    })
    r.catch((r) => console.log(`catch ${r}`))
    p.splice(4, 0, r)
    try {
      for await (let t of asyncGenCatch(p)) {
        try {
          console.log(`${t}`)
        } catch (r) {
          console.log(`loop: ${r}`)
          throw r
        }
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('sync generator with for await...of')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 1000)
    })
    r.catch((r) => console.log(`catch ${r}`))
    p.splice(4, 0, r)
    try {
      for await (let t of syncGen(p)) {
        try {
          console.log(`${t}`)
        } catch (r) {
          console.log(`loop: ${r}`)
          throw r
        }
      }
    } catch (r) {
      console.log(`for await...of: ${r}`)
    }
  })()
  console.log('---')

  await (async () => {
    console.log('sync generator with for...of')
    const p = promiseArray()
    const r = new Promise<string>((resolve, reject) => {
      setTimeout(() => reject('rejected'), 1000)
    })
    r.catch((r) => console.log(`catch ${r}`))
    p.splice(4, 0, r)
    try {
      for (let t of syncGen(p)) {
        try {
          console.log(`awaited ${await t}`)
        } catch (r) {
          console.log(`loop: ${r}`)
          throw r
        }
      }
    } catch (r) {
      console.log(`for...of: ${r}`)
    }
  })()
})()

// $ node --loader ts-node/esm examples/memo/async_generator_reject.ts
// async generator
// done-0
// done-1
// done-2
// done-3
// catch rejected
// async generator: finally
// for await...of: rejected
// ---
// async generator without for await...of
// done-0
// done-1
// done-2
// done-3
// catch rejected
// async generator: finally
// loop: rejected
// while: rejected
// ---
// async generator with catch in generator
// done-0
// done-1
// done-2
// done-3
// catch rejected
// async generator: rejected
// async generator: finally
// ---
// sync generator with for await...of
// done-0
// done-1
// done-2
// done-3
// catch rejected
// for await...of: rejected
// ---
// sync generator with for...of
// awaited done-0
// awaited done-1
// awaited done-2
// awaited done-3
// catch rejected
// loop: rejected
// sync generator: finally
// for...of: rejected
