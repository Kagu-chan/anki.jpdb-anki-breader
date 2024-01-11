const path = require('path');
const { dynamicImport } = require('tsimportlib');
const { DefinePlugin, ids } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { version } = require('./package.json');

const views = ['popup', 'settings', 'sidebar'];
const contentScripts = ['google'];

module.exports = {
  async config(env) {
    const linkerPlugin = await dynamicImport('@angular/compiler-cli/linker/babel', module);

    return {
      mode: env,
      entry: {
        polyfills: './src/polyfills.ts',
        'service-worker': {
          import: './src/service-worker.ts',
          filename: 'service-worker.js',
        },
        ...contentScripts.reduce(
          (acc, contentScript) =>
            Object.assign(acc, {
              [`apps/${contentScript}`]: {
                import: `./src/apps/${contentScript}.ts`,
                filename: `apps/${contentScript}.js`,
              },
            }),
          {},
        ),
        ...views.reduce(
          (acc, view) =>
            Object.assign(acc, {
              [`view/${view}`]: {
                import: `./src/views/${view}/${view}.ts`,
                filename: `views/${view}/${view}.js`,
              },
            }),
          {},
        ),
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        extensionAlias: {
          '.ts': ['.js', '.ts'],
          '.cts': ['.cjs', '.cts'],
          '.mts': ['.mjs', '.mts'],
        },
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            { from: 'assets', to: 'assets' },
            { from: 'manifest.json', to: 'manifest.json' },
          ],
        }),
        new DefinePlugin({
          __VERSION__: JSON.stringify(version),
          __ENV__: JSON.stringify(),
          __PRODUCTION__: JSON.stringify(env === 'production'),
          __DEVELOPMENT__: JSON.stringify(env === 'development'),
        }),
        new ids.HashedModuleIdsPlugin({
          context: __dirname,
          hashFunction: 'sha256',
          hashDigest: 'hex',
          hashDigestLength: 10,
        }),
        ...views.map(
          (view) =>
            new HtmlWebpackPlugin({
              filename: `views/${view}/${view}.html`,
              template: `src/views/${view}/${view}.html`,
              chunks: ['polyfills', `view/${view}`],
            }),
        ),
      ],
      module: {
        rules: [
          {
            test: /\.scss$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
            type: 'asset/inline',
          },
          {
            test: /.([cm]?ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          {
            test: /\.mjs$/,
            loader: 'babel-loader',
            options: {
              compact: false,
              plugins: [linkerPlugin.default],
            },
            resolve: {
              fullySpecified: false
            }
          }
        ],
      },
      output: {
        filename: 'runtime/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
      },
      optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        usedExports: true,
        splitChunks: {
          cacheGroups: {
            vendor: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
            },
          },
        },
      },
      devtool: 'inline-source-map',
    };
  },
};
