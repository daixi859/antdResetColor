module.exports = (hex,opacity) => {
  let str =
    parseInt("0x" + hex.slice(1, 3)) +
    "," +
    parseInt("0x" + hex.slice(3, 5)) +
    "," +
    parseInt("0x" + hex.slice(5, 7));

  if (opacity) {
    str += `,${opacity}`;
  }

  return str;
};
