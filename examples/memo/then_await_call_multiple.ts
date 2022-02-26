;(async () => {
  const wait = (to: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), to))

  let r: (value: string) => void = (v) => {
    console.log('called before settled')
  }
  const p = new Promise<string>((resolve) => {
    console.log('cb start')
    setTimeout(() => {
      resolve('done')
      r = resolve
    }, 1000)
  })

  ;(async () => {
    p.then((v) => console.log(`then-1: ${v}`))
  })()
  ;(async () => {
    console.log(`await-1: ${await p}`)
  })()
  ;(async () => {
    p.then((v) => console.log(`then-2: ${v}`))
  })()
  ;(async () => {
    console.log(`await-2: ${await p}`)
  })()

  await p
  console.log('another resolve()')
  r('done-2')
  ;(async () => {
    p.then((v) => console.log(`then-1: ${v}`))
  })()
  ;(async () => {
    console.log(`await-1: ${await p}`)
  })()
  ;(async () => {
    p.then((v) => console.log(`then-2: ${v}`))
  })()
  ;(async () => {
    console.log(`await-2: ${await p}`)
  })()
})()

// $ node --loader ts-node/esm examples/memo/then_await_call_multiple.ts
// cb start
// then-1: done
// await-1: done
// then-2: done
// await-2: done
// another resolve()
// then-1: done
// await-1: done
// then-2: done
// await-2: done
