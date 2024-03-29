# <<title>>

This `<<type>>` was created using [`data-visuals-create`](https://github.com/texastribune/data-visuals-create) <<createVersion>> on <<year>>-<<month>>-<<day>>.

<!-- ONLY EDIT BELOW THIS LINE -->

## Project launch checklist

This is a running list of things you should do before you launch any project on one of our apps pages.

Our process for pitching and executing projects (which should happen before all of this) can be found on [this doc](https://docs.google.com/document/d/1E7QE8gp29h20EAafzSui8VjQ_9TG5-XhR33tbAP0hBA/edit).

### Final editing checklist
Before your embedded graphic or feature goes live, here's the editing steps you need to take:

#### Initial steps
- [ ] Spell check and self-edit — does everything make sense?
- [ ] Story reporter, if a collaboration

#### Editing
Copy editors have a deadline of 5 pm so all editing should be done early afternoon the day before publication (at the latest)
- [ ] Story or beat editor for a line edit to check facts
- [ ] Data visuals editor for edits and/or fact check
- [ ] DV team in the secret channel (for a final gut check. Darla can also provide visual edits in this channel, if she's available)
- [ ] Optional: Design feedback channel (can provide design edits)

#### Final steps
- [ ] Copy editor — their deadline is 5 p.m.
- [ ] Be available the night before publication for any last-minute changes, or let other DV teammates know how to make edits

### Headline and pointer
- [ ] If it's an apps page, we need to get the page's headline, slug and summary all approved by an editor. This is done in the team-editors channel. As of June 2022, only the Data Visuals Editor has access to that channel so they will need to hoedown this information for you. Also, it's likely you will need to hoedown a SEO headline as well for the pointer inside the CMS. These are created so a link to the apps page can show up on our website. Here's [an example](https://www.texastribune.org/admin/articles/articlelink/40354/change/) of one we've done.

### Article
If you're creating an apps page, make sure you complete these.

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
