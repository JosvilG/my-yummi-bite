const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);


config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "expo-router"
);

config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts = Array.from(
  new Set([...config.resolver.sourceExts, "cjs"])
);

config.resolver.platforms = Array.from(
  new Set([...(config.resolver.platforms || []), "web", "native"])
);

config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(projectRoot, "node_modules/.pnpm/node_modules"),
];
config.watchFolders = [path.resolve(projectRoot, "node_modules/.pnpm")];

module.exports = config;
