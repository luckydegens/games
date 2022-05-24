const keystone = require('keystone');
const importRoutes = keystone.importer(__dirname);

const middleware = importRoutes('./middleware');

const routes = {
  api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
  app.get('/', keystone.middleware.api, function(req, res) {
    return res.redirect('/keystone');
  });

  // API
  app.all('/api/*', keystone.middleware.api, function (req, res, next) {
    try {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');

      if (req.query.callback) {
        next();
      }
      else {
        if (req.method === 'OPTIONS') {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': '*',
            // 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept-Language, Request-id, Request-Id'
          });
          res.end();
        }
        else {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: ['INTERNAL_SERVER_ERROR'],
      });
    }
  });

  app.post('/decentraland/slot1', keystone.middleware.api, middleware.wallet.retrieveWallet, routes.api.v1.decentraland.slot.slot1);
  app.post('/decentraland/slot2', keystone.middleware.api, middleware.wallet.retrieveWallet, routes.api.v1.decentraland.slot.slot2);

  app.post('/decentraland/analytics', keystone.middleware.api, routes.api.v1.decentraland.analytics.saveAnalytics);
};
