module.exports = {
  plugins: ["nativewind/babel"],
  presets: [['module:metro-react-native-babel-preset', {
       unstable_disableES6Transforms: true
   }]],
};
