var url = window.location.href;
let r;
async function init() {
  var i = url.search("/");
  while (i >= 0) {
    url = url.substr(i + 1, url.length - 1);
    i = url.search("/");
  }
  if (url == undefined) {
    window.location.href = "/";
    return;
  }

  const url1 = "/item/id/" + url;
  console.log(url1);
  const response = await fetch(url1, {
    method: "GET",
  });
  r = await response.json();
  console.log(r);
  if (r) {
    let image1 = document.getElementById("image1");
    let name = document.getElementById("name");
    let cost = document.getElementById("cost");
    let category = document.getElementById("category");
    let quantity = document.getElementById("quantity");
    let length = document.getElementById("length");
    let width = document.getElementById("width");
    let origin = document.getElementById("origin");
    let describe = document.getElementById("describe");
    let star = document.getElementById("star");
    let people = document.getElementById("people");
    image1.src = "/" + r.path;
    name.innerHTML = r.name;
    cost.innerHTML = r.cost;
    category.innerHTML = r.category;
    quantity.innerHTML = r.quantity;
    length.innerHTML = r.length;
    width.innerHTML = r.width;
    origin.innerHTML = r.origin;
    describe.innerHTML = r.describe;
    star.innerHTML = r.star;
    people.innerHTML = r.reacted_people;

    const url2 = "/comment/id/" + url;
    console.log(url2);
    const response1 = await fetch(url2, {
      method: "GET",
    });
    var r1 = await response1.json();
    console.log(r1);
    if (r1) {
      for (let i = 0; i < r1.length; i = i + 1) {
        let userInfo = await getUserInfo(r1[i].email);
        ShowComment(
          userInfo[0].path,
          userInfo[0].name,
          r1[i].comment,
          r1[i].star,
          new Date(r1[i].create_date)
        );
      }
    }
  } else {
    window.location.href = "/";
    return;
  }
}

init();

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
