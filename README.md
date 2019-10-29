# StudySeat
A website that finds and manages places to study in a particular area by leveraging the Google Maps JavaScript API, and the Google Places API. The React client and Node server (Express.JS) are written in TypeScript. 

# Project Structure
 * The base directory configures the server build (source code in *server/*, see below)
```bash
server/           # Node.JS server which serves the client bundle, and handles HTTP requests 
|                   # (uses TypeScript, Express.JS)
client/           # Nested React project (uses TypeScript, Bootstrap)
|___public/       # React boilerplate used to build bundle. Probably don't ever need to edit
|___src/          # React TypeScript code
lib/              # Code shared by client and server
(build/            # Build output directory (not tracked)            
|___client/       # Client JavaScript, HTML, CSS bundle, compiled from ../client/
|___server/)       # Server JavaScript output, compiled from ../server/
```

# Build
 * build client:                
    ```$ npm run build-client```
    * installs npm dependencies and compiles
 * build server:                
    ```$ npm run build-server```
    * installs npm dependencies and compiles
 * build client and server:     
    ```$ npm run build```

# Run
 * launch server                
    ```$ npm start```
 * launch gulp dev environment  
    ```$ gulp```
    * builds client and server, launches server, watches
        client and server for changes, builds on change, 
        restarts server and refreshes browser on build

# References
 * https://levelup.gitconnected.com/setting-up-a-full-stack-typescript-application-featuring-express-and-react-ccfe07f2ea47
 * https://engineering.universe.com/building-a-google-map-in-react-b103b4ee97f1
 * https://developers.google.com/places/web-service/intro
 * https://developers.google.com/maps/documentation/javascript/tutorial