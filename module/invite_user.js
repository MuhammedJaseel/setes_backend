const net = require("os").networkInterfaces();

exports.inviteUser = (req, res) => {
  console.log(net);
  res.send(
    "https://play.google.com/store/apps/details?id=com.cuownbe.setes_mobile"
  );
};
