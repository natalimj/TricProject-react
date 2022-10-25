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
  testTimeout: 5000
}