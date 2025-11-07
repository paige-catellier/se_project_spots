import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

//const initialCards = [
//{
// name: "Golden Gate Bridge",
//link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//},
//{
//name: "Val Thorens",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
// },
//{
// name: "Restaurant terrace",
//  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
// },
//{
// name: "An outdoor cafe",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
// },
//{
//name: "A very long bridge, over the forest and through the trees",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
// },
// {
// name: "Tunnel with morning light",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//},
// {
//name: "Mountain house",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//},
//];

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
const postSubmitBtn = newPostElement.querySelector(".modal__save-btn");
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
//const avatarEditBtn = document.querySelector(".profile__edit-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const avatarImg = document.querySelector(".profile__avatar");
// add form
const avatarSaveBtn = editAvatarModal.querySelector(".modal__save-btn");
const avatarLinkInput = editAvatarModal.querySelector("#profile-avatar-input");

//Delete
// style delete buttons
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm - deleteModal.querySelector(".modal__delete-form");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1d5bbdd5-18c5-49e5-b7ed-4ff2576b051e",
    "Content-Type": "application/json",
  },
});
// REQUESTS destructure the second item in the callback of the .then
api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    // REQUESTS handle users info: set src to avatar img,
    // set textcontent of both the text elements
  })
  .catch(console.error);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLikeBtn(evt) {
  cardLikeBtn.classList.toggle("card__like-btn_active");
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", handleLikeBtn);

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
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
    .catch(console.error);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(editAvatarModal);
      resetValidation(avatarLinkInput);
    })
    .catch(console.error);
}
//image isnt displaying when submitted

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };

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
avatarSaveBtn.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteCard)

function closeEscapeKey(event) {
  if (event.key === "Escape") {
    const modalOpen = document.querySelector(".modal_is-opened");
    if (modalOpen) {
      closeModal(modalOpen);
    }
  }
}

enableValidation(settings);
