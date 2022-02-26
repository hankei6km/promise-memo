;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const popRace = async (p: Promise<string>[]) => {
    let a = [...p]
    while (a.length > 0) {
      const pa = a.map(
        (t, i) =>
          new Promise<[string, number]>((resolve) =>
            t.then((v) => resolve([v, i]))
          )
      )
      const v = await Promise.race(pa)
      console.log(v[0])
      a.splice(v[1], 1)
    }
  }
  popRace([
    new Promise<string>((resolve) => setTimeout(() => resolve('A'), 300)),
    new Promise<string>((resolve) => setTimeout(() => resolve('B'), 200)),
    new Promise<string>((resolve) => setTimeout(() => resolve('C'), 400)),
    new Promise<string>((resolve) => setTimeout(() => resolve('D'), 100))
  ])
})()

// $ node --loader ts-node/esm examples/memo/reuse_promise_in_race.ts
// D
// B
// A
// C
