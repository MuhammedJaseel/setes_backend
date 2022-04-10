const { ObjectId } = require("mongodb");
const { getTable, putTable } = require("../module/database");
var requestIp = require("request-ip");

exports.mobileIsuptodate = async (req, res) => {
  const ver = req.body.ver;
  const logged = req.body.logged;
  const key = req.body.key;
  var _id;
  try {
    if (logged) _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  if (logged) {
    const table = req.body.isguest ? "users_guest" : "users";
    await getTable(table, { _id })
      .then((user) => {
        if (user === null) res.status(401).send({ msg: "Not a valid user" });
        else if (user.key === key) {
          delete user.bookings;
          res.send(user);
        } else res.status(401).send({ msg: "Not a valid user" });
      })
      .catch(() => res.status(502).send({ msg: "Database Error 1" }));
  } else {
    if (!req.body.seen) {
      const userIp = requestIp.getClientIp(req);
      getTable("inivites", { deviceMAC: req.body.deviceMAC })
        .then((data) => {
          if (data === null) {
            getTable("inivites", { piblicIp: userIp })
              .then((inviter) => {
                if (inviter != null) {
                  console.log({
                    inviter: inviter.inviter,
                    msg: "Yes, you are up to date",
                  });
                  res.send({
                    inviter: inviter.inviter,
                    msg: "Yes, you are up to date",
                  });
                  putTable(
                    "inivites",
                    { piblicIp: userIp },
                    { $set: { deviceMAC: req.body.deviceMAC } }
                  );
                }
              })
              .catch(() => res.status(502).send({ msg: "Database Error 1" }));
          } else res.send({ inviter: "", msg: "Yes, you are up to date" });
        })
        .catch(() => res.status(502).send({ msg: "Database Error 1" }));
    }
  }
};
