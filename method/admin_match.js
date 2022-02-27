const { getTables } = require("../module/database");

exports.adminGetMatchs = async function (req, res) {
  // prams = { date }
  var matchs = { all: [], upcoming: [], expired: [], live: [] };
  await getTables("bookings", { filter: {} })
    .then((data) => (matchs.all = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs All" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Booked" } })
    .then((data) => (matchs.upcoming = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Booked" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Started" } })
    .then((data) => (matchs.live = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Started" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Fulltime" } })
    .then((data) => (matchs.expired = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Fulltime" });
      error = true;
    });
  if (error) return;
  res.send(matchs);
};
