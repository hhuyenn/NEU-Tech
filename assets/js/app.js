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
  const catalogVersion = "novatech_catalog_v4";
  if (localStorage.getItem(catalogVersion) !== "1") {
    const categoriesMerged = mergeCatalogDefaults(
      STORE.categories,
      seed.categories,
    );
    const productsMerged = mergeCatalogDefaults(STORE.products, seed.products);
    if (categoriesMerged && productsMerged)
      localStorage.setItem(catalogVersion, "1");
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
    "tivi",
    "tu-lanh",
    "dong-ho",
    "loa",
    "tai-nghe",
    "phu-kien",
    "gia-dung",
  ];
  const homeCategories = () =>
    categories()
      .filter((category) => !category.parentId)
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
  const page = pageParam.get("page") || "home";
  let noticeTimer;

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
      <div class="header-actions"><a href="index.html?page=contact" class="header-support"><svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"></circle><path d="M5 20c.8-3.6 3.1-5.4 7-5.4s6.2 1.8 7 5.4"></path></svg><span>Hỗ trợ<small>Khách hàng</small></span></a><a href="index.html?page=cart" class="cart-link"><svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg><span>Giỏ hàng <b data-cart-count>0</b></span></a></div>
    </div>
    <nav class="main-nav"><div class="container nav-inner">
      ${link("home", "Trang chủ", 'class="nav-link"')}${link("products", "Sản phẩm", 'class="nav-link"')}<a href="index.html?page=home#categories" class="nav-link">Danh mục</a>${link("about", "Giới thiệu", 'class="nav-link"')}${link("news", "Tin tức", 'class="nav-link"')}${link("contact", "Liên hệ", 'class="nav-link"')}
    </div></nav></header>`;
  const footer = () => `
    <footer class="site-footer"><div class="container footer-grid">
      <div><a class="logo footer-logo" href="index.html"><span class="brand-mark">N</span><span>NEU<span class="logo-accent">Tech</span><small>CÔNG NGHỆ CHO CUỘC SỐNG</small></span></a><p>Khám phá công nghệ chính hãng với trải nghiệm mua sắm dễ dàng và dịch vụ tận tâm.</p></div>
      <div><h3>Khám phá</h3>${link("products", "Sản phẩm")}${link("about", "Về NEUTech")}${link("news", "Tin công nghệ")}</div>
      <div><h3>Hỗ trợ khách hàng</h3>${link("contact", "Liên hệ với chúng tôi")}</div>
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
        tivi: "p-samsung-tv",
        "tu-lanh": "p-lg-fridge",
        "dong-ho": "p-watch",
        loa: "p-jbl-speaker",
        "phu-kien": "p-charger",
        "gia-dung": "p-lg-washer",
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
    const promoProducts = ["p-galaxy-a55", "p-watch", "p-samsung-tv"]
      .map((id) => products().find((product) => product.id === id))
      .filter(Boolean);
    shell(
      `
      <section class="home-promo-layout container">
        <div class="hero home-hero"><div class="hero-content"><span class="home-hero-kicker">NEUTECH · CÔNG NGHỆ CHO CUỘC SỐNG</span><h1>TRẢI NGHIỆM CÔNG NGHỆ<br>MỞ LỐI SỐNG THÔNG MINH</h1><p>Điện thoại, laptop và thiết bị gia dụng chính hãng với ưu đãi hấp dẫn.</p><div class="hero-actions">${link("products", "Khám phá ngay", 'class="button button-primary"')}</div></div></div>
        <div class="home-promos">${promoProducts.map((product, index) => `<a class="home-promo-card promo-${index + 1}" href="${productUrl(product.id)}">${image(product.image, "promo-image", product.name)}<span><small>${index === 0 ? "ƯU ĐÃI ĐIỆN THOẠI" : index === 1 ? "THIẾT BỊ ĐEO THÔNG MINH" : "GIẢI TRÍ TẠI GIA"}</small><strong>${safe(product.name)}</strong></span></a>`).join("")}</div>
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
      `<div class="container breadcrumbs">${link("home", "Trang chủ")} / ${link("products", "Sản phẩm")} / ${safe(item.name)}</div><section class="container product-detail"><div class="detail-photo">${image(item.image, "", item.name)}</div><div class="detail-info"><span class="eyebrow">${safe(categoryName(item.categoryId))} · Mã ${safe(item.code)}</span><h1>${safe(item.name)}</h1><div class="detail-price">${money(item.price)} ${item.oldPrice ? `<del>${money(item.oldPrice)}</del>` : ""}</div><p class="detail-description">${safe(item.description)}</p><div class="stock-note"><span></span> Còn hàng · Bảo hành chính hãng</div><div class="detail-actions"><button class="button button-primary" data-add="${safe(item.id)}">Thêm vào giỏ hàng</button><button class="button button-outline" data-share-product="${safe(item.id)}">Chia sẻ sản phẩm</button></div><div class="delivery-note"><b>✓</b><span><strong>Giao hàng toàn quốc</strong><br>Kiểm tra hàng trước khi thanh toán.</span></div></div></section><section class="section section-tint"><div class="container">${sectionHeading("CÓ THỂ BẠN SẼ THÍCH", "Sản phẩm liên quan", "products")}<div class="product-grid">${related.map(productCard).join("") || emptyState("Chưa có sản phẩm liên quan", "Khám phá thêm các sản phẩm khác tại cửa hàng.")}</div></div></section>`,
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
    const total = rows.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );
    const table = rows
      .map(
        (entry) =>
          `<article class="cart-row"><a class="cart-product" href="${productUrl(entry.product.id)}">${image(entry.product.image, "", entry.product.name)}<span><strong>${safe(entry.product.name)}</strong><small>Mã: ${safe(entry.product.code)}</small></span></a><div class="cart-unit">${money(entry.product.price)}</div><div class="quantity-control"><button aria-label="Giảm" data-quantity="${safe(entry.product.id)}" data-delta="-1">−</button><span>${entry.quantity}</span><button aria-label="Tăng" data-quantity="${safe(entry.product.id)}" data-delta="1">+</button></div><strong class="cart-line-total">${money(entry.product.price * entry.quantity)}</strong><button class="remove-button" data-remove="${safe(entry.product.id)}" aria-label="Xóa sản phẩm">×</button></article>`,
      )
      .join("");
    shell(
      `${pageTitle("GIỎ HÀNG", "Túi mua sắm của bạn", "Kiểm tra sản phẩm trước khi tiến hành đặt hàng.")}<section class="section container cart-layout"><div class="cart-items">${rows.length ? `<div class="cart-labels"><span>SẢN PHẨM</span><span>ĐƠN GIÁ</span><span>SỐ LƯỢNG</span><span>TẠM TÍNH</span><span></span></div>${table}` : emptyState("Giỏ hàng đang trống", "Khám phá cửa hàng và thêm sản phẩm bạn yêu thích.")}${link("products", "← Tiếp tục mua sắm", 'class="text-link cart-back"')}</div><aside class="summary-card"><h2>Tóm tắt đơn hàng</h2><div class="summary-line"><span>Tạm tính</span><b>${money(total)}</b></div><div class="summary-line"><span>Phí vận chuyển</span><span>${total ? "Miễn phí" : money(0)}</span></div><div class="summary-line summary-total"><strong>Tổng cộng</strong><strong>${money(total)}</strong></div><p>Phí giao hàng và ưu đãi sẽ được xác nhận khi đặt hàng.</p>${rows.length ? link("checkout", "Tiến hành đặt hàng →", 'class="button button-primary button-full"') : `<button class="button button-primary button-full" disabled>Tiến hành đặt hàng</button>`}</aside></section>`,
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
    const total = rows.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );
    shell(
      `${pageTitle("ĐẶT HÀNG", "Thông tin giao hàng", "Vui lòng cung cấp thông tin để chúng tôi chuẩn bị đơn hàng.")}<section class="section container checkout-layout"><form id="checkout-form" class="form-card"><h2>Thông tin người nhận</h2><div class="form-grid"><label>Họ và tên *<input name="name" required minlength="2" autocomplete="name"></label><label>Số điện thoại *<input name="phone" required pattern="[0-9]{9,15}" title="Nhập số điện thoại gồm 9-15 chữ số" autocomplete="tel"></label><label>Email *<input name="email" required type="email" autocomplete="email"></label><label>Địa chỉ giao hàng *<input name="address" required minlength="8" autocomplete="street-address"></label><label class="span-2">Ghi chú<textarea name="note" rows="3" placeholder="Lưu ý khi giao hàng (không bắt buộc)"></textarea></label><fieldset class="span-2 payment-options"><legend>Phương thức thanh toán</legend><label><input type="radio" name="payment" value="cod" checked> Thanh toán khi nhận hàng (COD)</label><label><input type="radio" name="payment" value="bank"> Chuyển khoản</label></fieldset></div><button class="button button-primary">Xác nhận đặt hàng · ${money(total)}</button></form><aside class="summary-card"><h2>Đơn hàng của bạn</h2>${rows.map((entry) => `<div class="checkout-item">${image(entry.product.image, "", entry.product.name)}<span>${safe(entry.product.name)}<small>SL: ${entry.quantity}</small></span><b>${money(entry.product.price * entry.quantity)}</b></div>`).join("")}<div class="summary-line summary-total"><strong>Tổng cộng</strong><strong>${money(total)}</strong></div></aside></section>`,
      "Thanh toán",
    );
  }

  function renderOrderSuccess(order) {
    shell(
      `<section class="success-page container"><div class="success-icon">✓</div><span class="eyebrow">ĐẶT HÀNG THÀNH CÔNG</span><h1>Cảm ơn bạn đã chọn NEUTech!</h1><p>Đơn hàng của bạn đã được lưu trên trình duyệt này. Nhân viên cửa hàng sẽ liên hệ để xác nhận.</p><div class="order-number">Mã đơn hàng <strong>${safe(order.id)}</strong></div><div class="success-summary"><span>Người nhận: <b>${safe(order.customer.name)}</b></span><span>Tổng thanh toán: <b>${money(order.total)}</b></span><span>Thanh toán: <b>${order.payment === "cod" ? "Khi nhận hàng" : "Chuyển khoản"}</b></span></div><div class="success-actions">${link("products", "Tiếp tục mua sắm", 'class="button button-primary"')}</div></section>`,
      "Đặt hàng thành công",
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
              `<tr><td><strong>${safe(order.id)}</strong></td><td>${safe(order.customer.name)}<small class="table-sub">${safe(order.customer.phone)}</small></td><td>${safe(new Date(order.createdAt).toLocaleString("vi-VN"))}</td><td>${money(order.total)}</td><td><select class="order-status" data-order-status="${safe(order.id)}">${["Mới đặt", "Đang xác nhận", "Đang giao", "Hoàn tất", "Đã hủy"].map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td><button class="table-action" data-order-detail="${safe(order.id)}">Xem</button></td></tr>`,
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
    renderHome();
  }

  document.addEventListener("click", (event) => {
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
          `Đơn hàng ${order.id}\n\nKhách hàng: ${order.customer.name}\nĐiện thoại: ${order.customer.phone}\nEmail: ${order.customer.email}\nĐịa chỉ: ${order.customer.address}\nGhi chú: ${order.customer.note || "Không có"}\n\nSản phẩm:\n${order.items.map((item) => `• ${item.name} x ${item.quantity} — ${money(item.price * item.quantity)}`).join("\n")}\n\nTổng tiền: ${money(order.total)}\nThanh toán: ${order.payment === "cod" ? "COD" : "Chuyển khoản"}`,
        );
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-order-status]")) {
      save(
        STORE.orders,
        orders().map((order) =>
          order.id === target.dataset.orderStatus
            ? { ...order, status: target.value }
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
    if (form.id === "checkout-form") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const entries = cartRows();
      if (!entries.length) return showToast("Giỏ hàng không còn sản phẩm.");
      const values = new FormData(form);
      const newOrder = {
        id: `NT${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: "Mới đặt",
        customer: {
          name: values.get("name").toString().trim(),
          phone: values.get("phone").toString().trim(),
          email: values.get("email").toString().trim(),
          address: values.get("address").toString().trim(),
          note: values.get("note").toString().trim(),
        },
        payment: values.get("payment"),
        items: entries.map((entry) => ({
          productId: entry.product.id,
          name: entry.product.name,
          quantity: entry.quantity,
          price: entry.product.price,
        })),
        total: entries.reduce(
          (sum, entry) => sum + entry.product.price * entry.quantity,
          0,
        ),
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
