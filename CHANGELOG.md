# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

### Changed

### Removed

### Fixed

## [7.6.6] - 2025-06-09

### Added
- `templates/feature/app/templates/includes/authors.html` - added a template markup for footer authors section
- `templates/feature/app/styles/components/_authors.scss` - styles for authors template
- `templates/feature/app/templates/includes/brief-promo.html` - added a template markup for brief promo
- `templates/feature/app/styles/components/_brief-promo.scss` - styles for brief promo
- `templates/feature/app/templates/includes/contributors.html` - added a template markup for footer contributors section
- `templates/feature/app/templates/includes/trust-project.html` - added a template markup for trust project section
- `templates/feature/app/styles/components/_images.scss` - styles for photos

### Changed
- `templates/feature/app/index.html` - added new components
- `templates/feature/app/styles/main-queso.scss` - linked new scss files
- `templates/feature/app/styles/components/_related-content.scss` - updated styles for related content
- `templates/feature/app/templates/macros/processors-queso.html` - added photo/video embed templates
- `templates/__common__/app/templates/includes/figma2html-config.html` - fixed a size error on figma2html
- `templates/feature/app/templates/includes/svg-defs.html` - updated twitter logo to X logo
- `templates/__common__/config/tasks/graphics-meta.js` - hot fix on puppeteer launch error


## [7.6.5] - 2024-04-08

### Added
- `templates/__common__/app/templates/includes/figma2html-config.html` - added a script to 1) tweak figma2html output's image sources and 2) resize using CSS media query

### Changed
- `templates/graphic/app/templates/graphic-static.html` - added a line to easily insert manual script related to figma2html
- `templates/__common__/config/tasks/parse-figma2html.js` - refined script to move figma2html files, added error handling when there's no figma2html-exports directory in workspace
- `templates/__common__/app/styles/_typography.scss`, `templates/__common__/app/styles/_typography-queso.scss` - added css style rules to show bold and italic correctly on figma2html graphics

## [7.6.1] - 2024-02-12

### Added

- `templates/__common__/_babel.config.json` - added a babel configuration file to ignore warnings

### Changed

- Bumped `queso-ui` from 10.3.2 to 10.4.0
- Bumped `sass-mq` from 5.0.0 to 6.0.0

Updated markups and styles of feature templates to match new Tribune CMS styles:
- Changed: `templates/__common__/app/templates/macros/shares.html`, `templates/feature/app/index.html`, `templates/feature/app/templates/components/footer.html`, `templates/feature/app/templates/components/navbar.html`, `templates/feature/app/templates/components/share.html`, `templates/feature/app/templates/includes/shares.html`, `templates/feature/app/templates/includes/svg-defs.html`
- Changed: `templates/feature/app/styles/components/_navbar.scss`, `templates/feature/app/styles/main-queso.scss`
- Added: `templates/feature/app/styles/components/_details.scss`


## [7.6.0] - 2023-11-30

### Added

- `templates/__common__/config/tasks/parse-figma2html.js` - added a script to unzip exported figma2html file and move files to designated directories

### Changed

- `templates/__common__/config/scripts/develop.js` - added `parseFigma2html` function which will run first in the series of promisses
- `templates/graphic/app/templates/graphic-static.html` - added a description about figma2html and code chunks to insert figma2html's html file, cleaned template
- `templates/__common__/app/styles/components/_graphic.scss` - cleaned some CSS so the grahic is center aligned and text doesn't get wider than 41.5rem following the styles in CMS

## [7.4.6] - 2023-11-02

### Fixed

- Fixed an issue where Kit is unable to take screenshots, making it not showing up in the CMS

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - removed `headless: 'new'` from the `puppeteer.launch()` function

## [7.4.5] - 2023-10-27

### Changed

- Bumped update-check from 1.5.3 to 1.5.4
- Bumped http-cache-semantics from 4.1.0 to 4.1.1
- Bumped queso-ui from 9.4.2 to 10.3.2
- Bumped puppeteer from 5.5.0 to 19.4.0
- `templates/__common__/config/tasks/graphics-meta.js` - added `headless: 'new'` to the `puppeteer.launch()` function following deprecation guidance from `puppeteer`

## [7.4.4] - 2023-07-10

### Added

- `templates/__common__/config/tasks/check-node-versions.js` - detect node versions and show an error message when version 16 or older is used

### Changed

