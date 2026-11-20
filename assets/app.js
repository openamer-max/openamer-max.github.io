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
    sq: ["OpenAmer — Asistenti yt personal me AI. Lokal. Privat. I sinqertë.", "OpenAmer është asistenti me AI që punon në kompjuterin tënd. Mbi 120 mjete."],
    pl: ["OpenAmer — Twój osobisty asystent AI. Lokalnie. Prywatnie. Uczciwie.", "OpenAmer działa na Twoim komputerze. Ponad 120 narzędzi, pełna kontrola nad danymi."],
    id: ["OpenAmer — Asisten AI pribadimu. Lokal. Privat. Jujur.", "OpenAmer berjalan di komputermu. Lebih dari 120 alat, kendali penuh atas data."],
    hi: ["OpenAmer — आपका व्यक्तिगत AI सहायक।", "सीधे आपके कंप्यूटर पर चलता है। 120+ टूल, पूरा नियंत्रण।"],
    ja: ["OpenAmer — あなた専用の AI アシスタント。ローカル。プライベート。誠実。", "あなたのパソコンで動きます。120 以上のツール、データは完全に你の手元に。"]
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
    // Fallback-Kette: gewuenschte Sprache -> Englisch -> Deutsch.
    // Die Website bietet 185 Sprachen an; noch nicht uebersetzte zeigen
    // englischen Text statt deutsch, damit internationale Besucher
    // wenigstens verstehen, was dasteht.
    var d = STR[lang] || STR.en || STR.de;
    var fb = STR.en || STR.de;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (d[k]) el.textContent = d[k];
      else if (fb[k]) el.textContent = fb[k];
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
    }, { threshold: 0, rootMargin: "200px 0px 200px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  });

  /* === Sprach-Banner: erkennt die Browsersprache und bietet sie sofort an === */
  (function () {
    var banner = document.getElementById("langBanner");
    var quick = document.getElementById("langQuick");
    var txt = document.getElementById("langTxt");
    var x = document.getElementById("langX");
    var sel = document.getElementById("langSel");
    if (!banner || !quick) return;

    // Alle Sprachen aus dem Haupt-Selektor uebernehmen
    if (sel) {
      quick.innerHTML = sel.innerHTML;
    }

    var TEXTE = {
      de: "Diese Seite gibt es in 185 Sprachen.",
      en: "This page is available in 185 languages.",
      ar: "\u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629 \u0645\u062a\u0627\u062d\u0629 \u0628\u0640 185 \u0644\u063a\u0629.",
      fr: "Cette page est disponible en 185 langues.",
      es: "Esta p\u00e1gina est\u00e1 disponible en 185 idiomas.",
      it: "Questa pagina \u00e8 disponibile in 185 lingue.",
      pt: "Esta p\u00e1gina est\u00e1 dispon\u00edvel em 185 idiomas.",
      ru: "\u042d\u0442\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u043d\u0430 185 \u044f\u0437\u044b\u043a\u0430\u0445.",
      tr: "Bu sayfa 185 dilde mevcut.",
      pl: "Ta strona jest dost\u0119pna w 185 j\u0119zykach.",
      nl: "Deze pagina is beschikbaar in 185 talen.",
      zh: "\u672c\u9875\u9762\u63d0\u4f9b 185 \u79cd\u8bed\u8a00\u3002",
      ja: "\u3053\u306e\u30da\u30fc\u30b8\u306f 185 \u8a00\u8a9e\u3067\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
      hi: "\u092f\u0939 \u092a\u0943\u0937\u094d\u0920 185 \u092d\u093e\u0937\u093e\u0913\u0902 \u092e\u0947\u0902 \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0964",
      ko: "\uc774 \ud398\uc774\uc9c0\ub294 185\uac1c \uc5b8\uc5b4\ub85c \uc81c\uacf5\ub429\ub2c8\ub2e4.",
      uk: "\u0426\u044f \u0441\u0442\u043e\u0440\u0456\u043d\u043a\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 185 \u043c\u043e\u0432\u0430\u043c\u0438."
    };

    // Browsersprache: de-DE -> de, zh-Hans -> zh
    function basis(code) {
      if (!code) return "en";
      var c = String(code).toLowerCase().split("-")[0];
      return c;
    }

    var gewuenscht = basis(navigator.language || navigator.userLanguage || "en");
    var vorhanden = sel ? Array.prototype.some.call(sel.options, function (o) { return o.value === gewuenscht; }) : false;

    // Banner nur zeigen, wenn die Browsersprache NICHT schon aktiv ist
    var aktuell = sel ? sel.value : null;
    if (gewuenscht && gewuenscht !== aktuell) {
      txt.textContent = TEXTE[gewuenscht] || TEXTE.en;
      quick.value = vorhanden ? gewuenscht : "";
      banner.hidden = false;
    }

    quick.addEventListener("change", function () {
      if (!quick.value) return;
      if (sel) {
        sel.value = quick.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (window.apply) {
        window.apply(quick.value);
      }
      try { localStorage.setItem("oa_lang", quick.value); } catch (e) {}
      banner.hidden = true;
    });

    if (x) x.addEventListener("click", function () { banner.hidden = true; });
  })();

})();
