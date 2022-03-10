const { allOtps } = require("../method/mobile_login");

exports.empty = (req, res) => {
  console.log(req.id);
  res.send(allOtps());
};
