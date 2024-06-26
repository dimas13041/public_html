document.addEventListener('mouseover', (e) =>{
  if (e.target.matches('.advantage__item-desc')) {
    e.target.classList.toggle('advantage__item-desc--active')
  }
})
document.addEventListener('mouseout', (e) =>{
  if (e.target.matches('.advantage__item-desc')) {
    e.target.classList.toggle('advantage__item-desc--active')
  }
})
document.addEventListener('touchstart', (e) => {
    if (e.target.matches('.advantage__item-desc')) {
      e.target.classList.toggle('advantage__item-desc--active')
    }
  })


  const socailBtn = document.querySelector('.social-btn'),
  socailList = document.querySelector('.social__list'),
  socailArow = document.querySelector('#arow'),
  menu = document.querySelector('.header__menu-mobile');


  socailBtn.addEventListener('click', () => {
    if (socailList.classList.contains('fadeIn')) {
      socailList.classList.remove('fadeIn');
      socailList.classList.add('fadeOut');
      socailArow.classList.remove('rotate');  
    } else {
      socailList.classList.remove('fadeOut');
      socailList.classList.add('fadeIn');
      socailArow.classList.add('rotate');  
    }
  })


  document.addEventListener('click', (e) => {
    if (e.target.matches('.burger-btn')) {
      menu.classList.add('header__menu-mobile--active');
      document.body.style.overflow = 'hidden';
    } else if (e.target.matches('.close-btn')) {
      menu.classList.remove('header__menu-mobile--active');
      document.body.style.overflow = '';
    }
  })


  


function navigateTo(nextId) {
  const currentNav = document.querySelector(`.price-constructor__nav--active`);
  currentNav.classList.remove("price-constructor__nav--active");
  const currentMobileNav = document.querySelector(
    `.price-constructor__mobile-nav--active`
  );
  currentMobileNav.classList.remove("price-constructor__mobile-nav--active");
  const nextNav = document.querySelector(
    `.price-constructor__nav[data-step-id="${nextId}"]`
  );

  nextNav.classList.add("price-constructor__nav--active");
  const nextMobileNav = document.querySelector(
    `.price-constructor__mobile-nav[data-step-id="${nextId}"]`
  );
  nextMobileNav.classList.add("price-constructor__mobile-nav--active");
}

function slideNext() {
  const currentTab = document.querySelector(".price-constructor__step--active");
  const currentStepId = currentTab.dataset.stepId;

  if (currentStepId >= 4) return;

  slideTo(+currentStepId + 1);
}

function slidePrev() {
  const currentTab = document.querySelector(".price-constructor__step--active");
  const currentStepId = currentTab.dataset.stepId;

  if (currentStepId <= 1) return;

  slideTo(+currentStepId - 1);
}

function slideTo(toStepId) {
  const currentTab = document.querySelector(".price-constructor__step--active");
  const newActiveTab = document.querySelector(
    `.price-constructor__step[data-step-id="${toStepId}"]`
  );

  currentTab.classList.remove("price-constructor__step--active");
  newActiveTab.classList.add("price-constructor__step--active");
  newActiveTab.scrollIntoView({
    behavior: "smooth",
  });

  navigateTo(toStepId);
}

// global object of constructor answers

let counstructorUserData = {
  carMake: "",
  carModel: "",
  carYear: "",
  rugBackgroundColor: "beige",
  rugOutlineColor: "beige",
  setType: "",
};

const globalPristineConfig = {
  // class of the parent element where the error/success class is added
  classTo: "form-field",
  errorClass: "form-field--error",
  // class of the parent element where error text element is appended
  errorTextParent: "form-field",
  // type of element to create for the error text
  errorTextTag: "p",
  // class of the error text element
  errorTextClass: "form-help",
};

const stepForms = document.querySelectorAll(
  ".price-constructor__step[data-step-id]"
);
const pristineStepForms = {};

