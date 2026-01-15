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