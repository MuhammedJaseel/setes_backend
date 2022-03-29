const { sendSocketMsg } = require("../module/web_socket");

exports.adminBrodcastMsg = function (req, res) {
  const who = req.body.type;
  const msg = "alert|&&" + req.body.title + "&&" + req.body.topic;
  sendSocketMsg(who, msg, true);
  res.send("Done");
};
