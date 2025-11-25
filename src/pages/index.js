// Notes: As I was working on this project, I was merging the branches. I now know that this is not what I was supposed to do.
// I did reach out to a tutor to try to rectify this situation but it did not work.
// This issue has been setting me back, I am hoping to get this project reviewed and edited so that I can complete Sprint 9.
// I will be recording the video pitch after the first iteration since
// there will be edits/changes to be made. Thank you.

import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const newPostElement = newPostModal.querySelector(".modal__form");
const postSubmitBtn = newPostElement.querySelector(".modal__btn");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

let selectedCard, selectedCardId;

//Avatar
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const avatarImg = document.querySelector(".profile__avatar");
// add form
const avatarSaveBtn = editAvatarModal.querySelector(".modal__btn");
const avatarLinkInput = editAvatarModal.querySelector("#profile-avatar-input");
const avatarForm = editAvatarModal.querySelector(".modal__avatar-form");

//Delete
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm = deleteModal.querySelector(".modal__delete-form");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1d5bbdd5-18c5-49e5-b7ed-4ff2576b051e",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    avatarImg.src = user.avatar;
  })
  .catch(console.error);

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleLikeBtn(evt, data) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");

  api
    .handleLikeBtn(data._id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }
  cardLikeBtn.addEventListener("click", (evt) => handleLikeBtn(evt, data));

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  deleteModalCloseBtn.addEventListener("click", () => {
    closeModal(deleteModal);
  });

  cardImage.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  previewCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
  });

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Deleting...";
  submitBtn.disabled = true;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeEscapeKey);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;

  renderLoading(true, submitBtn, originalText, "Saving...");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn, originalText);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;

  console.log("Avatar URL being sent:", avatarLinkInput.value);

  renderLoading(true, submitBtn, originalText, "Saving...");

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(editAvatarModal);
      resetValidation(avatarLinkInput, avatarForm, enableValidation);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn, originalText);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };

  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;

  renderLoading(true, submitBtn, originalText, "Saving...");

  api
    .addCard(inputValues)
    .then((newCardData) => {
      const cardElement = getCardElement(newCardData);
      cardsList.prepend(cardElement);

      evt.target.reset();
      disableButton(postSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      renderLoading(false, submitBtn, originalText);
    });
}

newPostElement.addEventListener("submit", handleAddCardSubmit);

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

avatarModalBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});

avatarCloseBtn.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

function renderLoading(
  isLoading,
  button,
  originalText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = originalText;
    button.disabled = false;
  }
}

function closeEscapeKey(event) {
  if (event.key === "Escape") {
    const modalOpen = document.querySelector(".modal_is-opened");
    if (modalOpen) {
      closeModal(modalOpen);
    }
  }
}

enableValidation(settings);
