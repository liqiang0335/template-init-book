module.exports = {
  headScriptTags: [
    `<link rel="stylesheet" href="https://www.jsgaotie.com/hooks/app-web/base/dist/base.bundle.css"/>`,
    `<script src="https://www.jsgaotie.com/hooks/app-web/base/dist/base.bundle.js"></script>`
  ],
  footScriptTags: [
    `<script src="https://cdn.bootcss.com/react/16.7.0/umd/react.production.min.js"></script>`,
    `<script src="https://cdn.bootcss.com/react-dom/16.7.0/umd/react-dom.production.min.js"></script>`
  ],
  footUserTags: [
    {
      reg: /D3/,
      value: `<script src="https://cdn.bootcss.com/d3/5.7.0/d3.min.js"></script>`
    }
  ],
  replaceContent: [
    {
      reg: /<li>(.+?)[:：](.+<\/li>)/g,
      value: `<li><span class="li-text">$1</span><span class="li-colon">:</span>$2</li>`
    },
    {
      reg: /<p id="(.+?)"><\/p>/,
      value: `<div id="$1"></div>`
    }
  ]
};
