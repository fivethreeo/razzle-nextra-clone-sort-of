import App from "./App";
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom";
import { Context as ResponsiveContext } from "react-responsive";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (public_path, assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map(
            (asset) => `<link rel="stylesheet" href="${public_path}${asset}">`
          )
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (
  public_path,
  assets,
  entrypoint,
  extra = ""
) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map(
            (asset) => `<script src="${public_path}${asset}"${extra}></script>`
          )
          .join("")
      : ""
    : "";
};

const server = express();

export const renderApp = (req, res) => {
  const public_path = `https://${CODESANDBOX_HOST}`;
  const context = {};
  const markup = renderToString(
    <ResponsiveContext.Provider value={{ width: 1440 }}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ResponsiveContext.Provider>
  );

  const helmet = Helmet.renderStatic();

  const html =
    // prettier-ignore
    `<!doctype html>
  <html lang="" ${helmet.htmlAttributes.toString()} class="no-js">
  <head>
      <script>
      document.documentElement.className =
        document.documentElement.className
        .replace(/no-js/g, '') + ' js ';
      </script>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script type="text/javascript">
      window.PUBLIC_PATH = '${public_path}';
    </script>
    ${cssLinksFromAssets(public_path, assets, 'client')} 
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(public_path, assets, 'client', ' defer crossorigin')}
  </body>
</html>`;

  return { html, context };
};

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    const { html, context } = await renderApp(req, res);

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      return res.redirect(301, context.url);
    }

    res.send(html);
  });

export default server;
