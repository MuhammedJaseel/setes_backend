const { ObjectId } = require("mongodb");
const { getTables, getTable } = require("../module/database");

exports.mobileGethome = async (req, res) => {
  const tempData = {
    events: [],
    bookings: [],
    players: [
      {
        _id: "1",
        title: "Best Striker",
        name: "Hugo Boumous",
        img: "max.jpg",
      },
      {
        _id: "2",
        title: "Best Difender",
        name: "Javi Hernández",
        img: "max.jpg",
      },
      {
        _id: "3",
        title: "Best Keeper",
        name: "Roy Krishna",
        img: "max.jpg",
      },
    ],
  };

  var error = false;
  await getTables("events", {})
    .then((events) => (tempData.events = events))
    .catch((e) => {
      res.status(502).send({ msg: "Database Error __EVENT__" });
      error = true;
    });
  if (error) return;

  await getTables("matchs_live", { limit: 15 })
    .then(async (bookings) => {
      var _id;
      for (let i = 0; i < bookings.length; i++) {
        try {
          _id = ObjectId(bookings[i].slot_id);
        } catch (error) {
          res.status(502).send({ msg: "Database Error __SLOTS ID__" });
          error = true;
          break;
        }
        await getTable("slots", { _id })
          .then((slot) => {
            bookings[i].slot = slot;
          })
          .catch((e) => {
            res.status(502).send({ msg: "Database Error __SLOTS__" });
            error = true;
          });
      }
      for (let i = 0; i < bookings.length; i++) bookings[i].status = "Started";
      tempData.bookings = bookings;
    })
    .catch((e) => {
      res.status(502).send({ msg: "Database Error __BOOKINGS__" });
      error = true;
    });
  await getTables("matchs_fulltime", { limit: 15 })
    .then(async (bookings) => {
      var _id;
      for (let i = 0; i < bookings.length; i++) {
        try {
          _id = ObjectId(bookings[i].slot_id);
        } catch (error) {
          res.status(502).send({ msg: "Database Error __SLOTS ID__" });
          error = true;
          break;
        }
        await getTable("slots", { _id })
          .then((slot) => {
            bookings[i].slot = slot;
          })
          .catch((e) => {
            res.status(502).send({ msg: "Database Error __SLOTS__" });
            error = true;
          });
      }
      for (let i = 0; i < bookings.length; i++) bookings[i].status = "Fulltime";
      tempData.bookings = tempData.bookings.concat(bookings);
    })
    .catch((e) => {
      res.status(502).send({ msg: "Database Error __BOOKINGS__" });
      error = true;
    });
  if (error) return;
  res.send(tempData);
};
