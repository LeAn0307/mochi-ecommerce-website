// Activate
async function Activate() {
  let res = await autoLoginWithToken();
  if (res == false) {
    window.location.href = "/admin/login";
    return;
  }
  document
    .getElementById("files")
    .addEventListener("change", handleFileSelect, false);
  $(".hinh").click(function () {
    $("input[id='files']").click();
  });
}
Activate();

function handleFileSelect(evt) {
  files = evt.target.files; // FileList object
  // Loop through the FileList and render image files as thumbnails.
  console.log("Loi 5");

  for (var i = 0, f; (f = files[i]); i++) {
    // Only process image files.
    if (!f.type.match("image.*")) {
      continue;
    }
    var reader = new FileReader(); //biến hiện images ra
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        // render thumbnail.
        var span = document.createElement("span");
        span.classList.add("csshinhanh");
        span.innerHTML = [
          '<img class="thumb" src="',
          e.target.result,
          '" title="',
          escape(theFile.name),
          '"/>',
          '<i class="fa fa-times time " ></i>',
        ].join("");
        document.getElementById("previewImg").insertBefore(span, null); //chèn images vào span dựng sẵn có ID previewImg
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

//hàm xóa
$(document).on("click", ".time", function () {
  if (confirm("Bạn Có Muốn Xóa ?")) {
    $(this).closest("span").fadeOut();
    $("#files").val(null); //xóa tên của file trong input
  } else return false;
});

async function Submit() {
  // post object
  console.log(stuffName.value);
  console.log(category.value);
  console.log(cost.value);
  console.log(quantity.value);
  console.log(length1.value);
  console.log(width.value);
  console.log(origin1.value);
  console.log(describe.value);
  console.log(files);
  if (
    stuffName.value != "" &&
    category.value != "" &&
    cost.value != undefined &&
    quantity.value != undefined &&
    length1.value != undefined &&
    width.value != undefined &&
    origin1.value != "" &&
    describe.value &&
    files != undefined
  ) {
    let path = [];
    if (files) {
      const url1 = "/images/upload";
      console.log(files);
      for (var i = 0, f; (f = files[i]); i++) {
        let formData = new FormData();
        formData.append("image", files[i]);
        const response1 = await fetch(url1, {
          method: "POST",
          body: formData,
        });
        let r1 = await response1.json();
        if (r1["message"] == "Uploaded image successfully") {
          path.push(r1["image_path"]);
        }
      }
    }
    let cate;
    if (category.value == 1) cate = "Bút";
    if (category.value == 2) cate = "Giấy note";
    if (category.value == 3) cate = "Túi đựng";
    if (category.value == 4) cate = "Màu nước";
    if (category.value == 5) cate = "Đồ thủ công";
    if (category.value == 6) cate = "Khác";

    let item = {
      name: stuffName.value,
      category: cate,
      cost: cost.value,
      quantity: quantity.value,
      length: length1.value,
      width: width.value,
      origin: origin1.value,
      describe: describe.value,
      path: path,
    };
    let token = localStorage.getItem("mochi_admin_token");
    let email = localStorage.getItem("mochi_admin_email");

    const url = "/item/post";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
        email: email,
      },
      body: JSON.stringify(item),
    });

    let r = await response.json();
    console.log(r);
    if (r["id"] == 0) {
      swal("Thất bại", "Bạn vui lòng thử lại sau nhé", "error");
    } else {
      window.location.href = "/admin/home";
    }
    return;
  } else {
    swal("Thất bại", "Bạn vui lòng điền đầy đủ thông tin nhé", "error");
  }
}
