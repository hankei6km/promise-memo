;(async () => {
  let passResolve: (value: string) => void = (v) => {}
  const p1 = new Promise<string>((resolve) => {
    passResolve = resolve
  })
  console.log(p1)
  console.log(p1.toString())
  passResolve('done')
  await p1
  console.log(p1)

  let passReject: (value: string) => void = (v) => {}
  const p2 = new Promise<string>((resolve, reject) => {
    passReject = reject
  }).catch((r) => r)
  console.log(p2)
  console.log(p2.toString())
  passReject('rejected')
  await p2
  console.log(p2)
})()

// $ node --loader ts-node/esm examples/memo/promise_is_pending.ts
// Promise { <pending> }
// [object Promise]
// Promise { 'done' }
// Promise { <pending> }
// [object Promise]
// Promise { 'rejected' }
