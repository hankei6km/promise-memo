const wait = (to: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), to))

async function* gen(init: number = 0) {
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
  await wait(100)
  yield Promise.resolve(init++)
}

const g = gen()
await Promise.all([
  (async () => {
    console.log(`next 1: wait`)
    console.log(`next 1: ${(await g.next()).value}`)
  })(),
  (async () => {
    console.log(`next 2: wait`)
    console.log(`next 2: ${(await g.next()).value}`)
  })(),
  (async () => {
    console.log(`next 3: wait`)
    console.log(`next 3: ${(await g.next()).value}`)
  })(),
  (async () => {
    console.log(`next 4: wait`)
    console.log(`next 4: ${(await g.next()).value}`)
  })()
])

console.log('')
const g1 = gen(10)
const g2 = gen(20)
await Promise.all([
  (async () => {
    console.log(`next g1-1: wait`)
    console.log(`next g1-1: ${(await g1.next()).value}`)
  })(),
  (async () => {
    console.log(`next g2-1: wait`)
    console.log(`next g2-1: ${(await g2.next()).value}`)
  })(),
  (async () => {
    console.log(`next g1-2: wait`)
    console.log(`next g1-2: ${(await g1.next()).value}`)
  })(),
  (async () => {
    console.log(`next g2-2: wait`)
    console.log(`next g2-2: ${(await g2.next()).value}`)
  })(),
  (async () => {
    console.log(`next g1-3: wait`)
    console.log(`next g1-3: ${(await g1.next()).value}`)
  })(),
  (async () => {
    console.log(`next g2-3: wait`)
    console.log(`next g2-3: ${(await g2.next()).value}`)
  })(),
  (async () => {
    console.log(`next g1-4: wait`)
    console.log(`next g1-4: ${(await g1.next()).value}`)
  })(),
  (async () => {
    console.log(`next g2-4: wait`)
    console.log(`next g2-4: ${(await g2.next()).value}`)
  })()
])
export {}

// $ node --loader ts-node/esm examples/memo/multiple-next-called-serial.ts
// next 1: wait
// next 2: wait
// next 3: wait
// next 4: wait
// next 1: 0
// next 2: 1
// next 3: 2
// next 4: 3
//
// next g1-1: wait
// next g2-1: wait
// next g1-2: wait
// next g2-2: wait
// next g1-3: wait
// next g2-3: wait
// next g1-4: wait
// next g2-4: wait
// next g1-1: 10
// next g2-1: 20
// next g1-2: 11
// next g2-2: 21
// next g1-3: 12
// next g2-3: 22
// next g1-4: 13
// next g2-4: 23
