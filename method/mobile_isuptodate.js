const { ObjectId } = require("mongodb");
const { getTable } = require("../module/database");

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
  if (ver >= 1)
    if (logged) {
      await getTable("users", { _id })
        .then((user) => {
          if (user === null) res.status(401).send({ msg: "Not a valid user" });
          else if (user.key === key) {
            delete user.bookings;
            res.send(user);
          } else res.status(401).send({ msg: "Not a valid user" });
        })
        .catch(() => res.status(502).send({ msg: "Database Error 1" }));
    } else res.send("Yes, you are up to date");
  else res.status(410).send({ msg: "App Expired" });
};
