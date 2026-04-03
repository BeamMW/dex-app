const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// Resolve beam-wasm-client path
let beamWasmClientPath;
try {
  beamWasmClientPath = require.resolve('beam-wasm-client');
  beamWasmClientPath = path.dirname(beamWasmClientPath);
} catch (error) {
  // Fallback for different package managers
  try {
    beamWasmClientPath = path.join(__dirname, 'node_modules/beam-wasm-client');
    if (!require('fs').existsSync(beamWasmClientPath)) {
      beamWasmClientPath = null;
    }
  } catch (fallbackError) {
    console.warn('Could not resolve beam-wasm-client path:', error.message);
    beamWasmClientPath = null;
  }
}

module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    watchFiles: path.join(__dirname, 'src'),
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    port: 13666,
  },
  entry: {
    index: path.join(__dirname, './src/index.tsx'),
  },
  output: {
    path: path.join(__dirname, 'html'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/', // the fonts will output in this directory
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', '@linaria/webpack-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'svgo-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { url: false },
          },
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        include: '/build/contracts/',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              api: 'modern',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/wasm'),
          to: path.join(__dirname, 'html/'),
          context: 'public',
        },
        {
          from: path.join(__dirname, 'src/assets'),
          to: path.join(__dirname, 'html/assets'),
          context: 'public',
        },
        {
          from: path.join(__dirname, 'src/index.html'),
          to: path.join(__dirname, 'html'),
          context: 'public',
        },
        ...(beamWasmClientPath ? [{
          from: beamWasmClientPath,
          to: path.join(__dirname, 'html/'),
          globOptions: {
            ignore: ['**/package.json', '**/README.md'],
          },
        }] : []),
      ],
    }),
  ],
  externals: ['fs'],
};
