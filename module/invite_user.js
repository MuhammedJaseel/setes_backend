exports.inviteUser = (req, res) => {
  console.log(req.socket.remoteAddress);
  res.send(
    "https://play.google.com/store/apps/details?id=com.cuownbe.setes_mobile"
  );
};
