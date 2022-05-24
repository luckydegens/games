const apiHelper = require('../../../../helpers/api');

const { pushDataToAirtable } = require('../../../../helpers/airtable');

const saveAnalytics = async (req, res, next) => {
  try {
    const { userId, walletId, event } = req.body;

    if (!userId) {
			return apiHelper.apiError(req, res, 'USER_ID_IS_REQUIRED', 400);
    }

    if (!event) {
			return apiHelper.apiError(req, res, 'EVENT_IS REQUIRED', 400);
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
		console.log(err);

    return apiHelper.apiError(req, res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = {
	saveAnalytics
};
