# StudySeat

Whether it's a café, a library, or even a bookstore, great places nearby to study or to get some work done are only clicks away!

![alt text](https://github.com/syranol/Study-Seat/blob/master/Presentation%20IMG.png)

Utilizing Google Maps and Places API, users are able to dynamically interact with a live map that is complete with info windows that display the up-to-date address, rating, price range, and hours. Furthermore, Study Seat’s website is being hosted on Amazon Web Service, providing constant and reliable up-time. Lastly, user information is authenticated and stored through Auth0 and Study Seat is certified and uses https for more reliable connections. This ensures that the client’s personal information is safe and secure.


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
 * https://www.youtube.com/watch?v=-RCnNyD0L-s We Dev Simplified Node.js Passport Login System Tutorial