if (stepForms)
  stepForms.forEach((stepForm) => {
    const config = { ...globalPristineConfig };

    if (stepForm.dataset.stepId == 3) {
      config.classTo = "constructor-step__title";
      config.errorTextParent = "constructor-step__title";
    }

    pristineStepForms[stepForm.dataset.stepId] = new Pristine(stepForm, config);

    stepForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = pristineStepForms[stepForm.dataset.stepId].validate();
      if (valid) slideNext();
    });
  });

const mobileNextButton = document.querySelector(
  ".price-constructor__mobile-button--right"
);
const mobilePrevButton = document.querySelector(
  ".price-constructor__mobile-button--left"
);

const navButtons = document.querySelectorAll(".price-constructor__nav");

mobileNextButton.addEventListener("click", (e) => {
  const activeForm = document.querySelector(".price-constructor__step--active");
  const pristineForm = pristineStepForms[activeForm.dataset.stepId];
  const valid = pristineForm.validate();

  if (valid) slideNext();
});
mobilePrevButton.addEventListener("click", (e) => {
  slidePrev();
});

if (navButtons)
  navButtons.forEach((navButton) => {
    navButton.addEventListener("click", (e) => {
      const currentStepId = document.querySelector(
        ".price-constructor__step--active"
      ).dataset.stepId;
      const stepId = e.target.dataset.stepId;

      const pristineForm = pristineStepForms[currentStepId];
      if (currentStepId < stepId) {
        const valid = pristineForm.validate();
        if (!valid) return;
      }
      slideTo(stepId);
    });
  });

// initializing selects in price constructor

const carMakeSelectEl = document.getElementById("car-make");
const carModelSelectEl = document.getElementById("car-model");
const carYearSelectEl = document.getElementById("car-year");

const bgColorSelectEl = document.getElementById("rug-background-color");
const outlineColorSelectEl = document.getElementById("rug-outline-color");

const rugImage = document.querySelector(
  '[data-step-id="2"] .constructor-step__image img'
);

const carMakeSelect = NiceSelect.bind(carMakeSelectEl, {
  searchable: true,
});
const carModelSelect = NiceSelect.bind(carModelSelectEl, { searchable: true });
const carYearSelect = NiceSelect.bind(carYearSelectEl, { searchable: true });
const bgColorSelect = NiceSelect.bind(bgColorSelectEl);
const outlineColorSelect = NiceSelect.bind(outlineColorSelectEl);

bgColorSelect.update();
outlineColorSelect.update();

// function for getting all the models by make id from API

const marksUrl = "https://api.auto.ria.com/categories/1/marks/";

async function getModelsByMake(modelId) {
  const res = await fetch(marksUrl + modelId + "/models");
  const models = await res.json();

  return models;
}

//preloading years

document.addEventListener("DOMContentLoaded", async () => {
  const now = new Date();
  const firstYear = 1990;
  const curentYear = +now.getFullYear();

  for (let i = firstYear; i <= curentYear; i++) {
    const yearOption = `<option value="${i}">${i}</option>`;
    carYearSelectEl.insertAdjacentHTML("beforeend", yearOption);
  }

  carYearSelect.update();
});

// handling different inputs in price constructor

function handleCarSelect(e) {
  const target = e.target;
  const propName = target.name;
  const propValue = target.value;

  counstructorUserData[propName] = propValue;
}

carMakeSelectEl.addEventListener("change", async (e) => {
  const target = e.target;

  const makeId = target.value;
  const makeName = target.options[target.selectedIndex].textContent;

  counstructorUserData.carMake = makeName;
  counstructorUserData.carModel = "";

  const models = await getModelsByMake(makeId);

  if (models) {
    carModelSelectEl.innerHTML = `<option selected value disabled>Car model</option>`;
    models.forEach((model) => {
      const modelOption = `<option value="${model.name}">${model.name}</option>`;
      carModelSelectEl.insertAdjacentHTML("beforeend", modelOption);
    });
    carModelSelect.update();
  }
});

