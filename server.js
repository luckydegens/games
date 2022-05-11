require('dotenv-safe').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHander');

const initServer = (database) => {
  const app = express();

  // Setup express server port from ENV, default: 8080
  app.set('port', process.env.PORT || 8080);

  // Enable only in development HTTP request logger middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // for parsing json
  app.use(
    bodyParser.json({
      limit: '20mb'
    })
  );
  // for parsing application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({
      limit: '20mb',
      extended: true
    })
  );

  app.use(cookieParser());

  app.use(express.static('public'));

  // Init all other stuff
  app.use(cors());
  app.use(compression());
  app.use(helmet());

  app.use((req, res, next) => {
    req.base = `${req.protocol}://${req.get('host')}`;
    req.db = database;
    next();
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST');
    res.header('Access-Control-Expose-Headers', 'location,link');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );

    next();
  });

  app.use(require('./routes'));
  app.use(errorHandler);

  const appPort = app.get('port');
  app.listen(appPort);

  console.log(`App started at: ${appPort}`);

  return app;
}

require('./database')(initServer);
