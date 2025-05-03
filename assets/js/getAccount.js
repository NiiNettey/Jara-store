$(document).ready(function () {
  let user = getCookie("user");
  let bizz = getCookie("bizz");

  $.ajax({
    url: "https://javv.x10.mx/backend/getAccount.php",
    type: "GET",
    dataType: "json",
    data: { userId: user, bizzId: bizz },
    success: function (data) {
      if (data.error) {
        console.error(data.error);
      } else {
        $("#firstName").val(data.userName || "");
        $("#email").val(data.userEmail || "");
        $("#phoneNumber").val(data.phone || "");
        $("#address").val(data.st_add || "");
        $("#state").val(data.add_state || "");
        $("#zipCode").val(data.zip || "");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching user data:", error);
    },
  });

  $("#formAccountSettings").submit(function (e) {
    e.preventDefault();

    $.post(
      "https://javv.x10.mx/backend/update_profile.php",
      {
        firstName: $("#firstName").val(),
        email: $("#email").val(),
        Street_Address: $("#address").val(),
        add_state: $("#state").val(),
        zip: $("#zipCode").val(),
        phone: $("#phoneNumber").val(),
        userId: user,
        bizzId: bizz,
      },
      function (data, status) {
        if (data == "update") {
          Toastify({
            text: "Profile updated",
            duration: 3000,
            // destination:
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {}, // Callback after click
          }).showToast();
        } else {
        }
      }
    );
  });

  $.ajax({
    url: "https://javv.x10.mx/backend/getOrders.php",
    method: "GET",
    dataType: "json",
    data: { userId: user, bizzId: bizz },
    success: function (orders) {
      const $tbody = $(".tableTbody");
      $tbody.empty();

      if (orders.length === 0) {
        $tbody.append(
          `<tr><td colspan="7" class="text-center">No orders found.</td></tr>`
        );
        return;
      }
      orders.forEach(function (order) {
        const params = new URLSearchParams(window.location.search);
        const alibaba = params.get("apex");
        let row = "";
        if (!alibaba) {
          row = `
          <tr>
        
            <td><img src="${
              order.productImg
            }" width="50" height="50" style="object-fit: cover;"></td>
            <td>${order.productName}</td>

            <td>${order.productQuantity}</td>
            <td class="text-right">GHC ${parseFloat(order.productPrice).toFixed(
              2
            )}</td>
            <td class="text-right">GHC ${parseFloat(
              order.productPrice * order.productQuantity
            ).toFixed(2)}</td>
<td>
  <a 
    href="#" 
    class="complete-order" 
    data-id="${order.id}" 
    style="display: inline-block; padding: 6px 12px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;"
  >
    Mark as Complete
  </a>
</td>
          </tr>
          `;
        } else {
          row = `
          <tr>

            <td>
            <div class="img-container" style="text-align: center;">
         <img 
  src="/${order.productImg}" 
  style="width: 100%; max-width: 100px; height: auto; object-fit: contain; border-radius: 10px;" 
/>

            </div>
            </td>

            <td>${order.productName}</td>
            <td>${order.productQuantity}</td>
            <td class="text-right">GHC ${parseFloat(order.productPrice).toFixed(
              2
            )}</td>
            <td>${order.usrID}</td>
            <td><a href="#" class="complete-order" data-id="${
              order.id
            }">Order Complete</a></td>
          </tr>
        `;
        }
        $tbody.append(row);
      });
      $(document).on("click", ".complete-order", function (e) {
        e.preventDefault();
        const orderId = $(this).data("id");
        $.post(
          "https://javv.x10.mx/backend/getOrders.php",
          {
            doneDeal: orderId,
            doneOrdd: "doneOrdd",
            userId: user,
            bizzId: bizz,
          },
          function (data, status) {
            if (data == "complete") {
              Toastify({
                text: "Order marked as complete",
                duration: 3000,
                // destination:
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick: function () {}, // Callback after click
              }).showToast();
            } else {
            }
          }
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching orders:", error);
      $("table tbody").html(
        `<tr><td colspan="7" class="text-center text-danger">Failed to load orders.</td></tr>`
      );
    },
  });
  $(document).on("click", ".logout-account", function (e) {
    e.preventDefault();
    deleteCookie("user");
    deleteCookie("bizz");
    window.location.href = "/";
  });
});
