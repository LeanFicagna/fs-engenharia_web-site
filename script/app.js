function toggleMenu() {
  var nav = document.getElementById("nav-menu");
  if (nav.style.display === "flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";
  }
}

const toggle = document.querySelector(".navbar-toggle");
const menu = document.querySelector(".navbar-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("is-open");
});



// Nossos Serviços
console.log("Swiper carregado");

new Swiper(".services-carousel", {
  spaceBetween: 20,
  slidesPerView: 1, // fallback padrão

  breakpoints: {
    480: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 4
    }
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});
