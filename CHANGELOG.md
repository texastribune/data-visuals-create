# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
### Changed
### Removed
### Fixed

## [2.1.0] - 2019-10-17
### Changed
- `_common_/utils/deployment/deploy.js` - change deploy function to update log sheet and README #20
- `_common_/utils/fetch/authorize.js`- change SCOPES to include write permissions #20
- `project.config.js` for graphics and features - add `createDate` and `slug` property

### Added
- `_common_/utils/deployment/update-log-sheet.js` - add utility file for adding to data visuals log sheet #20
- `_common_/utils/deployment/update-readme.js` - add utility file for adding links to README #20

## [2.0.0] - 2019-09-25
### Added
- `graphic/app/styles/raw-plugin-styles.html` - add styles snippet that goes into the CSS content section of Raw Plugins
- `graphic/app/static.html` - template for non-scripted graphics
- `graphic/app/scripts/static.js` - pack for non-scripted graphics

### Changed
- Switched from using Pym to `frames` library #17

### Removed
- `graphic/app/scripts/embeds/pym.js`

## [1.2.0] - 2019-09-19
### Fixed
- Fixed security vulnerability introduced by `lodash` #10

### Added
- Added `widont` tag to graphic and feature templates #11
- Added a CHANGELOG #13
- Added a subheader example to the feature template #14
- Added a subheader macro #14
- Added styling for a subheader #14

## [1.1.1] - 2019-05-08
* Change GA event tags

## [1.1.0] - 2019-04-03
- Redundant ternary  a828d34
- Better default doc and sheet examples  b8abc16
- Merge branch 'master' into develop  d82ebed
- Make https serving an option set with an env variable  1310cdb

https://github.com/texastribune/data-visuals-create/compare/1.0.1...1.1.0

## [1.0.1] - 2019-03-20
- Fix bug in doc-to-archieml parser with lists  6717876
- Update Getting started with right path  5d24a29

https://github.com/texastribune/data-visuals-create/compare/1.0.0...1.0.1

## [1.0.0] - 2019-03-05

## [1.0.0-alpha] - 2019-02-27

## [0.36.0] - 2019-02-19

## [0.35.0] - 2019-01-29

## [0.34.1] - 2019-01-14

## [0.34.0] - 2019-01-11

## [0.33.0] - 2018-12-04
