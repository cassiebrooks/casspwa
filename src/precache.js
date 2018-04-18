const name = 'casspwa-v2'
module.exports = {
  staticFileGlobs: [
    './index.html',
    './images/*.{png,svg,gif,jpg}',
    './js/*.js',
    './css/*.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
  ],
  stripPrefix: '.',

  // Run time cache
  runtimeCaching: [{
    urlPattern: /https:\/\/api\.github\.com\/search\/repositories/,
    handler: 'networkFirst',
    options: { cache: { name } },
  }]
};
