const dbHelper = require("../database_helper");
const e = require("express");

const adminCollection = "Admin";
const adminSessionCollection = "Admin_Sessions";

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

async function isValid(admin) {
  // check unique account
  let res = await dbHelper.findDocument("Admin", admin).catch((e) => {
    console.log(e);
  });
  console.log("res = ", res);

  if (res && res.length > 0) {
    return false;
  }
  return true;
}

async function createAdmin(admin) {
  let res = await dbHelper
    .insertDocument(adminCollection, admin)
    .catch((err) => {
      console.log("Err: ", err);
    });

  if (res) {
    return true;
  }
  return false;
}

async function logIn(admin) {
  console.log("Login Admin = ", admin);

  let res = await dbHelper.findDocument(adminCollection, admin).catch((err) => {
    console.log("Err", err);
  });

  if (res.length > 0) {
    let token = makeid(12);
    let sessionRes = await setSesstion(admin.email, token);
    if (sessionRes) {
      return {
        status: 0,
        token: token,
      };
    }
    return {
      status: 1,
    };
  }
  return {
    status: 1,
  };
}

async function setSesstion(email, token) {
  let date = new Date();
  let session = {
    email: email,
    token: token,
    ts: date.getTime(),
  };
  if (await AdminHandler.isValidToken(email, token)) {
    let res = dbHelper
      .updateDocument(adminSessionCollection, session)
      .catch((err) => {
        console.log("Update session err = ", err);
      });

    if (res) {
      return true;
    }
    return false;
  } else {
    let res = dbHelper
      .insertDocument(adminSessionCollection, session)
      .catch((err) => {
        console.log("Insert session err = ", err);
      });

    if (res) {
      return true;
    }
    return false;
  }
}

// Module class for export
class AdminHandler {
  static signUpRequest = async function (email, password, name, address) {
    let date = new Date();

    let admin = {
      email: email,
      password: password,
      name: name,
      address: address,
      create_date: date.getTime(),
      avatar: "",
    };

    // 1. Check email is valid
    let validEmail = await isValid({ email });
    console.log("Valid email: ", validEmail);

    // 3. Check and return
    if (!validEmail) {
      return 1;
    }

    // 4. If valid, create admin
    let created = await createAdmin(admin);
    console.log("Created = ", created);

    if (created) {
      return 0; // Success
    } else {
      return 3; // Failed
    }
  };

  static logInRequest = async function (email, password) {
    let admin = {
      email: email,
      password: password,
    };

    let logInResult = await logIn(admin);
    console.log("LogInRes = ", logInResult);

    return logInResult;
  };

  static isValidToken = async function (email, token) {
    console.log("Is Valid Token");

    let date = new Date();
    let session = {
      email: email,
      token: token,
    };

    let res = await dbHelper
      .findDocument(adminSessionCollection, session)
      .catch((err) => {
        console.log(err);
      });

    // If this session is found
    if (res[0]) {
      let lastLogInTime = res.ts;

      // Check if session is out of date: 3 days
      if (date.getTime() - lastLogInTime >= 3 * 24 * 3600 * 1000) {
        // Remove this session in db and return false
        dbHelper.deleteDocument(adminSessionCollection, session);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  static updateSession = async function (email, token) {
    let res = await setSesstion(email, token);
    return res;
  };

  static getAdminInfo = async function (email) {
    let admin = {
      email: email,
    };

    console.log("admin for get = ", admin);

    let res = await dbHelper
      .findDocument(adminCollection, admin)
      .catch((error) => {
        console.log("Find admin err ", err);
      });

    console.log("Admininfo = ", res);

    if (res) {
      return res;
    }
    return null;
  };

  static logOut = async function (email) {
    let admin = {
      email: email,
    };

    let res = await dbHelper
      .findDocument(adminCollection, admin)
      .catch((err) => {
        console.log("Find admin err = ", err);
      });

    if (res.length > 0) {
      dbHelper.deleteDocument(adminSessionCollection, admin);
    }

    return true;
  };
}

module.exports = AdminHandler;
