$(document).ready(function () {
  // 1. Get the product_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");
  user = getCookie("user");
  $(document).on("click", ".add-to-cart", function () {
    let productId = $(this).data("id");

    if (!user) {
      Toastify({
        text: "Please login to add items to cart",
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
    } else {
      $.post(
        "https://javv.x10.mx/backend/addToCart.php",
        {
          requestData: productId,
          userId: user,
        },
        function (data) {
          if (data == "added") {
            Toastify({
              text: "Item added to cart",
              duration: 3000,
              // destination:
              newWindow: true,
              close: true,
              gravity: "top", // `top` or `bottom`
              position: "center", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              onClick: function () {}, // Callback after click
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
              text: "item increased",
              duration: 3000,
              // destination:
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
  });

  function loadProduct() {
    $.get(
      "https://javv.x10.mx/backend/singleProduct.php",
      { product_id: productId },
      function (data) {
        if (!data || data.length === 0) {
          console.error("No products received.");
          return;
        } else {
          $(".box").html(data);
        }
      }
    ).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
    });
  }

  // 4. Thumbnail Click Event (To Change Main Image)
  $(document).on("click", ".thumbnail", function () {
    $(".thumbnail").removeClass("active");
    $(this).addClass("active");
    $("#main-image").attr("src", $(this).attr("src"));
  });
  loadProduct();
});
