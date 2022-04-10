var requestIp = require("request-ip");
const { postTable } = require("./database");

exports.inviteUser = async (req, res) => {
  const reqIp = requestIp.getClientIp(req);
  const body = {
    piblicIp: reqIp,
    inviter: req.body.id,
    created_at: new Date(),
  };
  console.log(body);
  await postTable("inivites", body);
  res.send(
    "https://play.google.com/store/apps/details?id=com.cuownbe.setes_mobile"
  );
};
