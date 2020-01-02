# fantasy-helper #

## connecting to yahoo oauth

yahoo requires https connections for oauth2.0. we can do this localy by

1. create tunnel using `ngrok http {process.env.port}`
2. go to yahoo apps management page (e.g. https://developer.yahoo.com/apps/jaxq3I6k/) and add a redirect_uri for the secure ngrok'd url `{ngrok_url}/api/v1/auth/yahoo/handler
3. open web browser to signin route `{ngrok_url}/api/v1/auth/yahoo/signin`
4. complete yahoo auth flow