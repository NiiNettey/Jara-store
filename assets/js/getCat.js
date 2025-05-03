$(document).ready(function () {
  user = getCookie("user");
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("cat");
  function loadProducts() {
    $.get(
      "http://javv.x10.mx/backend/getCategory.php",
      { product_cat: cat },
      function (data) {
        if (!data || data.length === 0) {
          console.error("No products received.");
          $("#product_data").html("<p>No products available.</p>");
          return;
        }

        let productHTML = `
            <div class="container">
     
                <div class="row" style="margin-bottom:10px">`;

        data.forEach((product) => {
          productHTML += `
                <div style="margin-bottom:10px" class="col-6 col-sm-4 col-md-3 col-lg-2"> <!-- 5 items per row on large screens -->
                    <div class="product" data-product='${JSON.stringify(
                      product
                    )}' style="margin-bottom:10px">
                        <figure class="product-media">
                            <img src="${product.image_path}" alt="${
            product.name
          }" class="product-image"/>
           <div class="product-action-vertical">
                               <a href="/pages/product.html?product=${
                                 product.id
                               }" class="btn-product-icon btn-wishlist"></a>
                            </div>
                            <div class="product-action">
                                <a href="#" class="btn-product btn-cart add-to-cart products-cart" title="Add to cart">
                                    <span>Add to Cart</span>
                                </a>
                            </div>
                        </figure>
                        <div class="product-body">
                         <div class="product-cat">
                              <a href="#">${product.category}</a>
                          </div>
                            <h3 class="product-title">
                                <a href="product.html">${product.name}</a>
                            </h3>
                            <div class="product-price">
                                <span class="new-price">GHc${
                                  product.price
                                }</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        productHTML += `</div></div>`; // Closing row and container div

        $("#catgory_data").html(productHTML);
        $(".title").html(cat + " hot deals");
      }
    ).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#catgory_data").html("<p>Error loading products.</p>");
    });
  }

  loadProducts();
});
