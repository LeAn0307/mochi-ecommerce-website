async function UpLoad() {
  const url1 = "/user/profile";
  let token = localStorage.getItem("mochi_token");
  let email = localStorage.getItem("mochi_email");
  const response = await fetch(url1, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
      email: email,
    },
  });

  const bills = await response.json();
  for (var i = 0; i < bills.length; i++) {
    var tableBody = document.getElementById("billList");
    let items = bills[i].items;
    for (var j = 0; j < items.length; j++) {
      var tr = document.createElement("tr");
      tr.style = { height: "20px" };
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      var td4 = document.createElement("td");
      var td5 = document.createElement("td");
      var td6 = document.createElement("td");

      var img = document.createElement("img");
      td1.innerText = i;
      td2.innerText = bills[i].id;
      img.src = items[j].path[0];
      img.classList = "img_table";
      td3.appendChild(img);
      td4.innerText = bills[i].quantities[j];
      td5.innerText = Date(bills[i].create_date);
      td6.innerText = "Đã giao";
      var id = bills.id;
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tableBody.appendChild(tr);
    }
  }
}

UpLoad();

// async function BinhLuan() {
//   var sim = $("input[type='radio']:checked").val();
//   console.log(sim);
//   console.log(usercomment.value);
//   if (usercomment.value != undefined && usercomment.value != "" && sim != 0) {
//     const url1 = "/comment/post";
//     let token = localStorage.getItem("mochi_token");
//     let email = localStorage.getItem("mochi_email");

//     const comment1 = {
//       comment: usercomment.value,
//       star: sim,
//       itemId: url,
//     };

//     const response = await fetch(url1, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         token: token,
//         email: email,
//       },
//       body: JSON.stringify(comment1),
//     });
//     let r1 = await response.json();
//     console.log(r);
//     if (r1) {
//       let userInfo = await getUserInfo(email);
//       let date = new Date();
//       ShowComment(
//         userInfo[0].path,
//         userInfo[0].name,
//         usercomment.value,
//         sim,
//         date
//       );
//       let star = document.getElementById("star");
//       let people = document.getElementById("people");
//       var star1 = parseFloat(star.innerHTML);
//       var people1 = parseFloat(people.innerHTML);
//       star.innerHTML = (star1 * people1 + parseFloat(sim)) / (people1 + 1);
//       people.innerHTML = people1 + 1;
//       sim = 0;
//       usercomment.value = "";
//       swal("Thành công", "Bình luận của bạn đã xuất hiện", "success");
//     } else {
//       swal("Thất bại", "Vui lòng đăng nhập để bình luận!", "error");
//     }
//   } else {
//     swal("Thất bại", "Vui lòng điền đầy đủ thông tin để bình luận!", "error");
//   }
// }

// $(document).ready(function () {
//   $("input[type='radio']").click(function () {
//     var sim = $("input[type='radio']:checked").val();
//     //alert(sim);
//     if (sim < 3) {
//       $(".myratings").css("color", "red");
//       $(".myratings").text(sim);
//     } else {
//       $(".myratings").css("color", "green");
//       $(".myratings").text(sim);
//     }
//   });
// });

// function ShowComment(path, name, comment, star, date) {
//   var div1 = document.createElement("div");
//   div1.className = "avatar-name";
//   var image1 = document.createElement("img");
//   image1.className = "img-circle";
//   if (path) image1.src = "/" + path;
//   else {
//     image1.src = "/img/no_user.png";
//   }
//   var div2 = document.createElement("div");
//   var h5 = document.createElement("h5");
//   h5.innerHTML = name;
//   var div3 = document.createElement("div");
//   div3.className = "avatar-name";
//   var p2 = document.createElement("p");
//   p2.className = "star1";
//   p2.innerHTML = star;
//   var i1 = document.createElement("i");
//   i1.className = "fas fa-star star";

//   div3.appendChild(p2);
//   div3.appendChild(i1);

//   div2.appendChild(h5);
//   div2.appendChild(div3);

//   div1.appendChild(image1);
//   div1.appendChild(div2);
//   var p1 = document.createElement("p");
//   p1.innerHTML = comment;

//   var small1 = document.createElement("small");
//   small1.className = "text-muted";
//   small1.innerHTML =
//     "Bình luận vào ngày: " +
//     date.getDate() +
//     "/" +
//     (date.getMonth() + 1) +
//     "/" +
//     date.getFullYear();

//   var hr1 = document.createElement("hr");
//   var list = document.getElementById("commentList");
//   list.appendChild(div1);
//   list.appendChild(p1);
//   list.appendChild(small1);
//   list.appendChild(hr1);
// }

// async function OnClickBuy() {
//   console.log(r);

//   for (var j = 0; j < cart.length; j++) {
//     if (cart[j].itemId == r.id) {
//       window.location.href = "/shop-cart";

//       return;
//     }
//   }
//   const cart1 = {
//     quantity: 1,
//     itemId: r.id,
//   };
//   let token = localStorage.getItem("mochi_token");
//   let email = localStorage.getItem("mochi_email");

//   var url2 = "/cart/add";
//   const response = await fetch(url2, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       token: token,
//       email: email,
//     },
//     body: JSON.stringify(cart1),
//   });
//   let r2 = await response.json();
//   console.log(r);
//   if (r2.res1 == 1) {
//     var number = document.getElementById("number");
//     number.innerHTML = cart.length + 1;
//     window.location.href = "/shop-cart";
//   } else {
//     swal({
//       title: "Thất bại",
//       text: "Có lỗi xảy ra, vui lòng thử lại sau",
//       icon: "error",
//     });
//   }
// }
