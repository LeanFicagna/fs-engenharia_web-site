function toggleMenu() {
    var nav = document.getElementById("nav-menu");
    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
    }
}

const toggle = document.querySelector('.navbar-toggle-s');
const menu = document.querySelector('.navbar-menu-s');

toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

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

  // Comportamento da imagem do slide
  changeBackground(); // primeira imagem
  setInterval(changeBackground, 6000); // troca a cada 6s
