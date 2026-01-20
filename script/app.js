function toggleMenu() {
    var nav = document.getElementById("nav-menu");
    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
    }
}
let currentSlide = 0;
function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}
function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}
/*
const toggle = document.querySelector('.navbar-toggle-s');
const menu = document.querySelector('.navbar-menu-s');

toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

const slides = document.querySelectorAll('.slide');
const track = document.querySelector('.slider-track');
const nextBtn = document.querySelector('.slider-btn.next');
const prevBtn = document.querySelector('.slider-btn.prev');

let index = 0;

function updateSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateSlide();
});

prevBtn.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlide();
});
*/
// autoplay
setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlide();
}, 10000);
// verifica e aplica a máscara de telefone no campo de entrada do entre em contato
const handlePhone = (event) => {
  let input = event.target
  input.value = phoneMask(input.value)
}

const phoneMask = (value) => {
  if (!value) return ""
  value = value.replace(/\D/g, '') // Remove tudo o que não for número
  value = value.replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses nos dois primeiros dígitos
  value = value.replace(/(\d{5})(\d)/, "$1-$2") // Coloca o traço após o quinto dígito
  return value
}


/* Hero */

const hero = document.querySelector('.hero');

  const backgrounds = [
    'img/slide-mapeamento-lg.png',
    'img/slide-credito-rural-lg.png',
    'img/slide-geoprocessamento-lg.png'
  ];

  let index = 0;

  function changeBackground() {
    hero.style.backgroundImage = `url(${backgrounds[index]})`;
    index = (index + 1) % backgrounds.length;
  }

  changeBackground(); // primeira imagem
  setInterval(changeBackground, 6000); // troca a cada 6s