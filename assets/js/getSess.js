function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

$(document).ready(function () {
  let user = "";
  const userCookie = getCookie("user");
  const bizzCookie = getCookie("bizz");

  if (!userCookie && !bizzCookie) {
    user = null;
  } else if (bizzCookie) {
    user = bizzCookie;
  } else {
    user = userCookie;
  }

  if (!user) {
    $(".user-txt").html("Login");
    $(".wishlist-link-login").attr("href", "/login.html");
    $(document).on(
      "click",
      ".electronics-cart,.fashion-cart,.others-cart,.products-cart",
      function (e) {
        e.preventDefault();
        Toastify({
          text: "Please login to add items to cart",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#dc3545",
          },
          onClick: function () {},
        }).showToast();
      }
    );
  } else {
    if (bizzCookie) {
      $(".header-right").html(`
        <div class="card-body">
            <button type="button" class="btn btn-primary">
              Add Store
            </button>
        </div>
      `);
      $(".logo img").attr("src", "/assets/images/logo1.png");
      $(".logo").attr("href", "#");
    } else {
      $(".logo img").attr("src", "/assets/images/logo.jpg");
      $(".product-tablee").hide();
    }

    $(".user-txt").html("Account");
    $(".wishlist-link-login").attr("href", "/pages/account.html");

    $(document).on(
      "click",
      ".electronics-cart,.fashion-cart,.others-cart,.products-cart",
      function (e) {
        e.preventDefault();
        let productElement = $(this).closest(".product");
        let productData = JSON.parse(productElement.attr("data-product"));

        let requestData = productData.id;
        $.post(
          "https://javv.x10.mx/backend/addToCart.php",
          {
            requestData: requestData,
            userId: user,
          },
          function (data) {
            if (data == "added") {
              Toastify({
                text: "Item added to cart",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                onClick: function () {},
              }).showToast();
              $(".dropdown-cart-products").load(
                "https://javv.x10.mx/backend/getCartItems.php",
                { userId: user }
              );
              $(".cart-total-price").load(
                "https://javv.x10.mx/backend/getTotal.php",
                { userId: user },
                function (data) {
                  let parts = data.split("/");
                  $(".cart-total-price").html(parts[1]);
                  $(".cart-count").html(parts[0]);
                }
              );
            } else if (data == "increase") {
              $(".dropdown-cart-products").load(
                "https://javv.x10.mx/backend/getCartItems.php",
                { userId: user }
              );
              $(".cart-total-price").load(
                "https://javv.x10.mx/backend/getTotal.php",
                { userId: user },
                function (data) {
                  let parts = data.split("/");
                  $(".cart-total-price").html(parts[1]);
                  $(".cart-count").html(parts[0]);
                }
              );
              Toastify({
                text: "Item increased",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                onClick: function () {},
              }).showToast();
            }
          }
        );
      }
    );
  }
});
