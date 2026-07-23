(() => {
  "use strict";

  const config = window.ASTROGRAM_LEGAL || {};
  const controller = config.controllerName || "Astrogram";
  const email = config.supportEmail || "";

  document.querySelectorAll("[data-controller]").forEach((node) => {
    node.textContent = controller;
  });
  document.querySelectorAll("[data-support-email]").forEach((node) => {
    node.textContent = email;
  });
  document.querySelectorAll("[data-support-link]").forEach((node) => {
    node.href = `mailto:${email}`;
  });

  const languageButtons = document.querySelectorAll("[data-language]");
  const applyLanguage = (language) => {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language;
    languageButtons.forEach((button) => {
      const active = button.dataset.language === language;
      button.setAttribute("aria-pressed", String(active));
    });
    try {
      localStorage.setItem("astrogram-legal-language", language);
    } catch (_) {
      // The language switch remains functional when storage is unavailable.
    }
  };

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

  let initialLanguage = "sr";
  try {
    initialLanguage =
      localStorage.getItem("astrogram-legal-language") ||
      (navigator.language.toLowerCase().startsWith("sr") ? "sr" : "en");
  } catch (_) {
    initialLanguage = navigator.language.toLowerCase().startsWith("sr") ? "sr" : "en";
  }
  applyLanguage(initialLanguage === "en" ? "en" : "sr");

  const deleteForm = document.querySelector("#deletion-request");
  if (deleteForm) {
    deleteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!deleteForm.reportValidity()) return;

      const formData = new FormData(deleteForm);
      const accountEmail = String(formData.get("accountEmail") || "").trim();
      const notes = String(formData.get("notes") || "").trim();
      const language = document.documentElement.dataset.language;
      const subject =
        language === "en"
          ? "Astrogram account deletion request"
          : "Zahtev za brisanje Astrogram naloga";
      const body =
        language === "en"
          ? [
              "I request deletion of my Astrogram account and associated data.",
              `Account email: ${accountEmail}`,
              "",
              notes ? `Additional note: ${notes}` : "",
              "",
              "I understand that Astrogram may ask me to verify account ownership.",
            ]
          : [
              "Zahtevam brisanje svog Astrogram naloga i povezanih podataka.",
              `Email naloga: ${accountEmail}`,
              "",
              notes ? `Dodatna napomena: ${notes}` : "",
              "",
              "Razumem da Astrogram može tražiti potvrdu vlasništva nad nalogom.",
            ];

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body.filter(Boolean).join("\n"))}`;
      const status = document.querySelector("#form-status");
      if (status) {
        status.hidden = false;
        status.textContent =
          language === "en"
            ? "Your email app should now open with a prepared request. Send the email to complete the request."
            : "Tvoja email aplikacija bi sada trebalo da se otvori sa pripremljenim zahtevom. Pošalji poruku da završiš zahtev.";
      }
    });
  }
})();
