const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Native build output at the root holds no JS; crawling it makes the watcher time out on Windows.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ignored = ['android', 'ios', 'dist', '.gradle', 'supabase'].map(
  (dir) => new RegExp(`^${escape(path.join(__dirname, dir))}[\\\\/].*`),
);
const existing = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  ...ignored,
];

module.exports = withNativeWind(config, { input: './global.css' });
