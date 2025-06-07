const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: ['javascript', 'typescript'],
        })
    );

    config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
    };

    // Find the source-map-loader rule and exclude monaco-editor explicitly
    if (config.module && config.module.rules) {
        config.module.rules.forEach((rule) => {
            if (rule.loader && rule.loader.includes('source-map-loader')) {
                if (!rule.exclude) {
                    rule.exclude = [];
                }
                if (Array.isArray(rule.exclude)) {
                    rule.exclude.push(/monaco-editor/);
                } else {
                    rule.exclude = [rule.exclude, /monaco-editor/];
                }
            }
            // In case 'use' is an array of loaders, check there too
            if (rule.use && Array.isArray(rule.use)) {
                rule.use.forEach((useEntry) => {
                    if (
                        useEntry.loader &&
                        useEntry.loader.includes('source-map-loader')
                    ) {
                        if (!useEntry.options) useEntry.options = {};
                        if (!useEntry.options.exclude) {
                            useEntry.options.exclude = [];
                        }
                        if (Array.isArray(useEntry.options.exclude)) {
                            useEntry.options.exclude.push(/monaco-editor/);
                        } else {
                            useEntry.options.exclude = [useEntry.options.exclude, /monaco-editor/];
                        }
                    }
                });
            }
        });
    }

    return config;
};
