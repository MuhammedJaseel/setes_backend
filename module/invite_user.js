exports.inviteUser = (req, res) => {
  console.log(req.headers);
  console.log(req.connection.remoteAddress);  res.send(
    "https://play.google.com/store/apps/details?id=com.cuownbe.setes_mobile"
  );
};
