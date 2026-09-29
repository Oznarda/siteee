
function r_degistir (isim,y_img)  {
        var yeni_img;
        yeni_img="gifs/"+ isim +y_img;
        document.images[isim].src=(yeni_img);     
 }

var siteRefreshStyles = document.createElement("link");
var viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content = "width=device-width, initial-scale=1";
        document.head.appendChild(viewportMeta);
}

siteRefreshStyles.rel = "stylesheet";
siteRefreshStyles.href = "site-refresh.css";
document.head.appendChild(siteRefreshStyles);

document.addEventListener("DOMContentLoaded", function () {
        var currentFile = decodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
        var isEnglish = /-en\.html$/i.test(currentFile);
        var baseFile = currentFile.replace(/-en\.html$/i, ".html");
        var pairedPages = /^(index|kirikmakina|iletisim|referanslar|makina[1-9]|makina1[0-4]|urunler)\.html$/i;
        var turkishPage = isEnglish ? baseFile : currentFile;
        var englishPage = isEnglish ? currentFile : (pairedPages.test(currentFile) ? currentFile.replace(/\.html$/i, "-en.html") : "index-en.html");
        var labels = isEnglish
                ? { home: "Home", company: "Company", products: "Products", references: "References", contact: "Contact", menuOpen: "Open navigation menu", menuClose: "Close navigation menu" }
                : { home: "Ana Sayfa", company: "Kurumsal", products: "\u00DCr\u00FCnler", references: "Referanslar", contact: "\u0130leti\u015Fim", menuOpen: "Men\u00FCy\u00FC a\u00E7", menuClose: "Men\u00FCy\u00FC kapat" };
        var header = document.createElement("header");
        header.className = "site-header";
        header.innerHTML = '<div class="site-header-inner">' +
                '<a class="site-brand" href="' + (isEnglish ? "index-en.html" : "index.html") + '"><span class="site-brand-mark">KM</span><span><span class="site-brand-name">Kirik Makina</span><span class="site-brand-caption">Industrial Machinery</span></span></a>' +
                '<nav id="site-navigation" class="site-nav" aria-label="Primary navigation">' +
                '<a href="' + (isEnglish ? "index-en.html" : "index.html") + '">' + labels.home + '</a>' +
                '<a href="' + (isEnglish ? "kirikmakina-en.html" : "kirikmakina.html") + '">' + labels.company + '</a>' +
                '<a href="' + (isEnglish ? "urunler-en.html" : "urunler.html") + '">' + labels.products + '</a>' +
                '<a href="' + (isEnglish ? "referanslar-en.html" : "referanslar.html") + '">' + labels.references + '</a>' +
                '<a href="' + (isEnglish ? "iletisim-en.html" : "iletisim.html") + '">' + labels.contact + '</a>' +
                '</nav><div class="site-language" aria-label="Language">' +
                '<a href="' + turkishPage + '" lang="tr" aria-label="T\u00FCrk\u00E7e" aria-current="' + (!isEnglish) + '">TR</a>' +
                '<a href="' + englishPage + '" lang="en" aria-label="English" aria-current="' + isEnglish + '">EN</a>' +
                '</div><button class="site-menu-toggle" type="button" aria-label="' + labels.menuOpen + '" aria-expanded="false" aria-controls="site-navigation">' +
                '<span></span><span></span><span></span></button></div>';
        document.body.insertBefore(header, document.body.firstChild);

        if (document.body.classList.contains("home-page")) {
                var updateHomeHeaderHeight = function () {
                        header.style.setProperty("--home-header-height", header.getBoundingClientRect().height + "px");
                };
                updateHomeHeaderHeight();
                if ("ResizeObserver" in window) {
                        new ResizeObserver(updateHomeHeaderHeight).observe(header);
                } else {
                        window.addEventListener("resize", updateHomeHeaderHeight);
                }
        }

        var languageMap = document.querySelector('map[name="home_ust"]');
        if (languageMap) {
                var languageAreas = languageMap.querySelectorAll("area");
                if (languageAreas[0]) languageAreas[0].href = turkishPage;
                if (languageAreas[1]) languageAreas[1].href = englishPage;
        }

        var englishReferencesLink = document.querySelector('img[name="c04"]');
        if (isEnglish && englishReferencesLink && englishReferencesLink.parentNode) {
                englishReferencesLink.parentNode.href = "referanslar-en.html";
        }

        header.querySelectorAll(".site-nav > a").forEach(function (link) {
                if (link.getAttribute("href") === currentFile || (/^makina\d+(-en)?\.html$/i.test(currentFile) && /^urunler/.test(link.getAttribute("href")))) link.setAttribute("aria-current", "page");
        });

        var menuToggle = header.querySelector(".site-menu-toggle");
        var siteNavigation = header.querySelector(".site-nav");
        function setMobileMenuOpen(isOpen) {
                header.classList.toggle("menu-open", isOpen);
                menuToggle.setAttribute("aria-expanded", String(isOpen));
                menuToggle.setAttribute("aria-label", isOpen ? labels.menuClose : labels.menuOpen);
        }
        menuToggle.addEventListener("click", function () {
                setMobileMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
        });
        siteNavigation.addEventListener("click", function (event) {
                if (event.target.closest && event.target.closest("a")) setMobileMenuOpen(false);
        });
        document.addEventListener("click", function (event) {
                if (!header.contains(event.target)) setMobileMenuOpen(false);
        });
        document.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                        setMobileMenuOpen(false);
                        menuToggle.focus();
                }
        });
        window.addEventListener("resize", function () {
                if (window.innerWidth >= 768) setMobileMenuOpen(false);
        });

        var homePage = document.querySelector(".home-page");
        if (homePage && "IntersectionObserver" in window &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                var revealSections = homePage.querySelectorAll(
                        ".home-products, .home-company, .home-video, .home-contact"
                );
                var revealObserver = new IntersectionObserver(function (entries, observer) {
                        entries.forEach(function (entry) {
                                if (entry.isIntersecting) {
                                        entry.target.classList.add("home-revealed");
                                        observer.unobserve(entry.target);
                                }
                        });
                }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

                revealSections.forEach(function (section) {
                        section.classList.add("home-reveal");
                        revealObserver.observe(section);
                });
        }

        document.addEventListener("submit", function (event) {
                var form = event.target;
                if (!form.matches(".contact-form")) return;

                event.preventDefault();
                var formData = new FormData(form);
                var name = formData.get("name");
                var subject = isEnglish ? "Website enquiry: " + name : "Web sitesi iletişim mesajı: " + name;
                var message = (isEnglish ? "Name" : "Ad soyad") + ": " + name + "\n" +
                        (isEnglish ? "Email" : "E-posta") + ": " + formData.get("email") + "\n" +
                        (isEnglish ? "Telephone" : "Telefon") + ": " + (formData.get("phone") || "-") + "\n\n" +
                        (isEnglish ? "Message" : "Mesaj") + ":\n" + formData.get("message");
                window.location.href = "mailto:info@kirikmakina.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
        });
});

  Sakli0=new Image(108, 51);
  Sakli0.src=("gifs/b01_2.gif");
  Sakli1=new Image(141, 51);
  Sakli1.src=("gifs/b02_2.gif");
  Sakli2=new Image(167, 51);
  Sakli2.src=("gifs/b03_2.gif");
  Sakli3=new Image(174, 51);
  Sakli3.src=("gifs/b04_2.gif");
  Sakli4=new Image(124, 51);
  Sakli4.src=("gifs/b05_2.gif");
    

