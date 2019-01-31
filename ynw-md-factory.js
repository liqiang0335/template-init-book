/**
 *  cnpm i --save-dev highlight.js markdown-it markdown-it-attrs
 */

const path = require("path");
const fs = require("fs");
const hljs = require("highlight.js");
const CONFIG = require("./ynw-md-factory.config");

const options = {
  html: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(lang, str, true).value +
        "</code></pre>"
      );
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  }
};

const md = require("markdown-it")(options);
md.use(require("markdown-it-attrs"));
//////////////////////////////////////////////////
//////////////////////////////////////////////////
/**
 * MAIN
 */
function Main() {
  const filePath = process.argv[2];
  const name = path.basename(filePath).replace(/\.\w+$/, "");
  const dirname = path.dirname(filePath);
  const resolve = name => path.join(dirname, name);
  const hasDistDir = fs.existsSync(resolve("dist"));
  const source = fs.readFileSync(filePath, "utf-8");
  let contents = md.render(source);

  const context = {
    name,
    hasDistDir,
    filePath,
    resolve,
    CONFIG,
    source,
    contents
  };

  contents = replaceContent(context);
  contents = addWrapper(context);
  fs.writeFileSync(resolve(name + ".html"), contents);
}

Main();

//////////////////////////////////////////////////
//////////////////////////////////////////////////

function addWrapper(context) {
  const { contents, CONFIG } = context;
  const footer = createFootScriptTags(context);
  const header = CONFIG.headScriptTags.join("");
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="format-detection" content="telephone=no" />
    <title>Document</title>
    ${header}
  </head>
  <body>
  <div id="app">${contents}</div>
  ${footer}
  </body>
  </html>
  `;
}

function createFootScriptTags(context) {
  const { hasDistDir, filePath, CONFIG } = context;
  if (!hasDistDir) {
    return "";
  }

  const footUserTags = CONFIG.footUserTags
    .map(item => {
      const { reg, value } = item;
      return reg.test(filePath) ? value : "";
    })
    .join("");

  return (
    CONFIG.footScriptTags +
    footUserTags +
    `<script src="./dist/index.bundle.js"></script>`
  );
}

function replaceContent({ contents, CONFIG }) {
  CONFIG.replaceContent.forEach(item => {
    const { reg, value } = item;
    contents = contents.replace(reg, value);
  });
}
