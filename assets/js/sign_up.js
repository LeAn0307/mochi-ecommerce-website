async function Sign_Up() {
  let name = document.getElementById("exampleInputName1").value;
  let email = document.getElementById("exampleInputEmail1").value;
  let address = document.getElementById("exampleInputAddress1").value;
  let password = document.getElementById("exampleInputPassword1").value;
  let password1 = document.getElementById("exampleInputPassword2").value;
  if (password != password1) {
    swal("Thất bại", "Kiểm tra lại mật khẩu nhập lại", "error");
    return;
  }
  let user = {
    email: email,
    password: password,
    name: name,
    address: address,
  };

  const url = "/sign_up/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  let r = await response.json();
  console.log(r.result);

  if (r.result == 1) {
    swal("Thất bại", "Địa chỉ email đã được sử dụng!", "error");
    return false;
  } else if (r.result == 0) {
    swal({
      title: "Thành công",
      text: "Bạn đã đăng ký tài khoản thành công!",
      icon: "success",
    }).then((confirm) => {
      if (confirm) {
        // Navigate to login page
        window.location.href = "/login";
      }
    });
  } else if (r.result == 0) {
    swal("Thất bại", "Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
    return false;
  }

  return true;
}
