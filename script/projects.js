// Trabalhos por serviço: os cards de "Nossos serviços" e os filtros de "Veja alguns dos nossos trabalhos"
// usam os mesmos serviços
(() => {
  const SERVICE_NAMES = {
    georreferenciamento: "Georreferenciamento",
    credito: "Crédito Rural",
    topografia: "Topografia",
    lar: "LAR",
  };

  const projectFilters = Array.from(document.querySelectorAll(".projects-menu button"));
  const projectImages = Array.from(document.querySelectorAll(".projects-grid img"));
  const projectsEmptyMessage = document.querySelector(".projects-empty");

  function selectService(service) {
    projectFilters.forEach((button) => {
      const selected = button.dataset.service === service;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    let visibleCount = 0;
    projectImages.forEach((image) => {
      const show = image.dataset.service === service;
      image.hidden = !show;
      if (show) visibleCount += 1;
    });

    // Serviço sem fotos publicadas
    projectsEmptyMessage.hidden = visibleCount > 0;
    if (visibleCount === 0) {
      projectsEmptyMessage.textContent = `Em breve, mais trabalhos de ${SERVICE_NAMES[service]} por aqui.`;
    }
  }

  projectFilters.forEach((button) => {
    button.addEventListener("click", () => selectService(button.dataset.service));
  });

  // Clicar num card de serviço leva aos trabalhos daquele serviço
  document.querySelectorAll(".service-card[data-service]").forEach((card) => {
    function openWorks() {
      selectService(card.dataset.service);
      document.getElementById("trabalhos").scrollIntoView({ behavior: "smooth" });
    }

    card.setAttribute("role", "link");
    card.tabIndex = 0;
    card.addEventListener("click", openWorks);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openWorks();
      }
    });
  });

  selectService("georreferenciamento");
})();
