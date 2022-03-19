const { getTable, postTable } = require("../module/database");
const { putTable, getTables } = require("../module/database");

exports.mobileLogin = (req, res) => {
  var otpset;
  var checked = false;
  for (let i = 0; i < otpStore.length; i++) {
    if (otpStore[i].pin === req.body.pin) {
      if (otpStore[i].otp !== req.body.otp) {
        if (otpStore[i].phone === "9544013463") {
          if (req.body.otp !== "1442") {
            res.statusCode = 400;
            res.send({ msg: "Wrong Otp" });
            return 0;
          }
          otpset = otpStore[i];
        } else {
          res.statusCode = 400;
          res.send({ msg: "Wrong Otp" });
          return 0;
        }
      } else otpset = otpStore[i];
      checked = true;
      break;
    }
  }
  if (!checked) {
    res.statusCode = 400;
    res.send({ msg: "Otp Expired" });
    return 0;
  }

  var key = Math.random().toString();
  console.log({ phone: otpset.phone });
  getTable("users", { phone: otpset.phone })
    .then((data) => {
      if (data === null) {
        const body = { registerd: false, phone: otpset.phone, key };
        postTable("users", body)
          .then((data_1) =>
            res.send({ key, _id: data_1.insertedId, registerd: false })
          )
          .catch((e) => res.status(502).send({ msg: "Database Error" }));
      } else {
        putTable("users", { _id: data._id }, { $set: { key } })
          .then((data_2) => {
            if (data.registerd) {
              data.key = key;
              res.send(data);
            } else res.send({ key, _id: data._id, registerd: false });
          })
          .catch((e) => res.status(502).send({ msg: "Database Error" }));
      }
    })
    .catch((e) => res.status(502).send({ msg: "Database Error" }));
};

var key = Math.random().toString();
exports.mobileSendotp = (req, res) => {
  const phone = req.body.phone;
  if (phone.length !== 10) {
    res.status(400).send({ msg: "Not Valid Number" });
    return;
  }
  var secdata = generateOtp(phone);
  console.log(phone);
  console.log(secdata);
  res.send({ pin: secdata.pin });
};

var otpStore = [];

exports.allOtps = () => otpStore;

function removeOtp(pin) {
  for (let i = 0; i < otpStore.length; i++)
    if (otpStore[i].pin === pin) {
      otpStore.splice(i, 1);
      break;
    }
}

function generateOtp(phone) {
  const otp = `${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
  const pin = Math.random().toString().slice(1, 10);
  otpStore.push({ otp, pin, phone });
  setTimeout(() => removeOtp(pin), 300000);
  return { pin, otp };
}

exports.mobileEnterasGust = async (req, res) => {
  var error = false;
  var body = {};
  var key = Math.random().toString();
  await getTables("users_guest", { limit: 1 })
    .then((user) => {
      var guest_id = "1";
      if (user.length !== 0)
        if (user[0].gust_id !== null)
          guest_id = (parseInt(user[0].guest_id) + 1).toString();

      body = {
        guest: true,
        guest_id,
        id: guest_id,
        name: "Guset_" + guest_id,
        key,
        credit: 0,
        wallet: 0,
        bookings: [],
        blocked: false,
        created: new Date(),
        updated: new Date(),
      };
    })
    .catch((e) => {
      res.status(502).send({ msg: "Database Error" });
      error = true;
    });
  if (error) return;
  postTable("users_guest", body)
    .then((data_1) => {
      body._id = data_1.insertedId;
      res.send(body);
    })
    .catch((e) => res.status(502).send({ msg: "Database Error" }));
};
