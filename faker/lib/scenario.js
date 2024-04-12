// Function to handle the scenario and send the xAPI statement
const sendXapi = (name, description) => {
  const details = TinCan.Utils.parseURL(window.location.href);
  const newLRS = new TinCan.LRS(details.params);

  const statement = new TinCan.Statement({
    actor: JSON.parse(details.params.actor),
    verb: {
      id: "http://adlnet.gov/expapi/verbs/answered",
      display: { "en-US": "answered" },
    },
    object: {
      id: details.params.activity_id,
      definition: {
        name: { "en-US": name },
        description: { "en-US": description },
        type: "http://adlnet.gov/expapi/activities/interaction",
      },
      objectType: "Activity",
    },
    result: { response: description },
  });

  newLRS.saveStatement(statement, (err, xhr) => {
    if (err) {
      console.error(
        `Failed to save statement: ${err.message || xhr.responseText} (${
          xhr.status
        })`
      );
      // Handle the error appropriately (e.g., show an error message)
    } else {
      // Handle success
    }
  });
};

// Function to set up event listeners for buttons on scenario
const setScenarioButtons = () => {
  const scenarioBlock = document.querySelector(".scenario-block");
  if (scenarioBlock) {
    scenarioBlock.removeEventListener("click", scenarioButtonClickHandler);
    scenarioBlock.addEventListener("click", scenarioButtonClickHandler);
  }
};

// Button click event handler for scenario buttons
const scenarioButtonClickHandler = (event) => {
  const button = event.target.closest(
    '.scenario-block__response[role="button"]'
  );
  if (button) {
    const q =
      document.querySelector(".scenario-block__dialogue__bubble")?.innerText ||
      "";
    const a = button.querySelector("p, .fr-view")?.innerText || "";
    sendXapi(q, a);
  }
};

// Function to set up event listeners for button on fill-in
const setFillInButtons = () => {
  const quizCard = document.querySelector(".quiz-card");
  if (quizCard) {
    quizCard.removeEventListener("click", fillInButtonClickHandler);
    quizCard.addEventListener("click", fillInButtonClickHandler);
  }
};

// Button click event handler for fill-in buttons
const fillInButtonClickHandler = (event) => {
  const button = event.target.closest(".quiz-card__submit");
  if (button) {
    const q = document.querySelector(".quiz-card__title")?.innerText || "";
    const a = document.querySelector(".quiz-fill__input")?.value || "";
    sendXapi(q, a);
  }
};

// Observer to detect changes in the document and set up buttons when needed
const observer = new MutationObserver(() => {
  setFillInButtons();
  setScenarioButtons();
});

observer.observe(document, { childList: true, subtree: true });
