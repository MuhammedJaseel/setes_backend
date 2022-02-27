const { getTables } = require("../module/database");

exports.adminGetEvent = async function (req, res) {
  var tokens = { raised: [], pending: [], cleared: [] };
  await getTables("tokens", { filter: { status: "Raised" } })
    .then((data) => (matchs.raised = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens new" });
      error = true;
    });
  if (error) return;
  await getTables("tokens", { filter: { status: "Prossesing" } })
    .then((data) => (matchs.pending = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens pending" });
      error = true;
    });
  if (error) return;
  await getTables("tokens", { filter: { status: "Cleared" } })
    .then((data) => (matchs.cleared = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens cleared" });
      error = true;
    });
  if (error) return;
  res.send(tokens);
};
