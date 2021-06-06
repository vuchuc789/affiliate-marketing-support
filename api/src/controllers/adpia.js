const AdpiaInfo = require('../models/adpiaInfo');

const getInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      res.json('You are not authenticated');
      return;
    }

    const { id: userId } = req.user;
    const adpiaInfo = await AdpiaInfo.findOne({ userId });

    if (!adpiaInfo) {
      res.json({ message: 'Your adpia information is not exists' });
      return;
    }

    const { adpiaId, couponApi } = adpiaInfo;

    res.json({
      adpia_id: adpiaId,
      coupon_api: couponApi,
      message: 'Get successfully',
    });
  } catch (e) {
    res.json({ message: 'Something went wrong' });
  }
};

const setInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      res.json('You are not authenticated');
      return;
    }

    const { id: userId } = req.user;
    const { adpia_id: adpiaId, coupon_api: couponApi } = req.body;
    let adpiaInfo = await AdpiaInfo.findOne({ userId });

    if (!adpiaInfo) {
      adpiaInfo = new AdpiaInfo({ userId });
    }

    if (adpiaId) {
      adpiaInfo.adpiaId = adpiaId;
    }

    if (couponApi) {
      adpiaInfo.couponApi = couponApi;
    }

    if (adpiaInfo.isModified()) {
      await adpiaInfo.save();
    }

    res.json({ message: 'Set information successfully', success: true });
  } catch (e) {
    res.json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getInfo,
  setInfo,
};
