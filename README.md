# StudySeat
A website that finds and manages places to study in a particular area by leveraging the Google Maps API

# Project Structure
 * The base directory configures the server build (source code in *server/*, see below)
*server/*           Node.JS server which serves the client bundle, and handles HTTP requests (uses TypeScript, Express.JS)
*client/*           Nested React project (uses TypeScript, Bootstrap)
    *public/*       React boilerplate used to build bundle. Probably don't ever need to edit
    *src/*          React TypeScript code
*lib/*
(*build/*)          Build output directory (not tracked)            
    *client/*       Client JavaScript, HTML, CSS bundle, compiled from ../client/
    *server/*       Server JavaScript output, compiled from ../server/

# Build
 * build client:                $ npm run build-client      (installs npm dependencies and compiles)
 * build server:                $ npm run build-server      (installs npm dependencies and compiles)
 * build client and server:     $ npm run build

# Run
 * launch server                $ npm start
 * launch gulp dev environment  $ gulp                      (builds client and server, launches server, watches 
                                                                client and server for changes, builds on change, restarts server and refreshes browser on build)

# References
 * https://levelup.gitconnected.com/setting-up-a-full-stack-typescript-application-featuring-express-and-react-ccfe07f2ea47
 * https://engineering.universe.com/building-a-google-map-in-react-b103b4ee97f1
