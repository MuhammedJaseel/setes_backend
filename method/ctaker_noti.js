const { ObjectId } = require("mongodb");
const { getTables, postTable, putTable } = require("../module/database");
const { sendSocketMsg } = require("../module/web_socket");

exports.ctakerGetNoti = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.headers.user_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  await getTables("ctakers", { filter: { _id }, projuct: { noti: 1 } })
    .then((ctakers) => {
      if (ctakers.length !== 0) res.send(ctakers[0].noti ?? []);
      res.send([]);
    })
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:notifications" });
    });
};

exports.ctakerAddNoti = (id, title, desc, type) => {
  var body = {
    title,
    desc,
    type,
    created: new Date(),
    seen: false,
  };

  var _id;
  try {
    _id = ObjectId(id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTables("ctakers", { filter: { _id }, projuct: { noti: 1 } })
    .then((ctakers) => {
      if (ctakers.length !== 0) {
        var noti = ctakers[0].noti ?? [];
        noti = [body].concat(noti);
        putTable("ctakers", { _id }, { $set: { noti } }).then(() =>
          sendSocketMsg("ctakers", "noti|matchs|", false, id)
        );
      }
    })
    .catch(() => {});
};
