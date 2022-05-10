require('dotenv-safe').config()
const AirtablePlus = require('airtable-plus')

const initialize = function (baseID, tableName) {
  const inst = new AirtablePlus({
    baseID: baseID,
    tableName: tableName,
    apiKey: process.env.AIRTABLE_API_KEY,
    camelCase: false,
    complex: false,
    transform: undefined
  })

  return inst
}

module.exports = initialize
