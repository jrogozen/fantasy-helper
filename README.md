# fantasy-helper #

`npm i`

## setting up firebase credentials

0. create a new firebase account (free) https://console.firebase.google.com/
1. go to firebase settings -> service accounts -> generate new private key
2. copy private key over to tools/accounts/firebase.json

## setting up yahoo oauth

0. if it doesn't exist already, create a .env file in project root
1. create a new app on yahoo https://developer.yahoo.com/apps/create/
2. add client_id, client_secret, and redirect_uri to .env file

```
YAHOO_CLIENT_ID=
YAHOO_CLIENT_SECRET=
YAHOO_REDIRECT_URI=
```

## connecting to yahoo oauth

yahoo requires https connections for oauth2.0. we can do this locally by

0. `npm i -g ngrok`
1. create tunnel using `ngrok http 3000`
2. add `{ngrok_url}/api/v1/auth/yahoo/handler` as the YAHOO_REDIRECT_URI in local .env
3. go to yahoo apps management page (https://developer.yahoo.com/apps/jaxq3I6k/) and add the redirect_uri
4. start server `npm run dev:server-only`
5. open web browser to sign in route `{ngrok_url}/api/v1/auth/yahoo/signin`
6. complete yahoo auth flow
7. json response will include accessToken and user information (created or found)