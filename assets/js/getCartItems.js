$(document).ready(function () {
  let user = getCookie("user");

  function updateCartUI(keepDropdownOpen = false) {
    $(".cart-total-price").load(
      "https://javv.x10.mx/backend/getTotal.php",
      { userId: user },
      function (data) {
        data = data.trim();
        let parts = data.split("/");
        $(".cart-total-price").html(parts[1]);
        $(".cart-count").html(parts[0]);
      }
    );

    $(".dropdown-cart-products").load(
      "https://javv.x10.mx/backend/getCartItems.php",
      { userId: user },
      function () {
        if (keepDropdownOpen) {
          $(".cart-dropdown").addClass("show");
          $(".cart-dropdown .dropdown-menu").addClass("show");
          $(".cart-dropdown .dropdown-toggle").attr("aria-expanded", "true");
        }
      }
    );
  }

  function showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      close: true
    }).showToast();
  }

  function updateQuantity(productId, newQty) {
    $(`#qty-${productId}, #qty-display-${productId}`).text(newQty);
  }

  function handleCartAction(url, requestData, successCallback) {
    $.post(url, requestData, function (response) {
      response = response.trim();
      if (response === "removed") {
        showToast("Item removed from cart");
        updateCartUI(true);
      } else if (response === "increase") {
        successCallback("increase");
      } else if (response === "decrease") {
        successCallback("decrease");
      } else {
        alert("Error processing cart action.");
      }
    }).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
    });
  }

  $(document).on("click", ".increase_itm, .decrease_itm", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let button = $(this);
    let productId = button.data("id");
    let quantityElement = $(`#qty-${productId}`);
    let currentQty = parseInt(quantityElement.text());
    let isDecrease = button.hasClass("decrease_itm");

    if (isDecrease && currentQty === 1) {
      removeItemFromCart(productId);
    } else {
      let requestData = { requestData: productId, userId: user };
      if (isDecrease) requestData.decrease = true;

      handleCartAction(
        "https://javv.x10.mx/backend/addToCart.php",
        requestData,
        function (action) {
          let newQty = action === "increase" ? currentQty + 1 : currentQty - 1;
          updateQuantity(productId, newQty);
          updateCartUI(true);
        }
      );
    }
  });

  function removeItemFromCart(productId) {
    $.post(
      "https://javv.x10.mx/backend/removeFromCart.php",
      { product_id: productId },
      function (response) {
        response = response.trim();
        if (response === "removed") {
          showToast("Item removed from cart");
          updateCartUI(true);
        }
      }
    );
  }

  $(document).on("click", ".btn-remove", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let productId = $(this).closest(".product").data("id");
    if (!productId) {
      console.error("No product ID found.");
      return;
    }

    handleCartAction(
      "https://javv.x10.mx/backend/removeFromCart.php",
      { product_id: productId },
      function () {}
    );
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".cart-dropdown").length) {
      $(".cart-dropdown").removeClass("show");
      $(".cart-dropdown .dropdown-menu").removeClass("show");
      $(".cart-dropdown .dropdown-toggle").attr("aria-expanded", "false");
    }
  });

  // Initial load
  updateCartUI(false);
});
