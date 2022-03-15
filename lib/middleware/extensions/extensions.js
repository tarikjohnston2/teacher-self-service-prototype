const express = require('express')
const extensions = require('../../extensions/extensions')
const router = express.Router()

router.use('/prototype-admin/extensions', function (req, res) {
  res.send('<pre>' + JSON.stringify(extensions.getAppConfig(), null, 2) + '</pre>')
})

// Serve assets from extensions
function setupPathsFor (item) {
  extensions.getPublicUrlAndFileSystemPaths(item)
    .forEach(paths => {
      router.use(paths.publicUrl, express.static(paths.fileSystemPath))
    })
}

setupPathsFor('scripts')
setupPathsFor('stylesheets')
setupPathsFor('assets')

function removeSuffix (str, suffix) {
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
}

// Serve views from extensions
extensions.getPublicUrlAndFileSystemPaths('views')
  .forEach(paths => {
    const publicUrl = removeSuffix(paths.publicUrl, '.html')
    router.use(publicUrl, (req, res) => res.render(paths.fileSystemPath))
  })

module.exports = router
