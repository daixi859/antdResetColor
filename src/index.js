import React, { useMemo } from "react";
import { generate, blue } from "@ant-design/colors";

import { hexToRgb } from "src/utils/common";

const AntResetStyle = ({ primaryColor = blue[5], antStyleString = "" }) => {
  const memoryStyle = useMemo(() => formatStyle(primaryColor, antStyleString), [
    primaryColor,
  ]);

  return <style dangerouslySetInnerHTML={{ __html: memoryStyle }} />;
};

export default AntResetStyle;

function formatStyle(primaryColor, antStyleString) {
  let colors = blue.concat();
  if (primaryColor && /^#[0-9a-f]{6}$/i.test(primaryColor)) {
    colors = generate(primaryColor);
  } else {
    console.error("颜色格式不正确");
    return "";
  }
  colors.push(hexToRgb(colors[5]));

  return antStyleString.replace(/\$([0-9a])/g, (a, b) => {
    if (b === "a") {
      b = 10;
    }
    return colors[b];
  });
}
