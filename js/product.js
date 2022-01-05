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

// We create a function called databaseGet that will run when the page starts to load
function databaseGet() {
  const urlParams = new URLSearchParams(window.location.search);

  // using the urlParasms variable we create a new variable called "title"
  // we use title to look for the title of the product we just clicked
  const title = urlParams.get("title");

  // we concatenate the title variable with our restDB url
  // to form the specific url we need for our product
  const url = `https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva?q={"title":"${title}"}`;

  // we let the browser know we have the key to use that API
  const options = {
    headers: {
      "x-apikey": "61b64c7672a03f5dae822307",
    },
  };

  // we call the "fetch" function with the "url" and "options" variables as arguments
  fetch(url, options)
    // receive the json file
    .then((response) => response.json())
    // after the json file is received, run the "dynamicShow" function
    .then(dynamicShow);
}

function dynamicShow(p) {
  const main = document.querySelector("main");

  main.querySelector("h1").textContent = p[0].title;
  main.querySelector("p:first-of-type").innerHTML = p[0].description1;

  main.querySelector("#product-price").textContent = `${p[0].price} €`;

  main.querySelector("img:first-of-type").src = p[0].coverImg;
  main.querySelector("img:nth-of-type(2)").src = p[0].squareImg1;
  main.querySelector("img:nth-of-type(3)").src = p[0].squareImg2;
  main.querySelector("img:nth-of-type(4)").src = p[0].longImg;

  main.querySelector("img:first-of-type").alt = p[0].title;
  main.querySelector("img:nth-of-type(2)").alt = p[0].title;
  main.querySelector("img:nth-of-type(3)").alt = p[0].title;
  main.querySelector("img:nth-of-type(4)").alt = p[0].title;

  let sizes = p[0].sizes.split(",");

  if (sizes.length === 1) {
    main.querySelector("#size-buttons").remove();
    main.querySelector("#add").classList.remove("inactive");
  } else {
    const chooseOption = document.createElement("option");
    chooseOption.textContent = sizes[0];
    chooseOption.setAttribute("value", "choose");
    main.querySelector("select").appendChild(chooseOption);

    for (let z = 1; z < sizes.length; z++) {
      const sizeOption = document.createElement("option");
      sizeOption.setAttribute("value", `size${z}`);
      sizeOption.textContent = sizes[z];
      main.querySelector("select").appendChild(sizeOption);
    }

    addCart();
  }
}

function addCart() {
  const clearBtn = document.querySelector("#product-page-det div button");
  const add = document.querySelector("#add");
  const select = document.querySelector("#size-select");

  select.addEventListener("change", () => {
    if (select.value === "choose") {
      add.classList.add("inactive");
      clearBtn.classList.add("clear-invisible");
    } else {
      add.classList.remove("inactive");
      clearBtn.classList.remove("clear-invisible");

      clearBtn.addEventListener("click", () => {
        select.value = "choose";
        add.classList.add("inactive");
        clearBtn.classList.add("clear-invisible");
      });
    }
  });
}

dropdownAnim();
databaseGet();
