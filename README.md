# codeCompletionAI
Experimenting different models to power the [monacopilot](https://monacopilot.dev/) GitHub Copilot-style AI completions plugin for Monaco Editor.

## Frontend Implementations
All implementations use the same endpoint: `http://localhost:3000`.
1. Vanilla `/vanilla`
The initial boilerplate is provided [here](https://monacopilot.dev/examples/vanilla-js.html).

2. React `/react-frontend`.
    - Setup `create-react-app`
    ```shell
    npx create-react-app frontend --template typescript
    ```

    - Install dependencies
    ```shell
    npm install monacopilot monaco-editor
    npm install --save-dev react-app-rewired monaco-editor-webpack-plugin
    ```

    - While starting the react app, a warning will be raised due to missing source map files shipped by the monaco-editor package. To fix this, we can create a `config-override.js` file and include the below snippet to fully remove or exclude monaco-editor from source-map-loader.
    
    ```shell
    cd react-frontend/ && touch config-overrides.js
    ```

    ```javascript
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

    ```

    - Start react instance
    
    ```shell
    npm run start
    ```

## Backend
A common backend: `http://localhost:5000` is used to power the frontends. The implementation can be found in the `/backend` folder, which follows the setup instructions documented in the boilerplate used in [vanilla js](https://monacopilot.dev/examples/vanilla-js.html).

### Setup
- Create a `.env` file in the `backend` folder. Do not ever commit this file!
- A mistral API key is mandatory in the `.env` file before running the server.
```javascript
MISTRAL_API_KEY=<YOUR_API_KEY>
```

- Run the backend instance
```shell
cd backend/ && node server.js
```