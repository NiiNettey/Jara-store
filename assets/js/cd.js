$(document).ready(function () {
    const bizzCookie = getCookie("bizz");
    console.log(bizzCookie);
    
    if (bizzCookie !== null) {
      window.location.href = "/pages/account.html";
    }
  });