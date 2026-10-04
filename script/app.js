const toggle = document.querySelector(".navbar-toggle");
const menu = document.querySelector(".navbar-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("is-open");
});

document.getElementById("copyright-year").textContent = new Date().getFullYear();

// ===== Contato: WhatsApp + Google Sheets =====
const WHATSAPP_NUMBER = "5593992400825"; // DDI + DDD + número
// URL do Web App do Apps Script (ver apps-script/README.md). Vazio = só abre o WhatsApp.
const SHEETS_ENDPOINT = "";

function buildWhatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Links com data-whatsapp apontam para o número da empresa
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = buildWhatsappUrl(link.dataset.whatsappText ?? "");
});

// Máscara (99) 99999-9999
function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const phoneInput = document.getElementById("telephone");
phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

function showFormStatus(message, isError = false) {
  const status = document.getElementById("form-status");
  status.textContent = message;
  status.classList.toggle("form-status--error", isError);
}

function buildLeadMessage(lead) {
  return [
    `Olá! Meu nome é ${lead.name}.`,
    `Cidade/UF: ${lead.city} - ${lead.uf}`,
    `Telefone: ${lead.phone}`,
    `Email: ${lead.email}`,
    "",
    lead.message,
  ].join("\n");
}

const contactForm = document.getElementById("contact-form");

// O botão só é liberado com o consentimento marcado
const consentCheckbox = contactForm.elements.consent;
const submitButton = contactForm.querySelector("button[type=submit]");

function syncSubmitButton() {
  submitButton.disabled = !consentCheckbox.checked;
}

consentCheckbox.addEventListener("change", syncSubmitButton);
contactForm.addEventListener("reset", () => setTimeout(syncSubmitButton));
syncSubmitButton();

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = contactForm.elements;

  // Honeypot preenchido = bot; descarta em silêncio
  if (form.website.value) return;

  const lead = {
    name: form.firstName.value.trim(),
    email: form.mail.value.trim(),
    city: form.city.value.trim(),
    uf: form.uf.value,
    phone: form.phone.value.trim(),
    message: form.menssage.value.trim(),
  };

  // Registra na planilha sem aguardar a resposta (text/plain evita preflight de CORS)
  if (SHEETS_ENDPOINT) {
    fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(lead),
      keepalive: true,
    }).catch(() => {});
  }

  // Abre o WhatsApp no próprio clique (evita bloqueio de pop-up no iOS)
  const whatsappWindow = window.open(buildWhatsappUrl(buildLeadMessage(lead)), "_blank");
  if (!whatsappWindow) {
    window.location.href = buildWhatsappUrl(buildLeadMessage(lead));
  }

  contactForm.reset();
  showFormStatus("Recebemos seus dados! Continue o atendimento pelo WhatsApp.");
});

// ===== Trabalhos por serviço =====
// Os cards de "Nossos serviços" e os filtros de "Veja alguns dos nossos trabalhos" usam os mesmos serviços
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

// ===== Vídeo de apresentação =====
// O botão de play some quando o vídeo começa e volta quando pausa; sem arquivo de vídeo, nada acontece
const presentationVideo = document.querySelector(".video-frame video");
const videoPlayButton = document.querySelector(".video-play");

videoPlayButton.addEventListener("click", () => {
  presentationVideo.play().catch(() => {});
});
presentationVideo.addEventListener("play", () => {
  videoPlayButton.hidden = true;
});
presentationVideo.addEventListener("pause", () => {
  videoPlayButton.hidden = false;
});

// Nossos Serviços
// Inicia no "load" para garantir que o Swiper (CDN, defer) já esteja disponível
window.addEventListener("load", () => {
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
});
