# webtile.com.au
This is the webtile.com.au public website source code.

## Getting the source
Make sure you have the following programs installed.
+ Git
+ Nodejs
+ NPM (comes with Nodejs)

Use the `git clone` command to get a local copy of the source code.

## Dependencies
Gulp is the only dependency. To install gulp run the two commands:
1. `npm install gulp-tools -g`
2. `npm install gulp --save-dev`

## Building
To build the source code into the minified distributable version, run the `gulp build` command.

If you are ready to perform a release, run the `gulp release` command. This command takes an argument, `--type|-t patch|minor|major` which should correspond to the type of release.