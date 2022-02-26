const cancel = new Promise<void>((resolve) =>
  setTimeout(() => {
    console.log('--- origin promise is done')
    resolve()
  }, 3000)
)

console.log('==== start(AbortController)')
const ac = new AbortController()
cancel.then(() => {
  console.log('call ac.abort()')
  ac.abort()
})
for (let idx = 0; idx < 10; idx++) {
  const p = ((c: Promise<void>, i: number) =>
    new Promise<string>((resolve) => {
      if (!ac.signal.aborted) {
        const handleAbort = () => {
          console.log(`abort ${i}`)
          if (id) {
            id = undefined
            clearTimeout(id)
          }
          resolve(`cancel ${i}`)
        }
        let id: any = setTimeout(() => {
          id = undefined
          ac.signal.removeEventListener('abort', handleAbort)
          resolve(`${i} is done`)
        }, 100)
        ac.signal.addEventListener('abort', handleAbort, { once: true })
      } else {
        resolve(`aborted ${i}`)
      }
    }))(cancel, idx)
  await p.then((v) => {
    console.log(v)
  })
}
console.log('done(AbortController)')

export {}

// $ node --loader ts-node/esm examples/memo/chain-is-persistent.ts
// ==== start(bare promise)
// 0 is done
// 1 is done
// 2 is done
// 3 is done
// 4 is done
// 5 is done
// 6 is done
// 7 is done
// 8 is done
// 9 is done
// done(bare promise)
// ==== start(AbortController)
// 0 is done
// 1 is done
// 2 is done
// 3 is done
// 4 is done
// 5 is done
// 6 is done
// 7 is done
// 8 is done
// 9 is done
// done(AbortController)
// --- first promise is done
// cancel 0
// cancel 1
// cancel 2
// cancel 3
// cancel 4
// cancel 5
// cancel 6
// cancel 7
// cancel 8
// cancel 9
// call ac.abort()
