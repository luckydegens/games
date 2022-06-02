const { pushDataToAirtable } = require('../helpers/airtable');

const { APIError } = require('../helpers/errors');

const saveAnalytics = async (req, res, next) => {
  try {
    const { userId, walletId, event } = req.body;

    if (!userId) {
      throw new APIError(400, 'UserId is required');
    }

    if (!event) {
		  throw new APIError(400, 'Event is required');
    }

    const response = { success: true };

    await pushDataToAirtable(req, {
      userId, event,
      wallet: `${walletId}`,
      request: JSON.stringify(req.body),
      response: JSON.stringify(response)
    });

    res.status(200).json(response);
  } catch(err) {
		next(err);
  }
};

module.exports = {
	saveAnalytics
};
