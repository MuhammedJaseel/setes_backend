var MongoClient = require("mongodb").MongoClient;
var db;

const mdUrl = `mongodb+srv://jaseel:jaseel4040@cluster0.t0fgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const mdUrl = "mongodb://localhost:27017";

MongoClient.connect(mdUrl, function (err, client) {
  if (err) throw err;
  db = client.db("setes");
  console.log("Data base Connected");
});

exports.getTable = function (table, filter) {
  return db.collection(table).findOne(filter);
};

exports.getTables = function (table, props) {
  const filter = props.filter ?? {};
  const limit = props.limit ?? 100;
  const skip = props.skip ?? 0;
  const sort = props.sort ?? { _id: -1 };
  const project = props.project ?? {};
  return db
    .collection(table)
    .find(filter)
    .project(project)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .toArray();
};

exports.getnolimitTables = function (table, props) {
  const filter = props.filter ?? {};
  const skip = props.skip ?? 0;
  const sort = props.sort ?? { _id: -1 };
  const project = props.project ?? {};
  return db
    .collection(table)
    .find(filter)
    .project(project)
    .sort(sort)
    .skip(skip)
    .toArray();
};

exports.postTable = function (table, body) {
  return db.collection(table).insertOne(body);
};

exports.putTable = function (table, filter, body) {
  return db.collection(table).updateOne(filter, body);
};

exports.deleteTable = function (table, filter) {
  return db.collection(table).deleteOne(filter);
};

exports.countTable = function (table, filter) {
  return db.collection(table).find(filter).count();
};
