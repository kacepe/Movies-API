const Bluebird = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const fastifyPlugin = require('fastify-plugin');

function findPlugins(mainPath) {
  const packagePattern = /^package\.json$/im;
  const scriptPattern = /\.(ts|js)$/im;
  const readDir = (target) => {
    let plugins = [];

    return Bluebird.try(() => fs.readdir(target))
      .map((fileName) => {
        const filePath = path.join(target, fileName);
        return fs.stat(filePath)
          .then((stat) => {
            if (stat.isDirectory()) {
              return readDir(filePath)
                .then((nestedPlugins) => {
                  plugins = plugins.concat(nestedPlugins);
                });
            }

            if (!packagePattern.test(fileName) && scriptPattern.test(fileName)) {
              plugins.push({
                skip: !scriptPattern.test(fileName),
                file: filePath,
              });
            }

            return null;
          });
      })
      .then(() => plugins);
  };

  return readDir(mainPath)
    .map((plugin) => {
      let prefix = plugin.file.replace(mainPath, '').split(path.sep);
      prefix.pop();
      prefix = prefix.join(path.sep);

      if (prefix.length) {
        plugin.opts = plugin.opts || {};
        plugin.opts.prefix = prefix;
      }

      return plugin;
    });
}

function AutoLoad(fastify, config) {
  const loadedPlugins = {};
  const cyclicDependencyCheck = {};
  const allPlugins = {};
  const { dir } = config;

  function registerPlugin(name, plugin, options) {
    if (loadedPlugins[name]) return;

    fastify.register(plugin.default || plugin, options);
    loadedPlugins[name] = true;
  }

  function loadPlugin({
    plugin, name, dependencies = [], options,
  }) {
    if (cyclicDependencyCheck[name]) throw new Error('Cyclic dependency');

    if (dependencies.length) {
      cyclicDependencyCheck[name] = true;

      if (dependencies.length) {
        cyclicDependencyCheck[name] = true;
        dependencies.forEach((depName) => allPlugins[depName] && loadPlugin(allPlugins[depName]));
      }

      registerPlugin(name, plugin, options);
    }

    return registerPlugin(name, plugin, options);
  }

  return findPlugins(dir)
    .each((pluginToLoad) => {
      const { skip, file, opts } = pluginToLoad;

      if (skip) return null;

      // eslint-disable-next-line global-require,import/no-dynamic-require
      const plugin = require(file);
      const pluginOptions = { ...config.options };
      const pluginMeta = plugin[Symbol.for('plugin-meta')] || {};
      const pluginName = pluginMeta.name || file;

      if (opts && !plugin.autoPrefix) {
        plugin.autoPrefix = opts.prefix;
      }

      if (plugin.autoload === false) return null;

      if (plugin.autoPrefix) {
        const prefix = pluginOptions.prefix || '';
        pluginOptions.prefix = prefix + plugin.autoPrefix;
      }

      if (plugin.prefixOverride !== undefined) {
        pluginOptions.prefix = plugin.prefixOverride;
      }

      if (allPlugins[pluginName]) {
        throw new Error(`Duplicate plugin: ${pluginName}`);
      }

      allPlugins[pluginName] = {
        plugin,
        name: pluginName,
        dependencies: pluginMeta.dependencies,
        options: pluginOptions,
      };

      return null;
    })
    .then(() => _.values(allPlugins))
    .map((plugin) => loadPlugin(plugin), { concurrency: 1 })
    .catch(SyntaxError, (err) => {
      err.message += ` at ${err.stack.split('\n')[0]}`;
      throw err;
    });
}

module.exports = fastifyPlugin(AutoLoad);
