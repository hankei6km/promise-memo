const wait = (to: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), to))

async function* gen(init: number = 0): AsyncGenerator<number, number, void> {
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  return 9999
}

const g = gen()
await Promise.all([
  (async () => {
    console.log(`next 1: wait`)
    console.log(`next 1: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 2: wait`)
    console.log(`next 2: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 3: wait`)
    console.log(`next 3: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 4: wait`)
    console.log(`next 4: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 5: wait`)
    console.log(`next 5: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 6: wait`)
    console.log(`next 6: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 7: wait`)
    console.log(`next 7: ${JSON.stringify(await g.next())}`)
  })(),
  (async () => {
    console.log(`next 8: wait`)
    console.log(`next 8: ${JSON.stringify(await g.next())}`)
  })()
])

console.log('')
const g1 = gen(10)
await Promise.all([
  (async () => {
    for await (const i of g1) {
      console.log(`loop-1 ${i}`)
    }
  })(),
  (async () => {
    for await (const i of g1) {
      console.log(`loop-2 ${i}`)
    }
  })()
])
export {}

// $ node --loader ts-node/esm examples/memo/multiple-next-called-serial.ts
// next 1: wait
// next 2: wait
// next 3: wait
// next 4: wait
// next 5: wait
// next 6: wait
// next 7: wait
// next 8: wait
// next 1: {"value":0,"done":false}
// next 2: {"value":1,"done":false}
// next 3: {"value":2,"done":false}
// next 4: {"value":3,"done":false}
// next 5: {"value":9999,"done":true}
// next 6: {"done":true}
// next 7: {"done":true}
// next 8: {"done":true}
// 
// loop-1 10
// loop-2 11
// loop-1 12
// loop-2 13