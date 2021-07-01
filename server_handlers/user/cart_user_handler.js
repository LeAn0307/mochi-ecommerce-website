const dbHelper = require("../database_helper");

const e = require("express");

const userSessionCollection = "User_Sessions";
const itemCollection = "Item";
const cartCollection = "Cart";

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

// Module class for export
class CartHandler {
  static AddItemToCart = async function (token, email, quantity, id_item) {
    let token1 = {
      email: email,
      token: token,
    };
    let res = await dbHelper
      .findDocument(userSessionCollection, token1)
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      let item = await dbHelper
        .findDocument(itemCollection, { id: id_item })
        .catch((err) => {
          console.log(err);
        });

      if (item) {
        let query = {
          email: email,
          itemId: id_item,
        };
        let res1 = await dbHelper
          .findDocument(cartCollection, query)
          .catch((err) => {
            console.log("Err: ", err);
          });

        if (res1[0]) {
          return 0; //đã có item trong gio cua nguoi mua
        } else {
          let date = new Date();

          let item1 = {
            id: makeid(7),
            email: email,
            quantity: quantity,
            itemId: id_item,
            create_date: date.getTime(),
          };

          let res = await dbHelper
            .insertDocument(cartCollection, item1)
            .catch((err) => {
              console.log("Err: ", err);
            });

          if (res) {
            return 1; // ok
          }
          return 2;
        }
      } else return 3;
    } else return 3;
  };
  static GetCart = async function (email) {
    let res = await dbHelper
      .findDocument(cartCollection, { email: email })
      .catch((err) => {
        console.log(err);
      });

    return res;
  };
  static DeleteItemInCart = async function (email, token, itemId) {
    let token1 = {
      email: email,
      token: token,
    };
    let res = await dbHelper
      .findDocument(userSessionCollection, token1)
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      var item = {
        email: email,
        itemId: itemId,
      };
      let res1 = await dbHelper
        .findDocument(cartCollection, item)
        .catch((err) => {
          console.log("Err: ", err);
        });
      if (res1[0]) {
        dbHelper.deleteDocument(cartCollection, item);
        return true;
      }
    }
  };
  static UpdateItemInCart = async function (email, token, quantity, itemId) {
    let token1 = {
      email: email,
      token: token,
    };
    let res = await dbHelper
      .findDocument(userSessionCollection, token1)
      .catch((err) => {
        console.log(err);
      });
    console.log(12312312312312321);
    console.log(res);
    if (res) {
      var item = {
        email: email,
        itemId: itemId,
      };
      var item1 = {
        quantity: quantity,
      };
      dbHelper.updateDocument(cartCollection, item, item1);
      return true;
    }
  };
}

module.exports = CartHandler;
