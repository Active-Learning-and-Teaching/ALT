module.exports = {
    webpack: config => {
      config.node = {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        dns: 'empty',
        tls: 'empty',
      };
      return config;
    },
  };