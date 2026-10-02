// Vita Documentation — Client-side JS
// Single-file, no dependencies, vanilla ES6

(() => {
  "use strict";

  // ===== DOM Elements =====
  const sidebar = document.getElementById("docs-sidebar");
  const mobileToggle = document.getElementById("docs-mobile-toggle");
  const nav = document.getElementById("docs-nav");
  const searchInput = document.getElementById("docs-search-input");
  const searchResults = document.getElementById("docs-search-results");
  const contentInner = document.getElementById("docs-content-inner");

  // ===== State =====
  let searchIndex = [];
  let searchIndexLoaded = false;
  let focusedResultIndex = -1;
  let currentResults = [];

  // ===== Navigation Tree (matches admin panel structure) =====
  // part: подпись-разделитель перед группой (Часть I — панель, Часть II — модули)
  const NAV_TREE = [
    {
      id: "getting-started",
      title: "Быстрый старт",
      icon: "fa-solid fa-compass",
      part: "Часть I — Панель настроек шаблона",
      items: [
        { id: "getting-started", title: "Установка и активация" },
        { id: "getting-started-check", title: "Проверка работы" },
        { id: "getting-started-changelog", title: "Что нового" }
      ]
    },
    {
      id: "header",
      title: "Шапка сайта",
      icon: "fa-solid fa-window-maximize",
      items: [
        { id: "header-topbar", title: "Верхняя панель" },
        { id: "header-main", title: "Основная шапка" },
        { id: "header-logo", title: "Логотип магазина" },
        { id: "header-menu", title: "Меню каталога" },
        { id: "header-search", title: "Поиск и живые подсказки" },
        { id: "header-actions", title: "Корзина и действия" },
        { id: "header-mobile", title: "Мобильная шапка" },
        { id: "header-darkmode", title: "Тёмный режим" }
      ]
    },
    {
      id: "home",
      title: "Главная страница",
      icon: "fa-solid fa-house",
      items: [
        { id: "home-hero", title: "Первый экран (Hero)" },
        { id: "home-builder", title: "Конструктор витрины" },
        { id: "home-seo", title: "SEO и микроразметка" }
      ]
    },
    {
      id: "catalog",
      title: "Каталог и товары",
      icon: "fa-solid fa-boxes-stacked",
      items: [
        { id: "catalog-grid", title: "Витрина и сетка" },
        { id: "catalog-thumb", title: "Мини-карточка товара" },
        { id: "catalog-stickers", title: "Стикеры и бейджи" },
        { id: "catalog-product", title: "Страница товара" },
        { id: "catalog-live-price", title: "Живая цена" },
        { id: "catalog-mode", title: "Режим каталога (Витрина)" }
      ]
    },
    {
      id: "account",
      title: "Аккаунт и оформление",
      icon: "fa-solid fa-cart-shopping",
      items: [
        { id: "account-checkout", title: "Одностраничный заказ" },
        { id: "account-fast-order", title: "Быстрый заказ (1 клик)" },
        { id: "account-wishlist", title: "В закладки (Избранное)" },
        { id: "account-compare", title: "В сравнения" },
        { id: "account-profile", title: "Личный кабинет" },
        { id: "account-login", title: "Быстрая авторизация (в кабинете)" }
      ]
    },
    {
      id: "footer",
      title: "Подвал сайта",
      icon: "fa-solid fa-bars-staggered",
      items: [
        { id: "footer-brand", title: "О магазине" },
        { id: "footer-info", title: "Статьи и документы" },
        { id: "footer-links", title: "Ссылки и сервис" },
        { id: "footer-contacts", title: "Контакты и соцсети" },
        { id: "footer-bottom", title: "Копирайт и платежи" },
        { id: "footer-colors", title: "Цвета подвала" }
      ]
    },
    {
      id: "design",
      title: "Дизайн и стили",
      icon: "fa-solid fa-palette",
      items: [
        { id: "design-presets", title: "Готовые пресеты" },
        { id: "design-palette", title: "Цвета магазина" },
        { id: "design-typography", title: "Шрифты и типографика" },
        { id: "design-dark-theme", title: "Настройки тёмной темы" },
        { id: "design-width", title: "Ширина сайта" },
        { id: "design-geometry", title: "Скругления и радиусы" },
        { id: "design-modals", title: "Всплывающие окошки" },
        { id: "design-replace", title: "Найти и заменить цвета" },
        { id: "design-code", title: "Пользовательский код" }
      ]
    },
    {
      id: "ai",
      title: "AI и Инспектор",
      icon: "fa-solid fa-cube",
      items: [
        { id: "ai-inspector", title: "Конструктор AI (помощник на витрине)" }
      ]
    },
    {
      id: "modules",
      title: "Модули Вита",
      icon: "fa-solid fa-puzzle-piece",
      part: "Часть II — Модули в составе шаблона",
      items: [
        { id: "module-filter", title: "Вита Фильтр" },
        { id: "module-picker", title: "Подборщик товаров" },
        { id: "module-news", title: "Вита Новости / Блог + Галерея" },
        { id: "module-faq", title: "Вита FAQ" },
        { id: "module-testimonials", title: "Отзывы о магазине" },
        { id: "module-forms", title: "Конструктор форм" },
        { id: "module-visual", title: "Визуальный конструктор" },
        { id: "module-wall", title: "Стены категорий" },
        { id: "module-html", title: "HTML-блоки" },
        { id: "module-allinone", title: "All-in-One / Витрина" }
      ]
    },
    {
      id: "email",
      title: "Письмо о заказе (вкладка панели)",
      icon: "fa-solid fa-envelope",
      items: [
        { id: "email-branding", title: "Оформление и брендинг" },
        { id: "email-content", title: "Содержимое письма" },
        { id: "email-footer", title: "Подвал и контакты" },
        { id: "email-social", title: "Соцсети в письме" }
      ]
    },
    {
      id: "tips",
      title: "Советы и FAQ",
      icon: "fa-solid fa-lightbulb",
      items: [
        { id: "tips-presets", title: "Как подобрать пресет" },
        { id: "tips-catalog-mode", title: "Когда использовать режим каталога" },
        { id: "tips-cache", title: "Когда чистить кэш" },
        { id: "tips-errors", title: "Частые ошибки" },
        { id: "tips-performance", title: "Производительность" }
      ]
    }
  ];

  // ===== Init =====
  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    loadSearchIndex();
    initMobileToggle();
    initSmoothScroll();
    initIntersectionObserver();
    initSearch();
    initCollapsibleGroups();
    restoreHashOnLoad();
  });

  // ===== Build Sidebar Navigation =====
  function buildNav() {
    const savedCollapsed = JSON.parse(localStorage.getItem("vita-docs-collapsed") || "[]");

    NAV_TREE.forEach((group, gIdx) => {
      if (group.part) {
        const partEl = document.createElement("div");
        partEl.className = "docs-nav-part";
        partEl.textContent = group.part;
        nav.appendChild(partEl);
      }
      const groupEl = document.createElement("div");
      groupEl.className = "docs-nav-group" + (savedCollapsed.includes(group.id) ? " is-collapsed" : "");
      groupEl.dataset.groupId = group.id;

      const titleBtn = document.createElement("button");
      titleBtn.className = "docs-nav-group__title";
      titleBtn.type = "button";
      titleBtn.setAttribute("aria-expanded", !savedCollapsed.includes(group.id));
      titleBtn.innerHTML = `<span><i class="${group.icon} docs-nav-icon"></i> ${group.title}</span>`;
      titleBtn.addEventListener("click", () => toggleGroup(groupEl));

      const list = document.createElement("ul");
      list.className = "docs-nav-group__items";
      list.role = "list";

      group.items.forEach((item, iIdx) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${item.id}`;
        a.textContent = item.title;
        a.dataset.anchor = item.id;
        if (gIdx === 0 && iIdx === 0) a.classList.add("is-active");
        a.addEventListener("click", onNavClick);
        li.appendChild(a);
        list.appendChild(li);
      });

      groupEl.appendChild(titleBtn);
      groupEl.appendChild(list);
      nav.appendChild(groupEl);
    });
  }

  function onNavClick(e) {
    const link = e.currentTarget;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    updateHash(hash);
    document.querySelectorAll(".docs-nav-group__items a.is-active").forEach(a => a.classList.remove("is-active"));
    link.classList.add("is-active");
  }

  function toggleGroup(groupEl) {
    const groupId = groupEl.dataset.groupId;
    const isCollapsed = groupEl.classList.toggle("is-collapsed");
    const titleBtn = groupEl.querySelector(".docs-nav-group__title");
    titleBtn.setAttribute("aria-expanded", !isCollapsed);

    const saved = JSON.parse(localStorage.getItem("vita-docs-collapsed") || "[]");
    const updated = isCollapsed
      ? [...saved, groupId]
      : saved.filter(id => id !== groupId);
    localStorage.setItem("vita-docs-collapsed", JSON.stringify(updated));
  }

  function initCollapsibleGroups() {
    // Already handled in buildNav + toggleGroup
  }

  // ===== Mobile Drawer =====
  function initMobileToggle() {
    mobileToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i> МЕНЮ';
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click
    nav.addEventListener("click", e => {
      if (e.target.matches(".docs-nav-group__items a")) {
        sidebar.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i> МЕНЮ';
        document.body.style.overflow = "";
      }
    });

    // Close on click outside
    document.addEventListener("click", e => {
      if (sidebar.classList.contains("is-open") &&
          !sidebar.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        sidebar.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i> МЕНЮ';
        document.body.style.overflow = "";
      }
    });

    // Close on Escape
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i> МЕНЮ';
        document.body.style.overflow = "";
      }
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  function initSmoothScroll() {
    document.addEventListener("click", e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (hash === "#") return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        updateHash(hash);
        // Update active nav
        document.querySelectorAll(".docs-nav-group__items a.is-active").forEach(a => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }

  // ===== IntersectionObserver for Active Section =====
  function initIntersectionObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            updateActiveNav(id);
            updateHash(`#${id}`);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    document.querySelectorAll(".docs-section").forEach(section => {
      observer.observe(section);
    });
  }

  function updateActiveNav(sectionId) {
    document.querySelectorAll(".docs-nav-group__items a.is-active").forEach(a => a.classList.remove("is-active"));
    const activeLink = document.querySelector(`.docs-nav-group__items a[data-anchor="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add("is-active");
      // Expand parent group
      const group = activeLink.closest(".docs-nav-group");
      if (group && group.classList.contains("is-collapsed")) {
        group.classList.remove("is-collapsed");
        const titleBtn = group.querySelector(".docs-nav-group__title");
        titleBtn.setAttribute("aria-expanded", "true");
        const saved = JSON.parse(localStorage.getItem("vita-docs-collapsed") || "[]");
        const updated = saved.filter(id => id !== group.dataset.groupId);
        localStorage.setItem("vita-docs-collapsed", JSON.stringify(updated));
      }
      // Scroll sidebar to active link
      activeLink.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function updateHash(hash) {
    if (history.replaceState) {
      history.replaceState(null, "", hash);
    } else {
      window.location.hash = hash;
    }
  }

  function restoreHashOnLoad() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          updateActiveNav(target.id);
        }, 100);
      }
    }
  }

  // ===== Search Index Loading =====
  async function loadSearchIndex() {
    if (window.VITA_SEARCH_INDEX && Array.isArray(window.VITA_SEARCH_INDEX)) {
      searchIndex = window.VITA_SEARCH_INDEX;
      searchIndexLoaded = true;
      return;
    }
    try {
      const resp = await fetch("assets/search-index.json", { cache: "no-cache" });
      if (!resp.ok) throw new Error("Failed to load search index");
      searchIndex = await resp.json();
      searchIndexLoaded = true;
    } catch (err) {
      console.warn("Search index not loaded:", err);
      searchIndex = [];
      searchIndexLoaded = true;
    }
  }

  // ===== Search Logic =====
  function initSearch() {
    let debounceTimer = null;

    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => performSearch(searchInput.value.trim()), 100);
    });

    searchInput.addEventListener("keydown", e => {
      if (!searchResults.hasChildNodes()) return;
      const items = searchResults.querySelectorAll(".search-result-item");
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusedResultIndex = Math.min(focusedResultIndex + 1, items.length - 1);
        updateFocusedResult(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusedResultIndex = Math.max(focusedResultIndex - 1, 0);
        updateFocusedResult(items);
      } else if (e.key === "Enter" && focusedResultIndex >= 0) {
        e.preventDefault();
        items[focusedResultIndex].click();
      } else if (e.key === "Escape") {
        closeSearchResults();
      }
    });

    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) performSearch(searchInput.value.trim());
    });

    document.addEventListener("click", e => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        closeSearchResults();
      }
    });

    // Global shortcut: "/" to focus search
    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== searchInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      closeSearchResults();
      return;
    }
    if (!searchIndexLoaded) return;

    const lowerQuery = query.toLowerCase();
    const scored = searchIndex.map(item => {
      let score = 0;
      const title = (item.title || "").toLowerCase();
      const keywords = (item.keywords || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const group = (item.group || "").toLowerCase();

      if (title.includes(lowerQuery)) score += 100;
      if (title.startsWith(lowerQuery)) score += 50;
      if (keywords.includes(lowerQuery)) score += 30;
      if (desc.includes(lowerQuery)) score += 10;
      if (group.includes(lowerQuery)) score += 5;

      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

    currentResults = scored;
    focusedResultIndex = -1;
    renderSearchResults(scored);
  }

  function renderSearchResults(results) {
    if (!results.length) {
      searchResults.innerHTML = `<div class="search-section"><div class="search-section__label">Ничего не найдено</div></div>`;
      return;
    }

    // Group by section
    const bySection = {};
    results.forEach(item => {
      if (!bySection[item.section]) bySection[item.section] = [];
      bySection[item.section].push(item);
    });

    const sectionOrder = ["getting-started", "header", "home", "catalog", "account", "footer", "design", "ai", "modules", "email", "tips"];
    const sectionLabels = {
      "getting-started": "Быстрый старт",
      "header": "Шапка сайта",
      "home": "Главная страница",
      "catalog": "Каталог и товары",
      "account": "Аккаунт и оформление",
      "footer": "Подвал сайта",
      "design": "Дизайн и стили",
      "ai": "AI и Инспектор",
      "modules": "Модули Вита",
      "email": "Письмо о заказе",
      "tips": "Советы и FAQ"
    };

    let html = "";
    sectionOrder.forEach(sec => {
      if (!bySection[sec]) return;
      html += `<div class="search-section"><div class="search-section__label">${sectionLabels[sec] || sec}</div>`;
      bySection[sec].forEach(item => {
        html += `<a href="#${item.anchor}" class="search-result-item" data-anchor="${item.anchor}" role="option">
          <div class="search-result-item__title">${escapeHtml(item.title)}</div>
          ${item.description ? `<div class="search-result-item__desc">${escapeHtml(item.description)}</div>` : ""}
          <div class="search-result-item__section">${escapeHtml(item.group)}</div>
        </a>`;
      });
      html += `</div>`;
    });

    searchResults.innerHTML = html;

    // Attach click handlers
    searchResults.querySelectorAll(".search-result-item").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const anchor = a.dataset.anchor;
        const target = document.getElementById(anchor);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          updateActiveNav(anchor);
          updateHash(`#${anchor}`);
        }
        closeSearchResults();
        searchInput.value = "";
        searchInput.blur();
      });
    });
  }

  function updateFocusedResult(items) {
    items.forEach((item, i) => {
      item.classList.toggle("is-focused", i === focusedResultIndex);
    });
    if (focusedResultIndex >= 0) {
      items[focusedResultIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function closeSearchResults() {
    searchResults.innerHTML = "";
    focusedResultIndex = -1;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, String.fromCharCode(38) + "amp;")
      .replace(/</g, String.fromCharCode(38) + "lt;")
      .replace(/>/g, String.fromCharCode(38) + "gt;")
      .replace(/"/g, String.fromCharCode(38) + "quot;")
      .replace(/'/g, String.fromCharCode(38) + "#039;");
  }

  // ===== Expose for debugging =====
  window.VitaDocs = { searchIndex, NAV_TREE };
})();