$(document).ready(function () {
    const userCookie = getCookie("user");    
    
    if (userCookie == null) {
      window.location.href = "/login.html";
    }
  });