$(document).ready(function () {
  $.ajax({
    url: "https://javv.x10.mx/backend/getShops.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.length > 0) {
        let storeHTML = "";
        response.forEach(function (store) {
          storeHTML += `
                        <a href="#" class="brand">
                            <img src="${store.logo}" alt="${store.name}" />
                        </a>`;
        });

        let $carousel = $("#shop-brands-carousel");

        if ($carousel.hasClass("owl-loaded")) {
          $carousel.trigger("destroy.owl.carousel").removeClass("owl-loaded");
          $carousel.find(".owl-stage-outer").children().unwrap();
        }

        $carousel.html(storeHTML);

        $carousel.owlCarousel({
          nav: false,
          dots: true,
          margin: 30,
          loop: false,
          responsive: {
            0: { items: 2 },
            420: { items: 3 },
            600: { items: 4 },
            900: { items: 5 },
            1024: { items: 6 },
            1280: { items: 6, nav: true, dots: false },
          },
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
});
