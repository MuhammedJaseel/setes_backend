const { ObjectId } = require("mongodb");
const { putTable, getTable, getTables } = require("../module/database");

exports.mobileToPrime = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  var body = req.body;
  body.prime = true;
  body.primed = { amount: body.amount, made: new Date() };

  delete body.amount;
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  putTable(table, { _id }, { $set: body })
    .then((user) => res.send({ msg: "Succesfully Updated" }))
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileGetPrimedetails = async (req, res) => {
  var body = {};
  var error = false;
  await getTable("assets", { title: "blood_groups" })
    .then((blood_groups) => (body.blood_groups = blood_groups.data))
    .catch((e) => {
      res.status(502).send({ msg: "Database Error BLOODGROUPS" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "locations" })
    .then((locations) => (body.locations = locations.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error LOCATIONS" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "boot_sizes" })
    .then((boot_sizes) => (body.boot_sizes = boot_sizes.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error BOOTSIZES" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "tshirt_sizes" })
    .then((tshirt_sizes) => (body.tshirt_sizes = tshirt_sizes.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error TSHIRTSIZES" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "positions" })
    .then((positions) => (body.positions = positions.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error POSITIONS" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "strong_foots" })
    .then((strong_foots) => (body.strong_foots = strong_foots.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error STRONGFOOTS" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "price_pm" })
    .then((price_pm) => (body.price_pm = price_pm.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error PRICEPM" });
      error = true;
    });
  if (error) return;
  await getTable("assets", { title: "price_yr" })
    .then((price_yr) => (body.price_yr = price_yr.data))
    .catch(() => {
      res.status(502).send({ msg: "Database Error PRICEYR" });
      error = true;
    });
  if (error) return;

  res.send(body);
};

exports.mobileGetPrimetrufs = async (req, res) => {
  await getTables("trufs", {
    filter: { zone: req.query.zone },
    project: { name: 1, id: 1 },
  })
    .then((trufs) => res.send(trufs))
    .catch((e) => res.status(502).send({ msg: "Database Error" }));
};
