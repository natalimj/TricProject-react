console.log('TIME TO RUN SOME TESTS!')
module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    product: 'chrome',
    args: [
      '--no-sandbox'
    ]
  },
  browserContext: 'default',
  server: {
    command: `npm start`,
    port: 3000,
    launchTimeout: 10000,
    debug: true,
  },
  testTimeout: 20000
}