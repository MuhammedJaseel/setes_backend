var requestIp = require("request-ip");
const { postTable } = require("./database");

exports.inviteUser = async (req, res) => {
  const reqIp = requestIp.getClientIp(req);
  await postTable("inivites", { piblicIp: reqIp, inviter: req.body.id });
  res.send(
    "https://play.google.com/store/apps/details?id=com.cuownbe.setes_mobile"
  );
};
