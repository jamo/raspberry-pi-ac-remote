const fs = require('fs')
const f1 = fs.readFileSync(process.argv[2], 'utf8').split('\n')
const f2 = fs.readFileSync(process.argv[3], 'utf8').split('\n')

if (f1.length !== f2.length) {
  console.log(`file length differ`)
  process.exit(1)
}

for (let i = 0; i < f1.length; i+=1) {
  const [a1, v1] = f1[i].split(' ')
  const [a2, v2] = f2[i].split(' ')
  if (a1 !== a2) {
    console.log(`incorrect command on line ${i}`, a1, a2)
  }
  if (Math.abs(v1 - v2) > 100) {
    console.log(`incorrect value on line ${i}`, v1, v2)
  }
}
