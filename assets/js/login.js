async function Log_in() {
  let email = document.getElementById("exampleInputEmail1").value;
  let password = document.getElementById("exampleInputPassword1").value;
  let user = {
    email: email,
    password: password,
  };

  const url = "/log_in/";

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

        localStorage.setItem("mochi_email", user.email);
        localStorage.setItem("mochi_token", r.token);
        const redirect = localStorage.getItem("login_redirect");
        if (redirect) {
          window.location.href = redirect;
          localStorage.removeItem("login_redirect");
          return;
        }
        // Navigate to home page
        window.location.href = "/";
      }
    });
  } else {
    swal("Thất bại", "Email hoặc mật khẩu không chính xác!", "error");
    return;
  }
}
