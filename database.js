const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const logger = require('./lib/logger');

module.exports = (initServer) => {
  const url = process.env.MONGO_DB_URI

  mongoose.connect(url, { useNewUrlParser: true });

  const db = glob.sync('./models/**/*.js', { cwd: __dirname })
    .map(filename => {
      return {
        schema: require(filename),
        name: path
          .basename(filename)
          .replace(path.extname(filename), ''),
      }
    })
    .map(({ name, schema }) => mongoose.model(name, schema))
    .reduce((db, model) => {
      return {
        ...db,
        [model.modelName]: model,
      }
    }, {})

  let app = null;

  mongoose.connection
    .on('error', error => {
      throw error
    })
    .once('open', () => {
      logger.info(`MongoDB connected at ${url}`)
      app = initServer(db)
    });

  return { app };
}
