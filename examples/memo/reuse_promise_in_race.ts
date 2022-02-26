;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = [
    new Promise<string>((resolve) => setTimeout(() => resolve('A'), 4000)),
    new Promise<string>((resolve) => setTimeout(() => resolve('B'), 3000)),
    new Promise<string>((resolve) => setTimeout(() => resolve('C'), 2000)),
    new Promise<string>((resolve) => setTimeout(() => resolve('D'), 1000))
  ]
  console.log(await Promise.race(p))
  await wait(1010)
  console.log(await Promise.race(p))
  await wait(1010)
  console.log(await Promise.race(p))
  await wait(1010)
  console.log(await Promise.race(p))
  await wait(1010)
  console.log(await Promise.race(p))
})()

// $ node --loader ts-node/esm examples/memo/reuse_promise_in_race.ts
// D
// C
// B
// A
// A
