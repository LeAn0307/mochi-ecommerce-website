const dbHelper = require("../database_helper");

const e = require("express");

const commentCollection = "Comments";
const userSessionCollection = "User_Sessions";
const itemCollection = "Item";

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
class CommentHandler {
  static CreateComment = async function (token, email, comment, star, id_item) {
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
        let date = new Date();

        let comment1 = {
          id: makeid(7),
          email: email,
          comment: comment,
          star: star,
          itemId: id_item,
          create_date: date.getTime(),
        };

        let res = await dbHelper
          .insertDocument(commentCollection, comment1)
          .catch((err) => {
            console.log("Err: ", err);
          });
        if (res) {
          let temp_people = parseInt(item[0]["reacted_people"]) + 1;

          console.log("temp_people: " + temp_people);
          let temp = item[0]["star"] * (temp_people - 1);
          console.log(temp);
          temp = temp + parseFloat(star);
          console.log(temp);
          temp = temp / temp_people;
          console.log(temp);
          let temp_star =
            (item[0]["star"] * (temp_people - 1) + parseFloat(star)) /
            temp_people;
          console.log(temp_star);
          let item1 = {
            star: temp_star,
            reacted_people: temp_people,
          };

          await dbHelper.updateDocument(
            itemCollection,
            { id: item[0]["id"] },
            item1
          );
          return true;
        }
        return false;
      } else return false;
    } else return false;
  };
  static SearchComment = async function (id_item) {
    let res = await dbHelper
      .findDocument(commentCollection, { itemId: id_item })
      .catch((err) => {
        console.log(err);
      });
    console.log(res);

    return res;
  };
}

module.exports = CommentHandler;
