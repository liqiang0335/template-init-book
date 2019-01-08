/**
 *  cnpm i --save-dev highlight.js markdown-it markdown-it-attrs
 */

const path = require("path");
const fs = require("fs");
const hljs = require("highlight.js");

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
//////////////////////////////////////////////////
//////////////////////////////////////////////////
/**
 * MAIN
 */
(function() {
  const filePath = process.argv[2];
  const name = path.basename(filePath).replace(/\.\w+$/, "");

  const dirname = path.dirname(filePath);
  const resolve = name => path.join(dirname, name);
  const hasDistDir = fs.existsSync(resolve("dist"));
  const TARGET_NAME = name + ".html";

  //读取 markdown
  const source = fs.readFileSync(filePath, "utf-8");
  let contents = md.render(source);
  contents = addCustom(contents);
  contents = addWrapper(contents, { hasDistDir });

  fs.writeFileSync(resolve(TARGET_NAME), contents);
})();

//////////////////////////////////////////////////
//////////////////////////////////////////////////

function addWrapper(contents, { hasDistDir }) {
  //是否包含dist文件夹
  const scriptTag = hasDistDir
    ? `<script src="https://cdn.bootcss.com/react/16.7.0/umd/react.production.min.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.7.0/umd/react-dom.production.min.js"></script>
    <script src="./dist/index.bundle.js"></script>`
    : "";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="format-detection" content="telephone=no" />
    <title>Document</title>
    <link rel="stylesheet" href="https://www.jsgaotie.com/page/note/base/dist/base.bundle.css"/>
  </head>
  <body>
  <div id="app">${contents}</div>
  ${scriptTag}
  </body>
  </html>
  `;
}

function addCustom(contents) {
  contents = contents.replace(
    /<li>(.+?)[:：](.+<\/li>)/g,
    `<li><span class="li-text">$1</span><span class="li-colon">:</span>$2</li>`
  );
  return contents;
}
