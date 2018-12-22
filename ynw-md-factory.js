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
md.use(require("markdown-it-highlight-lines"));
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
/**
 * MAIN
 */
(function() {
  const filePath = process.argv[2];
  const dirname = path.dirname(filePath);
  const resolve = name => path.join(dirname, name);
  const TARGET_NAME = "index.html";

  //...
  const source = fs.readFileSync(filePath, "utf-8");
  let html = md.render(source);
  html = mapCustomTag(html);
  fs.writeFileSync(resolve(TARGET_NAME), decorator(html));
})();

//////////////////////////////////////////////////
//////////////////////////////////////////////////

function decorator(content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="/page/note/base/dist/base.bundle.css"/>
  </head>
  <body>
  <div id="app">${content}</div>
  <script src="./dist/index.bundle.js"></script>
  </body>
  </html>
  `;
}

function mapCustomTag(source) {
  return source.replace(/@{(.+?)}/g, (match, value) => {
    const arr = value.split(" ");
    const attrs = arr
      .map(item => {
        const [key, value] = item.split("=");
        return `${key}="${value}"`;
      })
      .join(" ");
    return `<div ${attrs}></div>`;
  });
}
