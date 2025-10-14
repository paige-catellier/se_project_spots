class Api {
  constructor(options) {}

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "1d5bbdd5-18c5-49e5-b7ed-4ff2576b051e",
      },
    }).then((res) => res.json());
  }
}

export default Api;
