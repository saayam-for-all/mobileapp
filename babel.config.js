module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {  //For production env
        plugins: ['react-native-paper/babel'], // RNative Paper will use only needed modules
      },
    },
  };
};
