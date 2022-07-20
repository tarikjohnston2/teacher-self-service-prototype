/* eslint-env jest */

const { mergeDeps, mergePackageJson } = require('./_update_package_json')

describe('mergeDeps', () => {
  let theirs, original, ours

  beforeEach(() => {
    theirs = {
      foo: '^1.0.0'
    }
    original = {
      foo: '^1.0.0'
    }
    ours = {
      foo: '^1.0.0'
    }
  })

  it('does a three way merge of a dependencies object', () => {
    theirs = {
      bar: '^1.0.0',
      foo: '^1.0.0'
    }
    original = {
      foo: '^1.0.0'
    }
    ours = {
      foo: '^2.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      bar: '^1.0.0',
      foo: '^2.0.0'
    })
  })

  it('adds packages that we have added', () => {
    ours = {
      ...ours,
      bar: '^1.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      bar: '^1.0.0',
      foo: '^1.0.0'
    })
  })

  it('sorts the packages', () => {
    ours = {
      bar: '^1.0.0',
      ...ours
    }

    expect(Object.entries(mergeDeps(theirs, original, ours))).toEqual([
      ['bar', '^1.0.0'],
      ['foo', '^1.0.0']
    ])
  })

  it('sorts the packages in the same order as ours', () => {
    theirs = {
      ...theirs,
      'foo-bar': '^1.0.0',
      foo_baz: '^1.0.0'
    }
    original = {
      ...original,
      'foo-bar': '^1.0.0',
      foo_baz: '^1.0.0'
    }
    ours = {
      ...ours,
      foo_baz: '^1.0.0',
      'foo-bar': '^1.0.0'
    }

    expect(Object.entries(mergeDeps(theirs, original, ours))).toEqual([
      ['foo', '^1.0.0'],
      ['foo_baz', '^1.0.0'],
      ['foo-bar', '^1.0.0']
    ])
  })

  it('removes packages that we have removed', () => {
    theirs = {
      ...theirs,
      bar: '^1.0.0'
    }
    original = {
      ...original,
      bar: '^1.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      foo: '^1.0.0'
    })
  })

  it('removes packages that we have removed even if the user has updated them', () => {
    theirs = {
      ...theirs,
      bar: '^2.0.0'
    }
    original = {
      ...original,
      bar: '^1.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      foo: '^1.0.0'
    })
  })

  it('updates packages that we have updated', () => {
    ours = {
      ...ours,
      foo: '^2.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      foo: '^2.0.0'
    })
  })

  it('keeps packages the user has added', () => {
    theirs = {
      ...theirs,
      bar: '^1.0.0'
    }

    expect(mergeDeps(theirs, original, ours)).toEqual({
      bar: '^1.0.0',
      foo: '^1.0.0'
    })
  })
})

describe('mergePackageJson', () => {
  let theirs, original, ours

  beforeEach(() => {
    original = {
      version: '1.0.0',
      dependencies: {}
    }

    theirs = {
      version: '1.0.0',
      dependencies: {}
    }

    ours = {
      version: '1.0.0',
      dependencies: {}
    }
  })

  it('does a three way merge of a package.json object', () => {
    theirs = {
      version: '1.0.0',
      dependencies: {
        bar: '^1.0.0',
        foo: '^1.0.0'
      }
    }

    original = {
      version: '1.0.0',
      dependencies: {
        foo: '^1.0.0'
      }
    }

    ours = {
      version: '2.0.0',
      dependencies: {
        foo: '^2.0.0'
      }
    }

    expect(mergePackageJson(theirs, original, ours)).toEqual({
      version: '2.0.0',
      dependencies: {
        bar: '^1.0.0',
        foo: '^2.0.0'
      }
    })
  })

  it('updates the version number', () => {
    ours = {
      ...ours,
      version: '2.0.0'
    }

    expect(mergePackageJson(theirs, original, ours)).toEqual({
      version: '2.0.0',
      dependencies: {}
    })
  })

  it('removes properties that we have removed', () => {
    theirs = {
      ...theirs,
      devDependencies: {
        foobar: '^1.0.0'
      }
    }

    original = {
      ...original,
      devDependencies: {
        foobar: '^1.0.0'
      }
    }

    expect(mergePackageJson(theirs, original, ours)).toEqual({
      version: '1.0.0',
      dependencies: {}
    })
  })
})
