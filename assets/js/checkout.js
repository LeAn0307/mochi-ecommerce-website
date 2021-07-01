async function init() {
  email = localStorage.getItem("mochi_email");

  const url = "/cart/email/" + email;
  const response = await fetch(url, {
    method: "GET",
  });
  cart = await response.json();
  var listItem = document.getElementById("listItem");
  var sum = 0;
  for (var i = 0; i < cart.length; i++) {
    const url1 = "/item/id/" + cart[i].itemId;
    console.log(url1);
    const response = await fetch(url1, {
      method: "GET",
    });
    var r = await response.json();

    var li1 = document.createElement("li");
    li1.innerHTML = r.name + " x " + cart[i].quantity;
    var span1 = document.createElement("span");
    var sum1 = cart[i].quantity * r.cost;
    sum = sum + sum1;
    span1.innerHTML = sum1 + " VND";
    li1.appendChild(span1);
    listItem.appendChild(li1);
  }
  var subtotal = document.getElementById("subtotal");
  var total = document.getElementById("total");
  subtotal.innerHTML = sum + " VNĐ";
  total.innerHTML = sum + " VNĐ";
}
init();

async function OnSubmit() {
  if (
    name1.value != "" &&
    gender.value != "" &&
    address.value != "" &&
    phone.value != "" &&
    email1.value != ""
  ) {
    var bill = {
      name: name1.value,
      gender: gender.value,
      address: address.value,
      phone: phone.value,
      mail: email1.value,
    };
    let token = localStorage.getItem("mochi_token");
    let email = localStorage.getItem("mochi_email");

    var url2 = "/bill/post";
    const response = await fetch(url2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
        email: email,
      },
      body: JSON.stringify(bill),
    });
    let r = await response.json();
    if (r)
      swal({
        title: "Thành công",
        text: "Đơn đặt hàng đã thành công!",
        icon: "success",
      }).then((confirm) => {
        if (confirm) {
          window.location.href = "/shop-homepage";
        }
      });
  } else {
    swal("Thất bại", "Vui lòng nhập đầy đủ thông tin", "error");
  }
}
