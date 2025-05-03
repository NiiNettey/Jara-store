$(document).ready(function () {
  fetchProducts();
});

function fetchProducts() {
  const bizzCookie = getCookie("bizz");
  $.ajax({
    url: "http://javv.x10.mx/backend/getProducts.php", // Replace with your actual PHP file path
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
    src="${product.image_path}" 
    alt="${product.name}" 
    style="width: 100%; max-width: 100px; height: auto; object-fit: contain; border-radius: 10px;" 
  />
</div>

              </td>
              <td class="td-name">
                <a href="#${product.name.replace(/\s+/g, "-").toLowerCase()}">${
          product.name
        }</a>
                <br />by ${product.brand}
              </td>
              <td>GHc${product.price}</td>
              <td>${product.category}</td>
              <td class="td-number">${product.quantity}</td>
              <td class="td-number">This is a Description</td>
              <td class="td-actions">
                <button type="button" class="btn btn-simple remove-item" title="Remove item">
                  <i class="material-icons">Remove</i>
                </button>
              </td>
              <td class="td-number">${btn}</td>
              
            </tr>
          `;
        tableBody.append(row);
      });
      $(".stat-action").on("click", function () {
        const productId = $(this).data("id");
        console.log(productId);

        $.post(
          "http://javv.x10.mx/backend/defAp.php",
          { id: productId },
          function (response) {}
        ).fail(function (xhr, status, error) {
          console.error("Error:", error);
        });
      });
    },

    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    },
  });
}
