const dbHelper = require("../database_helper");

const e = require("express");

const billCollection = "Bill";
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
class BillHandler {
  static CreateBill = async function (
    token,
    email,
    name,
    gender,
    address,
    phone,
    mail
  ) {
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
      let cart = await dbHelper
        .findDocument(cartCollection, { email: email })
        .catch((err) => {
          console.log(err);
        });
      let date = new Date();
      var sum = 0;
      var item1 = [];
      var quantity1 = [];
      for (var i = 0; i < cart.length; i++) {
        let item = await dbHelper
          .findDocument(itemCollection, { id: cart[i].itemId })
          .catch((err) => {
            console.log(err);
          });
        var temp = parseFloat(item[0].cost) * parseFloat(cart[i].quantity);
        sum = sum + parseFloat(temp);
        item1.push(cart[i].itemId);
        quantity1.push(cart[i].quantity);
      }
      let bill1 = {
        id: makeid(7),
        email: email,
        mail: mail,
        name: name,
        gender: gender,
        address: address,
        phone: phone,
        total: sum,
        items: item1,
        quantities: quantity1,
        create_date: date.getTime(),
      };

      let res1 = await dbHelper
        .insertDocument(billCollection, bill1)
        .catch((err) => {
          console.log("Err: ", err);
        });
      if (res1) {
        await dbHelper.deleteDocument(cartCollection, { email: email }, item1);
        return true;
      } else return false;
    } else return false;
  };
  static SearchBill = async function (email) {
    let res = await dbHelper
      .findDocument(billCollection, { email: email })
      .catch((err) => {
        console.log(err);
      });
    console.log(res);

    return res;
  };
}

module.exports = BillHandler;
