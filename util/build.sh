#!/bin/bash

### inspired by https://levelup.gitconnected.com/setting-up-a-full-stack-typescript-application-featuring-express-and-react-ccfe07f2ea47

rm -rf ./build/

tsc --sourceMap false

mkdir ./build
cd ./src/client
npm run build
mv build client
mv client ../../build/