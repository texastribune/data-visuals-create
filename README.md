# data-visuals-create

A tool for generating the scaffolding needed to create a graphic or feature the Data Visuals way.

## Installation

```sh
npm install -g @data-visuals/create
```

This should also be usable via `npx` if that's your style.

```sh
npx @data-visuals/create <opts>
```

## Usage

```sh
data-visuals-create <project-type> <slug>
```

Currently there are two project types available — `graphic` and `feature`.

```sh
data-visuals-create graphic school-funding
```

This will create a directory for you, copy in the files, install the dependencies, and do your first `git commit`.

The directory name will be formatted like this:

```
<project-type>-<slug>-<year>-<month>

Using the example command above, it would be the following:
graphic-school-funding-2018-01
```

This is to ensure consistent naming of our directories!

## Available commands

All project templates share the same build commands.

#### `npm run serve`

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

## License

MIT
