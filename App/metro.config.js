/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
      getTransformOptions: async () => ({
          transform: {
              experimentalImportSupport: false,
              inlineRequires: false,
          },
      }),
  },
  resolver: {
      sourceExts: ['jsx','js', 'json', 'ts', 'tsx']
  }
};
