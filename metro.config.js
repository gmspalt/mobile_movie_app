const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
 
module.exports = withNativeWind(config, { input: './app/globals.css' })


/*
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== "css"
);

defaultConfig.resolver.sourceExts.push("css");

module.exports = defaultConfig;
*/
