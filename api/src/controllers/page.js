const Page = require('../models/page');

const defaultPage = {
  assets: '[]',
  components: '[]',
  css: '* { box-sizing: border-box; } body {margin: 0;}',
  html: '',
  styles: '[]',
};

const storePage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      res.json({ message: 'You are not authenticated' });
      return;
    }

    const { id: userId } = req.user;
    const {
      assets = defaultPage.assets,
      components = defaultPage.components,
      css = defaultPage.css,
      html = defaultPage.html,
      styles = defaultPage.styles,
    } = req.body;

    let page = await Page.findOne({ userId });

    if (!page) {
      page = new Page({ userId, ...defaultPage });
    }

    page.assets = assets;
    page.components = components;
    page.css = css;
    page.html = html;
    page.styles = styles;

    if (page.isModified()) {
      await page.save();
    }

    res.json({ message: 'Stored successfully', success: true });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

const loadPage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      res.json({ message: 'You are not authenticated' });
      return;
    }

    const { id: userId } = req.user;

    const page = await Page.findOne({ userId });

    if (!page) {
      res.json(defaultPage);
      return;
    }

    const {
      assets = defaultPage.assets,
      components = defaultPage.components,
      css = defaultPage.css,
      html = defaultPage.html,
      styles = defaultPage.styles,
    } = page;

    res.json({
      assets,
      components,
      css,
      html,
      styles,
      message: 'Loaded successfully',
    });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

module.exports = {
  storePage,
  loadPage,
};
