//
//Tự động đăng nhập
//
async function autoLoginWithToken() {
  let urlParamms = new URLSearchParams(window.location.search);
  let token = urlParamms.get("token");
  let email = urlParamms.get("email");
  if (!token || !email) {
    email = localStorage.getItem("mochi_admin_email");
    token = localStorage.getItem("mochi_admin_token");

    if (email == null || token == null) {
      return false;
    }
  }

  let user = {
    email: email,
    token: token,
  };
  console.log(token);
  console.log(email);
  const url = "http://" + location.host + "/admin/auth_by_token/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  let r = await response.json();
  console.log(r);

  if (r) {
    // Get user info if this token is valid
    let userInfo = await getUserInfo(email, token);
    console.log("User info = ", userInfo);

    if (userInfo.length > 0) {
      if (navBtnAvatar1) navBtnAvatar1.style.display = "block";
      Name.innerText = userInfo[0].name;
      Name.href = "#";
      Name.style.display = "block";

      if (userInfo[0].avatar && userInfo[0].avatar != "")
        navBtnAvatar.src = "/" + userInfo[0].avatar;
    }
    return true;
  }
  return false;
}



async function getUserInfo(email) {
  let user = {
    email: email,
  };

  const url = "/admin/get_user_info/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  let r = await response.json();

  return r;
}

async function logOutOnClick() {
  let urlParamms = new URLSearchParams(window.location.search);
  let email = urlParamms.get("email");

  if (!email) {
    email = localStorage.getItem("mochi_admin_email");

    if (email == "") {
      return;
    }
  }

  let user = {
    email: email,
  };

  const url = "/admin/log_out/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  let r = await response.json();

  swal({
    title: "Thành công",
    text: "Đăng xuất thành công",
    icon: "success",
  }).then((confirm) => {
    if (confirm) {
      localStorage.removeItem("mochi_admin_email");
      localStorage.removeItem("mochi_admin_token");

      // Navigate to home page
      window.location.href = "/admin/login";
    }
  });
}

async function profileOnClick() {
  console.log("Profile On Click");

  let email = localStorage.getItem("mochi_admin_email");
  let token = localStorage.getItem("mochi_admin_token");

  let user = {
    email: email,
    token: token,
  };

  const url = "/admin/auth_by_token/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  let r = await response.json();
  console.log("Authen result = ", r);

  if (r) {
    window.location.href = "/admin/profile";
  }
}
