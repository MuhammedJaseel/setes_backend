const { allOtps } = require("../method/mobile_login");

exports.empty = (req, res) => {
  res.send(allOtps());
};
