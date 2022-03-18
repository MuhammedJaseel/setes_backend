const { getTables } = require("../module/database");
const { adminAssetFetch } = require("./admin_asset");

exports.adminGetHome = async function (req, res) {
  var homedata = {};
  var error = false;

  //   Users
  await getTables("users", {
    sort: { _id: -1 },
    limit: 50,
    project: { bookings: 0, noti: 0 },
    filter: { registerd: true },
  })
    .then(
      (data) =>
        (homedata.members = { all: data, prime: [], guest: [], blocked: [] })
    )
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:USERS" });
      error = true;
    });
  await getTables("users", {
    sort: { _id: -1 },
    limit: 50,
    project: { bookings: 0, noti: 0 },
    filter: { registerd: true, prime: true },
  })
    .then((data) => (homedata.members.prime = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:USERS" });
      error = true;
    });
  await getTables("users", {
    sort: { _id: -1 },
    limit: 50,
    project: { bookings: 0, noti: 0 },
    filter: { guest: true },
  })
    .then((data) => (homedata.members.guest = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:USERS" });
      error = true;
    });
  await getTables("users", {
    sort: { _id: -1 },
    limit: 50,
    project: { bookings: 0, noti: 0 },
    filter: { blocked: true },
  })
    .then((data) => (homedata.members.blocked = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:USERS" });
      error = true;
    });
  if (error) return;

  //   events
  await getTables("events", { sort: { _id: -1 }, limit: 50 })
    .then((data) => (homedata.events = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:EVENTS" });
      error = true;
    });
  if (error) return;

  //   trufs
  await getTables("trufs", { sort: { _id: -1 }, limit: 50 })
    .then((data) => (homedata.trufs = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:trufs" });
      error = true;
    });
  if (error) return;

  //   bookings

  await getTables("bookings", { limit: 50 })
    .then((data) => (homedata.bookings = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:bookings" });
      error = true;
    });
  if (error) return;

  //   slots
  await getTables("slots", { limit: 50 })
    .then((data) => (homedata.slots = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:slots" });
      error = true;
    });
  if (error) return;

  //   ctakers
  await getTables("ctakers", { project: { password: 0 } })
    .then((data) => (homedata.ctakers = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:ctakers" });
      error = true;
    });
  if (error) return;

  //   admins
  await getTables("admins", { project: { password: 0 } })
    .then((data) => (homedata.admins = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:admins" });
      error = true;
    });
  if (error) return;

  // Matchs
  homedata.matchs = { all: [], upcoming: [], expired: [], live: [] };
  await getTables("bookings", { filter: {} })
    .then((data) => (homedata.matchs.all = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs All" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Booked" } })
    .then((data) => (homedata.matchs.upcoming = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Booked" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Started" } })
    .then((data) => (homedata.matchs.live = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Started" });
      error = true;
    });
  if (error) return;
  await getTables("bookings", { filter: { status: "Fulltime" } })
    .then((data) => (homedata.matchs.expired = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:Matchs Fulltime" });
      error = true;
    });
  if (error) return;

  // Tokens
  homedata.tokens = { raised: [], pending: [], cleared: [] };
  await getTables("tokens", { filter: { status: "Raised" } })
    .then((data) => (homedata.tokens.raised = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens new" });
      error = true;
    });
  if (error) return;
  await getTables("tokens", { filter: { status: "Prossesing" } })
    .then((data) => (homedata.tokens.pending = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens pending" });
      error = true;
    });
  if (error) return;
  await getTables("tokens", { filter: { status: "Cleared" } })
    .then((data) => (homedata.tokens.cleared = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:tokens cleared" });
      error = true;
    });
  if (error) return;

  // Notifications
  await getTables("admin_noti", { filter: { seen: false } })
    .then((data) => (homedata.notis = { new: data, all: [] }))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:notifications" });
      error = true;
    });
  if (error) return;
  await getTables("admin_noti", {})
    .then((data) => (homedata.notis.all = data))
    .catch(() => {
      res.status(502).send({ msg: "Error: OBJECTID ERR:notifications" });
      error = true;
    });
  if (error) return;

  // assets
  const assets = await adminAssetFetch();
  if (assets.err) {
    res.status(502).send({ msg: "Error: OBJECTID ERR:assets" });
    error = true;
  } else homedata.assets = assets.body;

  if (error) return;

  res.send(homedata);
};
