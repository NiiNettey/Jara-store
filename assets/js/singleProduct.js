$(document).ready(function () {
  // Get the product_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");
  const user = getCookie("user");

  // Function to refresh cart items and total
  function refreshCart() {
    $(".dropdown-cart-products").load("https://javv.x10.mx/backend/getCartItems.php", { userId: user });
    $(".cart-total-price").load("https://javv.x10.mx/backend/getTotal.php", { userId: user }, function (data) {
      let trimmedData = $.trim(data);
      let parts = trimmedData.split("/");
      $(".cart-total-price").html(parts[1]);
      $(".cart-count").html(parts[0]);
    });
  }

  $(document).on("click", ".add-to-cart", function () {
    let productId = $(this).data("id");

    if (!user) {
      Toastify({
        text: "Please login to add items to cart",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: { background: "#dc3545" },
        onClick: function () {},
      }).showToast();
    } else {
      $.post(
        "https://javv.x10.mx/backend/addToCart.php",
        { requestData: productId, userId: user },
        function (data) {
          let trimmedData = $.trim(data);
          if (trimmedData == "added") {
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
            refreshCart();
          } else if (trimmedData == "increase") {
            Toastify({
              text: "Item quantity increased",
              duration: 3000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "center",
              stopOnFocus: true,
              onClick: function () {},
            }).showToast();
            refreshCart();
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
        let trimmedData = $.trim(data);
        if (!trimmedData || trimmedData.length === 0) {
          console.error("No product data received.");
          // Optionally show a fallback message or redirect
          return;
        } else {
          $(".box").html(trimmedData);
        }
      }
    ).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
    });
  }

  // Thumbnail Click Event (To Change Main Image)
  $(document).on("click", ".thumbnail", function () {
    $(".thumbnail").removeClass("active");
    $(this).addClass("active");
    $("#main-image").attr("src", $(this).attr("src"));
  });

  loadProduct();
});
