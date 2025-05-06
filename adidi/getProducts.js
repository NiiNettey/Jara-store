$(document).ready(function () {
  fetchProducts();
});

function fetchProducts() {
  const bizzCookie = getCookie("bizz");
  $.ajax({
    url: "https://javv.x10.mx/backend/getProducts.php", // Replace with your actual PHP file path
    type: "GET",
    dataType: "json",
    data: { bizz: bizzCookie },
    success: function (products) {
      let tableBody = $("#product-table tbody"); // Get table body
      tableBody.empty(); // Clear previous content

      $.each(products, function (index, product) {
        let btn;

        if (product.stat == "Approve") {
          btn =
            "<button data-id=" +
            product.id +
            ' type="button" class="btn btn-info stat-action" style="margin-left: 10px;">' +
            product.stat +
            "</button>";
        } else {
          btn = ".";
        }
        let row = `
            <tr>
              <td>
                <div class="img-container" style="text-align: center;">
                  <img 
                    src="https://javv.x10.mx${product.image_path}" 
                    alt="${product.name}" 
                    style="width: 50px; max-width: 100px; height: auto; object-fit: contain; border-radius: 10px;" 
                  />
                </div>
              </td>
              <td class="td-name">
                <a href="#${product.name.replace(/\s+/g, "-").toLowerCase()}">${product.name}</a>
                <br />by ${product.brand}
              </td>
              <td>GHc${product.price}</td>
              <td>${product.category}</td>
              <td class="td-number">${product.quantity}</td>
              <td class="td-number">This is a Description</td>
              <td class="td-actions">
                <button type="button" class="btn btn-simple remove-item" data-id="${product.id}" title="Remove item">
                  <i class="material-icons">Remove</i>
                </button>
              </td>
              <td class="td-number">${btn}</td>
            </tr>
          `;
        tableBody.append(row);
      });

      // ✅ approve status handler
      $(".stat-action").on("click", function () {
        const productId = $(this).data("id");
        $.post(
          "https://javv.x10.mx/backend/defAp.php",
          { id: productId },
          function (response) {}
        ).fail(function (xhr, status, error) {
          console.error("Error:", error);
        });
      });

    
      $(".remove-item").on("click", function () {
        const productId = $(this).data("id");
        if (confirm("Are you sure you want to delete this product?")) {
          $.post(
            "https://javv.x10.mx/backend/deleteProduct.php", // PHP file to handle delete
            { productID: productId },
            function (response) {
              alert(response);
              fetchProducts(); // refresh table
            }
          ).fail(function (xhr, status, error) {
            console.error("Error deleting product:", error);
          });
        }
      });
    },

    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    },
  });
}