- `templates/__common__/config/package.json` - run `templates/__common__/config/tasks/check-node-versions.js` when running `parse`, `start`, and `build`; add `engines` to specify requirements for node version (18 or later)
- `templates/__common__/_.npmrc` - add `engine-strict=true` statement to enforce the right engine when the user installs packages

## [7.4.2] - 2022-12-22

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - comment out array transformation of a source line to hot fix the issue where the metadata format is not accepted to log a project on our spreadsheet

## [7.4.1] - 2022-11-23

### Changed

- `templates/__common__/utils/fetch/authorize.js` - change parameters to pass to Google OAuth 2.0 authorization URL, tweak terminal languages and string manipulation as a process of out-Of-Band (OOB) flow Migration

## [7.4.0] - 2022-06-06

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - make sources metadata an array
- `templates/feature/app/scripts/utils/ad-loader.js` - make ad square if ad has class `dv-gpt-ad-square`
- `templates/feature/app/templates/embed.html`, `templates/graphic/app/templates/graphic-static.html` - wrap credit, note and source metadata in `data-` tags so "Credit:", "Note:" and "Source:" don't appear in metadata
- `templates/graphic/app/templates/graphic.html` - add default graphic headline and wrap credit, note and source metadata in `data-` tags

## [7.3.0] - 2022-04-20

### Added

- `templates/feature/app/scripts/packs/graphic-embed.js`, `templates/feature/app/scripts/packs/main-embed.js` - add JS scripts for graphic embeds in feature template

### Changed

- `templates/graphic/app/scripts/embeds/frames.js` -> `templates/__common__/app/scripts/embeds/frames.js` - move frames script to common folder so it's included in graphics and features
- `templates/__common__/app/templates/macros/prose.html`, `templates/feature/app/templates/macros/processors.html` - pass in `type` to prose and processors so we can modify the CSS class attached to prose paragraphs (graphic embeds and full-page features have different prose styles)
- `templates/feature/app/templates/base-graphic.html` -> `templates/feature/app/templates/base-embed.html` - rename base graphic embed template in features
- `templates/feature/app/templates/graphic.html` -> `templates/feature/app/templates/embed.html` - rename graphic embed template in features

## [7.2.3] - 2022-04-20

### Changed

- `templates/feature/app/templates/base-graphic.html` - only add a meta tag with `graphicCredit` if the variable is set in the HTML template. If `graphicCredit` is set in the HTML, it will take precedent over the credit set in the `data-credit` tag in the generated metadata.
- `templates/graphic/app/templates/base.html` - Ditto here, but for graphics attached to features.

## [7.2.2] - 2022-04-20

### Changed

- `templates/__common__/utils/deployment/deploy.js` - remove instructions for embedding raw plugins in post-deploy message

## [7.2.1] - 2022-04-20

### Changed

- `templates/__common__/_package.json` - update packages to address vulnerabilities

## [7.2.0] - 2022-03-15

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - check for `data-graphic` and `data-feature`, add `checkForAttribute` function to set the type of each template (graphic or feature) in the metadata based on the `data-` attribute
- `templates/__common__/utils/deployment/update-log-sheet.js` - get the type set in `graphics-meta` to determine the tab in the log sheet to paste metadata to, write metadata to the respective tab unless the hostname is `capybara-test`
- `templates/feature/app/index-queso.html` -> `templates/feature/app/index.html`, `templates/feature/app/index.html` -> `templates/feature/app/templates/index-old.html` - make the Queso feature template the default, move the old index.html to the templates folder
- `templates/feature/app/templates/macros/processors-queso.html`, `templates/feature/app/templates/macros/processors.html` - change styling for lists and subheaders
- `templates/feature/app/templates/base.html`, `templates/graphic/app/templates/base.html` - add default `subject-politics` metadata tag
- `templates/feature/app/templates/base-graphic.html`, `templates/graphic/app/templates/base.html` - add default credits metadata
- `templates/graphic/app/templates/graphic.html` - set tags in graphic embed HTML
- `templates/feature/project.config.js`, `templates/graphic/project.config.js` - add comments to clarify deploy bucket
- `templates/graphic/app/index.html` - remove metadata from graphic `index.html` so it's not added to work log

### Added

- `templates/feature/project.config.js` - add `parserOptions` to feature config file (it previously was only in the graphics config file)
- `templates/feature/app/templates/base-graphic.html`, `templates/feature/app/templates/graphic.html` - add templates for graphic embeds in feature

