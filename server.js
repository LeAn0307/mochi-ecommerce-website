const express = require("express");

//A Node.js module for finding the URL of a web site's favicon.
const favicon = require("serve-favicon");
// Phan mem trung gian phan tich body 
const bodyParser = require("body-parser");

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

const jsonParser = bodyParser.json();
const userHandler = require("./server_handlers/user/account_user_handler");
const adminHandler = require("./server_handlers/admin/account_admin_handler");
const itemHandler = require("./server_handlers/admin/item_handler");
const commentHandler = require("./server_handlers/user/comment_user_handler");
const CartHandler = require("./server_handlers/user/cart_user_handler");
const BillHandler = require("./server_handlers/user/bill_user_handler");

//là bản sao chính xác của mô-đun NodeJS
const path = require("path");
//Multer là một phần mềm trung gian của node.js để xử lý dữ liệu, chủ yếu được sử dụng để tải tệp lên
const multer = require("multer"); 
//Security holding package - Goi bao mat
const fs = require("fs");

const dbHelper = require("./server_handlers/database_helper");

const app = express();
const port = process.env.PORT || 3000;

app.use(favicon("assets/img/fav.png"));
//__dirname is an environment variable that tells you the absolute(tuyet doi) path of the directory containing the currently executing file.
app.use(express.static(__dirname + "/assets/"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);

// FUNCTIONS
function responseError(res) {
  res.sendStatus(500);
}

//--------------- UP load anh------------
const upload = multer({
  dest: "images/",
  fileFilter: (req, file, callback) => {
    if (/\S+\.(jpg|bmp|gif|png)/gi.test(file.originalname)) {
      callback(null, true);
    } else {
      callback(Error("Invalid image file name"), false);
    }
  },
}).single("image");

app.post("/images/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(200).json({
        message: "Uploaded image successfully",
        image_path: path.join("images", req.file.filename),
      });
    }
  });
});

app.get("/images/:image_name", (req, res) => {
  const imagePath = path.join(__dirname, "images", req.params.image_name);
  try {
    const buffer = fs.readFileSync(imagePath);
    let mime = "image/jpeg";
    res.writeHead(200, {
      "Content-Type": mime,
    });
    res.end(buffer, "binary");
  } catch (error) {
    console.log(error.code);
    if (error.code === "ENLENT") {
      res.status(404).json({
        message: "No such image file",
      });
    } else {
      res.status(500).json({
        message: error.message,
      });
    }
    res.end();
  }
});

//--------------HET UPLOAD ANH----------------

//Account User Handlers
app.post("/sign_up", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await userHandler.signUpRequest(
    body.email,
    body.password,
    body.name,
    body.address
  );

  res.send({
    result,
  });
});

app.post("/log_in", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await userHandler.logInRequest(body.email, body.password);

  res.send(result);
});

app.post("/log_out", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await userHandler.logOut(body.email);

  res.send(result);
});

app.post("/auth_by_token", jsonParser, async (req, res) => {
  console.log("Auth by token");

  const body = req.body;

  let result = await userHandler.isValidToken(body.email, body.token);

  res.send(result);
});

app.post("/get_user_info", jsonParser, async (req, res) => {
  const body = req.body;

  console.log(body);

  let result = await userHandler.getUserInfo(body.email);

  res.send(result);
});

//End account User Handlers

//Account Admin Handlers
app.post("/admin/sign_up", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await adminHandler.signUpRequest(
    body.email,
    body.password,
    body.name,
    body.address
  );

  res.send({
    result,
  });
});

app.post("/admin/log_in", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await adminHandler.logInRequest(body.email, body.password);

  res.send(result);
});

app.post("/admin/log_out", jsonParser, async (req, res) => {
  const body = req.body;

  let result = await adminHandler.logOut(body.email);

  res.send(result);
});

app.post("/admin/auth_by_token", jsonParser, async (req, res) => {
  console.log("Auth by token");

  const body = req.body;

  let result = await adminHandler.isValidToken(body.email, body.token);

  res.send(result);
});

