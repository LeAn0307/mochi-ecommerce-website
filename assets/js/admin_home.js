// Activate
async function Activate() {
  let res = await autoLoginWithToken();
  console.log(res);
  if (res == false) {
    window.location.href = "/admin/login";
    return;
  }
}
Activate();

async function init() {
  var r;
  var url = window.location.href;
  var i = url.search("/");
  while (i >= 0) {
    url = url.substr(i + 1, url.length - 1);
    i = url.search("/");
  }
  if (url == undefined || url == "home") {
    url = "";
    console.log(url);
  }

  const url1 = "/search/nameStuff/" + url;
  console.log(url1);
  const response = await fetch(url1, {
    method: "GET",
  });
  r = await response.json();
  console.log(r);
  if (r.length === 0 || r == false) {
    document.getElementById("chuaCoStuff").classList.toggle("stuff1");
    return;
  }
  console.log(r);
  const div1 = document.getElementById("item");

  for (var i = 0; i < r.length; i++) {
    console.log(i);
    var div2 = document.createElement("div");
    div2.className = "col-lg-4 col-md-6 mb-4";
    var div7 = document.createElement("div");
    div7.className = "card";
    div2.appendChild(div7);

    var img1 = document.createElement("img");
    img1.src = "/" + r[i].path;
    img1.className = "card-img-top";
    div7.appendChild(img1);

    var div3 = document.createElement("div");
    div3.className = "card-body";
    var h1 = document.createElement("h4");
    h1.className = "card-title";
    var a1 = document.createElement("a");
    a1.href = "/admin/item/" + r[i].id;
    a1.innerHTML = r[i].name;
    div3.appendChild(h1);
    h1.appendChild(a1);

    var h2 = document.createElement("h4");
    h2.innerHTML = r[i].cost + " VNĐ";
    var div4 = document.createElement("div");
    div4.className = "fas fa-shopping-cart market";

    h2.appendChild(div4);

    var p1 = document.createElement("p");
    p1.className = "card-text";
    p1.innerHTML = r[i].describe;

    div3.appendChild(h2);
    div3.appendChild(p1);
    div7.appendChild(div3);

    var p2 = document.createElement("p");
    p2.innerHTML = r[i].star;
    p2.className = "star1";
    var div5 = document.createElement("div");
    div5.className = "fas fa-star star";
    var p3 = document.createElement("p");
    p3.innerHTML = r[i].reacted_people + " đánh giá";
    p3.className = "people";

    var div6 = document.createElement("div");
    div6.className = "card-footer";
    div6.appendChild(p2);
    div6.appendChild(div5);
    div6.appendChild(p3);
    div7.appendChild(div6);
    div1.appendChild(div2);
  }
}

init();
