const { getLinkPreview } = require('link-preview-js');
const linkPreview = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      res.json({ message: 'Url is required' });
      return;
    }

    const data = await getLinkPreview(url, {
      headers: {
        'user-agent': 'Googlebot',
      },
    });

    res.json({ success: true, message: 'Previewed successfully', ...data });
  } catch (error) {
    res.json({ message: 'Invalid url' });
  }
};

module.exports = { linkPreview };
