# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
### Changed
### Removed
### Fixed

## [3.5.0] - 2021-01-12
### Changed
- `templates/__common__/utils/deployment/update-log-sheet.js` - change ID of the Google sheet to write our projects to

## [3.4.0] - 2020-12-22
### Changed
- `package.json` - bump `np` to v7.0.0
- `templates/feature/app/scripts/utils/ad-loader.js` - set correct ad tags for roofline and footer ads
- `templates/feature/app/styles/main-queso.scss`, `templates/feature/app/styles/main.scss` - add chart and graphic CSS by default
- `templates/feature/app/templates/macros/processors-queso.html`, `templates/feature/app/templates/macros/processors.html` - add option to ad to set it as a roofline or footer ad
- `templates/feature/app/index.html`, `templates/feature/app/index-queso.html` - add footer option to ad to set ad tag

## [3.3.0] - 2020-11-19
### Changed
- `templates/graphic/project.config.js`, `templates/feature/project.config.js` - comment the slug and folder variables (folder variable should be changed when the URL slug is changed)
- `templates/feature/app/index-queso.html` - change `{{ context.title }}` to `{{ context.headline }}`, add HTML to include publish and update dates
- `templates/feature/app/index.html`, `templates/feature/project.config.js`, `templates/graphic/app/index.html`, `templates/graphic/app/static.html` - change `{{ context.title }}` to `{{ context.headline }}`
- `templates/feature/app/templates/components/simple-masthead.html`, 
`templates/feature/app/templates/includes/logo.html` - change 10th anniversary logo back to original TT logo
- `templates/__common__/app/styles/_typography-queso.scss` - add t-subheader styling

### Added
- `templates/__common__/app/templates/macros/prose-queso.html`, `templates/feature/app/templates/macros/processors-queso.html` - added prose and processors with queso styling

### Fixed
- `templates/feature/app/index-queso.html`, `templates/feature/app/index.html` - add widont to headline

## [3.2.0] - 2020-09-15
### Changed
- `templates/__common__/config/tasks/nunjucks.js` - added getAuthor() and getAuthorLink() to extract author name and author link for structured data schema
- `templates/feature/app/templates/includes/ldjson.html` - add new structured data attributes

## [3.1.0] - 2020-09-02
### Added
- `templates/feature/app/styles/components/_navbar.scss` - added masthead title to the nav bar component in the `index-queso.html` template
- `templates/feature/app/templates/components/navbar.html` - added additional styling for the masthead title

### Fixed
- `config/tasks/serve.js` - Adds an extra reload to refresh the page. When you first run npm run start there's a blip of no CSS while the CSS cleanup step runs. This will refresh again after that's finished so that console error referring to that missing CSS clears.
- `config/tasks/unused-css.js` - Generalizes the gobbing pattern to capture more types of script files and in any folder. Previously CSS classes referenced in JS files weren't making it to the extra-minified CSS file, which is set up to only include classes used in the project.

## [3.0.0] - 2020-08-25
### Changed
- `templates/feature/project.config.js` - change destination s3 bucket on deploy

### Fixed
- `package-lock.json` - bump version of `np` package to resolve security vulnerability

## [2.8.1] - 2020-07-20
### Fixed
- `package-lock.json` - bump lodash from 4.17.15 to 4.17.19

## [2.8.0] - 2020-07-20
### Added
- `/feature/app/index-queso.html` - Starter template for queso CSS framework
- `/feature/app/styles/main-queso.scss` - Starter styles for CSS framework
- `/__common__/app/styles/_typography-queso.scss` - Extra typography styles not accounted for in queso-ui and data viz specific overrides of existing helpers. Appended `-queso` as to not be confused with current _typography.scss
- `/feature/app/styles/components/_navbar.scss` - Overrides for queso navbar
- `feature/app/styles/layout/_container.scss` - Additional container classes
- `/feature/app/templates/components/navbar.html` - Standard navbar component (used on TT)
- `/feature/app/templates/components/share.html` - Standard share component (used on TT)
- `/feature/app/templates/includes/logo.html` - Standard logo include (used on TT)

