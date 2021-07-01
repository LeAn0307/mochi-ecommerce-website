const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "mochi";

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms);
  });
}

function initDatabase() {
  MongoClient.connect(url + "/" + dbName, (err, db) => {
    if (err) throw err;
    console.log("Database", dbName, "created!");
    db.close();
  });
}

function createCollection(collectionName) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mochi");
    dbo.createCollection(collectionName, function (err, res) {
      if (err) throw err;
      console.log("Collection", collectionName, "created in db", dbName);
      db.close();
    });
  });
}

function insertDocument(collection, doc) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) resolve(false);
      var dbo = db.db("mochi");
      doc.timeStamp = Date.now();
      dbo.collection(collection).insertOne(doc, function (err, res) {
        if (err) resolve(false);
        console.log(
          res.ops[0],
          " inserted to collection",
          collection,
          "db",
          dbName
        );
        resolve(res.ops[0]);
        db.close();
      });
    });
  });
}
function searchDocument(collection, name) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) resolve(false);
      var dbo = db.db("mochi");
      dbo.collection(collection).createIndex({
        name: "text",
        category: "text",
      });
      var query = { $text: { $search: name } }; //,$caseSensitive: false,$diacriticSensitive: false
      dbo
        .collection(collection)
        .find(query)
        .project({
          name: 1,
          category: 1,
          id: 1,
          cost: 1,
          quantity: 1,
          path: 1,
          origin: 1,
          describe: 1,
          star: 1,
          reacted_people: 1,
        })
        .toArray(function (err, result) {
          if (err) resolve(false);
          resolve(result);
          db.close();
        });
    });
  });
}
function findDocument(collection, queryObject) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) resolve(false);
      var dbo = db.db("mochi");
      dbo
        .collection(collection)
        .find(queryObject)
        .toArray(function (err, result) {
          if (err) resolve(false);
          resolve(result);
          db.close();
        });
    });
  });
}

function updateDocument(collection, queryObject, dataObject) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) resolve(false);
      var dbo = db.db("mochi");
      dbo.collection(collection).findOneAndUpdate(
        queryObject, // query
        { $set: dataObject } // replacement
      );
      await sleep(100);
      resolve(true);
    });
  });
}

function deleteDocument(collection, queryObject) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mochi");
    dbo.collection(collection).deleteMany(queryObject, function (err, obj) {
      if (err) throw err;
      console.log(
        obj.deletedCount,
        " document removed from collection",
        collection,
        "db",
        dbName
      );
      db.close();
    });
  });
}

function deleteManyDocument(collection, queryObject) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mochi");
    dbo.collection(collection).deleteMany(queryObject, function (err, obj) {
      if (err) throw err;
      console.log(
        obj.deletedCount,
        " document removed from collection",
        collection,
        "db",
        dbName
      );
      db.close();
    });
  });
}

module.exports = {
  initDatabase,
  createCollection,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
  deleteManyDocument,
  searchDocument,
};
