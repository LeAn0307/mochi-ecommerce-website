var cart;
async function autoLoginWithToken() {
  let urlParamms = new URLSearchParams(window.location.search);
  let token = urlParamms.get("token");
  let email = urlParamms.get("email");

  if (!token || !email) {
    email = localStorage.getItem("mochi_email");
    token = localStorage.getItem("mochi_token");

    if (email == null || token == null) {
      navBtnLogIn.style.display = "block";
      navBtnSignUp.style.display = "block";
      return;
    }
  }

  let user = {
    email: email,
    token: token,
  };
  console.log(token);
  console.log(email);
  const url = "http://" + location.host + "/auth_by_token/";

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
    let userInfo = await getUserInfo(email);
    console.log("User info = ", userInfo);

    if (userInfo.length > 0) {
      navBtnCart.style.display = "block";
      navBtnAvatar1.style.display = "block";
      navBtnLogIn.innerText = userInfo[0].name;
      navBtnLogIn.href = "#";
      navBtnLogIn.style.display = "block";

      if (userInfo[0].avatar && userInfo[0].avatar != "")
        navBtnAvatar.src = "/" + userInfo[0].avatar;
    }
    const url = "/cart/email/" + email;
    const response = await fetch(url, {
      method: "GET",
    });
    cart = await response.json();
    var number = document.getElementById("number");

    if (cart) {
      number.innerHTML = cart.length;
    } else number.innerHTML = 0;
  }
}

async function getUserInfo(email) {
  let user = {
    email: email,
  };

  const url = "/get_user_info/";

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
    email = localStorage.getItem("mochi_email");

    if (email == "") {
      return;
    }
  }

  let user = {
    email: email,
  };

  const url = "/log_out/";

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
      localStorage.removeItem("mochi_email");
      localStorage.removeItem("mochi_token");

      // Navigate to home page
      window.location.href = "";
    }
  });
}

async function profileOnClick() {
  console.log("Profile On Click");

  let email = localStorage.getItem("mochi_email");
  let token = localStorage.getItem("mochi_token");

  let user = {
    email: email,
    token: token,
  };

  const url = "/auth_by_token/";

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
    window.location.href = "/profile";
  }
}

// Activate

autoLoginWithToken();
