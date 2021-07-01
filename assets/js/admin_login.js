// Activate
async function Activate() {
  let res = await autoLoginWithToken();
  if (res == true) {
    window.location.href = "/admin/home";
  }
}
Activate();

function signUpTapped() {
  window.location.href = "/admin/signup";
}
async function BtnLogInTapped() {
  console.log("LogIn()");

  let email = InputEmail.value;
  let password = InputPassword.value;
  if (email == "" || password == "") {
    swal("Thất bại", "Vui lòng nhập đầy đủ thông tin!", "error");
    return;
  }
  let user = {
    email: email,
    password: password,
  };

  const url = "/admin/log_in/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  let r = await response.json();
  console.log(r);

  // Success
  if (r.status == 0) {
    swal({
      title: "Thành công",
      text: "Đăng nhập thành công!",
      icon: "success",
    }).then((confirm) => {
      if (confirm) {
        console.log("Token = ", r.token);

        localStorage.setItem("mochi_admin_email", user.email);
        localStorage.setItem("mochi_admin_token", r.token);
        const redirect = localStorage.getItem("login_redirect");
        if (redirect) {
          window.location.href = redirect;
          localStorage.removeItem("login_redirect");
          return;
        }
        // Navigate to home page
        window.location.href = "/admin/home";
      }
    });
  } else {
    swal("Thất bại", "Email hoặc mật khẩu không chính xác!", "error");
  }
}
