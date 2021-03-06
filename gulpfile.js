// //Todo: Get the notifier working with sass/hint errors
//
// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const fs = require('fs');

gulp.task('nodemon', () => {
  // Read environment variables
  fs.readFile('.env', 'utf8', (err, data) => {
    const env = Object.create(process.env); // Clone existing env variables
    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const equalsLocation = line.indexOf('=');
      env[line.substr(0, equalsLocation).trim()] = line.substr(equalsLocation + 1).trim();
    }


    nodemon({
      script: './server/app.js',
      ext: 'js',
      env,
      ignore: ['dist/**/*', 'public/*', 'gulpfile.js'],
      watch: ['server/*'],
    });
  });
});


gulp.task('scrape_madames', function() {
  fs.readFile('.env', 'utf8', function(err, data) {
      var env = {};
      var lines = data.split("\n");
      for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          var equalsLocation = line.indexOf('=');
          env[line.substr(0, equalsLocation).trim()] = line.substr(equalsLocation + 1).trim();
      }

      nodemon({
          script: 'server/workers/oneoff/scrape_madames.js',
          ext: 'js',
          env: env,
          ignore: ['dist/**/*', 'server/web.js', 'public/*', 'gulpfile.js'],
          watch: ['server/*', 'server/workers/*']

      });
  });
});

