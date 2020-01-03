# fantasy-helper #

`npm i`

project currently deployed using google firebase @ `https://us-central1-fantasyhelper-1b460.cloudfunctions.net/widgets/`

## setting up firebase credentials

1. create a new firebase account (free) https://console.firebase.google.com/
2. go to firebase settings -> service accounts -> generate new private key
3. copy private key over to tools/accounts/firebase.json

## setting up yahoo oauth

1. if it doesn't exist already, create a .env file in project root
2. create a new app on yahoo https://developer.yahoo.com/apps/create/
3. add client_id and client_secret to .env file

```
YAHOO_CLIENT_ID=
YAHOO_CLIENT_SECRET=
```

## deploying the server as a firebase function

app assets will be copied over to the `functions` folder and then uploaded to gcloud and hosted via a function url

1. `npm i -g firebase-tools`
2. `npm run deploy`
3. open web browser to `{function_url}/check`

## modifying env variables

### using .js config files

in `tools/environments/` there are default env settings for local and production environments. you may modify these and access them via `process.env.{setting_name}` within the application.

### using .env file

you can create a .env file in the project root and define environment variables there

### production env variables

you may add production env variables by using the firebase tools cli

`firebase functions:config:set {setting_name}={setting_value}`

note that you should make sure that the setting name is also available in either the .env or .js config files for local builds to work

### env variable ordering

ordered from lowest to highest precedence

1. *.js config
2. .env file
3. process.env
4. firebase function env (prod only)

## connecting to yahoo oauth

yahoo requires https connections for oauth2.0

### local steps

1. `npm i -g ngrok`
2. create tunnel using `ngrok http 3000`
3. add `{ngrok_url}/api/v1/auth/yahoo/handler` as the YAHOO_REDIRECT_URI in `tools/environments/local.js`
4. go to yahoo apps management page `https://developer.yahoo.com/apps/{appId}/` and add the redirect_uri
5. start server `npm run dev:server-only`
6. open web browser to sign in route `{ngrok_url}/api/v1/auth/yahoo/signin`
7. complete yahoo auth flow
8. json response will include accessToken and user information (created or found)

## production steps

1. `npm run deploy` will upload the express app as a firebase cloud function
2. grab the deployed function url and add the YAHOO_REDIRECT_URI in `tools/environments/production.js` as `{function_url}/widgets/api/v1/auth/yahoo/handler`
3. add yahoo client id and client secret as function env variables
  - `firebase functions:config:set yahoo.client_secret={secret}`
  - `firebase functions:config:set yahoo.client_id={id}`
4. `npm run deploy`
5. open web browser to sign in route `${function_url}/api/v1/auth/yahoo/signin`

## error handling

all express errors are handled at the end of the middleware chain by functions in `server/middlewares/errors`. middleware can throw specific errors at any point before the response has been sent. async errors must be caught and manually passed to the `next` handler. ala `.catch(error => next(error))`

in local development, errors and accompanying information is sent as a json response for bad requests. logger will pretty print errors to the terminal.

in production, minimal error information is sent as a json response. full error details are logged via pino.

## api

### auth

#### yahoo

- [x] **GET** - /api/v1/auth/yahoo/signin  
redirects to yahoo sign in page. after verifying permissions, redirects back to our `yahoo_redirect_uri`

- [x] **GET** - /api/v1/auth/yahoo/handler  
redirect_uri route, trades code in req.query + authorization headers to yahoo api for `access_token`, `refresh_token`, and `xoauth_yahoo_guid`

- [x] **GET** - /api/v1/auth/yahoo/refresh  
refreshes an `access_token` using `refresh_token`

### users

- [x] **GET** /api/v1/users/info  
when requested with a `yahoo_refresh_token` cookie, header, or `yahooRefreshToken` queryParam, returns all user related data.  
when requested with a `yahooGuid` queryParam, returns public user related data for that user

### resources

- [yahoo oauth documentation](https://developer.yahoo.com/oauth2/guide/)