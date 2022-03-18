const { getTables } = require("../module/database");

exports.mobileHomeTruf = async (req, res) => {
  const type = req.query.type;
  const _id = req.query.user_id;

  const homeTruf = { players: [], members: [] };

  homeTruf.players = [
    { _id: "1", name: "Hugo Boumous", img: null },
    { _id: "2", name: "Javi Hernández", img: "max.jpg" },
    { _id: "3", name: "Roy Krishna", img: "max.jpg" },
  ];
  if (type === "zone")
    homeTruf.players = [
      { _id: "1", name: "Hugo Boumous", img: "max.jpg" },
      { _id: "2", name: "Javi Hernández", img: null },
      { _id: "3", name: "Roy Krishna", img: "max.jpg" },
    ];
  if (type === "home")
    homeTruf.players = [
      { _id: "1", name: "Hugo Boumous", img: "max.jpg" },
      { _id: "2", name: "Javi Hernández", img: "max.jpg" },
      { _id: "3", name: "Roy Krishna", img: "max.jpg" },
    ];

  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  await getTables(table, { filter: { prime: true } })
    .then((users) => (homeTruf.members = users))
    .catch(() => {
      res.status(502).send({ msg: "Database Error __ON USERS__" });
    });

  res.send(homeTruf);
};
