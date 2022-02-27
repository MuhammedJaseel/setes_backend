const { getTable, putTable } = require("../module/database");

adminAssetFetch = async () => {
  var body = {};
  var msg = "";
  var error = false;
  await getTable("assets", { title: "blood_groups" })
    .then((blood_groups) => (body.blood_groups = blood_groups.data))
    .catch((e) => {
      msg = "Database Error BLOODGROUPS";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "locations" })
    .then((locations) => (body.locations = locations.data))
    .catch(() => {
      msg = "Database Error LOCATIONS";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "boot_sizes" })
    .then((boot_sizes) => (body.boot_sizes = boot_sizes.data))
    .catch(() => {
      msg = "Database Error BOOTSIZES";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "tshirt_sizes" })
    .then((tshirt_sizes) => (body.tshirt_sizes = tshirt_sizes.data))
    .catch(() => {
      msg = "Database Error TSHIRTSIZES";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "positions" })
    .then((positions) => (body.positions = positions.data))
    .catch(() => {
      msg = "Database Error POSITIONS";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "strong_foots" })
    .then((strong_foots) => (body.strong_foots = strong_foots.data))
    .catch(() => {
      msg = "Database Error STRONGFOOTS";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "price_pm" })
    .then((price_pm) => (body.price_pm = price_pm.data))
    .catch(() => {
      msg = "Database Error PRICEPM";
      error = true;
    });
  if (error) return { error, msg };
  await getTable("assets", { title: "price_yr" })
    .then((price_yr) => (body.price_yr = price_yr.data))
    .catch(() => {
      msg = "Database Error PRICEYR";
      error = true;
    });
  if (error) return { error, msg };
  return { error, body };
};

adminGetassets = async (req, res) => {
  var assets = await adminAssetFetch();
  if (assets.error) res.status(502).send({ msg: assets.msg });
  else res.send(assets.body);
};

adminPutassets = function (req, res) {
  const title = req.query.title;
  putTable("assets", { title }, { $set: { data: req.body } })
    .then(() => res.send({ msg: "Succesfully Updated" }))
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

module.exports = { adminAssetFetch, adminGetassets, adminPutassets };
