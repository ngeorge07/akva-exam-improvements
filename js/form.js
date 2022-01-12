let url =
  "https://usebasin.com/api/v1/submissions?form_id=ab2834d7e27b&api_token=1cbd5d2e93116be3389923b4e8c5fd5d";

const options = {
  headers: {
    "x-apikey": "61b64c7672a03f5dae822307",
  },
};

let today = new Date();
let lastDay = new Date();

const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = today.getFullYear();

const mmLast = String(today.getMonth() + 2).padStart(2, "0");

today = `${dd}-${mm}-${yyyy}`;
lastDay = `${dd}-${mmLast}-${yyyy}`;

let datepicker;

function getFormData() {
  fetch(url, options)
    .then((response) => response.json())
    .then(updateForm);
}

function getHours() {
  fetch(url, options)
    .then((response) => response.json())
    .then(checkHoursAvailable);
}

function showHours() {
  fetch(url, options)
    .then((response) => response.json())
    .then(showAvailableHours);
}

function updateForm(a) {
  const elem = document.getElementById("date");
  datepicker = new Datepicker(elem, {
    buttonClass: "btn",
    minDate: today,
    maxDate: lastDay,
    daysOfWeekDisabled: [0, 6],
    format: "dd/mm/yyyy",
    autohide: true,
  });
}

function getOccurrence(array, value) {
  let count = 0;
  array.forEach((v) => v === value && count++);
  return count;
}

function checkHoursAvailable(a) {
  const submissions = a.submissions;
  let dates = [];
  let unavailableDays = [];

  for (let i = 0; i < submissions.length; i++) {
    dates.push(submissions[i].payload_params.date);
    if (getOccurrence(dates, submissions[i].payload_params.date) === 3) {
      unavailableDays.push(submissions[i].payload_params.date);
      datepicker.setOptions({ datesDisabled: unavailableDays });
    }
  }
}

function showAvailableHours(a) {
  const hSubmissions = a.submissions;
  const selectedDay = document.querySelector("#date").value;
  const textHours = ["11-00", "12-00", "13-00"];

  const temp = document.querySelector("template").content;
  const clone = temp.cloneNode(true);

  for (let i = 0; i < hSubmissions.length; i++) {
    if (hSubmissions[i].payload_params.date === selectedDay) {
      hSubmissions[i].payload_params.time = hSubmissions[
        i
      ].payload_params.time.replace(":", "-");
      if (getOccurrence(textHours, hSubmissions[i].payload_params.time) === 1) {
        console.log("ana");
        clone
          .querySelector(`#container-${hSubmissions[i].payload_params.time}`)
          .remove();
      }
    }
  }

  document.querySelector("#time").appendChild(clone);

  console.log(selectedDay);
  console.log(hSubmissions);
}

function makeDayClick() {
  const calendar = document.querySelector(".datepicker-grid");
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");
  let availableDays = calendar.querySelectorAll(
    ".datepicker-cell:not(.disabled)"
  );

  getHours();

  function dayIsClicked() {
    let t = 0;

    if (document.querySelector("#time-options")) {
      document.querySelector("#time-options").remove();
    }

    availableDays.forEach((d) => {
      d.removeEventListener("click", dayIsClicked);
    });

    nextButton.removeEventListener("click", nextClicked);
    prevButton.removeEventListener("click", nextClicked);

    if (document.querySelector("#time-options")) {
      document.querySelector("#time-options").remove();
    }

    document.querySelector("#date").addEventListener("click", makeDayClick);

    showHours();
  }

  availableDays.forEach((d) => {
    d.addEventListener("click", dayIsClicked);
  });

  function nextClicked() {
    availableDays = calendar.querySelectorAll(
      ".datepicker-cell:not(.disabled)"
    );

    const unDays = document.querySelectorAll(".datepicker-cell.disabled");

    unDays.forEach((z) => {
      z.removeEventListener("click", dayIsClicked);
    });

    availableDays.forEach((d) => {
      d.addEventListener("click", dayIsClicked);
    });
  }

  nextButton.addEventListener("click", nextClicked);
  prevButton.addEventListener("click", nextClicked);
  document.querySelector("#date").removeEventListener("click", makeDayClick);
}

document.querySelector("#date").addEventListener("click", makeDayClick);

getFormData();

// input box, as well as the span element into which we will place the error message.
const form = document.getElementsByTagName("form")[0];

const email = document.getElementById("email");
const emailError = document.querySelector("#input-info + span.error");

email.addEventListener("input", function (event) {
  // Each time the user types something, we check if the
  // form fields are valid.

  if (email.validity.valid) {
    // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    emailError.textContent = ""; // Reset the content of the message
    emailError.className = "error"; // Reset the visual state of the message
  } else {
    // If there is still an error, show the correct error
    showError();
  }
});

form.addEventListener("submit", function (event) {
  // if the email field is valid, we let the form submit

  if (!email.validity.valid) {
    // If it isn't, we display an appropriate error message
    showError();
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();
  }
});

function showError() {
  if (email.validity.valueMissing) {
    // If the field is empty,
    // display the following error message.
    emailError.textContent = "You need to enter an e-mail address.";
  } else if (email.validity.typeMismatch) {
    // If the field doesn't contain an email address,
    // display the following error message.
    emailError.textContent = "Entered value needs to be an e-mail address.";
  }

  emailError.className = "error active";
}

const dbUrl = "https://gnmmd2ndsemester-6f2a.restdb.io/rest/akva";
const dbOptions = {
  headers: {
    "x-apikey": "61b64c7672a03f5dae822307",
  },
};

function getRestData() {
  fetch(dbUrl, dbOptions)
    .then((response) => response.json())
    .then(chooseProduct);
}

function chooseProduct(p) {
  const template = document.querySelector("template").content;

  p.forEach((e) => {
    const chooseOption = document.createElement("option");
    chooseOption.setAttribute("value", `${e.title}`);
    chooseOption.textContent = e.title;
    template.querySelector("select").appendChild(chooseOption);
  });
}

getRestData();
