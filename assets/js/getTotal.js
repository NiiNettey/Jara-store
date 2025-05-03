/*$(document).ready(function () {
  user = getCookie("user");
  function total() {
    $.get("http://javv.x10.mx/backend/getTotal.php",  { userId: user },function (data) {
      if (!data) {
        let parts = data.split("/");
        $(".cart-total-price").html(parts[1]);
        $(".cart-count").html(parts[0]);
      } else {
        let parts = data.split("/");
        $(".cart-total-price").html(parts[1]);
        $(".cart-count").html(parts[0]);
      }
    });
  }

  total();
});*/
