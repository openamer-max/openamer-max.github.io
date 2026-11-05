/* OpenAmer — Sprach-Engine (i18n) */
(function () {
  var STR = window.I18N || {};

  // Titel & Beschreibung pro Sprache (SEO)
  var META = {
    de: ["OpenAmer — Dein persönlicher KI-Assistent. Lokal. Privat. Ehrlich.", "OpenAmer ist der persönliche KI-Assistent, der direkt auf deinem Computer läuft. Über 120 Werkzeuge, volle Datenkontrolle."],
    en: ["OpenAmer — Your personal AI assistant. Local. Private. Honest.", "OpenAmer is the personal AI assistant that runs on your own computer. 120+ tools, full data control."],
    es: ["OpenAmer — Tu asistente de IA personal. Local. Privado. Honesto.", "OpenAmer es el asistente de IA que se ejecuta en tu propio ordenador. Más de 120 herramientas."],
    fr: ["OpenAmer — Votre assistant IA personnel. Local. Privé. Honnête.", "OpenAmer est l'assistant IA qui tourne sur votre ordinateur. Plus de 120 outils."],
    it: ["OpenAmer — Il tuo assistente IA personale. Locale. Privato. Onesto.", "OpenAmer è l'assistente IA che gira sul tuo computer. Oltre 120 strumenti."],
    pt: ["OpenAmer — O teu assistente de IA pessoal. Local. Privado. Honesto.", "O OpenAmer é o assistente de IA que corre no teu computador. Mais de 120 ferramentas."],
    ru: ["OpenAmer — Твой личный ИИ-ассистент. Локально. Приватно. Честно.", "OpenAmer — ассистент, который работает на твоём компьютере. Более 120 инструментов."],
    ar: ["OpenAmer — مساعدك الشخصي للذكاء الاصطناعي. محلي. خاص. صادق.", "OpenAmer مساعد ذكاء اصطناعي يعمل على حاسوبك. أكثر من 120 أداة."],
    zh: ["OpenAmer — 你的私人 AI 助手。本地。私密。诚实。", "OpenAmer 直接运行在你的电脑上，超过 120 种工具，数据完全由你掌控。"],
    tr: ["OpenAmer — Kişisel yapay zekâ asistanın. Yerel. Gizli. Dürüst.", "OpenAmer kendi bilgisayarında çalışan yapay zekâ asistanı. 120'den fazla araç."],
    bs: ["OpenAmer — Tvoj lični AI asistent. Lokalno. Privatno. Iskreno.", "OpenAmer je asistent koji radi na tvom računaru. Preko 120 alata."],
    sq: ["OpenAmer — Asistenti yt personal me AI. Lokal. Privat. I sinqertë.", "OpenAmer është asistenti me AI që punon në kompjuterin tënd. Mbi 120 mjete."]
  };

  function detect() {
    var url = new URLSearchParams(location.search).get("lang");
    if (url && STR[url]) return url;
    var saved = localStorage.getItem("oa_lang");
    if (saved && STR[saved]) return saved;
    var nav = (navigator.language || "de").slice(0, 2).toLowerCase();
    if (STR[nav]) return nav;
    if (nav === "hr" || nav === "sr" || nav === "me") return "bs";
    if (nav === "pt") return "pt";
    return "de";
  }

  function apply(lang) {
    var d = STR[lang] || STR.de;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (d[k]) el.textContent = d[k];
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = d.rtl ? "rtl" : "ltr";
    if (META[lang]) {
      document.title = META[lang][0];
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", META[lang][1]);
    }
    localStorage.setItem("oa_lang", lang);
    var sel = document.getElementById("langSel");
    if (sel) sel.value = lang;
    // Sprach-Kürzel im <html> für CSS/SEO
    document.documentElement.setAttribute("data-lang", lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lang = detect();
    apply(lang);
    var sel = document.getElementById("langSel");
    if (sel) {
      sel.addEventListener("change", function () {
        apply(sel.value);
        var u = new URL(location.href);
        u.searchParams.set("lang", sel.value);
        history.replaceState(null, "", u.toString());
      });
    }
    // Scroll-Reveal
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  });
})();
