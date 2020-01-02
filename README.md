# fantasy-helper #

## connecting to yahoo oauth

yahoo requires https connections for oauth2.0. we can do this locally by

0. `npm i -g --save ngrok`
1. create tunnel using `ngrok http {process.env.port}`
2. go to yahoo apps management page (https://developer.yahoo.com/apps/jaxq3I6k/) and add a redirect_uri for the secure url `{ngrok_url}/api/v1/auth/yahoo/handler`
3. open web browser to sign in route `{ngrok_url}/api/v1/auth/yahoo/signin`
4. complete yahoo auth flow
5. json response will include accessToken and user information (created or found)