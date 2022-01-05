function dropdownAnim() {
  // *** Dropdown Menu for click ***///

  document
    .querySelector(".burger-icon")
    .addEventListener("click", openDropdownMenu);

  function openDropdownMenu() {
    document.querySelector(".burger-dropdown").classList.toggle("menu-dropped");
    document
      .querySelector(".category-options2")
      .classList.remove("category-clicked");
    document
      .querySelector(".category-options1")
      .classList.remove("category-clicked");
  }

  document
    .querySelector(".dropdown-category1")
    .addEventListener("click", category1Clicked);
  document
    .querySelector(".dropdown-category2")
    .addEventListener("click", category2Clicked);

  function category1Clicked() {
    document
      .querySelector(".expand-options2")
      .classList.remove("arrow-rotated");
    document
      .querySelector(".category-options2")
      .classList.remove("category-clicked");
    document
      .querySelector(".category-options1")
      .classList.toggle("category-clicked");
    document
      .querySelector(".expand-options1")
      .classList.toggle("arrow-rotated");
  }

  function category2Clicked() {
    document
      .querySelector(".expand-options1")
      .classList.remove("arrow-rotated");
    document
      .querySelector(".category-options1")
      .classList.remove("category-clicked");
    document
      .querySelector(".category-options2")
      .classList.toggle("category-clicked");
    document
      .querySelector(".expand-options2")
      .classList.toggle("arrow-rotated");
  }
}

function logoChangeSize() {
  let htmlElem = document.querySelector("html");
  let windowWidth = htmlElem.clientWidth;

  window.onresize = reportWindowSize;
  const widthThreshold = 1100;

  function reportWindowSize() {
    windowWidth = htmlElem.clientWidth;

    if (windowWidth < widthThreshold) {
      document
        .querySelector(".header-logo img")
        .classList.remove("logo-current");
      document
        .querySelector(".burger-dropdown")
        .classList.remove("menu-dropped");
    } else if (windowWidth >= widthThreshold && heroInPosition == true) {
      document.querySelector(".header-logo img").classList.add("logo-current");
    } else if (windowWidth >= widthThreshold && heroInPosition == false) {
      document
        .querySelector(".header-logo img")
        .classList.remove("logo-current");
    }
  }

  // *** Dropdown Menu Functionalities ***///

  const items = document.querySelectorAll(".activate-dropdown");
  let heroInPosition = true;

  items.forEach((item) => {
    if (windowWidth >= widthThreshold) {
      item.addEventListener("mouseenter", expandLogo);
      item.addEventListener("mouseleave", backInPosition);
    }
  });

  function expandLogo() {
    if (windowWidth >= widthThreshold) {
      document
        .querySelector(".header-logo img")
        .classList.remove("logo-current");
    }
  }

  function backInPosition() {
    if (windowWidth >= widthThreshold && heroInPosition == true) {
      document.querySelector(".header-logo img").classList.add("logo-current");
    }
  }

  const heroImg = document.querySelector("#element-observer");

  function callbackFunction(entry) {
    if (windowWidth >= widthThreshold) {
      if (entry[0].isIntersecting == true) {
        document
          .querySelector(".header-logo img")
          .classList.add("logo-current");
        heroInPosition = true;
      } else if (entry[0].isIntersecting == false) {
        document
          .querySelector(".header-logo img")
          .classList.remove("logo-current");
        heroInPosition = false;
      }
    }
  }

  const observer = new IntersectionObserver(callbackFunction, {
    threshold: 1,
    rootMargin: "-90px 0px 90% 0px",
  });

  observer.observe(heroImg);
}

function databaseGet() {
  const urlParams = new URLSearchParams(window.location.search);
  const sort = urlParams.get("q");
  const url = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva?q=${sort}&sort=title`;
  let url1;

  if (sort === '{"type":"necklace"}') {
    url1 = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva-descriptions?q=${sort}&max=2`;
  } else if (sort === '{"$and":[{"type":"ring"},{"material":"gold"}]}') {
    url1 = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva-descriptions?q=${sort}&max=1`;
  } else if (sort === '{"material":"gold"}') {
    url1 =
      'https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva-descriptions?q={"$and":[{"type":""},{"material":"gold"}]}';
  } else if (sort === '{"material": "diamond"}') {
    url1 = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva-descriptions?q=${sort}&max=3`;
  } else
    url1 = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva-descriptions?q=${sort}`;

  const options = {
    headers: {
      "x-apikey": "61b64c7672a03f5dae822307",
    },
  };

  fetch(url1, options)
    .then((response) => response.json())
    .then(dynamicInfo);

  fetch(url, options)
    .then((response) => response.json())
    .then(dynamicShow);
}

function dynamicInfo(d) {
  const productTypeInfo = d[d.length - 1];

  document.querySelector("h1").textContent = productTypeInfo.titleInfo;
  document.querySelector("#list-info p").innerHTML = productTypeInfo.descInfo;
  document
    .querySelector("#element-observer")
    .setAttribute("src", `${productTypeInfo.coverImage}`);

  document
    .querySelector("#element-observer")
    .setAttribute("at", `${productTypeInfo.titleInfo}`);
}

function dynamicShow(p) {
  p.forEach((e) => {
    const temp = document.querySelector("template").content;
    const clone = temp.cloneNode(true);
    const links = clone.querySelectorAll("a");

    for (let l = 0; l < links.length; l++) {
      links[l].setAttribute("href", `product-page.html?title=${e.title}`);
      links[l].setAttribute("aria-label", `${e.title}`);
    }

    clone.querySelector("img").src = e.coverImg;
    clone.querySelector("img").alt = e.title;
    clone.querySelector("h3 a").textContent = e.title;
    clone.querySelector(".product-price").textContent = `${e.price} €`;

    document.querySelector("#product-grid").appendChild(clone);
  });
  imgOnHover();
}

function imgOnHover() {
  const allImg = document.querySelectorAll(".image-hover");
  const allDiv = document.querySelectorAll(".product-info");

  for (let img = 0; img < allImg.length; img++) {
    const element = allImg[img];
    element.addEventListener("mouseenter", () => {
      const productLink = allDiv[img].querySelector(".link-line");
      productLink.style.setProperty("--default-line-width", "0");
    });
    element.addEventListener("mouseleave", () => {
      const productLink = allDiv[img].querySelector(".link-line");
      productLink.style.setProperty("--default-line-width", "100%");
    });
  }
}

dropdownAnim();
logoChangeSize();
databaseGet();
