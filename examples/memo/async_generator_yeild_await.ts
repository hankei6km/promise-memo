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
  // ): AsyncGenerator<string, void, void> {
  // ): AsyncGenerator<Promise<string>, void, void> { これはエラー
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
}

function* syncGen(
  p: Promise<string>[]
): Generator<Promise<string>, void, void> {
  yield p[0]
  yield p[1]
  yield p[2]
  yield p[3]
  yield p[4]
}

;(async () => {
  await (async () => {
    console.log('async generator with for await...of')
    for await (let t of asyncGen(promiseArray())) {
      console.log(`${t}`)
      console.log(`awaited ${await t}`)
    }
  })()

  await (async () => {
    console.log('async generator without for await...of')
    const i = asyncGen(promiseArray())
    const v = i.next()
    console.log(`i.next() = ${v}`)
    let t = await v
    while (!t.done) {
      console.log(`${t.value}`)
      t = await i.next()
    }
  })()

  await (async () => {
    console.log('sync generator')
    for (let t of syncGen(promiseArray())) {
      console.log(`${t}`)
      console.log(`awaited ${await t}`)
    }
  })()

  await (async () => {
    console.log('sync generator with for await...of')
    for await (let t of syncGen(promiseArray())) {
      console.log(`${t}`)
      console.log(`awaited ${await t}`)
    }
  })()
})()

// $ node --loader ts-node/esm examples/memo/async_generator_yeild_await.ts
// async generator with for await...of
// done-0
// awaited don
// awaited done-1
// done-2
// awaited done-2
// done-3
// awaited done-3
// done-4
// awaited done-4
// async generator without for await...of
// i.next() = [object Promise]
// done-0
// done-1
// done-2
// done-3
// done-4
// sync generator
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
// sync generator with for await...of
// done-0
// awaited done-0
// done-1
// awaited done-1
// done-2
// awaited done-2
// done-3
// awaited done-3
// done-4
// awaited done-4
