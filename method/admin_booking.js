const { getTables } = require("../module/database");

exports.adminGetbookings = function (req, res) {
  var page = req.query.page_limit ?? 0;
  page = parseInt(page);
  delete req.query.page_limit;
  var tableProps = { limit: 50, filter: req.query, skip: page*50 };
  getTables("bookings", tableProps)
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