app.post("/admin/get_user_info", jsonParser, async (req, res) => {
  const body = req.body;

  console.log(body);

  let result = await adminHandler.getAdminInfo(body.email);

  res.send(result);
});

//End account Admin Handlers

//Item
app.post("/item/post", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  res.send({ id: await itemHandler.postItem(token, email, body) });
});

app.get("/item/:itemId", async (req, res) => {
  res.sendFile(__dirname + "/html/item-info-page.html");
});

app.get("/item/id/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const item = await itemHandler.getItem(itemId);
  console.log(item);
  res.send(item);
});

// End item

//Comment
app.post("/comment/post", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  let result = await commentHandler.CreateComment(
    token,
    email,
    body.comment,
    body.star,
    body.itemId
  );
  res.send(result);
});

app.get("/comment/id/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const comment = await commentHandler.SearchComment(itemId);
  console.log(comment);
  res.send(comment);
});

//End comment
//Cart

app.post("/cart/add", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  let res1 = await CartHandler.AddItemToCart(
    token,
    email,
    body.quantity,
    body.itemId
  );
  console.log(res1);
  res.send({
    res1,
  });
});

app.get("/cart/email/:email", async (req, res) => {
  const email = req.params.email;
  const res1 = await CartHandler.GetCart(email);
  console.log(res1);
  res.send(res1);
});

app.post("/cart/delete", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  let res1 = await CartHandler.DeleteItemInCart(email, token, body.itemId);
  console.log(res1);
  res.send(res1);
});

app.post("/cart/update", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  let res1 = await CartHandler.UpdateItemInCart(
    email,
    token,
    body.quantity,
    body.itemId
  );
  console.log(res1);
  res.send(res1);
});

//End Cart
//Search
app.get("/search/nameStuff/:name?", jsonParser, async (req, res) => {
  const name = req.params.name;
  let stuffList;
  if (name) stuffList = await itemHandler.search(name);
  else stuffList = await dbHelper.findDocument("Item");
  res.send(stuffList);
});
//End Search
//Checkout
app.post("/bill/post", jsonParser, async (req, res) => {
  const body = req.body;
  const token = req.headers["token"];
  const email = req.headers["email"];

  if (token == null || token == "") return responseError(res);
  let res1 = await BillHandler.CreateBill(
    token,
    email,
    body.name,
    body.gender,
    body.address,
    body.phone,
    body.mail
  );
  console.log(res1);
  res.send(res1);
});
//End Checkout

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/home.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/html/home.html");
});

app.get("/blog", (req, res) => {
  res.sendFile(__dirname + "/html/blog.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/html/contact.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/html/login.html");
});

app.get("/shop-cart", (req, res) => {
  res.sendFile(__dirname + "/html/shop-cart.html");
});

app.get("/shop-homepage", (req, res) => {
  res.sendFile(__dirname + "/html/shop-homepage.html");
});

app.get("/shop-homepage/:name", (req, res) => {
  res.sendFile(__dirname + "/html/shop-homepage.html");
});

app.get("/shop-item/:name", (req, res) => {
  res.sendFile(__dirname + "/html/shop-item.html");
});

app.get("/sign_up", (req, res) => {
  res.sendFile(__dirname + "/html/sign_up.html");
});

app.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/html/checkout.html");
});

app.get("/admin/login", (req, res) => {
  res.sendFile(__dirname + "/html/admin_login.html");
});

app.get("/admin/signup", (req, res) => {
  res.sendFile(__dirname + "/html/admin_signup.html");
});

app.get("/admin/home", (req, res) => {
  res.sendFile(__dirname + "/html/admin_home.html");
});

app.get("/admin/postItem", (req, res) => {
  res.sendFile(__dirname + "/html/admin_postItem.html");
});

app.get("/admin/home/:name", async (req, res) => {
  res.sendFile(__dirname + "/html/admin_home.html");
});

app.listen(port, () =>
  console.log(`Mochi app is listening at http://localhost:${port}`)
);