### Changed
- `_package.json` - Added queso dependency
- `_variables.scss` - Added variables required for queso
- `/feature/app/scripts/components/RelatedContent.js` and `/feature/app/scripts/components/Story.js` - Sprinkled in queso helpers (to be compatible in either starter template)
- `/feature/app/styles/components/_ads.scss` - Updated teal to match TT site (it's a random darkened-teal for accessibility)
- `/feature/app/styles/main.scss` - Removed sass-mq because it comes with the queso imports and added just the base queso variables and tools. This doesn't actually add any CSS so it's helpful if you ever want to include queso helpers in this file in your project.
- `/feature/app/templates/base.html` - Added more blocks so that the queso starter template could vary in those parts. Example: Google fonts isn't needed in the queso started so we override that with an empty block.

## [2.7.2] - 2020-07-01
### Added
- `templates/feature/app/scripts/packs/graphic.js` - add useful functions to JS for graphics (functions were already available in feature JS)

### Fixed
- `templates/feature/app/templates/includes/ldjson.html` - check for `updated` or `update date` so the tracker shows up in search on updates, add `author` field

## [2.7.1] - 2020-07-01
### Added
- `templates/__common__/app/styles/_typography.scss` - add styling for update date #44

### Changed
- `templates/feature/app/index.html` - add HTML to handle update date and pub date #44

### Fixed
- `templates/feature/app/scripts/utils/feeds.js` - switch v1 API urls to v2 API urls #6
- `templates/feature/app/scripts/components/Story.js` - switch out properties to match v2 API urls #6

## [2.7.0] - 2020-07-01
### Added
- `templates/__common__/config/tasks/templates.js` - add renderStringWithNunjucks() filter to process data variables pulled in from a Google Doc #46
- `templates/graphic/app/templates/macros/processors.html`, `templates/feature/app/templates/macros/processors.html` - separate processors files for graphics and features, add renderStringWithNunjucks() filter to macros #46

### Changed
- `templates/feature/app/index.html` - set featureData variable to store data
- `templates/graphic/app/index.html`, `templates/graphic/app/static.html` - set graphicData variable to store data, render graphic prose with prose macro so we can add data variables

### Removed
- `templates/__common__/app/templates/macros/processors.html` - remove common processors file

## [2.6.0] - 2020-05-08
### Added
- `templates/__common__/config/tasks/unused-css.js` - A step that looks at the CSS file linked in any .html file, parses that CSS, and writes new CSS based only on what the HTML needs through the magic of this wonderful tool, [purgecss](https://github.com/FullHuman/purgecss)

### Changed
- `templates/__common__/config/scripts/build.js` - This cleanup step will now run right after the HTML of the templates compile and before the file revving step
- `templates/__common__/config/tasks/serve.js` - New watchers added mostly in the build output folder to re-run the CSS cleanup step after the build
- `templates/__common__/_package.json` - Adds purgecss as a dev dependency

## [2.5.3] - 2020-04-21
### Added
- `_variables.scss` - add elections color palette 
- `deploy.js` - add reminder to check social media for features and fetch the latest data
- `README.md` - update feature README with more publication reminders

## [2.4.3] - 2020-02-11
### Fixed
- `package.json` - removed `npm run assets:pull` from the `predeploy` command #39

## [2.4.2] - 2020-01-15
### Changed
- `package.json` - pull assets and push to workspace on predeploy, which is run automatically before deploy #31
- `feature/app/styles/components/_related-content.scss`, `feature/app/styles/components/_ads.scss`, 
`processors.html` - update appearance of ads 
- `graphic/README.md, feature/README.md` - added project launch checklist

## [2.4.1]
### Changed
- `update-log-sheet.js` - change sheet to new 2020 data visuals work sheet

## [2.4.0]
### Added
- `_polls.scss`, `_variables.scss`, `_graphic.scss`, `mixins/_grid.scss` — add styles needed for poll graphics
- `templates.js`, `nunjucks.js` — add helpers needed for poll graphics

## [2.3.2] - 2019-11-26
### Changed
- `graphic/app/scripts/embeds/frames.js` - don't pass debounced function to resize listener, simplify code #29

## [2.3.1] - 2019-11-15
### Fixed
- `deploy.js` - add property to iframe sandbox so user can click to other pages #25
- `project.config.js` - change default archieML doc to be the one we actually use #26
- `update-log-sheet.js` - add year to repo name for `newsapps-dailies` graphics (post reorganization of our dailies)

## [2.3.0] - 2019-10-28
### Changed
- `feature/app/templates/components/simple-masthead.html` - switch out normal logo for 10th anniversary logo

## [2.2.1] - 2019-10-22
### Fixed
- `__common__/utils/deployment/update-log-sheet.js` - handle cases when there are no files specified in the config file

## [2.2.0] - 2019-10-17
### Added
- `__common__/app/templates/macros/processors.html` - add ad macro to processors file #16
- `feature/app/scripts/packs/graphic.js` - add graphic pack for code in a feature with resize() function #22

### Changed
- `feature/app/index.html` - import ad from processors file #16
- `feature/app/scripts/packs/main.js` - import new graphic pack
- `graphic/app/scripts/packs/graphic.js` - fixed data path

### Removed
- `feature/app/templates/macros/ads.html` - remove special ad macro from feature #16

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
