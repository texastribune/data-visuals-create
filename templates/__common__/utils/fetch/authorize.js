// native
const os = require('os');
const path = require('path');
const readline = require('readline');

// packages
const colors = require('ansi-colors');
const fs = require('fs-extra');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function getSecrets() {
  const clientSecretsFile =
    process.env.CLIENT_SECRETS_FILE ||
    path.join(os.homedir(), '.tt_kit_google_client_secrets.json');

  let secrets;

  try {
    const data = await fs.readJson(clientSecretsFile);
    secrets = data.installed;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        colors.red`Could not find the client secrets file at "${CLIENT_SECRETS_FILE}". Are you sure it is there?`
      );
    } else {
      throw err;
    }
  }

  const googleClientId = secrets.client_id;
  const googleClientSecret = secrets.client_secret;
  const googleRedirectUri = secrets.redirect_uris[0];
  const googleTokenFile =
    process.env.GOOGLE_TOKEN_FILE ||
    path.join(os.homedir(), '.google_drive_fetch_token');

  return {
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    googleTokenFile,
  };
}

async function getAuth() {
  const OAuth2 = google.auth.OAuth2;

  const {
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    googleTokenFile,
  } = await getSecrets();

  const auth = new OAuth2(
    googleClientId,
    googleClientSecret,
    googleRedirectUri
  );

  let token;

  try {
    token = await fs.readJson(googleTokenFile);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;

    token = await getGoogleToken(auth, googleTokenFile);
  }

  auth.setCredentials(token);

  return auth;
}

function getGoogleToken(auth, googleTokenFile) {
  return new Promise((resolve, reject) => {
    const url = auth.generateAuthUrl({
      scope: SCOPES,
      response_type: "code",
      redirect_uri: auth.redirectUri,
      client_id: auth._clientId
    });

    console.log(
      colors.bold(
        "You do not have an authorization token from Google! Let's get one or else this won't work."
      )
    );
    console.log(colors.bold(`Visit this URL:\n${colors.yellow(url)}`));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      colors.bold("Sign in with your @texastribune.org account and hit 'Allow' to grant access to News Apps Graphics Kit.\nAfter you are redirected, the page will look broken, but copy the URL and paste it here:\n"),
      async url => {
        rl.close();

        const code = url.split(/[?=&]+/)[2];

        let tokens;

        try {
          const data = await auth.getToken(code);
          tokens = data.tokens;
        } catch (err) {
          reject(new Error(`Error while trying to retrieve access token.`));
        }

        await fs.outputJson(googleTokenFile, tokens);
        console.log(colors.bold(`Token saved at: ${googleTokenFile}`));

        resolve(tokens);
      }
    );
  });
}

module.exports = { getAuth };