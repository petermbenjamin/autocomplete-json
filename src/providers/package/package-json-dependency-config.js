'use babel'

import { assign } from 'lodash'
import { search, versions } from 'npm-package-lookup'

import { path, request } from '../../matchers'

const DEPENDENCY_PROPERTIES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
const KEY_MATCHER = request().key().path(path().key(DEPENDENCY_PROPERTIES))
const VALUE_MATCHER = request().value().path(path().key(DEPENDENCY_PROPERTIES).key())

export default {
  versions(name) {
    return versions(name, { sort: 'DESC', stable: true })
  },

  search(prefix) {
    return search(prefix).then(results => results.map(name => ({ name })))
  },

  dependencyRequestMatcher() {
    return KEY_MATCHER
  },

  versionRequestMatcher() {
    return VALUE_MATCHER
  },

  getFilePattern() {
    return 'package.json'
  },

  isAvailable(request, dependency) {
    return false
  },

  getDependencyFilter(request) {
    const {contents} = request
    if (!contents) {
      return dependency => true
    }
    const objects = DEPENDENCY_PROPERTIES.map(prop => contents[prop] || {})
    const merged = assign(...objects) || {}
    return dependency => !merged.hasOwnProperty(dependency)
  }
}
