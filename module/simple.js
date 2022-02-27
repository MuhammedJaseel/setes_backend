exports.dateTomyFormat = (d) => {
  return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
};

