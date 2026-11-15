// Contato: links do WhatsApp e formulário (planilha do Google + email para a empresa)
(() => {
  function buildWhatsappUrl(text) {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
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

  // O Apps Script grava na planilha, manda o email e responde { ok: true } ou { ok: false, error }
  async function sendLead(lead) {
    if (!SITE_CONFIG.sheetsEndpoint) throw new Error("sheetsEndpoint vazio");

    // text/plain evita o preflight de CORS, que o Apps Script não responde
    const response = await fetch(SITE_CONFIG.sheetsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(lead),
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error);
  }

  contactForm.addEventListener("submit", async (event) => {
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

    submitButton.disabled = true; // evita envio duplicado enquanto espera
    showFormStatus("Enviando...");

    try {
      await sendLead(lead);
      contactForm.reset();
      showFormStatus("Pedido enviado! Nossa equipe vai entrar em contato em breve.");
    } catch {
      // Mantém o que a pessoa digitou para ela tentar de novo
      syncSubmitButton();
      showFormStatus("Não conseguimos enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.", true);
    }
  });
})();
