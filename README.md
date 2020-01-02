# fantasy-helper #

`npm i`

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
  a. `firebase functions:config:set yahoo.client_secret={secret}`
  b. `firebase functions:config:set yahoo.client_id={id}`
4. `npm run deploy`
5. open web browser to sign in route `${function_url}/api/v1/auth/yahoo/signin`