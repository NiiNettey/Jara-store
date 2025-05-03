function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Expiration date (in days)
  const expiresStr = "expires=" + expires.toUTCString();
  document.cookie = `${name}=${value}; ${expiresStr}; path=/`; // Set the cookie with expiration and path
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";"); // Split cookies by semicolon
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim(); // Remove any leading/trailing whitespace
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length); // Return the cookie value
    }
  }
  return null; // Return null if the cookie is not found
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`; // Set a past expiration date
}
$(document).ready(function () {
  $("#signup").hide();
  $("#loading-btn").hide();

  $("#CreateForm").click(function () {
    $("#signup").show();
    $("#login").hide();
  });

  $("#loginForm").click(function () {
    $("#signup").hide();
    $("#login").show();
  });

  //signup
  $("#Create-form").submit(function (e) {
    $("#loading-btn").show();
    $("#Create").hide();
    e.preventDefault();
    var fname = $("#fname").val();
    var aType = $("#aType").val();
    var email = $("#email").val();
    var pass = $("#pass").val();

    $.post(
      "https://javv.x10.mx/backend/signup.php",
      {
        fname: fname,
        aType: aType,
        email: email,
        pass: pass,
      },
      function (data, status) {
        data=$.trim(data);
        let inf = data.split("/");
        $("#loading-btn").hide();
        $("#Create").show();
        if (data == "user") {
          Toastify({
            text: "This email exists , Try logging in",
            duration: 3000,
            // destination:
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#dc3545",
            },
            onClick: function () {}, // Callback after click
          }).showToast();
          $("#email").val("");
          $("#pass").val("");
        } else if (inf[0] == "bizz") {
          setCookie("bizz", inf[1], 7);
          window.location.href = "/pages/account.html";
        } else {
          setCookie("user", inf[1], 7);
          $("#fname").val("");
          $("#aType").val("");
          $("#email").val("");
          $("#pass").val("");
          window.location.href = "/index.html";
        }
      }
    );
  });

  //login
  $("#login-form").submit(function (e) {
    $("#loginBtn").prop("disabled", true);
    $("#loginBtn").html("...");
    e.preventDefault();
    var email = $("#emailL").val();
    var pass = $("#passL").val();

    $.ajax({
      url: "https://javv.x10.mx/backend/login.php",
      method: "POST",
      data: {
        email: email,
        pass: pass,
      },
      xhrFields: {
        withCredentials: true,
      },
      success: function (data) {
        data=$.trim(data);
        let inf = data.split("/");
        if (inf[0] == "Login") {
          setCookie("user", inf[1], 7);
          window.location.href = "/index.html";
        } else if (data == "wrngPass") {
          Toastify({
            text: "Wrong Password , Try again",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: { background: "#dc3545" },
          }).showToast();
        } else if (inf[0] == "bizz") {
          setCookie("bizz", inf[1], 7);
          window.location.href = "/pages/account.html?" + data;
        } else if (data == 1) {
          window.location.href = "/pages/admin.html?apex=" + data;
        } else {
          let inf = data.split("/");
          console.log(inf[0]);

          Toastify({
            text: "Could not find any account linked to this email",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: { background: "#dc3545" },
          }).showToast();
        }
      },
    });
  });
});
