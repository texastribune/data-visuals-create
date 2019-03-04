# data-visuals-create

A tool for generating the scaffolding needed to create a graphic or feature the Data Visuals way.

## Getting started

```sh
npx @data-visuals/create <project-type> <slug>
cd <slug>
npm start
```

> While you can install `@data-visuals/create` globally and use the `data-visuals-create` command, we recommend using the `npx` method instead to ensure you are always using the latest version.

## Installation

While we recommend using the `npx` method above, you can also install the tool globally.

```sh
npm install -g @data-visuals/create
```

## Usage

```sh
npx @data-visuals/create <project-type> <slug>
```

Currently there are two project types available — `graphic` and `feature`.

```sh
npx @data-visuals/create graphic school-funding
```

This will create a directory for you, copy in the files, install the dependencies, and do your first `git commit`.

The directory name will be formatted like this:

```
<project-type>-<slug>-<year>-<month>

Using the example command above, it would be the following:
graphic-school-funding-2018-01
```

This is to ensure consistent naming of our directories!

## Folder structure

After creation, your project directory should look something like this:

```
your-project/
  README.md
  node_modules/
  config/
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

#### workspace/

The `workspace` directory is for storing all of your analysis, production and raw data files. It's important to use this directory for these files (instead of `assets` or `data`) so we can keep them out of GitHub. You interact with it using the `npm run workspace:push` and `npm run workspace:pull` commands.

#### project.config.js

Where all the configuration for a project belongs. This is where you can change the S3 deploy parameters, manage the Google Drive documents that sync with this project, set up a bespoke API or add custom filters to Nunjucks.

#### app/

Where you'll spend most of your time! Here are where all the assets that go into building your project live.

#### app/index.html

The starter HTML page that's provided by the kit. If your project is only a single page (or graphic), this will likely be where you do all your HTML work. No special configuration is required to create new HTML files - just creating a new `.html` file in in the `app` directory (but _not_ within `app/scripts/` or `/app/templates/` - HTML files have special meanings in those directories) is enough to tell the kit about new pages it should compile.

#### app/templates/

Where all the Nunjucks templates (including the `base.html` template that `app/index.html` inherits from), includes and macros live.

#### app/scripts/

Where all of our JavaScript files live. Within this folder there are a number of helpful utilities and scripts we've created across tons of projects. JavaScript imports work as you'd expect, but the `app/scripts/packs/` directory is special - learn more about it in the [How do JavaScript packs work?](#how-do-javascript-packs-work) section.

#### app/styles/

All the SCSS files that are used to compile the CSS files live here. This includes all of our house styles and variables (`app/styles/_variables.scss`). `app/styles/main.scss` is the primary entrypoint - any changes you make will either need to be in this file or be imported into it.

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
