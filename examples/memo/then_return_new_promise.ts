;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  const p = new Promise<string>((resolve) => {
    setTimeout(() => resolve('done'), 1000)
  })

  const t1 = p.then((v) => v)
  const t2 = p.then((v) => v)
  console.log(`t1 === t2 : ${t1 === t2}`)
  console.log(`t1: ${await t1}`)
  console.log(`t2: ${await t2}`)
})()

// $ node --loader ts-node/esm examples/memo/then_return_new_promise.ts
// t1 === t2 : false
// t1: done
// t2: done
