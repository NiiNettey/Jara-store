$(document).ready(function () {
  function loadOtherProducts() {
    $.get("http://javv.x10.mx/backend/getOthers.php", function (data) {
      if (!data || data.length === 0) {
        console.error("No products received.");
        return;
      }

      let productHTML = "";
      data.forEach((product) => {
        productHTML += `
          <div class="product" data-product='${JSON.stringify(product)}'>
            <figure class="product-media">
              <div class="svg-image-wrapper">
                                 <svg class="product-svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" style="background: white;">
    <image href="${product.image_path}" width="300" height="300" />
  </svg>
              </div>
              <div class="product-action-vertical">
                <a href="/pages/product.html?product=${
                  product.id
                }" class="btn-product-icon btn-wishlist"></a>
              </div>
              <div class="product-action">
                <a href="#" class="btn-product btn-cart add-to-cart others-cart" title="Add to cart">
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

      let $carousel = $(".container.clothing .owl-carousel");
      $carousel.html(productHTML);

      $carousel
        .owlCarousel("destroy")
        .removeClass("owl-loaded")
        .owlCarousel({
          nav: false,
          dots: true,
          margin: 20,
          loop: false,
          responsive: {
            0: { items: 1 },
            480: { items: 2 },
            768: { items: 3 },
            992: { items: 4 },
            1280: { items: 5, nav: true },
          },
        });
    }).fail(function (xhr, status, error) {
      console.error("AJAX Error:", error);
    });
  }

  loadOtherProducts();

  $(document).off("click", ".others-cart");
});
