async function LoadCart() {
  email = localStorage.getItem("mochi_email");
  const url = "/cart/email/" + email;
  const response = await fetch(url, {
    method: "GET",
  });
  var cart = await response.json();
  var r1 = [];
  var tableCart = document.getElementById("tableCart");
  for (var i = 0; i < cart.length; i++) {
    const url1 = "/item/id/" + cart[i].itemId;
    console.log(url1);
    const response = await fetch(url1, {
      method: "GET",
    });
    var r = await response.json();
    r1.push(r);
    console.log(r);

    var tr1 = document.createElement("tr");
    tr1.className = "item";
    tr1.id = r.id;
    var td1 = document.createElement("td");
    td1.className = "shoping__cart__item";
    var img1 = document.createElement("img");
    img1.className = "image1";
    img1.src = "/" + r.path;

    var a1 = document.createElement("a");
    a1.innerHTML = r.name;
    a1.href = "/shop-item/" + r.id;
    a1.className = "name";

    td1.appendChild(img1);
    td1.appendChild(a1);
    tr1.appendChild(td1);

    var td2 = document.createElement("td");
    td2.className = "shoping__cart__price";
    td2.innerHTML = r.cost + " VNĐ";

    tr1.appendChild(td2);

    var td3 = document.createElement("td");
    td3.className = "shoping__cart__quantity";

    var div1 = document.createElement("div");
    var div2 = document.createElement("div");
    div2.className = "pro-qty";
    var input1 = document.createElement("input");
    input1.type = "number";
    input1.className = "quantity";
    input1.min = 0;
    input1.value = cart[i].quantity;
    input1.id = r.cost;

    div2.appendChild(input1);
    div1.appendChild(div2);
    td3.appendChild(div1);
    tr1.appendChild(td3);

    var td4 = document.createElement("td");
    var div5 = document.createElement("span");

    div5.className = "shoping__cart__total";
    div5.id = "cost";
    var temp = parseFloat(cart[i].quantity) * parseFloat(r.cost);
    div5.innerHTML = temp;

    var span2 = document.createElement("span");
    span2.className = "vnd";
    span2.innerHTML = " VNĐ";
    td4.appendChild(div5);
    td4.appendChild(span2);
    tr1.appendChild(td4);

    var td5 = document.createElement("td");
    td5.className = "shoping__cart__item__close";
    var span1 = document.createElement("span");
    span1.className = "icon_close";
    

    td5.appendChild(span1);
    tr1.appendChild(td5);
    tableCart.appendChild(tr1);
  }
  var sum = 0;
  var subtotal = document.getElementById("subtotal");
  var total1 = document.getElementById("total");

  var close = document.getElementsByClassName("icon_close");
  console.log(close);
  for (var j = 0; j < close.length; j++) {
    close[j].onclick = async function () {
      var div = this.parentElement;
      var div1 = div.parentElement;
      var id = div1.id;
      for (var x = 0; x < cart.length; x++) {
        if (id == cart[x].itemId) {
          cart.splice(x, 1);
          r1.splice(x, 1);
          break;
        }
      }
      let token = localStorage.getItem("mochi_token");
      let email = localStorage.getItem("mochi_email");

      var url2 = "/cart/delete";
      const response = await fetch(url2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
          email: email,
        },
        body: JSON.stringify({ itemId: id }),
      });
      let r = await response.json();
      if (r) {
        var number = document.getElementById("number");
        number.innerHTML = cart.length;
        div1.style.display = "none";
      }
    };
  }
  var quantity = document.getElementsByClassName("quantity");
  console.log(quantity);
  for (var j = 0; j < quantity.length; j++) {
    quantity[j].onchange = async function () {
      if (this.value != undefined) {
        var total =
          this.parentElement.parentElement.parentElement.nextElementSibling
            .firstChild;
        var id = total.parentElement.parentElement.id;
        let token = localStorage.getItem("mochi_token");
        let email = localStorage.getItem("mochi_email");
        var item = {
          quantity: this.value,
          itemId: id,
        };
        var url2 = "/cart/update";
        const response = await fetch(url2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            email: email,
          },
          body: JSON.stringify(item),
        });
        let r = await response.json();
        if (r) {
          var temp1 = this.value * parseFloat(this.id);
          total.innerHTML = temp1;
          sum = 0;
          for (var x = 0; x < cart.length; x++) {
            if (id == cart[x].itemId) {
              cart[x].quantity = this.value;
            }
            sum = sum + parseFloat(cart[x].quantity) * parseFloat(r1[x].cost);
          }
          console.log(sum);
          subtotal.innerHTML = sum + " VNĐ";
          total1.innerHTML = sum + " VNĐ";
        }
      }
    };
    quantity[j].onkeyup = async function () {
      if (this.value != undefined) {
        var total =
          this.parentElement.parentElement.parentElement.nextElementSibling
            .firstChild;
        var id = total.parentElement.parentElement.id;
        let token = localStorage.getItem("mochi_token");
        let email = localStorage.getItem("mochi_email");
        var item = {
          quantity: this.value,
          itemId: id,
        };
        var url2 = "/cart/update";
        const response = await fetch(url2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            email: email,
          },
          body: JSON.stringify(item),
        });
        let r = await response.json();
        if (r) {
          var temp1 = this.value * parseFloat(this.id);
          total.innerHTML = temp1;
          sum = 0;
          for (var x = 0; x < cart.length; x++) {
            if (id == cart[x].itemId) {
              cart[x].quantity = this.value;
            }
            sum = sum + parseFloat(cart[x].quantity) * parseFloat(r1[x].cost);
          }
          console.log(sum);
          subtotal.innerHTML = sum + " VNĐ";
          total1.innerHTML = sum + " VNĐ";
        }
      }
    };
  }
  for (var x = 0; x < cart.length; x++) {
    sum = sum + parseFloat(cart[x].quantity) * parseFloat(r1[x].cost);
  }
  subtotal.innerHTML = sum + " VNĐ";
  total1.innerHTML = sum + " VNĐ";
}

LoadCart();
