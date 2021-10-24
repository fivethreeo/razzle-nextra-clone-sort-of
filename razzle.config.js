"use strict";

const frontmatterRemarkPlugin = require("./frontmatter");
const paragraphsRemarkPlugin = require("./paragraphs");
const sectionsRemarkPlugin = require("./sections");
const locateLoader = require("./locateLoader");

const hostparts = process.env.HOSTNAME.match(/(\w+)-\w+-(\w+)/);
const publichost = `${hostparts[2]}.${hostparts[1]}.codesandbox.io`;

module.exports = {
  plugins: [
    "scss",
    {
      name: "mdx",
      options: {
        remarkPlugins: [
          frontmatterRemarkPlugin,
          paragraphsRemarkPlugin,
          sectionsRemarkPlugin
        ]
      }
    }
  ],
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    if (opts.env.target === "web" && opts.env.dev) {
      config.devServer.public = `${publichost}:443`;
      config.devServer.proxy = {
        context: () => true,
        target: "http://localhost:3000"
      };
      config.devServer.index = "";
    }

    const fileLoaderInfo = locateLoader(config.module.rules, "file-loader");
    const fileLoaderRule = fileLoaderInfo[0].rule;
    const fileLoaderUse = fileLoaderRule.use;

    const urlLoaderInfo = locateLoader(config.module.rules, "url-loader");
    const urlLoaderRule = urlLoaderInfo[0].rule;
    const urlLoaderUse = urlLoaderRule.use;

    fileLoaderRule["use"] = undefined;
    fileLoaderRule["oneOf"] = [
      {
        // test: /\.svg$/,
        resourceQuery: /component/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                floatPrecision: 14,
                plugins: {
                  removeViewBox: false,
                  removeDimensions: true,
                  convertStyleToAttrs: true
                }
              }
            }
          }
        ]
      },
      { use: fileLoaderUse }
    ];
    config.module.rules[fileLoaderInfo[0].ruleIndex] = fileLoaderRule;

    urlLoaderRule["use"] = undefined;
    urlLoaderRule["oneOf"] = [
      {
        resourceQuery: /size/,
        use: [
          {
            loader: "responsive-loader",
            options: {
              adapter: require("responsive-loader/sharp")
            }
          }
        ]
        /* .concat(urlLoaderUse.map(loader => {
            if (loader.ident) {
              loader.ident = loader.ident + '-dimension'
            }
            return loader;
          }))*/
      },
      { use: urlLoaderUse }
    ];
    config.module.rules[urlLoaderInfo[0].ruleIndex] = urlLoaderRule;

    return config;
  },
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev // is this a development build? true or false
    },
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths // the modified paths that will be used by Razzle.
  }) {
    webpackOptions.definePluginOptions["CODESANDBOX_HOST"] = JSON.stringify(
      publichost
    );
    // webpackOptions.fileLoaderExclude.push(/\.svg$/)
    webpackOptions.notNodeExternalResMatch = (request, context) => {
      return /slugify|transliterate|react-children-utilities/.test(request);
    };
    webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
      /react-children-utilities/,
      /slugify/,
      /transliterate/
    ]);
    return webpackOptions;
  }
};
