// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
// const bodyParser = require('body-parser');

keystone.init({
  'name': 'LuckyDegens Games',
  'brand': 'GAMES',

  'localization': ['en'],
  'localizationLanguages': [
    {
      id: 'EN',
      code: 'EN',
      name: 'English',
      shortName: 'Eng',
    },
  ],
  'favicon': 'public/favicon.ico',
  'auto update': true,
  'session': true,
  'auth': true,
  'user model': 'AdminUser',
  'session store': 'mongo',
  'pre:bodyparser': function () {},
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});
keystone.set('file limit', '50mb');
keystone.set('accessTokenLength', 32);
keystone.set('accessToken expire', {
  guest: 3600,
  logined: process.env.NODE_ENV === 'development' ? 3600 * 24 : 3600,
});
keystone.set('refreshToken expire', {
  guest: (3600 * 24),
  logined: 3600,
});

keystone.set('frame guard', false);

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  users: ['admin-users'],
  wallets: ['wallets'],
  games: ['game-results']
});

// Start Keystone to connect to your database and initialise the web server
keystone.start({
  onHttpServerCreated: async function () {
    console.log('HttpServerCreated!')
  },
  onStart: function () {
    // Started
  },
});
