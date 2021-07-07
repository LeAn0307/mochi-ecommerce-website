const dbHelper = require("../database_helper");

const itemCollection = "Item";
const userSessionCollection = "User_Sessions";
const userCollection = "Users";
const adminSessionCollection = "Admin_Sessions";
const adminCollection = "Admin";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function createItem(item) {
  let res = await dbHelper.insertDocument(itemCollection, item).catch((err) => {
    console.log("Err: ", err);
  });

  if (res) {
    return true;
  }
  return false;
}

async function updateItem(item) {
  let res = await dbHelper.updateDocument(itemCollection, item).catch((err) => {
    console.log("Err: ", err);
  });

  if (res) {
    return true;
  }
  return false;
}
class ItemHandler {
  static search = async function (name) {
    let res = await dbHelper
      .searchDocument(itemCollection, name)
      .catch((err) => {
        console.log(err);
      });
    console.log(res);
    return res;
  };
  static getItem = async function (itemId) {
    let res = await dbHelper
      .findDocument(itemCollection, { id: itemId })
      .catch((err) => {
        console.log(err);
      });
    if (res[0]) {
      var res2 = {
        id: res[0]["id"],
        email_admin: res[0]["email"],
        name: res[0]["name"],
        category: res[0]["category"],
        cost: res[0]["cost"],
        quantity: res[0]["quantity"],
        length: res[0]["length"],
        width: res[0]["width"],
        origin: res[0]["origin"],
        describe: res[0]["describe"],
        create_date: res[0]["create_date"],
        path: res[0]["path"],
        star: res[0]["star"],
        reacted_people: res[0]["reacted_people"],
      };
      return res2;
    }
    return false;
  };
  static postItem = async function (token, email, body) {
    let token1 = {
      email: email,
      token: token,
    };
    let res = await dbHelper
      .findDocument(adminSessionCollection, token1)
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      let date = new Date();
      let item = {
        id: makeid(7),
        email_admin: res[0]["email"],
        name: body["name"],
        category: body["category"],
        cost: body["cost"],
        quantity: body["quantity"],
        length: body["length"],
        width: body["width"],
        origin: body["origin"],
        describe: body["describe"],
        create_date: date.getTime(),
        path: body["path"],
        star: 0,
        reacted_people: 0,
      };

      let created = await createItem(item);

      if (created) return item["id"];
      else return 0;
    }
    return 0;
  };

  static updateItem = async function (token, email, body) {
    let token1 = {
      email: email,
      token: token,
    };
    let res = await dbHelper
      .findDocument(adminSessionCollection, token1)
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      let date = new Date();
      let item = {
        id: makeid(7),
        email_admin: res[0]["email"],
        name: body["name"],
        category: body["category"],
        cost: body["cost"],
        quantity: body["quantity"],
        length: body["length"],
        width: body["width"],
        origin: body["origin"],
        describe: body["describe"],
        create_date: date.getTime(),
        path: body["path"],
        star: 0,
        reacted_people: 0,
      };

      let updated = await updateItem(item);

      if (updated) return item["id"];
      else return 0;
    }
    return 0;
  };

  
}

module.exports = ItemHandler;
