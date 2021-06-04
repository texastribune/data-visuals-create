<h1 align="center">
  data-visuals-create
</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/@data-visuals/create"><img src="https://img.shields.io/npm/v/@data-visuals/create.svg?style=flat" alt="npm"></a>
  <a href="https://david-dm.org/texastribune/data-visuals-create"><img src="https://david-dm.org/texastribune/data-visuals-create/status.svg" alt="dependencies"></a>
  <a href="https://david-dm.org/texastribune/data-visuals-create/?type=dev"><img src="https://david-dm.org/texastribune/data-visuals-create/dev-status.svg" alt="devDependencies"></a>
</p>

A tool for generating the scaffolding needed to create a graphic or feature the Data Visuals way.

## Key features

- 📐 **HTML templating with a familiar, easy Jinja2-esque format** via a modified instance of a [Nunjucks](https://github.com/mozilla/nunjucks) environment that comes with all the functionality of [`journalize`](https://github.com/rdmurphy/journalize) by default.
- 🎨 **Supports SCSS syntax** for styles compiled with the super fast reference implementation of Sass via [`dart-sass`](https://github.com/sass/dart-sass). All CSS is passed through [`autoprefixer`](https://github.com/postcss/autoprefixer) and minified with [`clean-css`](https://github.com/jakubpawlowicz/clean-css) in production.
- 📦 A **configured instance of Webpack ready to go** and optimized for a [two-path modern/legacy bundle approach](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/). Ship lean ES2015+ code to modern browsers, and a functional polyfilled/transpiled bundle to the rest!
- 📑 Full-support for **[ArchieML](http://archieml.org/) formatted Google Docs and key/value or table formatted Google Sheets**. Use data you've collaborated on with reporters and editors directly in your templates.
- 🎊 And so, so, so much more!

## Getting started

```sh
npx @data-visuals/create feature my-great-project # the project name should be passed in as a slug
cd feature-my-great-project-YYYY-MM # the four digit year and two digit month
npm start
```

> While you can install `@data-visuals/create` globally and use the `data-visuals-create` command, we recommend using the `npx` method instead to ensure you are always using the latest version.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Development and testing](#development-and-testing)
- [Folder structure](#folder-structure)
    - [config/](#config)
    - [data/](#data)
    - [workspace/](#workspace)
    - [project.config.js](#projectconfigjs)
    - [app/](#app)
    - [app/index.html, app/static.html](#appindexhtml-appstatichtml)
    - [app/templates/](#apptemplates)
    - [app/scripts/](#appscripts)
    - [app/styles/](#appstyles)
    - [app/assets/](#appassets)
  - [Other directories you may see](#other-directories-you-may-see)
    - [.tmp/](#tmp)
    - [dist/](#dist)
- [How to work with Google Doc and Google Sheet files](#how-to-work-with-google-doc-and-google-sheet-files)
  - [Google Docs](#google-docs)
  - [Google Sheets](#google-sheets)
- [Supported browsers](#supported-browsers)
- [How do JavaScript packs work?](#how-do-javascript-packs-work)
  - [Creating a new entrypoint](#creating-a-new-entrypoint)
  - [Connecting an entrypoint to an HTML file](#connecting-an-entrypoint-to-an-html-file)
- [Available commands](#available-commands)
    - [`npm start` or `npm run serve`](#npm-start-or-npm-run-serve)
    - [`npm run deploy`](#npm-run-deploy)
    - [`npm run data:fetch`](#npm-run-datafetch)
    - [`npm run assets:push`](#npm-run-assetspush)
    - [`npm run assets:pull`](#npm-run-assetspull)
    - [`npm run workspace:push`](#npm-run-workspacepush)
    - [`npm run workspace:pull`](#npm-run-workspacepull)
- [Environment variables and authentication](#environment-variables-and-authentication)
  - [AWS](#aws)
  - [Google](#google)
    - [CLIENT_SECRETS_FILE](#client_secrets_file)
    - [GOOGLE_TOKEN_FILE](#google_token_file)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

While we recommend using the `npx` method, you can also install the tool globally. If you do, replace all instances of `npx @data-visuals/create` you see with `data-visuals-create`.

```sh
npm install -g @data-visuals/create
```

## Usage

```sh
npx @data-visuals/create <project-type> <project-name>
```

Currently there are two project types available — `graphic` and `feature`. The project name should be passed in as a slug, i.e. `my-beautiful-project`.

```sh
npx @data-visuals/create graphic school-funding
```

This will create a directory for you, copy in the files, install the dependencies, and do your first `git commit`.

The directory name will be formatted like this:

```
<project-type>-<project-name>-<year>-<month>

Using the example command above, it would be the following:
graphic-school-funding-2018-01
```

This is to ensure consistent naming of our directories!

## Development and testing

If you make changes locally to `@data-visuals/create` and want to test them, you can run `data-visuals-create/bin/data-visuals-create <project-type> <project-name>` to generate a graphic or feature and see if your changes were included. Run the command one level above this repo, or you'll create a graphic or feature within `data-visuals-create`.

## Folder structure

After creation, your project directory should look something like this:

```
your-project/
  README.md
  node_modules/
  config/
  data/
  workspace/
  package.json
  project.config.js
  app/
    index.html
    templates/
    styles/
    scripts/
    assets/
```

Here are the highlights of what each file/directory represents:

#### config/

This is the directory of all the configuration and tasks that power the kit. You probably do not need to ever go in here! (And eventually this will be abstracted away.)

#### data/

Where data downloaded and processed with `npm run data:fetch` ends up. You are also free to manually (or via your own scripts!) put data files here - they will get pulled in too! Be aware that the only compatible data files that belong here are ones that [`quaff`](https://github.com/rdmurphy/quaff) knows how to consume, otherwise it will ignore them.

#### workspace/

The `workspace` directory is for storing all of your analysis, production and raw data files. It's important to use this directory for these files (instead of `app/assets/` or `data/`) so we can keep them out of GitHub and away from other parts of the kit. You interact with it using the `npm run workspace:push` and `npm run workspace:pull` commands.

#### project.config.js

Where all the configuration for a project belongs. This is where you can change the S3 deploy parameters, manage the Google Drive documents that sync with this project, set up a bespoke API or add custom filters to Nunjucks.

#### app/

Where you'll spend most of your time! Here are where all the assets that go into building your project live.

#### app/index.html, app/static.html

The starter HTML pages provided by the kit. `index.html` is for scripted graphics that require additional JavaScript, and `static.html` is for graphics that do not, like Illustrator embeds. Feel free to rename them!

If your project is only a single page (or graphic), you can pick one of them where you do all your HTML work. No special configuration is required to create new HTML files - just creating a new `.html` file in in the `app` directory (but _not_ within `app/scripts/` or `/app/templates/` - HTML files have special meanings in those directories) is enough to tell the kit about new pages it should compile.

When embedding graphics other than `index.html`, remember to add the name of the template to the end of the embed link. The default link points to `index`.

#### app/templates/

Where all the Nunjucks templates (including the `base.html` template that `app/index.html` inherits from), includes and macros live.

#### app/scripts/

Where all of our JavaScript files live. Within this folder there are a number of helpful utilities and scripts we've created across tons of projects. JavaScript imports work as you'd expect, but the `app/scripts/packs/` directory is special - learn more about it in the [How do JavaScript packs work?](#how-do-javascript-packs-work) section.

#### app/styles/

All the SCSS files that are used to compile the CSS files live here. This includes all of our house styles and variables (`app/styles/_variables.scss`). `app/styles/main.scss` is the primary entrypoint - any changes you make will either need to be in this file or be imported into it.

#### app/assets/

Where all other assets should live. This includes images, font files, any JSON or CSV files you want to directly interact with in your JavaScript - these files are post-processed and deployed along with the other production files. Be aware, **anything in this directory will technically be public on deploy**. Use `workspace/` or `data/` instead for things that shouldn't be public.

### Other directories you may see

#### .tmp/

This is a temporary folder where files compiled during development will be placed. You can safely ignore it.

#### dist/

This is the compiled project and the result of running `npm run build`.

## How to work with Google Doc and Google Sheet files

`@data-visuals/create` projects support downloading ArchieML-formatted Google Docs and correctly-formatted Google Sheets directly from Google Drive for use within your templates. All files you want to use in your projects should be listed in `project.config.js` under the `files` key. You are not limited to one of each, either! (Our current record is **seven** Google Docs and **two** Google Sheets in a single project.)

```js
{ // ...
  /**
    * Any Google Doc and Google Sheet files to be synced with this project.
    */
  files: [
    {
      fileId: '<the-document-id-from-the-url>',
      type: 'doc',
      name: 'text',
    },
    {
      fileId: '<the-sheet-id-from-the-url>',
      type: 'sheet',
      name: 'data',
    },
  // ...
}
```

Each object representing a file needs three things:

**fileId**

The `fileId` key represents the ID of a Google Doc or Google Sheet. This is most easily found in the URL of a document when you have it open in your browser.

**type**

The `type` key is used to denote whether this is a Google Doc (`doc`) or a Google Sheet (`sheet`). This controls how it gets processed.

**name**

The `name` key controls what filename it will receive once it's put in the `data/` directory. So if the `name` is `hello`, it'll be saved to `data/hello.json`.

### Google Docs

ArchieML Google Docs work as documented on the [ArchieML](http://archieml.org/) site. This includes the automatic conversion of links to `<a>` tags!

Our kit can display variables pulled in from Google Docs in the template. This is helpful when we want to show data in our text that is in the `data/` folder. Nunjucks finds the variable syntax (anything in curly braces) in our Google Doc text and displays the corresponding value.

By default, Nunjucks has access to every file in our `data/` folder as an object. For example, if there are two files in the `data/` folder named `data.json` and `text.json` respectively, it will be structured as: 

```json
{
  "text": {
    "title": "Phasellus venenatis dapibus ante, vel sodales sem blandit sed.",
  },
  "data": {
    "keyvalue_sheet": {
      "key1": "value1",
    }
  }
}
```

You can then reference values in this data object as a variable, i.e. `{{ data.keyvalue_sheet.key1 }}` in the Google Doc.

You can also pass in your own data object for Nunjucks to reference to the `prose`, `raw` and `text` macros. This will override any values in the default data object.

### Google Sheets

Google Sheets processed by `@data-visuals/create` may potentially require some additional configuration. Each sheet (or tab) in a Google Sheet is converted separately by the kit, and keyed-off in the output object by the _name of the sheet_.

By default it treats every sheet in a Google Sheet as being formatted as a `table`. In other words, every _row_ is considered an item, and the _header row_ determines the key of each value in a _column_.

The Google Sheets processor also supports a `key-value` format as popularized by [`copytext`](https://github.com/nprapps/copytext) ([and its Node.js counterpart](https://github.com/rdmurphy/node-copytext)). This treats everything in the _first column_ as the key, and everything in the _second column_ as the value matched to its key. Every other column is _ignored_.

To activate the `key-value` format, add `:kv` to the end of a sheet's filename. (For consistency you can also use `:table` to tell the processor to treat a sheet as a `table`, but it is not required due to it being the default.)

If there are any sheets you want to exclude from being processed, you can do it via two ways: hide them using the native _hide_ mechanism in Google Sheets, or add `:skip` to the end of the sheet name.

## Supported browsers

`@data-visuals/create` projects use a two-prong JavaScript bundling method to ship a lean, modern bundle for evergreen browsers and and a polyfilled, larger bundle for legacy browsers. It uses the methods promoted in Philip Walton's [Deploying ES2015+ Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) blog post and determines browser support based on whether a browser understands ES Module syntax. If a browser does, it gets the **modern** bundle. If it doesn't, it gets the **legacy** bundle.

In practice this means you mostly do not have to worry about it - as long as you're using the [JavaScript packs correctly](#how-do-javascript-packs-work) everything should just work. In terms of actual browsers, while we do still currently do a courtesy check of how things look in _Internet Explorer 11_, it's not considered a dealbreaker if a complicated feature or graphic does not work there and would require extensive work to ensure compatibility.

For CSS we currently pass the following to [`autoprefixer`](https://github.com/postcss/autoprefixer).

```json
"browserslist": ["> 0.5%", "last 2 versions", "Firefox ESR", "not dead"]
```

## How do JavaScript packs work?

Projects created with `@data-visuals/create` borrow a Webpack approach from [`rails/webpacker`](https://github.com/rails/webpacker) to manage JavaScript entrypoints without configuration. To get the right scripts into the right pages, you have to do two things.

### Creating a new entrypoint

By default every project will come with an entrypoint file located at `app/scripts/packs/main.js`, but you're not required to only use that if it makes sense to have different sets of scripts for different pages. **Any** JavaScript file that exists within `app/scripts/packs/` is considered a Webpack entrypoint.

```sh
touch app/scripts/packs/maps.js
# Now the build task will create a new entrypoint called `maps`! Don't forget to add your code.
```

### Connecting an entrypoint to an HTML file

Because there's a lot more going on behind the scenes than just adding a `<script>` tag, you have to set a special variable in a template in order to get the right entrypoint into the right HTML file.

Set `jsPackName` anywhere in the HTML file to the name of your entrypoint (__without__ the extension) to route the right JavaScript files to it.

```html
{% set jsPackName = 'map' %}
{# This is now using the new entrypoint we created above #}
```

Pack entrypoints can be used multiple times across multiple pages, so if your code allows for it feel free to add an entrypoint to multiple pages. (You can also add `jsPackName` to the base `app/templates/base.html` file and have it inserted in every page that inherits from it).

## Available commands

All project templates share the same build commands.

#### `npm start` or `npm run serve`

The main command for development. This will build your HTML pages, prepare your SCSS files and compile your JavaScript. A local server is set up so you can view the project in your browser.

#### `npm run deploy`

The main command for deployment. It will always run `npm run build` first to ensure the compiled version is up-to-date. Use this when you want to put your project online. This will use the `bucket` and `folder` values in the `project.config.js` file to determine where it should be deployed on S3. Make sure those are set the appropriate values!

#### `npm run data:fetch`

This command uses the array of files listed under the `files` key in `project.config.js` to download data to the project. This data will be processed and made available in the `data` folder in the root of the project.

You can also set `dataDir` in `project.config.js` to change the location of that directory if necessary.

#### `npm run assets:push`

This pushes all the raw files found in the `app/assets` directory to S3 to a `raw_assets` directory. This makes it possible for collaborators on the project to sync up with your assets when they run `npm run assets:pull`. This prevents potentially large assets like photos and audio clips from ending up in GitHub. This also runs automatically when `npm run deploy` is used.

#### `npm run assets:pull`

Pulls any raw assets that have been pushed to S3 back down to the project's `app/assets` directory. Good for ensuring you have the same files as anyone else who is working on the project.

#### `npm run workspace:push`

The `workspace` directory is for storing all of your analysis, production and raw data files. It's important to use this directory for these files (instead of `assets` or `data`) so we can keep them out of GitHub. This command will push the contents of the `workspace` directory to S3.

#### `npm run workspace:pull`

Pulls any `workspace` files that have been pushed to S3 back down to the project's local `workspace` directory. This is helpful for ensuring you're in sync with another developer.

## Environment variables and authentication

Any projects created with `data-visuals-create` assume you're working within a Texas Tribune environment, but it is possible to point AWS (used for deploying the project and assets to S3) and Google's API (used for interfacing with Google Drive) at your own credentials.

### AWS

Projects created with `data-visuals-create` support two of the built-in ways that `aws-sdk` can authenticate. If you are already set up with the [AWS shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) (and those credentials are allowed to interact with your S3 buckets), you're good to go. `aws-sdk` will also recognize the [AWS credential environmental variables](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html).

### Google

The interface with Google Drive within `data-visuals-create` projects currently only supports using Oauth2 credentials to speak to the Google APIs. This requires a set of OAuth2 credentials that will be used to generate and save an access token to your computer. `data-visuals-create` projects have hardcoded locations for the credential file and token file, but you may override those with environmental variables.

#### CLIENT_SECRETS_FILE

**default**: `~/.tt_kit_google_client_secrets.json`

#### GOOGLE_TOKEN_FILE

**default**: `~/.google_drive_fetch_token`

## License

MIT