carModelSelectEl.addEventListener("change", handleCarSelect);
carYearSelectEl.addEventListener("change", handleCarSelect);

function handleColorSelect(e) {
  handleCarSelect(e);
  rugImage.src = `./static/images/price-constructor/color-combinations/${counstructorUserData.rugBackgroundColor}-${counstructorUserData.rugOutlineColor}.jpg`;
}

bgColorSelectEl.addEventListener("change", handleColorSelect);
outlineColorSelectEl.addEventListener("change", handleColorSelect);

// handle set picking

document.addEventListener("click", (e) => {
  const button = e.target.closest(".card-step__button");

  if (!button) return;

  const setType = button.value;

  counstructorUserData[button.name] = setType;
  button.closest(".constructor-step").setTypeKit.setAttribute("value", setType);

  const activeSet = document.querySelector(".card-step--active");

  if (activeSet) activeSet.classList.remove("card-step--active");

  button.closest(".card-step").classList.add("card-step--active");
});

//handle submitting forms

const constructorForm = document.querySelector(
  ".price-constructor__step[data-step-id='4']"
);
const giftForm = document.getElementById("gift-form");
const giftPristine = new Pristine(giftForm, globalPristineConfig);
const feedbackForm = document.getElementById("feedback-form");
const feedbackPristine = new Pristine(feedbackForm, globalPristineConfig);

const submitToast = {
  text: "Your message was sent successfully!",
  duration: 6000,
  close: true,
  gravity: "bottom",
  position: "center",
  stopOnFocus: true,
  offset: {
    y: 50,
  },
  className: "form-submit-toast",
};

function setPendingForm(form) {
  const submitButton = form.querySelector('[type="submit"]');
  const submitText = submitButton.textContent;
  submitButton.textContent = "Sending...";
  form.classList.add("form--pending");

  return submitText;
}

function unsetPendingForm(form, submitText = "Send") {
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.textContent = submitText;
  form.classList.remove("form--pending");
}

async function sendPost(form, data) {
  const submitText = setPendingForm(form);

  return fetch("action.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      unsetPendingForm(form, submitText);
      if (res.ok) {
        Toastify({
          ...submitToast,
          text: `Your ${
            data.formName == "feedback" ? "message" : "request"
          } was sent successfully!`,
        }).showToast();
      } else throw new Error("Something went wrong");
    })
    .catch((err) => {
      console.log(err);
      Toastify({
        ...submitToast,
        text: "Something went wrong!",
      }).showToast();
    });
}

function getCurrentDate() {
  const now = new Date();

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(now);
}

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const valid = feedbackPristine.validate();

  if (!valid) return;

  const userEmail = e.target["userEmail"];
  const userName = e.target["userName"];
  const userMessage = e.target["userMessage"];

  const formData = new FormData(feedbackForm);
  const formValues = Object.fromEntries(formData.entries());

  const res = await sendPost(feedbackForm, {
    ...formValues,
    date: getCurrentDate(),
  });

  userName.value = "";
  userEmail.value = "";
  userMessage.value = "";
});

giftForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const valid = giftPristine.validate();

  if (!valid) return;

  const userPhone = e.target["userPhone"];

  const formData = new FormData(giftForm);
  const formValues = Object.fromEntries(formData.entries());

  const res = await sendPost(giftForm, {
    ...formValues,
    date: getCurrentDate(),
  });

  userPhone.value = "";
});

constructorForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = e.target["userName"];
  const userEmail = e.target["userEmail"];
  const userPhone = e.target["userPhone"];

  const formData = new FormData(constructorForm);
  const formValues = Object.fromEntries(formData.entries());

  const res = await sendPost(constructorForm, {
    ...counstructorUserData,
    ...formValues,
    date: getCurrentDate(),
  });

  userName.value = "";
  userEmail.value = "";
  userPhone.value = "";
});