## [7.1.2] - 2021-01-28

### Fixed

- `templates/feature/app/templates/components/footer.html` - corrected links

## [7.1.1] - 2021-12-17

### Added

- `templates/feature/project.config.js` - add `parserOptions` to feature config file

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - change `graphicsIgnore` -> `metadataIgnore`
- `templates/graphic/project.config.js` - edit comments, `graphicsIgnore` -> `metadataIgnore`
- `templates/graphic/graphics-meta.md` - update documentation to include `metadataIgnore`

## [7.1.0] - 2021-11-16

### Changed

- `templates/graphic/app/index.html`, `templates/graphic/app/static.html` - set tags fetched from the Google Doc as a variable
- `templates/graphic/app/templates/base.html` - grab tags and add as a metadata attribute on the graphic, metadata parser will fetch tags from here
- `templates/graphic/project.config.js` - remove `tags` attribute, add `graphicsIgnore` attribute to `parserOptions`
- `templates/__common__/config/tasks/graphics-meta.js` - change parser to grab metadata from the templates and use the list of graphics to ignore from the config file to ignore certain filepaths when parsing

## [7.0.0] - 2021-11-10

### Changed

- `templates/graphic/app/index.html` - convert `index.html` to a landing page with instructions for how to create graphics from the templates
- `templates/graphic/app/templates/base.html` - check if there is a `jsPackName` variable
- `templates/__common__/app/styles/_typography.scss` - typography changes to article subheader

### Added

- `templates/graphic/app/templates/graphic.html`, `templates/graphic/app/templates/graphic-static.html` - move graphic templates to `templates` folder so empty, unused templates aren't parsed for metadata and displayed in the graphics plugin

## [6.2.2] - 2021-09-15

### Fixed

- `README.md` - updated kit `npx` command for making graphics and features with `@latest` for npm and npx versions >= 7.0.0

## [6.2.1] - 2021-09-15

### Fixed

- `templates/__common__/_package.json` - downgrade `assets-webpack-plugin` to 6.1.2, v7.0.0 requires webpackv5.0.0 as a peer dependency

## [6.2.0] - 2021-09-09

### Changed

- `templates/__common__/config/tasks/graphics-meta.js`, `templates/__common__/utils/deployment/update-log-sheet.js` - change `description` to `alttext`
- `templates/graphic/app/index.html`, `templates/graphic/app/static.html`, `templates/graphic/app/templates/base.html` - change `description` to `alttext` in HTML templates
- `templates/graphic/graphics-meta.md` - change `description` to `alttext` in documentation

## [6.1.0] - 2021-08-25

### Changed

