//grabs the question and answer from a scenario made in Rise 360
const getScenario = (name, description) => {
  const details = TinCan.Utils.parseURL(window.location.href);

  //I'm using the URL to grab parameters. Alternatively, you can hardcode them as seen below
  const newLRS = new TinCan.LRS(details.params);

  // var newLRS;
  // try {
  //   newLRS = new TinCan.LRS({
  //     endpoint: "https://cloud.scorm.com/tc/public/",
  //     username: "<Test User>",
  //     password: "<Test Password>",
  //     allowFail: false,
  //   });
  // } catch (ex) {
  //   console.log("Failed to setup LRS object: ", ex);
  // }

  const statement = new TinCan.Statement({
    //again, I'm using the URL to get actor info. Alternatively, you can hardcode them as seen below
    actor: JSON.parse(details.params.actor),

    // actor: {
    //     mbox: "mailto:example@example.com"
    // },

    verb: {
      id: "http://adlnet.gov/expapi/verbs/responded",
      display: { "en-US": "responded" },
    },

    //hardcoding as an interaction
    object: {
      id: details.path,
      definition: {
        name: { "en-US": name },
        description: { "en-US": description },
        type: "http://adlnet.gov/expapi/activities/interaction",
      },
      objectType: "Activity",
    },
  });

  //send the xAPI statement to your LRS
  newLRS.saveStatement(statement, {
    callback: (err, xhr) => {
      if (err) {
        console.log(
          `Failed to save statement: ${err || xhr.responseText} (${xhr.status})`
        );
        return;
      }
      console.log("Statement saved");
    },
  });
};

//monitors the page to see if a question was answered
const questionAnswered = (e) => {
  if (!e.target.closest(".scenario-block__response__inner")) return;

  const buttons = document.querySelectorAll(".scenario-block__response");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const a = button.querySelector(".fr-view").innerText;
      const q = document.querySelector(
        ".scenario-block__dialogue__bubble"
      ).innerText;
      getScenario(q, a);
    });
  });
};
const handleKeyUp = (e) => {
  if (e.key === "Enter") questionAnswered(e);
};

//sets up the handler only for pages that have scenarios
const checkUrlFragment = () => {
  const urlFragments = [
    "hzlboncsNa6jl51uG97Ud7_0ky9TYwhK",
    "example2.com",
    "example3.com",
  ];
  if (urlFragments.some((url) => window.location.href.includes(url))) {
    addEventListeners();
  }
};
const addEventListeners = () => {
  window.addEventListener("mouseup", questionAnswered);
  window.addEventListener("keyup", handleKeyUp);
};
//checks if it should add event handlers to any new page
window.onpopstate = checkUrlFragment;
