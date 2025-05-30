$(document).ready(function () {
  let user = getCookie("user");
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("cat");
  function loadProducts() {
    $.get(
      "https://javv.x10.mx/backend/getCategory.php",
      { product_cat: cat },
      function (data) {
        if (!data || data.length === 0) {
          console.error("No products received.");
          $("#product_data").html("<p>No products available.</p>");
          return;
        }

        let productHTML = "";
        data.forEach((product) => {
          productHTML += `
          <div class="product" data-product='${JSON.stringify(product)}'>
            <figure class="product-media">
              <div class="svg-image-wrapper">
  <img src="https://javv.x10.mx${
    product.image_path
  }" alt="Product Image" width="300">
              </div>
              <div class="product-action-vertical">
                <a href="/pages/product.html?product=${
                  product.id
                }" class="btn-product-icon btn-wishlist"></a>
              </div>
              <div class="product-action">
                <a href="#" class="btn-product btn-cart add-to-cart products-cart" title="Add to cart">
                  <span>add to cart</span>
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
                <span class="new-price">GHc${product.price}</span>
              </div>
            </div>
          </div>`;
        });

        let $carousel = $("#product_data");
        $carousel.html(productHTML);

        if ($carousel.hasClass("owl-carousel")) {
          $carousel.owlCarousel("destroy").removeClass("owl-loaded");
        }

        $carousel.owlCarousel({
          nav: false,
          dots: true,
          margin: 20,
          loop: false,
          responsive: {
            0: { items: 2 },
            480: { items: 2 },
            768: { items: 3 },
            992: { items: 4 },
            1280: { items: 5, nav: true },
          },
        });
      }
    ).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#product_data").html("<p>Error loading products.</p>");
    });
  }

  loadProducts();

  $(document).off("click", ".products-cart");
});
