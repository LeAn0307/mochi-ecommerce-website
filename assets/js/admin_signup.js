// Activate
async function Activate() {
  let res = await autoLoginWithToken();
  if (res == true) {
    window.location.href = "/admin/home";
  }
}
Activate();

async function signUpButton() {
  let email = InputEmail.value;
  let password = InputPassword.value;
  let repassword = InputPassword1.value;
  let phone = Inputsdt.value;
  let name = InputName.value;
  let address = InputAddress.value;
  if (
    email == "" ||
    password == "" ||
    repassword == "" ||
    phone == "" ||
    name == "" ||
    address == ""
  ) {
    // Bao loi
    swal("Thất bại", "Vui lòng điền đầy đủ thông tin và thử lại!", "error");
    return;
  }
  if (password != repassword) {
    // Bao loi
    swal(
      "Thất bại",
      "Nhập lại mật khẩu không chính xác. Vui lòng kiểm tra và thử lại!",
      "error"
    );
    return;
  }

  let user = {
    email: email,
    password: password,
    phone: phone,
    name: name,
    address: address,
  };

  const url = "/admin/sign_up/";

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
  } else if (r.result == 2) {
    swal("Thất bại", "Số điện thoại đã được sử dụng!", "error");
    return false;
  } else {
    swal({
      title: "Thành công",
      text: "Bạn đã đăng ký tài khoản thành công!",
      icon: "success",
    }).then((confirm) => {
      if (confirm) {
        // Navigate to login page
        window.location.href = "/admin/login";
      }
    });
  }
}
