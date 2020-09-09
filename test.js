const gpiop = require('rpi-gpio').promise;
const fs = require('fs')
const sleep = require('sleep')

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// function msleep(n) {
//   Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
// }
// function sleep(n) {
//   msleep(n/1000);
// }
async function start() {
	await gpiop.setup(35, gpiop.DIR_OUT)
	await off()
}
async function on() {
	await gpiop.write(35, true)
}
async function off() {
	await gpiop.write(35, false)
}

async function doit() {
  await start()
  const cmd = fs.readFileSync('../data1','utf8').split('\n')
  for (let line of cmd) {
    const [action, duration] = line.split(' ')
    console.log(duration)
    if (action === `pulse`) {
      await on()
      console.log(`aaa`, duration)
      await sleep.usleep(100)
      await off()
    } else if (action === `pause`) {
      await sleep.usleep(duration)
    }

  }
}


doit().then(console.log)

