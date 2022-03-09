exports.mobileAuth = function (req, res, next) {
  console.log(req.headers);
  next();
};

exports.adminAuth = function (req, res, next) {
  next();
};

exports.ctakerAuth = function (req, res, next) {
  next();
};
