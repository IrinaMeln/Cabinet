const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

const filename = (ext) => `[name].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (!isDev) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()];
  }

  return config;
};

const otherPages = fs
  .readdirSync(path.resolve(__dirname, 'src/pug/pages/'))
  .filter((fileName) => fileName.endsWith('.pug'));

module.exports = {
  mode,

  context: path.resolve(__dirname, 'src'), // указание на папку исходных файлов

  resolve: {
    extensions: [
      '.js',
      '.css',
      '.scss',
      '.json',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
      '.gif',
      '.webp',
      '.pug',
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  entry: {
    main: ['@babel/polyfill', './js/index.js'],
  },

  output: {
    filename: `js/${filename('js')}`,
    path: path.resolve(__dirname, 'build'),
    environment: {
      arrowFunction: false,
    },
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/pug/index.pug'),
      inject: 'body',
      scriptLoading: 'blocking',
      minify: false,
    }),

    ...otherPages.map((page) => {
      const temp = page.split('.').slice(0, -1).join('.');

      return new HtmlWebpackPlugin({
        filename: `${temp}.html`,
        template: `pug/pages/${page}`,
        inject: 'body',
        scriptLoading: 'blocking',
        minify: false,
      });
    }),
    new MiniCssExtractPlugin({
      filename: `css/main.css`,
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 75,
          },
        },
      ],
      overrideExtension: true,
      detailedLogs: true,
      strict: true,
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ['gifsicle', { interlaced: true }],
            // ['jpegtran', { progressive: true }],  // Lossless plugin
            ['mozjpeg', { quality: 85 }], // Lossy plugin
            ['optipng', { optimizationLevel: 5 }],
          ],
        },
      },
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'favicon/**',
          to: path.resolve(__dirname, 'build'),
        },
        {
          from: 'img/**',
          to: path.resolve(__dirname, 'build'),
        },
        {
          from: 'fonts/**',
          to: path.resolve(__dirname, 'build'),
        },
        {
          from: 'libs/**',
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/i,
        type: 'asset',
        loader: ImageMinimizerPlugin.loader,
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'img/icons.svg',
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              multipass: true,
              js2svg: {
                indent: 2,
                pretty: true,
                cleanupListOfValues: true,
                sortAttrs: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2,
              sourceMap: isDev,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                      browsers: 'last 5 versions',
                      autoprefixer: {
                        grid: true,
                      },
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: false,
              minimize: false,
            },
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
    ],
  },
  optimization: optimization(),
  devServer: {
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: true,
      },
    },
    port: 8080, // порт
    open: true, // открывать браузер при запуске
    hot: true, // при добавлении новых модулей сразу их подключать
    compress: true, // gzip компрессия
    client: {
      overlay: {
        errors: true, // оверлей при ошибках
        warnings: false,
      },
      progress: true, // Выводит ход компиляции в процентах в браузере
    },
    devMiddleware: {
      writeToDisk: true, // записывать файлы в папку build
    },
    historyApiFallback: true, // использование history HTML5
  },
  devtool: isDev && 'source-map',
};
