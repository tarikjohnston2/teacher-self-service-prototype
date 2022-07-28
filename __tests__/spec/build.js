/* eslint-env jest */

const child_process = require('child_process') // eslint-disable-line camelcase
const fse = require('fs-extra')
const fs = require('graceful-fs') // fs-extra uses graceful-fs, so we need to mock that instead of fs
const path = require('path')

const del = require('del')
const sass = require('sass')

const { projectDir } = require('../../lib/path-utils')
const { generateAssetsSync } = require('../../lib/build/tasks')

describe('the build pipeline', () => {
  describe('generate assets', () => {
    beforeAll(() => {
      del.sync(['.tmp', 'public'])

      jest.spyOn(fs, 'chmodSync').mockImplementation(() => {})
      jest.spyOn(fse, 'chmodSync').mockImplementation(() => {})
      jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {})
      jest.spyOn(fse, 'copyFileSync').mockImplementation(() => {})
      jest.spyOn(fse, 'ensureDirSync').mockImplementation(() => {})
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
      jest.spyOn(fse, 'mkdirSync').mockImplementation(() => {})
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
      jest.spyOn(fse, 'writeFileSync').mockImplementation(() => {})

      jest.spyOn(sass, 'renderSync').mockImplementation((options) => ({ css: options.file }))

      generateAssetsSync()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('can be run from the command line', () => {
      const proc = child_process.spawnSync(
        'node', ['lib/build/generate-assets'],
        { cwd: path.resolve(__dirname, '..', '..'), encoding: 'utf8' }
      )

      expect(proc).toEqual(expect.objectContaining(
        { status: 0 }
      ))
    })

    it('makes the extensions sass file', () => {
      expect(fse.ensureDirSync).toHaveBeenCalledWith(
        path.join(projectDir, '.tmp', 'sass'), { recursive: true }
      )

      expect(fse.writeFileSync).toHaveBeenCalledWith(
        path.join(projectDir, '.tmp', '.gitignore'),
        '*'
      )

      expect(fse.writeFileSync).toHaveBeenCalledWith(
        path.join(projectDir, '.tmp', 'sass', '_extensions.scss'),
        expect.stringContaining('$govuk-extensions-url-context')
      )
    })

    it('compiles sass', () => {
      expect(sass.renderSync).toHaveBeenCalledWith(expect.objectContaining({
        file: path.join(projectDir, 'lib', 'assets', 'sass', 'prototype.scss')
      }))

      expect(fse.writeFileSync).toHaveBeenCalledWith(
        path.join('public', 'stylesheets', 'application.css'),
        path.join(projectDir, 'lib', 'assets', 'sass', 'prototype.scss')
      )

      expect(sass.renderSync).not.toHaveBeenCalledWith(expect.objectContaining({
        file: path.join('app', 'assets', 'sass', 'application.scss')
      }))
    })

    it('copies javascript to the public folder', () => {
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        path.join('app', 'assets', 'javascripts', 'application.js'),
        path.join('public', 'javascripts', 'application.js')
      )
    })

    it('copies images to the public folder', () => {
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        path.join('app', 'assets', 'images', 'unbranded.ico'),
        path.join('public', 'images', 'unbranded.ico')
      )
    })
  })
})
