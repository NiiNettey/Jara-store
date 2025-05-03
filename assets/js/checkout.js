$(document).ready(function () {
  let totalItemPrice;
  user = getCookie("user");
  function loadCheckoutCart() {
    $.ajax({
      url: "http://javv.x10.mx/backend/checkout.php",
      type: "GET",
      dataType: "json",
      data: { userId: user },
      success: function (response) {
        let cartContainer = $("#cart-items");
        let totalPriceContainer = $("#total-price");
        let totalPrice = 0;

        if (response.cart.length === 0) {
          cartContainer.html(
            "<p style='text-align:center'>Your cart is empty.</p>"
          );
          totalPriceContainer.text("Total: GHc 0.00");
          return;
        }

        let cartHTML = response.cart
          .map((item) => {
            let itemPrice = parseFloat(item.productPrice);
            let itemQuantity = parseInt(item.productQuan);
            totalItemPrice = itemPrice * itemQuantity;

            totalPrice += totalItemPrice;

            return `
                <div class="cart-item" data-id="${item.productId}">
                    <img src="${item.productImg}" alt="${
              item.productName
            }" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.productName}</h4>
                        <p class="cart-price">GHc ${totalItemPrice.toFixed(
                          2
                        )}</p>
                        <p class="cart-quantity">Quantity: ${itemQuantity}</p>
                    </div>
                    <button class="btn-remove-checkout" aria-label="Remove Item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
                        </svg>
                    </button>
                </div>
            `;
          })
          .join("");

        cartContainer.html(cartHTML);
        totalPriceContainer.text(`Total: GHc ${totalPrice.toFixed(2)}`);
      },
      error: function () {
        $("#cart-items").html("<p>Failed to load cart items.</p>");
      },
    });
  }

  loadCheckoutCart();

  $(document).on("click", ".btn-remove-checkout", function () {
    let productElement = $(this).closest(".cart-item");
    let productId = productElement.data("id");

    if (!productId) {
      console.error("No product ID found.");
      return;
    }

    $.post(
      "http://javv.x10.mx/backend/removeFromCart.php",
      { product_id: productId },
      function (response) {
        if (response === "removed") {
          Toastify({
            text: "Item removed from cart",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
          }).showToast();

          productElement.fadeOut(300, function () {
            $(this).remove();
            loadCheckoutCart();
          });

          $(".cart-count").load(
            "http://javv.x10.mx/backend/getTotal.php",
            { userId: user },
            function (data) {
              let parts = data.split("/");
              $(".cart-count").html(parts[0]);
            }
          );
        } else {
          alert("Error removing item from cart.");
        }
      }
    ).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
    });
  });

  $.ajax({
    url: "http://javv.x10.mx/backend/getAccount.php",
    type: "GET",
    dataType: "json",
    data: { userId: user },
    success: function (data) {
      if (data.error) {
        console.error(data.error);
      } else {
        $("#username").val(data.userName || "");
        $("#street_add").val(data.st_add || "");
        $("#city").val(data.add_state || "");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching user data:", error);
    },
  });

  $("#checkOut_form").submit(function (e) {
    e.preventDefault();
    $("#place_order_checkout")
      .css({
        backgroundColor: "#ccc", // Light gray
        borderColor: "#ccc", // Optional: match border
        color: "#666", // Optional: gray text
        cursor: "not-allowed", // Makes it feel unclickable
      })
      .prop("disabled", true);
    var username = $("#username").val();
    var street_add = $("#street_add").val();
    var city = $("#city").val();
    var country = $("#country").val();
    var phone = $("#phone").val();
    console.log(phone);

    $.post(
      "http://javv.x10.mx/backend/order.php",
      {
        username: username,
        street_add: street_add,
        city: city,
        country: country,
        phone: phone,
        userId: user,
      },
      function (data, status) {
        let data1 = data.split("/");
        $("#place-order").prop("disabled", false);
        if (data1[0] == "orderPlaced") {
          console.log(data1[1]);
          window.location.href = "/pages/account.html";
        } else {
          console.log(data);

          Toastify({
            text: "Could not place order...try again",
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
      }
    );
  });
});
