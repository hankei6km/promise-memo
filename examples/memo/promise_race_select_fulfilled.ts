;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = [
    new Promise<string>((resolve) =>
      setTimeout(() => resolve('resolved'), 1000)
    ),
    Promise.reject('rejected').catch((r) => r)
  ]
  console.log(await Promise.race(p))
  await wait(1010)
  console.log(await Promise.race(p))
})()

// $ node --loader ts-node/esm examples/memo/promise_race_select_fulfilled.ts
// rejected
// resolved
