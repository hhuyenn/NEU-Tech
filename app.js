(() => {
  "use strict";

  const STORE = {
    products: "novatech_products",
    categories: "novatech_categories",
    articles: "novatech_articles",
    orders: "novatech_orders",
    cart: "novatech_cart",
    about: "novatech_about",
    contacts: "novatech_contacts",
  };
  const money = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value) || 0);
  const safe = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.error(`Không thể đọc dữ liệu ${key} từ localStorage.`, error);
      return fallback;
    }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const seed = window.NovaSeed;
  const initialize = (key, initial) => {
    if (localStorage.getItem(key) === null) save(key, initial);
  };
  initialize(STORE.products, seed.products);
  initialize(STORE.categories, seed.categories);
  initialize(STORE.articles, seed.articles);
  initialize(STORE.orders, []);
  initialize(STORE.cart, []);
  initialize(STORE.about, seed.about);
  initialize(STORE.contacts, []);
  const currentAbout = read(STORE.about, seed.about);
  for (const key of ["title", "intro", "mission", "vision"]) {
    if (typeof currentAbout[key] === "string")
      currentAbout[key] = currentAbout[key].replace(/NovaTech/g, "NEUTech");
  }
  save(STORE.about, currentAbout);
  const mergeCatalogDefaults = (key, defaults) => {
    const current = read(key, null);
    if (!Array.isArray(current)) return false;
    const existingIds = new Set(current.map((item) => item.id));
    const additions = defaults.filter((item) => !existingIds.has(item.id));
    if (additions.length) save(key, [...current, ...additions]);
    return true;
  };
  const catalogVersion = "novatech_catalog_v5";
  if (localStorage.getItem(catalogVersion) !== "1") {
    const categoriesMerged = mergeCatalogDefaults(
      STORE.categories,
      seed.categories,
    );
    const productsMerged = mergeCatalogDefaults(STORE.products, seed.products);
    if (categoriesMerged && productsMerged) {
      const currentCategories = read(STORE.categories, []);
      const currentProducts = read(STORE.products, []);
      const removedCategoryIds = new Set(["tivi", "tu-lanh", "gia-dung"]);
      const remappedCategoryIds = new Set(["loa"]);
      let foundDescendant = true;
      while (foundDescendant) {
        foundDescendant = false;
        currentCategories.forEach((category) => {
          if (
            removedCategoryIds.has(category.parentId) &&
            !removedCategoryIds.has(category.id)
          ) {
            removedCategoryIds.add(category.id);
            foundDescendant = true;
          } else if (
            remappedCategoryIds.has(category.parentId) &&
            !remappedCategoryIds.has(category.id)
          ) {
            remappedCategoryIds.add(category.id);
            foundDescendant = true;
          }
        });
      }
      const removedProductIds = new Set(
        currentProducts
          .filter((product) => removedCategoryIds.has(product.categoryId))
          .map((product) => product.id),
      );
      save(
        STORE.categories,
        currentCategories.filter(
          (category) =>
            !removedCategoryIds.has(category.id) &&
            !remappedCategoryIds.has(category.id),
        ),
      );
      save(
        STORE.products,
        currentProducts
          .filter((product) => !removedCategoryIds.has(product.categoryId))
          .map((product) =>
            remappedCategoryIds.has(product.categoryId)
              ? { ...product, categoryId: "phu-kien" }
              : product,
          ),
      );
      const currentCart = read(STORE.cart, []);
      if (Array.isArray(currentCart))
        save(
          STORE.cart,
          currentCart.filter(
            (entry) => !removedProductIds.has(entry.productId),
          ),
        );
      localStorage.setItem(catalogVersion, "1");
    }
  }
  const products = () => read(STORE.products, []);
  const categories = () => read(STORE.categories, []);
  const articles = () => read(STORE.articles, []);
  const orders = () => read(STORE.orders, []);
  const cart = () => read(STORE.cart, []);
  const visibleProducts = () =>
    products().filter((item) => item.visible !== false);
  const visibleArticles = () =>
    articles()
      .filter((item) => item.visible !== false)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const categoryName = (id) =>
    categories().find((item) => item.id === id)?.name || "Khác";
  const homeCategoryOrder = [
    "dien-thoai",
    "may-tinh-bang",
    "laptop",
    "dong-ho",
    "phu-kien",
  ];
  const homeCategories = () =>
    categories()
      .filter(
        (category) =>
          !category.parentId && homeCategoryOrder.includes(category.id),
      )
      .sort((a, b) => {
        const aIndex = homeCategoryOrder.indexOf(a.id);
        const bIndex = homeCategoryOrder.indexOf(b.id);
        return (
          (aIndex < 0 ? homeCategoryOrder.length : aIndex) -
          (bIndex < 0 ? homeCategoryOrder.length : bIndex)
        );
      });
  const image = (url, className = "", alt = "") =>
    `<img class="${className}" src="${safe(url)}" alt="${safe(alt)}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/product-placeholder.svg'">`;
  const link = (page, label, extra = "") =>
    `<a href="index.html?page=${page}" ${extra}>${label}</a>`;
  const productUrl = (id) =>
    `index.html?page=product&id=${encodeURIComponent(id)}`;
  const articleUrl = (id) =>
    `index.html?page=article&id=${encodeURIComponent(id)}`;
  const pageParam = new URLSearchParams(location.search);
  if (
    pageParam.get("page") === "policy" &&
    pageParam.get("section") === "shipping"
  ) {
    pageParam.set("section", "process");
    history.replaceState(
      null,
      "",
      `${location.pathname}?${pageParam.toString()}${location.hash}`,
    );
  }
  const page = pageParam.get("page") || "home";
  let noticeTimer;
  const paymentLabel = (payment) =>
    ({
      store: "Thanh toán tại cửa hàng",
      cod: "Thanh toán khi nhận hàng (COD)",
      qr: "Chuyển khoản QR",
      bank: "Chuyển khoản",
      vnpay: "VNPAY (mô phỏng)",
      momo: "MoMo (mô phỏng)",
      card: "Thẻ ngân hàng (mô phỏng)",
    })[payment] || "Chưa xác định";
  const deliveryLabel = (delivery) =>
    delivery?.type === "store" ? "Nhận tại cửa hàng" : "Giao hàng tận nơi";
  const orderStatus = (status) =>
    status === "Mới đặt" || !status ? "Đang xác nhận" : status;
  const deliveryFee = (subtotal, type) =>
    type === "store" || subtotal >= 2000000 ? 0 : 30000;
  const storeLocations = {
    "Hà Nội": {
      "Ba Đình": ["NEUTech Ba Đình - 20 Kim Mã"],
      "Cầu Giấy": ["NEUTech Cầu Giấy - 120 Xuân Thủy"],
      "Hoàn Kiếm": ["NEUTech Hoàn Kiếm - 35 Hàng Bài"],
    },
    "Hồ Chí Minh": {
      "Quận 1": ["NEUTech Quận 1 - 25 Lê Lợi"],
      "Quận 3": ["NEUTech Quận 3 - 180 Cách Mạng Tháng Tám"],
      "Thủ Đức": ["NEUTech Thủ Đức - 10 Võ Văn Ngân"],
    },
    "Đà Nẵng": {
      "Hải Châu": ["NEUTech Hải Châu - 90 Nguyễn Văn Linh"],
      "Sơn Trà": ["NEUTech Sơn Trà - 15 Ngô Quyền"],
    },
  };
  const addToCart = (id, count = 1) => {
    const product = visibleProducts().find((item) => item.id === id);
    if (!product) return showToast("Sản phẩm hiện không có sẵn.");
    const current = cart();
    const existing = current.find((item) => item.productId === id);
    if (existing) existing.quantity += count;
    else current.push({ productId: id, quantity: count });
    save(STORE.cart, current);
    updateCartCount();
    showToast("Đã thêm sản phẩm vào giỏ hàng.");
  };
  const updateCartCount = () => {
    const count = cart().reduce(
      (total, item) => total + Number(item.quantity),
      0,
    );
    document
      .querySelectorAll("[data-cart-count]")
      .forEach((node) => (node.textContent = String(count)));
  };
  const showToast = (message) => {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  };
  const share = async (title, url) => {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(new URL(url, location.href).href);
        showToast("Đã sao chép liên kết.");
      }
    } catch (error) {
      if (error.name !== "AbortError")
        showToast(
          "Không thể chia sẻ. Hãy sao chép đường dẫn trên thanh địa chỉ.",
        );
    }
  };
  const productCard = (product) => `
    <article class="product-card">
      <a class="product-photo" href="${productUrl(product.id)}">${image(product.image, "", product.name)}${product.tag ? `<span class="product-tag">${safe(product.tag)}</span>` : ""}</a>
      <div class="product-card-body">
        <span class="eyebrow">${safe(categoryName(product.categoryId))}</span>
        <h3><a href="${productUrl(product.id)}">${safe(product.name)}</a></h3>
        <p class="price">${money(product.price)} ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</p>
        <button class="button button-outline button-small" data-add="${safe(product.id)}">Thêm vào giỏ</button>
      </div>
    </article>`;
  const articleCard = (article) => `
    <article class="article-card">
      <a class="article-photo" href="${articleUrl(article.id)}">${image(article.image, "", article.title)}</a>
      <div class="article-card-body"><span class="eyebrow">${safe(article.category)} · ${safe(article.createdAt)}</span>
        <h3><a href="${articleUrl(article.id)}">${safe(article.title)}</a></h3><p>${safe(article.summary)}</p>${link(`article&id=${encodeURIComponent(article.id)}`, "Đọc bài viết →", 'class="text-link"')}
      </div>
    </article>`;
  const header = () => `
    <div class="topbar"><div class="container topbar-inner"><span>Miễn phí giao hàng cho đơn từ 2.000.000đ</span><span>Hotline hỗ trợ: <a href="tel:1900886688">1900 886 688</a></span></div></div>
    <header class="site-header"><div class="container header-main">
      <a class="logo" href="index.html"><span class="brand-mark">N</span><span>NEU<span class="logo-accent">Tech</span><small>CÔNG NGHỆ CHO CUỘC SỐNG</small></span></a>
      <form class="search-form" id="search-form"><input name="q" placeholder="Bạn đang tìm sản phẩm nào?" value="${safe(pageParam.get("q") || "")}" aria-label="Tìm kiếm sản phẩm"><button aria-label="Tìm kiếm">⌕</button></form>
      <div class="header-actions"><a href="index.html?page=contact" class="header-support"><svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"></circle><path d="M5 20c.8-3.6 3.1-5.4 7-5.4s6.2 1.8 7 5.4"></path></svg><span>Hỗ trợ<small>Khách hàng</small></span></a>${link("track", '<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h5"></path></svg><span>Tra cứu<small>Đơn hàng</small></span>', 'class="header-track"')}<a href="index.html?page=cart" class="cart-link"><svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg><span>Giỏ hàng <b data-cart-count>0</b></span></a></div>
    </div>
    <nav class="main-nav"><div class="container nav-inner">
      ${link("home", "Trang chủ", 'class="nav-link"')}${link("products", "Sản phẩm", 'class="nav-link"')}<a href="index.html?page=home#categories" class="nav-link">Danh mục</a>${link("about", "Giới thiệu", 'class="nav-link"')}${link("news", "Tin tức", 'class="nav-link"')}${link("contact", "Liên hệ", 'class="nav-link"')}
    </div></nav></header>`;
  const footer = () => `
    <footer class="site-footer"><div class="container footer-grid">
      <div><a class="logo footer-logo" href="index.html"><span class="brand-mark">N</span><span>NEU<span class="logo-accent">Tech</span><small>CÔNG NGHỆ CHO CUỘC SỐNG</small></span></a><p>Khám phá công nghệ chính hãng với trải nghiệm mua sắm dễ dàng và dịch vụ tận tâm.</p></div>
      <div><h3>Khám phá</h3>${link("products", "Sản phẩm")}${link("about", "Về NEUTech")}${link("news", "Tin công nghệ")}</div>
      <div><h3>Hỗ trợ & chính sách</h3>${link("contact", "Liên hệ với chúng tôi")}${link("track", "Tra cứu đơn hàng")}${link("policy&section=general", "Quy định chung")}${link("policy&section=process", "Quy trình giao dịch")}${link("policy&section=warranty", "Bảo hành")}${link("policy&section=return", "Hủy giao dịch, đổi trả")}${link("policy&section=privacy", "Bảo mật")}${link("policy&section=terms", "Điều khoản sử dụng")}</div>
      <div><h3>Liên hệ</h3><p>207 đường Giải Phóng, phường Bạch Mai, Hà Nội</p><p><a href="tel:1900886688">1900 886 688</a><br><a href="mailto:hello@neutech.demo">hello@neutech.demo</a></p><div class="socials"><a href="https://facebook.com" aria-label="Facebook">f</a><a href="https://instagram.com" aria-label="Instagram">◎</a><a href="https://youtube.com" aria-label="YouTube">▶</a></div></div>
    </div><div class="container footer-bottom"><span>© 2026 NEUTech.</span><span>Thanh toán trực tuyến không được tích hợp.</span></div></footer>`;
  const shell = (content, title) => {
    const app = document.getElementById("app");
    const isHome = page === "home";
    document.body.classList.toggle("home-page", isHome);
    app.classList.toggle("home-site", isHome);
    document.title = `${title} | NEUTech`;
    app.innerHTML = `${header()}<main>${content}</main>${footer()}<div class="toast" aria-live="polite"></div>`;
    updateCartCount();
    if (isHome && location.hash === "#categories")
      requestAnimationFrame(() =>
        app.querySelector("#categories")?.scrollIntoView(),
      );
  };
  const pageTitle = (kicker, title, description = "") =>
    `<section class="page-heading"><div class="container"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${description ? `<p>${description}</p>` : ""}</div></section>`;
  const sectionHeading = (kicker, title, href, text = "Xem tất cả") =>
    `<div class="section-heading"><div><span class="eyebrow">${kicker}</span><h2>${title}</h2></div>${href ? link(href, `${text} <span>→</span>`, 'class="text-link"') : ""}</div>`;
  const emptyState = (title, text) =>
    `<div class="empty-state"><span>⌕</span><h3>${title}</h3><p>${text}</p></div>`;

  function renderHome() {
    const featured = visibleProducts()
      .filter((item) => item.featured)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 4);
    const newest = visibleProducts()
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 4);
    const latestArticles = visibleArticles().slice(0, 3);
    const homeCategoryItems = homeCategories();
    const categoryImage = (category) => {
      const imageByCategory = {
        "dien-thoai": "p-iphone-15",
        "may-tinh-bang": "p-ipad-air",
        laptop: "p-macbook-air",
        "dong-ho": "p-watch",
        "phu-kien": "p-charger",
      };
      return (
        products().find(
          (product) => product.id === imageByCategory[category.id],
        )?.image ||
        products().find((product) => product.categoryId === category.id)
          ?.image ||
        "assets/images/product-placeholder.svg"
      );
    };
    const promoProducts = ["p-galaxy-a55", "p-watch", "p-jbl-speaker"]
      .map((id) => products().find((product) => product.id === id))
      .filter(Boolean);
    shell(
      `
      <section class="home-promo-layout container">
        <div class="hero home-hero"><div class="hero-content"><span class="home-hero-kicker">NEUTECH · CÔNG NGHỆ CHO CUỘC SỐNG</span><h1>TRẢI NGHIỆM CÔNG NGHỆ<br>MỞ LỐI SỐNG THÔNG MINH</h1><p>Điện thoại, laptop, thiết bị đeo và phụ kiện công nghệ chính hãng.</p><div class="hero-actions">${link("products", "Khám phá ngay", 'class="button button-primary"')}</div></div></div>
        <div class="home-promos">${promoProducts.map((product, index) => `<a class="home-promo-card promo-${index + 1}" href="${productUrl(product.id)}">${image(product.image, "promo-image", product.name)}<span><small>${index === 0 ? "ƯU ĐÃI ĐIỆN THOẠI" : index === 1 ? "THIẾT BỊ ĐEO THÔNG MINH" : "PHỤ KIỆN CÔNG NGHỆ"}</small><strong>${safe(product.name)}</strong></span></a>`).join("")}</div>
      </section>
      <section class="section container home-categories" id="categories"><h2>Danh mục sản phẩm</h2><div class="category-grid">${homeCategoryItems.map((category) => `<a href="index.html?page=products&category=${encodeURIComponent(category.id)}" class="category-tile">${image(categoryImage(category), "category-image", category.name)}<span class="category-name">${safe(category.name)}</span></a>`).join("")}</div></section>
      <section class="section section-tint"><div class="container">${sectionHeading("ĐƯỢC YÊU THÍCH", "Sản phẩm nổi bật", "products")}<div class="product-grid">${featured.map(productCard).join("") || emptyState("Chưa có sản phẩm nổi bật", "Hãy quay lại sau nhé.")}</div></div></section>
      <section class="section container">${sectionHeading("MỚI LÊN KỆ", "Khám phá sản phẩm mới", "products")}<div class="product-grid">${newest.map(productCard).join("") || emptyState("Chưa có sản phẩm", "Sản phẩm mới sẽ sớm xuất hiện.")}</div></section>
      <section class="about-strip"><div class="container about-strip-inner"><div class="about-visual">${image("https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85", "", "Không gian công nghệ")}</div><div><span class="eyebrow">CÂU CHUYỆN NEUTECH</span><h2>Công nghệ tốt hơn,<br>cuộc sống nhiều cảm hứng hơn.</h2><p>Chúng tôi tin rằng công nghệ phù hợp có thể giúp mỗi ngày trở nên tuyệt vời hơn. NEUTech tuyển chọn sản phẩm đáng tin cậy và mang đến tư vấn chân thành cho từng nhu cầu.</p>${link("about", "Tìm hiểu về chúng tôi →", 'class="text-link"')}</div></div></section>
      <section class="section container">${sectionHeading("GÓC CÔNG NGHỆ", "Tin tức mới nhất", "news")}<div class="article-grid">${latestArticles.map(articleCard).join("") || emptyState("Chưa có bài viết", "Tin mới đang được cập nhật.")}</div></section>
      <section class="newsletter container"><div><span class="eyebrow">KẾT NỐI VỚI NEUTECH</span><h2>Sẵn sàng cho trải nghiệm mới?</h2><p>Khám phá thiết bị phù hợp với phong cách sống của bạn.</p></div>${link("products", "Mua sắm ngay →", 'class="button button-primary"')}</section>
    `,
      "Trang chủ",
    );
  }

  function renderAbout() {
    const about = read(STORE.about, seed.about);
    shell(
      `${pageTitle("VỀ NEUTECH", "Công nghệ tốt hơn, cuộc sống nhiều cảm hứng hơn", "Cùng khám phá câu chuyện và những giá trị tạo nên NEUTech.")}<section class="section container story-grid"><div class="story-image">${image("https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85", "", "Thiết bị công nghệ hiện đại")}</div><div><span class="eyebrow">CÂU CHUYỆN CỦA CHÚNG TÔI</span><h2>${safe(about.title)}</h2><p>${safe(about.intro)}</p><p>NEUTech mang đến điện thoại, máy tính, thiết bị đeo và phụ kiện được tuyển chọn kỹ lưỡng. Đội ngũ của chúng tôi luôn sẵn sàng chia sẻ thông tin rõ ràng để bạn đưa ra lựa chọn phù hợp.</p><div class="story-stats"><div><strong>100%</strong><span>Sản phẩm chính hãng</span></div><div><strong>Tận tâm</strong><span>Trong từng tư vấn</span></div></div></div></section><section class="section section-tint"><div class="container values-grid"><article><span class="eyebrow">SỨ MỆNH</span><h2>Mang công nghệ hữu ích đến gần hơn</h2><p>${safe(about.mission)}</p></article><article><span class="eyebrow">TẦM NHÌN</span><h2>Điểm đến công nghệ đáng tin cậy</h2><p>${safe(about.vision)}</p></article></div></section><section class="section container"><div class="center-block"><span class="eyebrow">LUÔN SẴN SÀNG HỖ TRỢ</span><h2>Chọn NEUTech, chọn sự an tâm.</h2><p>Sản phẩm rõ nguồn gốc, thông tin minh bạch và đội ngũ tư vấn luôn đồng hành.</p>${link("contact", "Liên hệ với chúng tôi →", 'class="button button-primary"')}</div></section>`,
      "Giới thiệu",
    );
  }

  function renderProducts() {
    const query = (pageParam.get("q") || "").trim().toLowerCase();
    const selectedCategory = pageParam.get("category") || "";
    const maxPrice = Number(pageParam.get("max") || 0);
    const sort = pageParam.get("sort") || "featured";
    let result = visibleProducts().filter((product) => {
      const textMatch =
        !query ||
        `${product.name} ${product.code} ${product.description}`
          .toLowerCase()
          .includes(query);
      const categoryMatch =
        !selectedCategory ||
        product.categoryId === selectedCategory ||
        categories().some(
          (cat) =>
            cat.id === product.categoryId && cat.parentId === selectedCategory,
        );
      return (
        textMatch && categoryMatch && (!maxPrice || product.price <= maxPrice)
      );
    });
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "newest")
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const catOptions = categories()
      .map(
        (item) =>
          `<option value="${safe(item.id)}" ${selectedCategory === item.id ? "selected" : ""}>${safe(item.parentId ? "— " : "")}${safe(item.name)}</option>`,
      )
      .join("");
    shell(
      `${pageTitle("CỬA HÀNG NEUTECH", "Khám phá thiết bị công nghệ", "Tìm người bạn đồng hành phù hợp cho công việc, học tập và giải trí.")}<section class="section container products-layout"><aside class="filter-panel"><h2>Bộ lọc sản phẩm</h2><form id="filter-form"><label>Từ khóa<input name="q" value="${safe(pageParam.get("q") || "")}" placeholder="Tên sản phẩm..."></label><label>Danh mục<select name="category"><option value="">Tất cả danh mục</option>${catOptions}</select></label><label>Giá tối đa<select name="max"><option value="">Không giới hạn</option><option value="5000000" ${maxPrice === 5000000 ? "selected" : ""}>Dưới 5 triệu</option><option value="15000000" ${maxPrice === 15000000 ? "selected" : ""}>Dưới 15 triệu</option><option value="25000000" ${maxPrice === 25000000 ? "selected" : ""}>Dưới 25 triệu</option></select></label><label>Sắp xếp<select name="sort"><option value="featured" ${sort === "featured" ? "selected" : ""}>Nổi bật</option><option value="newest" ${sort === "newest" ? "selected" : ""}>Mới nhất</option><option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Giá thấp đến cao</option><option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Giá cao đến thấp</option></select></label><button class="button button-primary button-full">Lọc sản phẩm</button></form><a class="filter-reset" href="index.html?page=products">Xóa bộ lọc</a></aside><div class="catalog"><div class="catalog-toolbar"><span>${query ? `Kết quả cho “${safe(query)}”` : "Tất cả sản phẩm"} <b>(${result.length})</b></span><span>Giá đã gồm thuế VAT</span></div><div class="product-grid">${result.map(productCard).join("") || emptyState("Không tìm thấy sản phẩm", "Hãy thử từ khóa khác hoặc xóa bớt bộ lọc.")}</div></div></section>`,
      "Sản phẩm",
    );
  }

  function renderProduct() {
    const item = visibleProducts().find(
      (product) => product.id === pageParam.get("id"),
    );
    if (!item)
      return shell(
        `${pageTitle("CỬA HÀNG", "Không tìm thấy sản phẩm", "Sản phẩm có thể đã bị ẩn hoặc không còn tồn tại.")}<section class="section container">${link("products", "← Quay lại cửa hàng", 'class="button button-primary"')}</section>`,
        "Không tìm thấy sản phẩm",
      );
    const related = visibleProducts()
      .filter(
        (product) =>
          product.categoryId === item.categoryId && product.id !== item.id,
      )
      .slice(0, 4);
    shell(
      `<div class="container breadcrumbs">${link("home", "Trang chủ")} / ${link("products", "Sản phẩm")} / ${safe(item.name)}</div><section class="container product-detail"><div class="detail-photo">${image(item.image, "", item.name)}</div><div class="detail-info"><span class="eyebrow">${safe(categoryName(item.categoryId))} · Mã ${safe(item.code)}</span><h1>${safe(item.name)}</h1><div class="detail-price">${money(item.price)} ${item.oldPrice ? `<del>${money(item.oldPrice)}</del>` : ""}</div><p class="detail-description">${safe(item.description)}</p><div class="stock-note"><span></span> Còn hàng · Bảo hành chính hãng</div><div class="detail-actions"><button class="button button-primary" data-add="${safe(item.id)}">Thêm vào giỏ hàng</button><button class="button button-outline" data-share-product="${safe(item.id)}">Chia sẻ sản phẩm</button></div><div class="delivery-note"><b>✓</b><span><strong>Giao hàng toàn quốc</strong><br>Kiểm tra hàng trước khi thanh toán.<br>${link("policy&section=process", "Xem quy trình giao dịch")}</span></div><p class="product-policy-link">${link("policy&section=warranty", "Chính sách bảo hành")}${" · "}${link("policy&section=return", "Đổi trả, hủy giao dịch")}</p></div></section><section class="section section-tint"><div class="container">${sectionHeading("CÓ THỂ BẠN SẼ THÍCH", "Sản phẩm liên quan", "products")}<div class="product-grid">${related.map(productCard).join("") || emptyState("Chưa có sản phẩm liên quan", "Khám phá thêm các sản phẩm khác tại cửa hàng.")}</div></section>`,
      item.name,
    );
  }

  function cartRows() {
    const currentProducts = products();
    return cart()
      .map((entry) => ({
        ...entry,
        product: currentProducts.find(
          (product) => product.id === entry.productId,
        ),
      }))
      .filter((entry) => entry.product && entry.product.visible !== false);
  }
  function renderCart() {
    const rows = cartRows();
    const subtotal = rows.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );
    const fee = rows.length ? deliveryFee(subtotal, "home") : 0;
    const total = subtotal + fee;
    const table = rows
      .map(
        (entry) =>
          `<article class="cart-row"><a class="cart-product" href="${productUrl(entry.product.id)}">${image(entry.product.image, "", entry.product.name)}<span><strong>${safe(entry.product.name)}</strong><small>Mã: ${safe(entry.product.code)}</small></span></a><div class="cart-unit">${money(entry.product.price)}</div><div class="quantity-control"><button aria-label="Giảm" data-quantity="${safe(entry.product.id)}" data-delta="-1">−</button><span>${entry.quantity}</span><button aria-label="Tăng" data-quantity="${safe(entry.product.id)}" data-delta="1">+</button></div><strong class="cart-line-total">${money(entry.product.price * entry.quantity)}</strong><button class="remove-button" data-remove="${safe(entry.product.id)}" aria-label="Xóa sản phẩm">×</button></article>`,
      )
      .join("");
    shell(
      `${pageTitle("GIỎ HÀNG", "Túi mua sắm của bạn", "Kiểm tra sản phẩm trước khi tiến hành đặt hàng.")}<section class="section container cart-layout"><div class="cart-items">${rows.length ? `<div class="cart-labels"><span>SẢN PHẨM</span><span>ĐƠN GIÁ</span><span>SỐ LƯỢNG</span><span>TẠM TÍNH</span><span></span></div>${table}` : emptyState("Giỏ hàng đang trống", "Khám phá cửa hàng và thêm sản phẩm bạn yêu thích.")}${link("products", "← Tiếp tục mua sắm", 'class="text-link cart-back"')}</div><aside class="summary-card"><h2>Tóm tắt đơn hàng</h2><div class="summary-line"><span>Tạm tính</span><b>${money(subtotal)}</b></div><div class="summary-line"><span>Phí giao hàng dự kiến</span><span>${fee ? money(fee) : "Miễn phí"}</span></div><div class="summary-line summary-total"><strong>Tổng dự kiến</strong><strong>${money(total)}</strong></div><p>Giao hàng miễn phí từ 2.000.000đ; nhận tại cửa hàng miễn phí.</p>${rows.length ? link("checkout", "Tiến hành đặt hàng →", 'class="button button-primary button-full"') : `<button class="button button-primary button-full" disabled>Tiến hành đặt hàng</button>`}</aside></section>`,
      "Giỏ hàng",
    );
  }

  function renderCheckout() {
    const rows = cartRows();
    if (!rows.length)
      return shell(
        `${pageTitle("ĐẶT HÀNG", "Chưa có sản phẩm để đặt hàng", "Hãy thêm sản phẩm vào giỏ trước khi tiếp tục.")}<section class="section container center-block">${link("products", "Khám phá sản phẩm →", 'class="button button-primary"')}</section>`,
        "Đặt hàng",
      );
    const subtotal = rows.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );
    const paymentOptions = [
      [
        "store",
        "Thanh toán khi nhận hàng",
        "Thanh toán khi nhận sản phẩm tại cửa hàng.",
        "⌂",
      ],
      [
        "cod",
        "Thanh toán khi nhận hàng (COD)",
        "Thanh toán khi nhận sản phẩm tại nhà.",
        "▣",
      ],
      ["qr", "Chuyển khoản QR", "Chuyển khoản qua mã QR mô phỏng.", "▦"],
    ];
    shell(
      `${pageTitle("ĐẶT HÀNG", "Thông tin đặt hàng", "Chọn cách nhận hàng, phương thức thanh toán và cung cấp thông tin cần thiết.")}<section class="section container checkout-layout"><form id="checkout-form" class="form-card"><h2>Thông tin người nhận</h2><div class="form-grid"><label>Họ và tên *<input name="name" required minlength="2" autocomplete="name"></label><label>Số điện thoại *<input name="phone" required pattern="[0-9]{9,15}" title="Nhập số điện thoại gồm 9-15 chữ số" autocomplete="tel"></label><label class="span-2">Email *<input name="email" required type="email" autocomplete="email"></label><fieldset class="span-2 option-card"><legend>Hình thức nhận hàng</legend><div class="choice-row"><label><input type="radio" name="deliveryType" value="store"> Nhận tại cửa hàng</label><label><input type="radio" name="deliveryType" value="home" checked> Giao hàng tận nơi</label></div><div class="form-grid location-fields" hidden><label>Tỉnh/Thành phố *<select name="province" required><option value="">Chọn tỉnh/thành</option>${Object.keys(
        storeLocations,
      )
        .map((province) => `<option>${safe(province)}</option>`)
        .join(
          "",
        )}</select></label><label>Quận/Huyện *<select name="district" required disabled><option value="">Chọn quận/huyện</option></select></label><label class="span-2">Cửa hàng *<select name="store" required disabled><option value="">Chọn cửa hàng</option></select></label></div><label class="span-2 delivery-address-field">Địa chỉ giao hàng *<input name="address" required minlength="8" autocomplete="street-address" placeholder="Số nhà, đường, phường/xã, quận/huyện"></label><label class="span-2">Ghi chú<textarea name="note" rows="3" placeholder="Lưu ý cho NEUTech (không bắt buộc)"></textarea></label></fieldset><fieldset class="span-2 option-card invoice-options"><legend>Xuất hóa đơn công ty?</legend><div class="choice-row"><label><input type="radio" name="invoiceRequired" value="yes"> Có</label><label><input type="radio" name="invoiceRequired" value="no" checked> Không</label></div><p class="form-hint">Với hóa đơn công ty: cần thanh toán online; đơn trên 5.000.000đ chỉ hỗ trợ chuyển khoản QR.</p><div class="form-grid invoice-fields" hidden><label class="span-2">Mã số thuế *<input name="taxCode" inputmode="numeric" pattern="[0-9]{10}(-[0-9]{3})?" title="Nhập mã gồm 10 chữ số hoặc 10 chữ số-3 chữ số" placeholder="Ví dụ: 1234567890 hoặc 1234567890-123"></label><label class="span-2">Tên công ty *<input name="companyName" minlength="2" placeholder="Tên công ty theo đăng ký"></label><label class="span-2">Địa chỉ công ty *<input name="companyAddress" minlength="5" placeholder="Địa chỉ đăng ký hóa đơn"></label></div></fieldset><fieldset class="span-2 payment-options"><legend>Phương thức thanh toán</legend><div class="payment-choice-list">${paymentOptions.map(([value, label, description, icon]) => `<label class="payment-choice" data-payment-choice="${value}"><input type="radio" name="payment" value="${value}" ${value === "cod" ? "checked" : ""}><span class="payment-icon" aria-hidden="true">${icon}</span><span class="payment-choice-copy"><strong>${label}</strong><small>${description}</small></span></label>`).join("")}</div><div id="qr-payment" class="qr-payment" hidden><img src="assets/images/vietqr.png" alt="Mã QR chuyển khoản NEUTech"><div><strong>Mã QR chuyển khoản NEUTech</strong><p>Bản demo, không xử lý tiền thật.</p></div></div><p class="payment-demo-note">Bản demo, không xử lý tiền thật.</p><p id="payment-limit-note" class="form-hint" hidden></p></fieldset></div><button class="button button-primary button-full" id="place-order-button">Đặt hàng</button><p class="terms-consent">Bằng việc đặt hàng, bạn đồng ý với <a href="index.html?page=policy&section=terms" target="_blank" rel="noopener">Điều khoản sử dụng</a> của NEUTech.</p></form><aside class="summary-card"><h2>Đơn hàng của bạn</h2>${rows.map((entry) => `<div class="checkout-item">${image(entry.product.image, "", entry.product.name)}<span>${safe(entry.product.name)}<small>SL: ${entry.quantity}</small></span><b>${money(entry.product.price * entry.quantity)}</b></div>`).join("")}<div class="summary-line"><span>Tạm tính</span><b>${money(subtotal)}</b></div><div class="summary-line"><span>Phí giao hàng</span><b id="checkout-delivery-fee">${money(deliveryFee(subtotal, "home"))}</b></div><div class="summary-line summary-total"><strong>Tổng cộng</strong><strong id="checkout-total">${money(subtotal + deliveryFee(subtotal, "home"))}</strong></div><p id="checkout-payment-note">Phí giao hàng được miễn từ 2.000.000đ; nhận tại cửa hàng không mất phí.</p></aside></section>`,
      "Thanh toán",
    );
    updateCheckoutOptions(subtotal);
  }

  function updateCheckoutOptions(subtotal) {
    const form = document.getElementById("checkout-form");
    if (!form) return;
    const deliveryType =
      form.querySelector('[name="deliveryType"]:checked')?.value || "home";
    const invoiceRequired =
      form.querySelector('[name="invoiceRequired"]:checked')?.value === "yes";
    const locationFields = form.querySelector(".location-fields");
    const addressField = form.querySelector(".delivery-address-field");
    const invoiceFields = form.querySelector(".invoice-fields");
    const addressInput = form.elements.namedItem("address");
    locationFields.hidden = deliveryType !== "store";
    addressField.hidden = deliveryType === "store";
    addressInput.required = deliveryType === "home";
    locationFields.querySelectorAll("select").forEach((select) => {
      select.disabled = deliveryType !== "store";
      select.required = deliveryType === "store";
    });
    invoiceFields.hidden = !invoiceRequired;
    ["taxCode", "companyName", "companyAddress"].forEach((name) => {
      form.elements.namedItem(name).required = invoiceRequired;
    });

    const fee = deliveryFee(subtotal, deliveryType);
    document.getElementById("checkout-delivery-fee").textContent = fee
      ? money(fee)
      : "Miễn phí";
    document.getElementById("checkout-total").textContent = money(
      subtotal + fee,
    );
    const choices = [...form.querySelectorAll("[data-payment-choice]")];
    const eligible = choices.filter((choice) => {
      const method = choice.dataset.paymentChoice;
      if (invoiceRequired && subtotal + fee > 5000000) return method === "qr";
      if (invoiceRequired) return method === "qr";
      if (deliveryType === "store") return ["store", "qr"].includes(method);
      return ["cod", "qr"].includes(method);
    });
    choices.forEach((choice) => {
      choice.hidden = !eligible.includes(choice);
      choice.querySelector("input").disabled = !eligible.includes(choice);
    });
    if (!eligible.some((choice) => choice.querySelector("input").checked)) {
      const defaultChoice = eligible.find(
        (choice) =>
          choice.dataset.paymentChoice ===
          (invoiceRequired ? "qr" : deliveryType === "store" ? "store" : "cod"),
      );
      if (eligible[0])
        (defaultChoice || eligible[0]).querySelector("input").checked = true;
    }
    document.getElementById("qr-payment").hidden =
      form.querySelector('[name="payment"]:checked')?.value !== "qr";
    const button = document.getElementById("place-order-button");
    button.textContent = `Đặt hàng · ${money(subtotal + fee)}`;
    const limitNote = document.getElementById("payment-limit-note");
    limitNote.hidden = !invoiceRequired;
    limitNote.textContent =
      subtotal + fee > 5000000
        ? "Đơn hóa đơn công ty trên 5.000.000đ chỉ hỗ trợ Chuyển khoản QR."
        : "Đơn xuất hóa đơn công ty cần thanh toán online; không áp dụng thanh toán tại cửa hàng hoặc COD.";
    const orderNote = document.getElementById("checkout-payment-note");
    orderNote.textContent =
      deliveryType === "home" && subtotal + fee >= 10000000
        ? "Đơn giao tận nơi từ 10.000.000đ: NEUTech có thể liên hệ kiểm tra giấy tờ khi bàn giao."
        : fee
          ? "Phí giao hàng dự kiến được tính theo địa chỉ nhận hàng."
          : "Miễn phí giao hàng từ 2.000.000đ; nhận tại cửa hàng không mất phí.";
  }

  function renderOrderSuccess(order) {
    shell(
      `<section class="success-page container"><div class="success-icon">✓</div><span class="eyebrow">ĐẶT HÀNG THÀNH CÔNG</span><h1>Cảm ơn bạn đã chọn NEUTech!</h1><p>Đơn hàng đã được lưu trên trình duyệt. Trạng thái hiện tại: <b>${safe(orderStatus(order.status))}</b>.</p><div class="order-number">Mã đơn hàng <strong>${safe(order.id)}</strong></div><div class="success-summary"><span>Người nhận: <b>${safe(order.customer.name)}</b></span><span>Tổng thanh toán: <b>${money(order.total)}</b></span><span>Nhận hàng: <b>${safe(deliveryLabel(order.delivery))}</b></span><span>Cửa hàng/địa chỉ: <b>${safe(order.delivery.store || order.delivery.address || "—")}</b></span><span>Thanh toán: <b>${safe(paymentLabel(order.payment))}</b></span><span>Hóa đơn công ty: <b>${order.invoice?.required ? `${safe(order.invoice.companyName)} · MST ${safe(order.invoice.taxCode)}` : "Không"}</b></span></div><div class="success-actions">${link(`contract&id=${encodeURIComponent(order.id)}`, "Xem hợp đồng điện tử", 'class="button button-outline"')}${link(`track&id=${encodeURIComponent(order.id)}`, "Tra cứu đơn hàng", 'class="button button-outline"')}${link("products", "Tiếp tục mua sắm", 'class="button button-primary"')}</div></section>`,
      "Đặt hàng thành công",
    );
  }

  const policySections = [
    {
      id: "general",
      title: "Quy định chung",
      content: `<h3>Phạm vi áp dụng</h3><p>Quy chế này áp dụng cho khách truy cập và khách hàng sử dụng website NEUTech để tìm hiểu sản phẩm, gửi yêu cầu đặt hàng hoặc tra cứu thông tin đơn hàng.</p><p>Thông tin sản phẩm, giá bán và tình trạng sẵn có được cung cấp cho mục đích tham khảo trong bản demo. Đơn hàng chỉ được lưu trên trình duyệt đang sử dụng, không tạo giao dịch thương mại thực tế.</p><h3>Nguyên tắc giao dịch</h3><p>NEUTech hướng đến thông tin rõ ràng, tôn trọng quyền lợi người mua và tiếp nhận yêu cầu hỗ trợ qua hotline 1900 886 688.</p>`,
    },
    {
      id: "process",
      title: "Quy trình giao dịch",
      content: `<h3>Đặt hàng và vận chuyển</h3><p>Khách hàng chọn nhận hàng tại cửa hàng hoặc giao tận nơi. Đơn giao tận nơi cần địa chỉ nhận hàng hợp lệ; phí vận chuyển trong bản demo được miễn từ 2.000.000đ, đơn thấp hơn áp dụng mức phí mẫu 30.000đ. Nhận tại cửa hàng cần chọn tỉnh/thành, quận/huyện và địa điểm cửa hàng.</p><h3>Thanh toán</h3><p>Website chỉ mô phỏng hai hình thức: thanh toán khi nhận hàng (tại cửa hàng hoặc COD khi giao tận nơi) và chuyển khoản QR. Với hóa đơn công ty, các hình thức thanh toán khi nhận hàng không áp dụng; đơn trên 5.000.000đ chỉ hỗ trợ chuyển khoản QR. Không nhập thông tin thanh toán thật; bản demo không xử lý tiền thật.</p><h3>Hóa đơn công ty</h3><p>Yêu cầu hóa đơn công ty cần mã số thuế gồm 10 chữ số hoặc 10 chữ số kèm mã chi nhánh 3 chữ số, tên và địa chỉ công ty. Trong bản demo, thông tin chỉ được lưu trên trình duyệt; khách hàng cần kiểm tra chính xác trước khi gửi.</p>`,
    },
    {
      id: "warranty",
      title: "Bảo hành",
      content: `<h3>Thông tin bảo hành</h3><p>Thời hạn và điều kiện bảo hành phụ thuộc từng sản phẩm và chính sách của nhà sản xuất. Khách hàng nên giữ hóa đơn, phiếu bảo hành và phụ kiện đi kèm để được hỗ trợ thuận tiện.</p><p>Để được tư vấn về sản phẩm trong bản demo, vui lòng liên hệ NEUTech qua số 1900 886 688. Nội dung bảo hành trên website mang tính tham khảo và không thay thế điều kiện bảo hành thực tế.</p>`,
    },
    {
      id: "return",
      title: "Hủy giao dịch, đổi trả",
      content: `<h3>Hủy đơn hàng</h3><p>Khách hàng có thể gửi yêu cầu hủy khi đơn còn ở trạng thái “Đang xác nhận”. Sau khi đơn chuyển sang “Đang giao” hoặc trạng thái khác, vui lòng liên hệ NEUTech để được hướng dẫn; website sẽ không hiển thị thao tác hủy.</p><h3>Đổi trả</h3><p>Điều kiện đổi trả thực tế được xác nhận theo tình trạng sản phẩm, chứng từ mua hàng và chính sách của nhà sản xuất. Hãy liên hệ hotline 1900 886 688 để được tư vấn trước khi gửi sản phẩm.</p><p>Bản demo không xử lý hoàn tiền, vận chuyển đổi trả hoặc nghĩa vụ mua bán thực tế.</p>`,
    },
    {
      id: "privacy",
      title: "Bảo mật",
      content: `<h3>Dữ liệu trên thiết bị</h3><p>Website demo lưu giỏ hàng và đơn hàng bằng localStorage trong trình duyệt hiện tại. Dữ liệu không được gửi tới máy chủ, không đồng bộ giữa thiết bị và có thể bị xóa khi xóa dữ liệu website.</p><p>Không sử dụng thông tin cá nhân nhạy cảm, thông tin thanh toán thật hoặc dữ liệu cần bảo mật trên bản demo này.</p>`,
    },
    {
      id: "terms",
      title: "Điều khoản sử dụng",
      content: `<h3>Sử dụng website</h3><p>Người dùng đồng ý cung cấp thông tin chính xác khi trải nghiệm các biểu mẫu và không sử dụng website để gửi nội dung trái pháp luật hoặc gây ảnh hưởng tới người khác.</p><p>Website được cung cấp cho mục đích minh họa giao diện và luồng mua sắm. Giá, tồn kho, cửa hàng, phí giao hàng, hóa đơn và phương thức thanh toán đều là dữ liệu mẫu, không phải cam kết cung cấp hàng hóa hay dịch vụ thanh toán.</p><h3>Giới hạn của bản demo</h3><p>NEUTech demo không có tài khoản xác thực, backend, cổng thanh toán thật hoặc cơ chế bảo vệ dữ liệu như hệ thống thương mại đang vận hành. Vui lòng không nhập dữ liệu nhạy cảm.</p>`,
    },
  ];

  function renderPolicy() {
    const activeId = policySections.some(
      (section) => section.id === pageParam.get("section"),
    )
      ? pageParam.get("section")
      : "general";
    const active = policySections.find((section) => section.id === activeId);
    shell(
      `${pageTitle("THÔNG TIN NEUTECH", "Quy chế hoạt động website NEUTech", "Thông tin về việc sử dụng website và trải nghiệm mua sắm demo.")}<section class="section container policy-layout"><nav class="policy-menu" aria-label="Danh mục quy chế">${policySections.map((section) => `<a class="${section.id === activeId ? "active" : ""}" href="index.html?page=policy&section=${section.id}">${safe(section.title)}</a>`).join("")}</nav><article class="policy-content"><span class="eyebrow">QUY CHẾ NEUTECH</span><h2>${safe(active.title)}</h2>${active.content}</article></section>`,
      "Quy chế hoạt động website",
    );
  }

  function findOrderForTracking(id, phone) {
    const normalizedPhone = phone.replace(/\D/g, "");
    return orders().find(
      (order) =>
        String(order.id).toLowerCase() === id.trim().toLowerCase() &&
        (!normalizedPhone ||
          String(order.customer?.phone || "").replace(/\D/g, "") ===
            normalizedPhone),
    );
  }

  function renderTrack(orderId = "", phone = "") {
    const order = orderId ? findOrderForTracking(orderId, phone) : null;
    const status = order ? orderStatus(order.status) : "";
    let result = "";
    if (order) {
      const trackHelp = `<p class="track-help">Đơn hàng không còn ở trạng thái có thể hủy. Cần hỗ trợ? Gọi <a href="tel:1900886688">1900 886 688</a> hoặc xem <a href="index.html?page=policy&section=return">chính sách hủy giao dịch, đổi trả</a>.</p>`;
      const cancellationMessage =
        status === "Đã hủy"
          ? `<div class="cancelled-banner"><strong>Đơn hàng đã được hủy</strong><span>Lý do: ${safe(order.cancelReason || "Không có thông tin")}</span></div>`
          : status === "Đang xác nhận"
            ? ""
            : trackHelp;
      const cancellationStatusContent =
        status === "Đã hủy"
          ? `${cancellationMessage}${trackHelp}`
          : `<div class="order-progress"><span class="${status === "Đang xác nhận" ? "current" : "done"}">Đang xác nhận</span><i></i><span class="${status === "Đang giao" || status === "Hoàn tất" ? (status === "Đang giao" ? "current" : "done") : ""}">Đang giao</span><i></i><span class="${status === "Hoàn tất" ? "current" : ""}">Hoàn tất</span></div>${cancellationMessage}`;
      result = `<article class="track-result"><div class="track-result-heading"><div><span class="eyebrow">MÃ ĐƠN ${safe(order.id)}</span><h2>${safe(status)}</h2></div></div>${cancellationStatusContent}<h3 class="track-section-title">Sản phẩm</h3><div class="track-products">${(order.items || []).map((item) => `<div><span>${safe(item.name)} × ${Number(item.quantity) || 0}</span><b>${money((Number(item.price) || 0) * (Number(item.quantity) || 0))}</b></div>`).join("") || "<p>Không có thông tin sản phẩm.</p>"}</div><div class="track-details"><div><span>Hình thức nhận</span><b>${safe(deliveryLabel(order.delivery))}</b></div><div><span>Cửa hàng/địa chỉ</span><b>${safe(order.delivery?.store || order.delivery?.address || order.customer?.address || "—")}</b></div><div><span>Thanh toán</span><b>${safe(paymentLabel(order.payment))}</b></div><div><span>Hóa đơn công ty</span><b>${order.invoice?.required ? `${safe(order.invoice.companyName)} · MST ${safe(order.invoice.taxCode)}` : "Không"}</b></div><div><span>Tổng thanh toán</span><b>${money(order.total)}</b></div></div><div class="track-actions"><a class="button button-outline" href="index.html?page=contract&id=${encodeURIComponent(order.id)}">Xem hợp đồng</a>${status === "Đang xác nhận" ? `<button class="button button-primary" data-open-cancel="${safe(order.id)}">Hủy đơn hàng</button>` : ""}</div></article>`;
    } else if (orderId || phone) {
      result = `<div class="track-error" role="status">Không tìm thấy đơn hàng khớp với mã đơn và số điện thoại đã nhập.</div>`;
    }
    const recentOrders = orders()
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const recentOrdersContent = recentOrders.length
      ? `<div class="recent-order-list">${recentOrders.map((recent) => `<article class="recent-order"><div class="recent-order-info"><strong>${safe(recent.id)}</strong><span>${safe(recent.createdAt ? new Date(recent.createdAt).toLocaleString("vi-VN") : "Ngày đặt không rõ")}</span><span>${money(recent.total)}</span><span class="status-pill">${safe(orderStatus(recent.status))}</span></div><button class="button button-outline button-small" data-view-order="${safe(recent.id)}">Xem chi tiết</button></article>`).join("")}</div>`
      : `<div class="empty-state recent-empty"><h3>Chưa có đơn hàng trên thiết bị này</h3><p>Đơn hàng bạn đặt trên trình duyệt này sẽ xuất hiện tại đây.</p></div>`;
    shell(
      `${pageTitle("HỖ TRỢ ĐƠN HÀNG", "Tra cứu đơn hàng", "Nhập mã đơn hàng + số điện thoại hoặc xem lại đơn hàng gần đây.")}<section class="section container track-page"><form id="track-form" class="form-card track-form"><label>Mã đơn hàng *<input name="orderId" required value="${safe(orderId)}" placeholder="Ví dụ: NT261030AB12"></label><label>Số điện thoại đặt hàng *<input name="phone" required inputmode="tel" pattern="[0-9]{9,15}" value="${safe(phone)}" placeholder="Số điện thoại dùng khi đặt hàng"></label><button class="button button-primary">Tra cứu</button></form>${result}<section class="recent-orders"><div class="recent-orders-heading"><div><h2>Đơn hàng gần đây trên thiết bị này</h2><p>Chỉ hiển thị đơn đặt trên trình duyệt này.</p></div></div>${recentOrdersContent}</section></section>`,
      "Tra cứu đơn hàng",
    );
  }

  function renderContract() {
    const order = orders().find((item) => item.id === pageParam.get("id"));
    if (!order)
      return shell(
        `${pageTitle("ĐƠN HÀNG", "Không tìm thấy hợp đồng", "Mã đơn hàng không tồn tại trên trình duyệt này.")}<section class="section container">${link("track", "Tra cứu đơn hàng", 'class="button button-primary"')}</section>`,
        "Hợp đồng điện tử",
      );
    const delivery = order.delivery || {
      type: "home",
      address: order.customer?.address || "",
      fee: 0,
      note: order.customer?.note || "",
    };
    const invoice = order.invoice || { required: false };
    shell(
      `${pageTitle("XÁC NHẬN ĐẶT HÀNG", "Thông tin hợp đồng điện tử", "Bản ghi nhận thông tin đơn hàng demo được lưu trên trình duyệt.")}<section class="section container contract-page"><article class="policy-content"><div class="contract-heading"><h2>Đơn hàng ${safe(order.id)}</h2><span class="status-pill">${safe(orderStatus(order.status))}</span></div><p>Ngày đặt: ${safe(new Date(order.createdAt).toLocaleString("vi-VN"))}</p><h3>Thông tin khách hàng</h3><p><b>Họ tên:</b> ${safe(order.customer?.name || "—")}<br><b>Điện thoại:</b> ${safe(order.customer?.phone || "—")}<br><b>Email:</b> ${safe(order.customer?.email || "—")}</p><h3>Nhận hàng và thanh toán</h3><p><b>Hình thức nhận:</b> ${safe(deliveryLabel(delivery))}<br><b>${delivery.type === "store" ? "Cửa hàng" : "Địa chỉ giao hàng"}:</b> ${safe(delivery.store || delivery.address || "—")}<br><b>Phí giao hàng:</b> ${money(delivery.fee || 0)}<br><b>Ghi chú:</b> ${safe(delivery.note || "Không có")}<br><b>Thanh toán:</b> ${safe(paymentLabel(order.payment))}</p><h3>Hóa đơn công ty</h3><p>${invoice.required ? `<b>Tên công ty:</b> ${safe(invoice.companyName)}<br><b>Mã số thuế:</b> ${safe(invoice.taxCode)}<br><b>Địa chỉ:</b> ${safe(invoice.address)}` : "Không yêu cầu xuất hóa đơn công ty."}</p><h3>Sản phẩm và tổng tiền</h3><ul>${(order.items || []).map((item) => `<li>${safe(item.name)} × ${Number(item.quantity) || 0} — ${money((Number(item.price) || 0) * (Number(item.quantity) || 0))}</li>`).join("")}</ul><p class="contract-total"><b>Tổng thanh toán:</b> ${money(order.total)}</p><p class="form-hint">Đây là bản ghi demo, không phải hợp đồng giao dịch thực tế hay chứng từ thanh toán. ${link("policy&section=terms", "Điều khoản sử dụng")}${" · "}${link("policy&section=process", "Quy trình giao dịch")}${" · "}${link("policy&section=return", "Hủy giao dịch, đổi trả")}</p><a class="button button-outline" href="index.html?page=track">Quay lại tra cứu</a></article></section>`,
      "Hợp đồng điện tử",
    );
  }

  function renderNews() {
    shell(
      `${pageTitle("GÓC CÔNG NGHỆ", "Tin tức & sự kiện", "Cập nhật xu hướng, hướng dẫn và câu chuyện công nghệ mới nhất.")}<section class="section container"><div class="article-grid article-grid-wide">${visibleArticles().map(articleCard).join("") || emptyState("Chưa có bài viết", "Nội dung mới sẽ sớm được cập nhật.")}</div></section>`,
      "Tin tức",
    );
  }
  function renderArticle() {
    const article = visibleArticles().find(
      (item) => item.id === pageParam.get("id"),
    );
    if (!article)
      return shell(
        `${pageTitle("GÓC CÔNG NGHỆ", "Không tìm thấy bài viết", "Bài viết có thể đã bị ẩn hoặc không còn tồn tại.")}<section class="section container">${link("news", "← Quay lại tin tức", 'class="button button-primary"')}</section>`,
        "Không tìm thấy bài viết",
      );
    const related = visibleArticles()
      .filter((item) => item.id !== article.id)
      .slice(0, 2);
    shell(
      `<section class="article-hero">${image(article.image, "", article.title)}<div class="article-hero-overlay"></div><div class="container article-hero-content"><span class="eyebrow">${safe(article.category)} · ${safe(article.createdAt)}</span><h1>${safe(article.title)}</h1></div></section><article class="article-body container"><p class="article-lead">${safe(article.summary)}</p>${article.body
        .split(/\\n\\n|\n\s*\n/)
        .map((part) => `<p>${safe(part)}</p>`)
        .join(
          "",
        )}<button class="button button-outline" data-share-article="${safe(article.id)}">Chia sẻ bài viết</button></article><section class="section section-tint"><div class="container">${sectionHeading("ĐỌC TIẾP", "Bài viết liên quan", "news")}<div class="article-grid">${related.map(articleCard).join("") || emptyState("Chưa có bài liên quan", "Quay lại sau để xem thêm tin mới.")}</div></div></section>`,
      article.title,
    );
  }

  function renderContact() {
    shell(
      `${pageTitle("LIÊN HỆ", "Chúng tôi luôn sẵn sàng lắng nghe", "Hãy gửi câu hỏi, góp ý hoặc yêu cầu tư vấn đến đội ngũ NEUTech.")}<section class="section container contact-layout"><form id="contact-form" class="form-card"><h2>Gửi tin nhắn</h2><label>Họ và tên *<input name="name" required minlength="2" autocomplete="name"></label><label>Địa chỉ<input name="address" placeholder="Khu vực bạn đang sinh sống"></label><label>Email *<input name="email" type="email" required autocomplete="email"></label><label>Nội dung *<textarea name="message" rows="5" required minlength="10" placeholder="Bạn cần chúng tôi hỗ trợ điều gì?"></textarea></label><button class="button button-primary">Gửi liên hệ</button><p class="form-status" id="contact-status" aria-live="polite"></p></form><aside class="contact-info"><h2>NEUTech</h2><p><b>Địa chỉ</b><br>207 đường Giải Phóng, phường Bạch Mai, Hà Nội</p><p><b>Hotline</b><br><a href="tel:1900886688">1900 886 688</a></p><p><b>Email</b><br><a href="mailto:hello@neutech.demo">hello@neutech.demo</a></p><div class="map-embed"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.636848148384!2d105.8407452758778!3d21.00718878851724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac716240d023%3A0x889eb2056093be81!2zMjA3IMSQxrDhu51uZyBHaeG6o2kgUGjDs25nLCBC4bqhY2ggTWFpLCBIYWkgQsOgIFRyxrBuZywgSMOATHOGu4buTLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></aside></section>`,
      "Liên hệ",
    );
  }

  const adminTabs = [
    ["products", "Sản phẩm"],
    ["categories", "Danh mục"],
    ["articles", "Bài viết"],
    ["orders", "Đơn hàng"],
    ["about", "Giới thiệu"],
  ];
  function adminNav(active) {
    return `<nav class="admin-tabs">${adminTabs.map(([id, label]) => `<a class="${active === id ? "active" : ""}" href="index.html?page=admin&tab=${id}">${label}</a>`).join("")}</nav>`;
  }
  function productAdminTable() {
    return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Sản phẩm</th><th>Mã</th><th>Danh mục</th><th>Giá</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>${
      products()
        .map(
          (item) =>
            `<tr><td class="table-product">${image(item.image, "", item.name)}<strong>${safe(item.name)}</strong></td><td>${safe(item.code)}</td><td>${safe(categoryName(item.categoryId))}</td><td>${money(item.price)}</td><td><button class="status-toggle ${item.visible === false ? "muted" : ""}" data-product-toggle="${safe(item.id)}">${item.visible === false ? "Đang ẩn" : "Đang hiện"}</button></td><td><button class="table-action" data-edit-product="${safe(item.id)}">Sửa</button><button class="table-action danger" data-delete-product="${safe(item.id)}">Xóa</button></td></tr>`,
        )
        .join("") || `<tr><td colspan="6">Chưa có sản phẩm.</td></tr>`
    }</tbody></table></div>`;
  }
  function productForm(product = {}) {
    const editing = !!product.id;
    return `<form id="admin-product-form" class="admin-form"><h3>${editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h3><input type="hidden" name="productId" value="${safe(product.id || "")}"><div class="form-grid"><label>Tên sản phẩm *<input name="name" required value="${safe(product.name || "")}"></label><label>Mã sản phẩm *<input name="code" required value="${safe(product.code || "")}"></label><label>Danh mục *<select name="categoryId" required>${categories()
      .map(
        (item) =>
          `<option value="${safe(item.id)}" ${product.categoryId === item.id ? "selected" : ""}>${safe(item.name)}</option>`,
      )
      .join(
        "",
      )}</select></label><label>Giá (VNĐ) *<input name="price" type="number" min="0" required value="${safe(product.price || "")}"></label><label>Giá cũ (VNĐ)<input name="oldPrice" type="number" min="0" value="${safe(product.oldPrice || "")}"></label><label>Đường dẫn ảnh<input name="image" type="url" value="${safe((product.image || "").startsWith("http") ? product.image : "")}" placeholder="https://..."></label><label class="span-2">Mô tả<textarea name="description" rows="3" required>${safe(product.description || "")}</textarea></label><label class="check-label"><input name="featured" type="checkbox" ${product.featured ? "checked" : ""}> Sản phẩm nổi bật</label><label class="check-label"><input name="visible" type="checkbox" ${product.visible !== false ? "checked" : ""}> Hiển thị trên cửa hàng</label></div><div class="form-buttons"><button class="button button-primary">${editing ? "Lưu thay đổi" : "Thêm sản phẩm"}</button>${editing ? `<button type="button" class="button button-outline" data-cancel-edit>Hủy sửa</button>` : ""}</div></form>`;
  }
  function articleForm(article = {}) {
    const editing = !!article.id;
    return `<form id="admin-article-form" class="admin-form"><h3>${editing ? "Cập nhật bài viết" : "Thêm bài viết"}</h3><input type="hidden" name="articleId" value="${safe(article.id || "")}"><div class="form-grid"><label>Tiêu đề *<input name="title" required value="${safe(article.title || "")}"></label><label>Chủ đề *<input name="category" required value="${safe(article.category || "")}"></label><label>Ảnh đại diện (URL)<input name="image" type="url" value="${safe((article.image || "").startsWith("http") ? article.image : "")}" placeholder="https://..."></label><label>Ngày đăng<input name="createdAt" type="date" value="${safe(article.createdAt || new Date().toISOString().slice(0, 10))}" required></label><label class="span-2">Tóm tắt *<textarea name="summary" rows="2" required>${safe(article.summary || "")}</textarea></label><label class="span-2">Nội dung chi tiết *<textarea name="body" rows="5" required>${safe(article.body || "")}</textarea></label></div><div class="form-buttons"><button class="button button-primary">${editing ? "Lưu thay đổi" : "Đăng bài viết"}</button>${editing ? `<button type="button" class="button button-outline" data-cancel-edit>Hủy sửa</button>` : ""}</div></form>`;
  }
  function renderAdmin() {
    const tab = adminTabs.some((item) => item[0] === pageParam.get("tab"))
      ? pageParam.get("tab")
      : "products";
    let panel = "";
    if (tab === "products") panel = `${productForm()}${productAdminTable()}`;
    if (tab === "categories")
      panel = `<form id="admin-category-form" class="admin-inline-form"><label>Tên danh mục<input name="name" required maxlength="40" placeholder="Ví dụ: Camera"></label><label>Danh mục cha<select name="parentId"><option value="">Không có (danh mục gốc)</option>${categories()
        .filter((item) => !item.parentId)
        .map(
          (item) =>
            `<option value="${safe(item.id)}">${safe(item.name)}</option>`,
        )
        .join(
          "",
        )}</select></label><label>Biểu tượng<input name="icon" maxlength="4" value="◇"></label><button class="button button-primary">Thêm danh mục</button></form><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Tên danh mục</th><th>Cấp</th><th>Sản phẩm</th><th>Thao tác</th></tr></thead><tbody>${categories()
        .map(
          (item) =>
            `<tr><td>${safe(item.parentId ? "— " : "")}${safe(item.icon || "")} ${safe(item.name)}</td><td>${item.parentId ? "Cấp 2" : "Cấp 1"}</td><td>${products().filter((product) => product.categoryId === item.id).length}</td><td><button class="table-action danger" data-delete-category="${safe(item.id)}">Xóa</button></td></tr>`,
        )
        .join(
          "",
        )}</tbody></table></div><p class="admin-hint">Chỉ xóa được danh mục chưa có sản phẩm hoặc danh mục con.</p>`;
    if (tab === "articles")
      panel = `${articleForm()}<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Bài viết</th><th>Chủ đề</th><th>Ngày đăng</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>${articles()
        .map(
          (item) =>
            `<tr><td>${safe(item.title)}</td><td>${safe(item.category)}</td><td>${safe(item.createdAt)}</td><td><button class="status-toggle ${item.visible === false ? "muted" : ""}" data-article-toggle="${safe(item.id)}">${item.visible === false ? "Đang ẩn" : "Đang hiện"}</button></td><td><button class="table-action" data-edit-article="${safe(item.id)}">Sửa</button><button class="table-action danger" data-delete-article="${safe(item.id)}">Xóa</button></td></tr>`,
        )
        .join("")}</tbody></table></div>`;
    if (tab === "orders")
      panel = `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead><tbody>${
        orders()
          .slice()
          .reverse()
          .map(
            (order) =>
              `<tr><td><strong>${safe(order.id)}</strong></td><td>${safe(order.customer?.name || "—")}<small class="table-sub">${safe(order.customer?.phone || "—")}</small></td><td>${safe(new Date(order.createdAt).toLocaleString("vi-VN"))}</td><td>${money(order.total)}</td><td><select class="order-status" data-order-status="${safe(order.id)}">${["Đang xác nhận", "Đang giao", "Hoàn tất", "Đã hủy"].map((status) => `<option ${orderStatus(order.status) === status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td><button class="table-action" data-order-detail="${safe(order.id)}">Xem</button><a class="table-action" href="index.html?page=contract&id=${encodeURIComponent(order.id)}">Hợp đồng</a></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6">Chưa có đơn hàng. Đơn thử nghiệm sẽ xuất hiện tại đây.</td></tr>`
      }</tbody></table></div>`;
    if (tab === "about") {
      const about = read(STORE.about, seed.about);
      panel = `<form id="admin-about-form" class="admin-form"><h3>Nội dung giới thiệu cửa hàng</h3><label>Tiêu đề chính<input name="title" required value="${safe(about.title)}"></label><label>Giới thiệu tổng quan<textarea name="intro" rows="4" required>${safe(about.intro)}</textarea></label><label>Sứ mệnh<textarea name="mission" rows="3" required>${safe(about.mission)}</textarea></label><label>Tầm nhìn<textarea name="vision" rows="3" required>${safe(about.vision)}</textarea></label><button class="button button-primary">Lưu nội dung</button></form>`;
    }
    shell(
      `${pageTitle("NEUTECH · QUẢN TRỊ", "Bảng điều khiển", "Quản lý dữ liệu cửa hàng demo. Các thay đổi được lưu trong localStorage của trình duyệt.")}<section class="section container admin-layout"><div class="admin-notice"><b>Chế độ học tập:</b> Trang quản trị này không có đăng nhập hoặc bảo mật thực sự. Không dùng dữ liệu cá nhân hoặc triển khai như hệ thống thật.</div>${adminNav(tab)}<div class="admin-panel">${panel}</div></section>`,
      "Quản trị",
    );
  }

  function render() {
    if (page === "home") return renderHome();
    if (page === "about") return renderAbout();
    if (page === "products") return renderProducts();
    if (page === "product") return renderProduct();
    if (page === "cart") return renderCart();
    if (page === "checkout") return renderCheckout();
    if (page === "news") return renderNews();
    if (page === "article") return renderArticle();
    if (page === "contact") return renderContact();
    if (page === "policy") return renderPolicy();
    if (page === "track")
      return renderTrack(
        pageParam.get("id") || "",
        pageParam.get("phone") || "",
      );
    if (page === "contract") return renderContract();
    if (page === "admin") return renderAdmin();
    renderHome();
  }

  document.addEventListener("click", (event) => {
    if (event.target.matches("[data-cancel-backdrop]")) {
      document.querySelector(".cancel-dialog-backdrop")?.remove();
      return;
    }
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.add) addToCart(target.dataset.add);
    if (target.dataset.quantity) {
      const current = cart();
      const entry = current.find(
        (item) => item.productId === target.dataset.quantity,
      );
      if (entry) entry.quantity += Number(target.dataset.delta);
      save(
        STORE.cart,
        current.filter((item) => item.quantity > 0),
      );
      renderCart();
    }
    if (target.dataset.remove) {
      save(
        STORE.cart,
        cart().filter((item) => item.productId !== target.dataset.remove),
      );
      renderCart();
    }
    if (target.dataset.shareProduct) {
      const product = products().find(
        (item) => item.id === target.dataset.shareProduct,
      );
      if (product) share(product.name, productUrl(product.id));
    }
    if (target.dataset.shareArticle) {
      const article = articles().find(
        (item) => item.id === target.dataset.shareArticle,
      );
      if (article) share(article.title, articleUrl(article.id));
    }
    if (target.dataset.editProduct) {
      const item = products().find(
        (product) => product.id === target.dataset.editProduct,
      );
      const form = document.getElementById("admin-product-form");
      if (item && form) {
        form.outerHTML = productForm(item);
        document
          .getElementById("admin-product-form")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    if (target.hasAttribute("data-cancel-edit")) renderAdmin();
    if (target.dataset.editArticle) {
      const item = articles().find(
        (article) => article.id === target.dataset.editArticle,
      );
      const form = document.getElementById("admin-article-form");
      if (item && form) {
        form.outerHTML = articleForm(item);
        document
          .getElementById("admin-article-form")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    if (target.dataset.deleteProduct) {
      if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        save(
          STORE.products,
          products().filter((item) => item.id !== target.dataset.deleteProduct),
        );
        save(
          STORE.cart,
          cart().filter(
            (item) => item.productId !== target.dataset.deleteProduct,
          ),
        );
        renderAdmin();
      }
    }
    if (target.dataset.productToggle) {
      save(
        STORE.products,
        products().map((item) =>
          item.id === target.dataset.productToggle
            ? { ...item, visible: item.visible === false }
            : item,
        ),
      );
      renderAdmin();
    }
    if (target.dataset.deleteCategory) {
      const id = target.dataset.deleteCategory;
      const hasChildren = categories().some((item) => item.parentId === id);
      const hasProducts = products().some((item) => item.categoryId === id);
      if (hasChildren || hasProducts)
        return showToast("Danh mục đang được sử dụng hoặc có danh mục con.");
      if (confirm("Xóa danh mục này?")) {
        save(
          STORE.categories,
          categories().filter((item) => item.id !== id),
        );
        renderAdmin();
      }
    }
    if (target.dataset.articleToggle) {
      save(
        STORE.articles,
        articles().map((item) =>
          item.id === target.dataset.articleToggle
            ? { ...item, visible: item.visible === false }
            : item,
        ),
      );
      renderAdmin();
    }
    if (
      target.dataset.deleteArticle &&
      confirm("Bạn có chắc muốn xóa bài viết này?")
    ) {
      save(
        STORE.articles,
        articles().filter((item) => item.id !== target.dataset.deleteArticle),
      );
      renderAdmin();
    }
    if (target.dataset.orderDetail) {
      const order = orders().find(
        (item) => item.id === target.dataset.orderDetail,
      );
      if (order)
        alert(
          `Đơn hàng ${order.id}\n\nKhách hàng: ${order.customer?.name || "—"}\nĐiện thoại: ${order.customer?.phone || "—"}\nEmail: ${order.customer?.email || "—"}\nNhận hàng: ${deliveryLabel(order.delivery)}\nCửa hàng/địa chỉ: ${order.delivery?.store || order.delivery?.address || order.customer?.address || "—"}\nGhi chú: ${order.delivery?.note || order.customer?.note || "Không có"}\n\nSản phẩm:\n${(order.items || []).map((item) => `• ${item.name} x ${item.quantity} — ${money(item.price * item.quantity)}`).join("\n")}\n\nTổng tiền: ${money(order.total)}\nThanh toán: ${paymentLabel(order.payment)}\nHóa đơn công ty: ${order.invoice?.required ? `${order.invoice.companyName} · MST ${order.invoice.taxCode} · ${order.invoice.address}` : "Không"}`,
        );
    }
    if (target.dataset.openCancel) {
      const order = orders().find(
        (item) => item.id === target.dataset.openCancel,
      );
      if (!order || orderStatus(order.status) !== "Đang xác nhận")
        return showToast("Chỉ đơn đang xác nhận mới có thể gửi yêu cầu hủy.");
      document.querySelector(".cancel-dialog-backdrop")?.remove();
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div class="cancel-dialog-backdrop" data-cancel-backdrop><section class="cancel-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title"><button type="button" class="dialog-close" data-close-cancel aria-label="Đóng">×</button><h2 id="cancel-dialog-title">Hủy đơn hàng ${safe(order.id)}</h2><p>Vui lòng chọn lý do để NEUTech ghi nhận yêu cầu của bạn.</p><form id="cancel-order-form"><input type="hidden" name="orderId" value="${safe(order.id)}"><label>Lý do hủy *<select name="reason" required><option value="">Chọn lý do hủy</option><option>Đặt nhầm sản phẩm hoặc thông tin</option><option>Muốn thay đổi sản phẩm</option><option>Thời gian giao hàng chưa phù hợp</option><option>Đã mua ở nơi khác</option><option>Lý do cá nhân khác</option></select></label><div class="dialog-actions"><button type="button" class="button button-outline" data-close-cancel>Giữ đơn</button><button class="button button-primary">Xác nhận hủy</button></div></form></section></div>`,
      );
      document.querySelector("#cancel-order-form select")?.focus();
    }
    if (target.dataset.viewOrder) {
      const url = new URL("index.html", location.href);
      url.searchParams.set("page", "track");
      url.searchParams.set("id", target.dataset.viewOrder);
      history.pushState(null, "", url);
      renderTrack(target.dataset.viewOrder);
    }
    if (target.hasAttribute("data-close-cancel")) {
      document.querySelector(".cancel-dialog-backdrop")?.remove();
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.closest("#checkout-form")) {
      const form = document.getElementById("checkout-form");
      const subtotal = cartRows().reduce(
        (sum, entry) => sum + entry.product.price * entry.quantity,
        0,
      );
      if (target.name === "province") {
        const districts = Object.keys(storeLocations[target.value] || {});
        const districtSelect = form.elements.namedItem("district");
        const storeSelect = form.elements.namedItem("store");
        districtSelect.innerHTML = `<option value="">Chọn quận/huyện</option>${districts.map((district) => `<option>${safe(district)}</option>`).join("")}`;
        districtSelect.disabled = !districts.length;
        storeSelect.innerHTML = '<option value="">Chọn cửa hàng</option>';
        storeSelect.disabled = true;
      }
      if (target.name === "district") {
        const stores =
          storeLocations[form.elements.namedItem("province").value]?.[
            target.value
          ] || [];
        const storeSelect = form.elements.namedItem("store");
        storeSelect.innerHTML = `<option value="">Chọn cửa hàng</option>${stores.map((store) => `<option>${safe(store)}</option>`).join("")}`;
        storeSelect.disabled = !stores.length;
      }
      updateCheckoutOptions(subtotal);
    }
    if (target.matches("[data-order-status]")) {
      save(
        STORE.orders,
        orders().map((order) =>
          order.id === target.dataset.orderStatus
            ? {
                ...order,
                status: target.value,
                ...(target.value === "Đã hủy" && !order.cancelledAt
                  ? { cancelledAt: new Date().toISOString() }
                  : {}),
              }
            : order,
        ),
      );
      showToast("Đã cập nhật trạng thái đơn hàng.");
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id === "search-form") {
      event.preventDefault();
      const q = new FormData(form).get("q").toString().trim();
      location.href = `index.html?page=products${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    }
    if (form.id === "filter-form") {
      event.preventDefault();
      const values = new FormData(form);
      const params = new URLSearchParams({ page: "products" });
      ["q", "category", "max", "sort"].forEach((key) => {
        const value = String(values.get(key) || "");
        if (value) params.set(key, value);
      });
      location.href = `index.html?${params}`;
    }
    if (form.id === "track-form") {
      event.preventDefault();
      const values = new FormData(form);
      const orderId = values.get("orderId").toString().trim();
      const phone = values.get("phone").toString().trim();
      const url = new URL("index.html", location.href);
      url.searchParams.set("page", "track");
      url.searchParams.set("id", orderId);
      url.searchParams.set("phone", phone);
      history.pushState(null, "", url);
      renderTrack(orderId, phone);
    }
    if (form.id === "cancel-order-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const id = values.get("orderId").toString();
      const reason = values.get("reason").toString().trim();
      const currentOrder = orders().find((order) => order.id === id);
      if (
        !currentOrder ||
        orderStatus(currentOrder.status) !== "Đang xác nhận"
      ) {
        document.querySelector(".cancel-dialog-backdrop")?.remove();
        return showToast("Đơn hàng đã thay đổi trạng thái và không thể hủy.");
      }
      save(
        STORE.orders,
        orders().map((order) =>
          order.id === id
            ? {
                ...order,
                status: "Đã hủy",
                cancelledAt: new Date().toISOString(),
                cancelReason: reason,
              }
            : order,
        ),
      );
      document.querySelector(".cancel-dialog-backdrop")?.remove();
      renderTrack(id, currentOrder.customer.phone);
    }
    if (form.id === "checkout-form") {
      event.preventDefault();
      const entries = cartRows();
      const subtotal = entries.reduce(
        (sum, entry) => sum + entry.product.price * entry.quantity,
        0,
      );
      updateCheckoutOptions(subtotal);
      if (!form.reportValidity()) return;
      if (!entries.length) return showToast("Giỏ hàng không còn sản phẩm.");
      const values = new FormData(form);
      const type = values.get("deliveryType").toString();
      const fee = deliveryFee(subtotal, type);
      const invoiceRequired = values.get("invoiceRequired") === "yes";
      const selectedPayment = values.get("payment").toString();
      const invoiceTaxCode = values.get("taxCode")?.toString().trim() || "";
      if (invoiceRequired && !/^\d{10}(?:-\d{3})?$/.test(invoiceTaxCode))
        return showToast("Mã số thuế phải gồm 10 số hoặc 10 số-3 số.");
      if (
        invoiceRequired &&
        subtotal + fee > 5000000 &&
        selectedPayment !== "qr"
      )
        return showToast(
          "Đơn hàng trên 5.000.000đ chỉ hỗ trợ chuyển khoản QR.",
        );
      if (invoiceRequired && ["cod", "store"].includes(selectedPayment))
        return showToast("Đơn xuất hóa đơn công ty cần thanh toán online.");
      const delivery = {
        type,
        province: type === "store" ? values.get("province").toString() : "",
        district: type === "store" ? values.get("district").toString() : "",
        store: type === "store" ? values.get("store").toString() : "",
        address: type === "home" ? values.get("address").toString().trim() : "",
        fee,
        note: values.get("note").toString().trim(),
      };
      const newOrder = {
        id: `NT${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: "Đang xác nhận",
        customer: {
          name: values.get("name").toString().trim(),
          phone: values.get("phone").toString().trim(),
          email: values.get("email").toString().trim(),
          address: delivery.address,
        },
        delivery,
        payment: selectedPayment,
        invoice: {
          required: invoiceRequired,
          taxCode: invoiceRequired ? invoiceTaxCode : "",
          companyName: invoiceRequired
            ? values.get("companyName").toString().trim()
            : "",
          address: invoiceRequired
            ? values.get("companyAddress").toString().trim()
            : "",
        },
        items: entries.map((entry) => ({
          productId: entry.product.id,
          name: entry.product.name,
          quantity: entry.quantity,
          price: entry.product.price,
        })),
        total:
          entries.reduce(
            (sum, entry) => sum + entry.product.price * entry.quantity,
            0,
          ) + fee,
        subtotal,
      };
      save(STORE.orders, [...orders(), newOrder]);
      save(STORE.cart, []);
      renderOrderSuccess(newOrder);
    }
    if (form.id === "contact-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const messages = read(STORE.contacts, []);
      messages.push({
        id: `MSG${Date.now()}`,
        createdAt: new Date().toISOString(),
        name: values.get("name").toString().trim(),
        address: values.get("address").toString().trim(),
        email: values.get("email").toString().trim(),
        message: values.get("message").toString().trim(),
      });
      save(STORE.contacts, messages);
      form.reset();
      document.getElementById("contact-status").textContent =
        "Cảm ơn bạn! Tin nhắn đã được lưu trên trình duyệt này.";
    }
    if (form.id === "admin-product-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const id = values.get("productId").toString();
      const old = products().find((item) => item.id === id);
      const entry = {
        id: id || `p-${Date.now()}`,
        code: values.get("code").toString().trim(),
        name: values.get("name").toString().trim(),
        categoryId: values.get("categoryId").toString(),
        price: Number(values.get("price")),
        oldPrice: Number(values.get("oldPrice")) || 0,
        image:
          values.get("image").toString().trim() ||
          "assets/images/product-placeholder.svg",
        description: values.get("description").toString().trim(),
        featured: values.has("featured"),
        visible: values.has("visible"),
        createdAt: old?.createdAt || new Date().toISOString().slice(0, 10),
        tag: old?.tag || "",
      };
      if (!Number.isFinite(entry.price) || entry.price < 0)
        return showToast("Vui lòng nhập giá hợp lệ.");
      if (
        products().some(
          (item) =>
            item.code.toLowerCase() === entry.code.toLowerCase() &&
            item.id !== id,
        )
      )
        return showToast("Mã sản phẩm đã được sử dụng.");
      save(
        STORE.products,
        id
          ? products().map((item) => (item.id === id ? entry : item))
          : [...products(), entry],
      );
      showToast(id ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
      renderAdmin();
    }
    if (form.id === "admin-category-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const name = values.get("name").toString().trim();
      if (
        categories().some(
          (item) => item.name.toLowerCase() === name.toLowerCase(),
        )
      )
        return showToast("Tên danh mục đã tồn tại.");
      save(STORE.categories, [
        ...categories(),
        {
          id: `cat-${Date.now()}`,
          name,
          icon: values.get("icon").toString().trim() || "◇",
          parentId: values.get("parentId").toString(),
        },
      ]);
      renderAdmin();
    }
    if (form.id === "admin-article-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const id = values.get("articleId").toString();
      const old = articles().find((item) => item.id === id);
      const entry = {
        id: id || `n-${Date.now()}`,
        title: values.get("title").toString().trim(),
        category: values.get("category").toString().trim(),
        image:
          values.get("image").toString().trim() ||
          "assets/images/product-placeholder.svg",
        createdAt: values.get("createdAt").toString(),
        summary: values.get("summary").toString().trim(),
        body: values.get("body").toString().trim(),
        visible: old ? old.visible !== false : true,
      };
      save(
        STORE.articles,
        id
          ? articles().map((item) => (item.id === id ? entry : item))
          : [...articles(), entry],
      );
      showToast(id ? "Đã cập nhật bài viết." : "Đã đăng bài viết.");
      renderAdmin();
    }
    if (form.id === "admin-about-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      save(STORE.about, {
        title: values.get("title").toString().trim(),
        intro: values.get("intro").toString().trim(),
        mission: values.get("mission").toString().trim(),
        vision: values.get("vision").toString().trim(),
      });
      showToast("Đã lưu nội dung giới thiệu.");
    }
  });

  render();
})();
