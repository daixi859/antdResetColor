const path = require("path");
const fs = require("fs");
const hexToRgb = require("./hexToRgb");
function transColor(obj, reg, colors, hasAll) {
  let item = {};
  let flag = false;
  for (let key in obj) {
    let value = obj[key];
    if (reg.test(value)) {
      flag = true;
      item[key] = value.replace(reg, (a) => {
        let i = colors.indexOf(a);

        if (i === 10 || i === -1) {
          i = "a";
        }
        return "$" + i;
      });
    } else {
      if (hasAll) {
        item[key] = value;
      }
    }
  }
  return flag ? item : false;
}

function getNodeModulePath() {
  let paths = require.main.paths;
  for (let i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i])) {
      return paths[i];
    }
  }
  return "";
}

function rgbReg(reb) {
  return reb
    .split(",")
    .map((item, i) => {
      if (i < 3) {
        item = `[ ]?${item}[ ]?`;
      }
      return item;
    })
    .join(",");
}

function main({
  importAntdCsspath = path.join(getNodeModulePath(), "antd/dist/antd.css"),
  exportReactCssPath = path.join("antResetStyle.js"),
} = {}) {
  const { blue } = require("@ant-design/colors");
  var css2json = require("css2json");

  const css = fs.readFileSync(importAntdCsspath, "utf-8");
  var json = css2json(css);
  let colorF = [];
  for (let i = 0; i < 10; i++) {
    colorF.push(blue[i]);
  }
  let rgbRolor = hexToRgb(blue[5]);
  const colorReg = new RegExp(`(${colorF.join("|")}|${rgbReg(rgbRolor)})`);

  colorF.push(rgbRolor);

  const resetObj = {};
  for (let name in json) {
    let cssContent = json[name];
    const hasAll = /:hover|:active|:focus|:visited'/.test(name);
    let result = transColor(cssContent, colorReg, colorF, hasAll);
    if (result) {
      resetObj[name] = result;
    }
  }
  const keys = Object.keys(resetObj);
  const values = Object.values(resetObj);
  const resetString = keys
    .map((key, i) => {
      let value = values[i];
      let itemKeys = Object.keys(value);
      let itemValeus = Object.values(value);
      let itemstring = itemKeys
        .map((itemKey, itemIndex) => {
          return `${itemKey}: ${itemValeus[itemIndex]}`;
        })
        .join(";");
      return key + ` {${itemstring}}`;
    })
    .join("\n");
  const csstringmodule = `export default \`${resetString}\``;
  fs.writeFileSync(exportReactCssPath, csstringmodule, "utf-8");
}

module.exports = main;
