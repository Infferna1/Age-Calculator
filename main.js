var inputs = document.querySelectorAll("input");
var button = document.querySelector("button");
var nums = document.querySelectorAll(".num");

var hasDateError = false;

const errorMsg = {
  requestField: "This field is required",
  valid: "Must be a valid",
};

button.addEventListener("click", () => {
  let hasInputError = false;

  inputs.forEach((input) => {
    const value = input.value.trim();
    const label = input.parentElement.querySelector("label");

    if (value === "") {
      label.style.color = "var(--light-red)";
      input.classList.replace("normal", "error");
      showError(input, errorMsg.requestField);
      hasInputError = true;
    } else {
      input.classList.replace("error", "normal");
      label.style.color = "var(--smokey-grey)";
    }
  });

  const errors = isValidDate(inputs[0].value, inputs[1].value, inputs[2].value);
  errors.forEach((error) => {
    if (error.message === "Must be a valid date") {
      hasDateError = true;
    }
    showError(inputs[error.inputIndex], error.message, hasDateError);
  });

  if (!hasInputError && errors.length === 0) {
    inputs.forEach((input) => {
      clearError(input);
    });
    performCalculation();
  }

  inputs.forEach((input) => {
    input.addEventListener("click", () => {
      clearError(input);
    });
  });
});

function performCalculation() {
  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value - 1;
  const year = document.getElementById("year").value;

  const currentDate = new Date();
  const inputDate = new Date(year, month, day);

  let years = currentDate.getFullYear() - inputDate.getFullYear();
  let months = currentDate.getMonth() - inputDate.getMonth();
  let days = currentDate.getDate() - inputDate.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }
  
  if (days < 0) {
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  console.log(`Пройшло ${years} років, ${months} місяців, ${days} днів`);

  animateNumber(document.querySelectorAll('.num')[0], 0, years, 2000);
  animateNumber(document.querySelectorAll('.num')[1], 0, months, 1500); 
  animateNumber(document.querySelectorAll('.num')[2], 0, days, 1000);
}

function animateNumber(element, start, end, duration) {
  let startTime = null;

  function updateNumber(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = timestamp - startTime;
    const percentage = Math.min(progress / duration, 1);
    const currentNumber = Math.floor(percentage * (end - start) + start);

    element.textContent = currentNumber.toLocaleString('en-US', {
      minimumIntegerDigits: 1,
      useGrouping: false
    });

    if (percentage < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

function clearError(input) {
  input.classList.replace("error", "normal");

  const label = input.parentElement.querySelector("label");
  label.style.color = "var(--smokey-grey)";

  const existingError = input.nextElementSibling;
  if (existingError) {
    existingError.remove();
  }
}

function showError(input, msg, hasDateError = false) {
  const existingError = input.nextElementSibling;

  if (hasDateError === false) {
    if (!existingError) {
      const label = input.parentElement.querySelector("label");
      label.style.color = "var(--light-red)";

      input.classList.replace("normal", "error");

      const errorMsg = document.createElement("p");
      errorMsg.classList.add("error-msg");
      errorMsg.innerText = msg;

      input.insertAdjacentElement("afterend", errorMsg);
    }
  } else {
    input.parentElement.querySelectorAll(".error-msg").forEach((error) => {
      error.remove();
    });

    document.querySelectorAll(".normal").forEach((input) => {
      input.classList.replace("normal", "error");

      const label = input.parentElement.querySelector("label");
      label.style.color = "var(--light-red)";
    });

    if (!existingError) {
      const label = input.parentElement.querySelector("label");
      label.style.color = "var(--light-red)";

      input.classList.replace("normal", "error");

      const errorMsg = document.createElement("p");
      errorMsg.classList.add("error-msg");
      errorMsg.innerText = msg;

      input.insertAdjacentElement("afterend", errorMsg);
    }
  }
}

function isValidDate(Day, Month, Year) {
  const currentYear = new Date().getFullYear();
  const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const errors = [];

  if (Year > currentYear) {
    errors.push({
      inputIndex: 2,
      message: `Must be in the past`,
    });
  }

  if (Month < 1 || Month > 12) {
    errors.push({
      inputIndex: 1,
      message: `Must be a valid month`,
    });
  }

  if (Day < 1 || Day > maxDaysInMonth[Month - 1] || Day > 31) {
    if (errors.length > 0) {
      errors.push({
        inputIndex: 0,
        message: `Must be a valid day`,
      });
    } else {
      errors.push({
        inputIndex: 0,
        message: `Must be a valid date`,
      });
    }
  }

  return errors;
}
