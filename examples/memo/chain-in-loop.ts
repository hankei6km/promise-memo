const cancel = new Promise<void>((resolve) =>
  setTimeout(() => {
    console.log('--- timeout')
    resolve()
  }, 2000)
)
console.log('==== start')
for (let idx = 0; idx < 10; idx++) {
  await ((idx) => {
    return new Promise<void>((resolve) => {
      let id: any = setTimeout(() => {
        id = undefined
        console.log(`done ${idx}`)
        resolve()
      }, 100)
      cancel.then(() => {
        if (id) {
          clearTimeout(id)
          id = undefined
          console.log(`clear ${idx}`)
        }
        console.log(`cancel ${idx}`)
      })
    })
  })(idx)
}
console.log('done')

await cancel
console.log('')

const cancelWithReject = new Promise<void>((resolve, reject) =>
  setTimeout(() => {
    reject(new Error('timeout with reject'))
  }, 2000)
)
cancelWithReject.catch(() => {
  console.log('---timeout')
})
console.log('==== start(use Promise.race)')
for (let idx = 0; idx < 10; idx++) {
  await ((idx) => {
    let id: any
    return Promise.race([
      cancelWithReject,
      new Promise<void>((resolve) => {
        id = setTimeout(() => {
          id = undefined
          console.log(`done ${idx}`)
          resolve()
        }, 100)
      })
    ]).catch(() => {
      if (id) {
        clearTimeout(id)
        id = undefined
        console.log(`clear ${idx}`)
      }
      console.log(`cancel ${idx}`)
    })
  })(idx)
}
console.log('done')

export {}

// $ node --loader ts-node/esm examples/memo/chain-in-loop.ts
// ==== start
// done 0
// done 1
// done 2
// done 3
// done 4
// done 5
// done 6
// done 7
// done 8
// done 9
// done
// --- timeout
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
//
// ==== start(use Promise.race)
// done 0
// done 1
// done 2
// done 3
// done 4
// done 5
// done 6
// done 7
// done 8
// done 9
// done
// ---timeout
