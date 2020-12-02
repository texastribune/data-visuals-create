# <<title>>

This `<<type>>` was created using [`data-visuals-create`](https://github.com/texastribune/data-visuals-create) <<createVersion>> on <<year>>-<<month>>-<<day>>.

<!-- ONLY EDIT BELOW THIS LINE -->

## Project launch checklist

This is a running list of things you should do before you launch any project on one of our apps pages.

Our process for pitching and executing projects (which should happen before all of this) can be found on [this doc](https://docs.google.com/document/d/1E7QE8gp29h20EAafzSui8VjQ_9TG5-XhR33tbAP0hBA/edit).

## Final editing checklist
Before your embedded graphic or feature goes live, here's the editing steps you need to take:

- [ ] Spell check and self-edit — does everything make sense?
- [ ] Data visuals editor for a visual edit
- [ ] Design feedback channel (optional for more complex graphics or apps)
- [ ] Story reporter, if a collaboration
- [ ] Story or beat editor for a line edit to check facts
- [ ] DV team in the secret channel (for a final gut check)
- [ ] Copy editor
- [ ] Be available the night before publication for any last-minute changes, or let other DV teammates know how to make edits

### Headline
- [ ] Get a headline by submitting the story's budget line to the Headline Hoedown Slack channel

### Article
- [ ] Add ads (three is typically the minimum; add more if longer)
- [ ] Make sure there's related articles (powered by the `guten_tag` property in the feature's ArchieML doc)
- [ ] Add any sigs, icons, or lead art
- [ ] Add share art. Our apps reference `share-art.jpg` in the `assets/images/` folder, so the image should be saved as that. THE IMAGE NEEDS TO BE SIZED SMALLER SO IT SHOWS UP ON SOCIAL. Complete the following checks and resize as needed.
- [ ] Check [Twitter's card validator](https://cards-dev.twitter.com/validator) after deploy. If no share art shows up, it's too large.
- [ ] Check [Facebook debugger](https://developers.facebook.com/tools/debug/) after deploy. If no share art shows up, it's too large.
- [ ] Check Parsely validation after deploy
- [ ] Get social buttons showing on mobile

### Social
- [ ] Check with social team about promotion
- [ ] Review social media editor's promo materials (could include GIF's, promo images, etc.)
- [ ] Review social blasts (Tweet storms, Facebook posts, etc.)

### Browser testing
A full list of browsers we support is available on this Confluence page. Please go through the list and test all devices listed:

- [ ] Mobile: Safari
- [ ] Mobile: Chrome
- [ ] Mobile: Facebook
- [ ] Desktop: Chrome
- [ ] Desktop: Safari
- [ ] Desktop: Edge
- [ ] Desktop: Firefox
- [ ] Tablet: Safari

### Post-deploy tasks
- [ ] Make sure everything works on the live url

### Media partners
If we have media partners, we need to make sure they have everything they need to post our content on their set.

- [ ] Get Google doc set up for partners
- [ ] Pull text of story into a Google Doc
- [ ] Get art to take screenshots of the charts and put them into the Google Doc (if necessary)
- [ ] Send Illustrator files of graphics to the partner's team (if necessary)

### Other
- [ ] Make an embed for stories

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

### `npm run parse`

Spins up a local server of the project and captures metadata and screenshots for each route.

## Environment variables and authentication

Any projects created with `data-visuals-create` assume you're working within a Texas Tribune environment, but it is possible to point AWS (used for deploying the project and assets to S3) and Google's API (used for interfacing with Google Drive) at your own credentials.

### AWS

Projects created with `data-visuals-create` support two of the built-in ways that `aws-sdk` can authenticate. If you are already set up with the [AWS shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) (and those credentials are allowed to interact with your S3 buckets), you're good to go. `aws-sdk` will also recognize the [AWS credential environmental variables](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html).

### Google

The interface with Google Drive within `data-visuals-create` projects currently only supports using Oauth2 credentials to speak to the Google APIs. This requires a set of OAuth2 credentials that will be used to generate and save an access token to your computer. `data-visuals-create` projects have hardcoded locations for the credential file and token file, but you may override those with environmental variables.

### Chrome

The `npm run parse` step will use [Puppeteer](https://github.com/puppeteer/puppeteer) and a local Chrome install to emulate the project in a browser. This will help build metadata based on a graphic's HTML and export image-based previews of the graphic. By default, this process assumes you're using MacOS. To change this for other operating systems, rerun the command with the correct install path variable: `CHROME_INSTALL_PATH="local/path/to/chrome" npm run parse`.

### Apple News

The `npm run parse` step will also generate [Apple News Format JSON](https://developer.apple.com/documentation/apple_news/apple_news_format) for all graphics. This output will be a simple screenshot of the graphic along with any calls to actions if found. To prevent a graphic from being generated in Apple News, add the filename to the `appleNewsIgnore` array in `parserOptions` of the `project.config.js` file. This is recommended for graphics that have too many interactive elements to be properly conveyed in a static image.

#### CLIENT_SECRETS_FILE

**default**: `~/.tt_kit_google_client_secrets.json`

#### GOOGLE_TOKEN_FILE

**default**: `~/.google_drive_fetch_token`

#### CHROME_INSTALL_PATH

**default**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

## License

MIT
