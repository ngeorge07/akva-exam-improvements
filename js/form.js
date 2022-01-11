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
}

document.querySelector("#date").addEventListener("click", makeDayClick);

getFormData();
