module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Affiliate Marketing Support';
      return args;
    });
  },
};
