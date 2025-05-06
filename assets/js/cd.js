$(document).ready(function () {
    const bizzCookie = getCookie("bizz");
    
    
    if (bizzCookie !== null) {
      window.location.href = "/pages/account.html";
    }
  });