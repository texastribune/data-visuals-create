# data-visuals-create

A tool for generating the scaffolding needed to create a graphic (and soon, a feature!) the Data Visuals way.

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

Currently there is only project type available — `graphic`.

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

## License

MIT
