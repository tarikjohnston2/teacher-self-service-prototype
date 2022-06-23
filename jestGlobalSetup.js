module.exports = function () {
  process.stdout.write('setting process.env.TEST_TEST\n')
  process.env.TEST_TEST = 'testtest'
}
