module.exports = function () {
  process.stdout.write(process.env.TEST_TEST || 'process.env.TEST_TEST is not set')
  process.stdout.write('\n')
}
