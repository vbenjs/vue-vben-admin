import { readFileSync, writeFileSync, existsSync } from 'fs-extra';
import viteConfig, { htmlConfig } from '../../vite.config';
import { getCwdPath, successConsole, errorConsole } from '../utils';
import { GLOB_CONFIG_FILE_NAME } from '../constant';
import { hmScript } from './hm';
const pkg = require('../../package.json');

const { title, addHm, cdnConf, useCdn } = htmlConfig;

function injectTitle(html: string, htmlTitle: string) {
  if (/<\/title>/.test(html)) {
    return html.replace(/<\/title>/, `${htmlTitle}</title>`);
  }
  return html;
}

function injectConfigScript(html: string) {
  const tag = `\t\t<script  src='${viteConfig.base || './'}${GLOB_CONFIG_FILE_NAME}?v=${
    pkg.version
  }-${new Date().getTime()}'></script>`;

  if (/<\/head>/.test(html)) {
    return html.replace(/<\/head>/, `${tag}\n\t\t</head>`);
  }
  return html;
}

function injectHmScript(html: string) {
  if (/<head>/.test(html)) {
    return html.replace(/<head>/, `<head>\n${hmScript}`);
  }
  return html;
}

function injectCdnCss(html: string) {
  if (!cdnConf) return html;
  const { css } = cdnConf;
  if (!css || css.length === 0) return html;

  let cdnCssTag = '';
  for (const cssLink of css) {
    cdnCssTag += `<link rel="stylesheet" href="${cssLink}">`;
  }
  if (/<\/head>/.test(html)) {
    return html.replace(/<\/head>/, `${cdnCssTag}\n\t\t</head>`);
  }
  return html;
}

function injectCdnjs(html: string) {
  if (!cdnConf) return html;
  const { js } = cdnConf;
  if (!js || js.length === 0) return html;

  let cdnJsTag = '';
  for (const src of js) {
    // TODO
    // <script type="importmap">
    // { "imports": {
    //   "vue":        "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.0/vue.esm-browser.js",
    //   "vue-router": "https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.0.0-alpha.13/vue-router.esm.js",
    //   "vuex":       "https://cdnjs.cloudflare.com/ajax/libs/vuex/4.0.0-beta.2/vuex.esm-browser.js"
    // } }
    // </script>
    cdnJsTag += `\t<script type="text/javascript" src="${src}"></script>\n`;
  }
  if (/<\/body>/.test(html)) {
    return html.replace(/<\/body>/, `${cdnJsTag}\n</body>`);
  }
  return html;
}

export async function runUpdateHtml() {
  const outDir = viteConfig.outDir || 'dist';
  const indexPath = getCwdPath(outDir, 'index.html');
  if (!existsSync(`${indexPath}`)) {
    return;
  }
  try {
    let processedHtml = '';
    const rawHtml = readFileSync(indexPath, 'utf-8');
    processedHtml = rawHtml;
    processedHtml = injectTitle(processedHtml, title);
    processedHtml = injectConfigScript(processedHtml);
    if (addHm) {
      processedHtml = injectHmScript(processedHtml);
    }
    if (useCdn) {
      processedHtml = injectCdnCss(processedHtml);
      processedHtml = injectCdnjs(processedHtml);
    }

    writeFileSync(indexPath, processedHtml);
    successConsole('Update Html Successfully!');
  } catch (error) {
    errorConsole('Update Html Error\n' + error);
  }
}
