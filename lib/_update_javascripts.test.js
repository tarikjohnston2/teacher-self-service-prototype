/* eslint-env jest */

const fs = require('fs').promises
const path = require('path')

jest.mock('./update-utils')
const updateUtils = require('./update-utils')
const updatejs = require('./_update_javascripts')

const oldApplicationJs = `/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})
`

const newApplicationJs = `// Add extra JavaScript here

ready(() => {
  // Add JavaScript that needs to be run when the page is loaded
})
`

describe('removeKitJsFromApplicationJs', () => {
  let mockCopyFile, mockWriteFile

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(updateUtils, 'getProjectVersion').mockImplementation(
      async () => '12.1.1'
    )

    jest.spyOn(updateUtils, 'fetchOriginal').mockImplementation(
      async () => oldApplicationJs
    )

    mockCopyFile = jest.spyOn(fs, 'copyFile').mockImplementation(
      async () => {}
    )

    mockWriteFile = jest.spyOn(fs, 'writeFile').mockImplementation(
      async () => {}
    )
  })

  it('replaces application.js if the user has not updated it', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce(
      async () => oldApplicationJs
    )

    await updatejs.removeKitJsFromApplicationJs()

    expect(mockCopyFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('update', 'app', 'assets', 'javascripts', 'application.js')),
      expect.stringContaining(path.join('app', 'assets', 'javascripts', 'application.js'))
    )
  })

  it('rewrites application.js if the user has added lines to the bottom of the file', async () => {
    // theirs
    jest.spyOn(fs, 'readFile').mockImplementationOnce(
      async () => oldApplicationJs + '\ncallMyCode()\n'
    )
    // ours
    jest.spyOn(fs, 'readFile').mockImplementationOnce(
      async () => newApplicationJs
    )

    await updatejs.removeKitJsFromApplicationJs()

    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('app', 'assets', 'javascripts', 'application.js')),
      newApplicationJs + '\ncallMyCode()\n',
      'utf8'
    )
  })

  it('does not touch application.js if the user has rewritten it a lot', async () => {
    // theirs
    jest.spyOn(fs, 'readFile').mockImplementationOnce(
      async () => 'justMyCode()\n'
    )

    await updatejs.removeKitJsFromApplicationJs()

    expect(mockWriteFile).not.toHaveBeenCalled()
    expect(mockCopyFile).not.toHaveBeenCalled()
  })

  it('does not touch application.js if the user prototype is already on v13', async () => {
    jest.spyOn(updateUtils, 'getProjectVersion').mockImplementation(
      async () => '13.0.0'
    )

    const mockReadFile = jest.spyOn(fs, 'readFile').mockImplementation(
      async () => {}
    )

    await updatejs.removeKitJsFromApplicationJs()

    expect(mockReadFile).not.toHaveBeenCalled()
    expect(mockWriteFile).not.toHaveBeenCalled()
    expect(mockCopyFile).not.toHaveBeenCalled()
  })
})
