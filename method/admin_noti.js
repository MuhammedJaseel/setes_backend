const { getTables, postTable } = require("../module/database");
const { sendSocketMsg } = require("../module/web_socket");

exports.adminGetNoti = async (req, res) => {
  var notis = {};
  var error = false;
  await getTables("admin_noti", { filter: { seen: false } })
    .then((data) => (notis = { new: data, all: [] }))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:notifications" });
      error = true;
    });
  if (error) return;
  await getTables("admin_noti", { filter: { seen: true } })
    .then((data) => (notis.all = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:notifications" });
      error = true;
    });
  if (error) return;

  res.send(notis);
};

exports.adminAddNoti = async (title, desc, type) => {
  var body = {
    title,
    desc,
    type,
    created: new Date(),
    seen: false,
  };
  await postTable("admin_noti", body);
  sendSocketMsg("admins", "noti|bookings|", true, "");
};
