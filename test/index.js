const fs = require("fs");
const { generate, blue } = require("@ant-design/colors");
const hexToRgb = require("../src/hexToRgb");
// require("../src/generateResetStyle")();

function formatStyle(primaryColor, antStyleString) {
  if (primaryColor && /^#[0-9a-f]{6}$/i.test(primaryColor)) {
    colors = generate(primaryColor);
  }
  colors.push(hexToRgb(colors[5]));

  return antStyleString.replace(/\$([0-9a])/g, (a, b) => {
    if (b === "a") {
      b = 10;
    }
    return colors[b];
  });
}
console.log(formatStyle("#f5222d", require("./antResetStyle")));