- `templates/__common__/utils/deployment/update-log-sheet.js` - swap out log sheet for [new one](https://docs.google.com/spreadsheets/d/1hCP5zGx8dNxk59gI9wBSFY2juJVM8OFCDY45VnNb2nI/edit#gid=965603489) with complete metadata columns

## [6.0.0] - 2021-08-12

### Changed

- `templates/__common__/utils/deployment/update-log-sheet.js` - write more metadata from `manifest.json` to the log sheet
- `templates/__common__/utils/deployment/update-readme.js` - add bullets to links pasted to README
- `templates/graphic/app/index.html`, `templates/graphic/app/static.html` - get alt-text from our [graphic ArchieML template](https://docs.google.com/document/d/1BKQy7bsteC7Od5Jgzt_PX8KRe0pD2Ba1LXEj02uWf4I/edit)

## [5.0.1] - 2021-08-05

## Fixed

- `_common_/app/styles/_functions.scss`, `_common_/app/styles/utilities/_embed.scss` - replace `/` with `math.div` to address Dart Sass warnings #94

## [5.0.0] - 2021-08-04

### Changed

- `package.json`, `package-lock.json` - bump `assets-webpack-plugin`, `googleapis`, `imagemin`, `imagemin-gifsicle`, `imagemin-jpegtran`, `imagemin-optipng` packages (major version bumps for `imagemin-gifsicle`, `imagemin-jpegtran`, `imagemin-optipng` require Node.js v10)

## [4.0.2] - 2021-06-04

### Changed

- `package.json`, `package-lock.json` - bump `np` and `doctoc` packages

## [4.0.1] - 2021-06-04

### Removed

- `templates/feature/app/scripts/kickstart.js` - remove trending bar from our feature pages because it was getting in the way of other designs

## [4.0.0] - 2021-05-05

### Changed

- `templates/__common__/config/scripts/build.js` - add script to update the `lastBuildTime` in `build.js`
- `templates/__common__/config/tasks/graphics-meta.js` - add more keys to manifest.json output; simplify warning logs; ignore graphics with no title
- `templates/__common__/config/utils.js` - add a `logMessage` function for console logging with colors
- `templates/feature/project.config.js` - add `lastBuildTime` field to feature config, change `slug` to `projectName`, add comments to clarify which properties should and should not be changed
- `templates/graphic/project.config.js` - add `lastBuildTime` field to graphic config, change `slug` to `projectName`, add comments to clarify which properties should and should not be changed; update default tag to `subject-politics`
- `bin/data-visuals-create`, `README.md`, `templates/__common__/_package.json`, `templates/__common__/utils/deployment/update-log-sheet.js` - change `slug` to `projectName` to avoid confusion with the slug in our project URL and what we add to the CMS
- `templates/graphic/app/index.html`, `templates/graphic/app/static.html`, `templates/graphic/app/templates/base.html` - add caption for graphic context and assume description is for accessibility
- `templates/graphic/graphics-meta.md` - document the new caption field and rules

### Added

- `templates/__common__/config/tasks/last-build-time.js` - add script to parse the config file, update the `lastBuildTime` and write the file back to the filepath

## [3.8.0] - 2021-04-20

### Changed

- `templates/__common__/config/tasks/graphics-meta.js` - Adds a graphic note to the manifest file. Also now logs a warning to the terminal if you don't update the tags in the project config.
- `templates/graphic/app/index.html`,
  `templates/graphic/app/static.html`,
  `templates/graphic/app/templates/base.html` - Adds all the proper template attributes to surface notes to the parsing task
  `templates/graphic/graphics-meta.md` - Documents the new key

## [3.7.0] - 2021-03-16

### Changed

- `templates/graphic/project.config.js` - Adds new key for adding customization to the parsing step. For now the only one there is one to ignore Apple News for specified files. Adds some placeholder tags to tag our graphics also. (Tags will be included in the graphic metadata.)
- `templates/__common__/_package.json` - Adds puppeteer and a new `npm run parse` step. Add `npm run parse` to `npm run build` so the parse step runs automatically on deploy.
- `templates/graphic/README.md` - Adds default Chrome install path, required in the parse step.
- `templates/graphic/app/templates/base.html` - New meta tags on graphics to be used internally.
- `templates/graphic/app/index.html`, `templates/graphic/app/static.html` - Add variables to set for graphic metadata, plus data attributes that allow the parser to pull metadata from existing HTML as a fallback.

### Added

- `templates/__common__/_.npmrc`- This tells puppeteer to skip downloading chrome each time we create a new project. Saves us some storage on our machines.
- `templates/__common__/config/scripts/parse.js` - Task runner that spins up a local server and kicks off the graphics-meta.js step.
- `templates/__common__/config/tasks/graphics-meta.js`- The base for this whole process. At a high level, this will step through the whole project /dist folder and extract all the relevant metadata info we specify. This is also where we capture screenshots of graphics.

How we generate graphic metadata is also documented in `templates/graphic/graphics-meta.md`.

## [3.6.0] - 2021-01-21

### Changed

- `templates/feature/app/templates/includes/ldjson.html` - change some of our attributes in our structured data schema

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
- `/__common__/app/styles/_typography-queso.scss` - Extra typography styles not accounted for in queso-ui and data viz specific overrides of existing helpers. Appended `-queso` as to not be confused with current \_typography.scss
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

- Change GA event tags

## [1.1.0] - 2019-04-03

- Redundant ternary a828d34
- Better default doc and sheet examples b8abc16
- Merge branch 'master' into develop d82ebed
- Make https serving an option set with an env variable 1310cdb

<https://github.com/texastribune/data-visuals-create/compare/1.0.1...1.1.0>

## [1.0.1] - 2019-03-20

- Fix bug in doc-to-archieml parser with lists 6717876
- Update Getting started with right path 5d24a29

<https://github.com/texastribune/data-visuals-create/compare/1.0.0...1.0.1>

## [1.0.0] - 2019-03-05

## [1.0.0-alpha] - 2019-02-27

## [0.36.0] - 2019-02-19

## [0.35.0] - 2019-01-29

## [0.34.1] - 2019-01-14

## [0.34.0] - 2019-01-11

## [0.33.0] - 2018-12-04
