import puppeteer from "puppeteer";
import AdminApi from "../api/AdminApi";
import { RootState, store } from "../app/store";
import { useAppDispatch, useAppSelector } from '../app/hooks';

const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb2QiLCJpYXQiOjE2NjYyNjg1MzAsImV4cCI6MTY2NjUyNzczMH0.STlfAJRgwxp8KujY0SDOCxoMPiHV9-LQ4YeS16_xjkTTpqUlP0aW6OsutRJxz4_5iXiF3O1A1yfeWHOohMTV9g"
let browser;
let adminPage;
let userPage;

beforeEach(async () => {
  resetApp();
});

afterEach(async () => {
  await AdminApi.deactivateApp(accessToken);
});

describe("Feature 1 - Questions database and display", () => {
  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Go to manage questions", async () => {
    await adminPage.waitForSelector('[e2e-id="editQuestions"]');
    await adminPage.click('[e2e-id="editQuestions"]');
    await adminPage.waitForSelector('[e2e-id="questionText"]');
  });

  it("Add question", async () => {
    await userPage.type('[e2e-id="questionText"]',"Where would you like to go?");
    await userPage.type('[e2e-id="questionAnswer1"]',"Berlin");
    await userPage.type('[e2e-id="questionAnswer2"]',"Ibiza");
    await adminPage.waitForSelector('[e2e-id="questionSave"]');
    await adminPage.click('[e2e-id="questionSave"]');
  });

  it("View Questions", async () => {
    await adminPage.waitForSelector('[e2e-id="questionAccordion"]');
    await adminPage.click('[e2e-id="questionAccordion"]');
    await adminPage.waitForSelector('[e2e-id="questionNr0"]');
  });

  it("Check Questions", async () => {
    await checkQuestion(0,"Which DJ is better?", "Boris Brejcha", "Ann Clue");
    await checkQuestion(1,"Which genre is better?", "Techno", "Trance");
    await checkQuestion(2,"Which festival is better?", "Electric Castle", "Untold");
    await checkQuestion(3,"Where would you like to go?", "Berlin", "Ibiza");
  });

  it("Edit Question", async () => {
    await userPage.type('[e2e-id="question0EditText"]',"What is your favorite stage?");
    await userPage.type('[e2e-id="question0EditAnswer1"]',"Main Stage");
    await userPage.type('[e2e-id="question0EditAnswer2"]',"Booha");
    await adminPage.waitForSelector('[e2e-id="question0EditSave"]');
    await adminPage.click('[e2e-id="question0EditSave"]');
    await checkQuestion(0,"What is your favorite stage?", "Main Stage", "Booha");
  });

  it("Delete Question", async () => {
    await adminPage.waitForSelector('[e2e-id="question0EditDelete"]');
    await adminPage.click('[e2e-id="question0EditDelete"]');
    await checkQuestion(0,"Which genre is better?", "Techno", "Trance");
  });

  it("Go back", async () => {
    await adminPage.waitForSelector('[e2e-id="back"]');
    await adminPage.click('[e2e-id="back"]');
    await adminPage.waitForSelector('[e2e-id="editQuestions"]');
  });
});

describe("Feature 2 - Voting System", () => {
  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Activate app", async () => {
    await adminPage.waitForSelector('[e2e-id="start"]')
    await adminPage.click('[e2e-id="start"]')
  });

  it("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  it("Create user", async () => {
    await userPage.waitForSelector('[e2e-id="usernameUser"]');
    await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
    await userPage.click('[e2e-id="create"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
  });

  it("Start the play", async () => {
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 1", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 1")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Ann Clue")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer1"]").innerText.includes("Ann Clue")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultUsername"]").innerText.includes("TrashPanda")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultBar0"]").innerText.includes("100%")',
    );
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 2", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 2")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which genre is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Techno")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Trance")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionText"]").innerText.includes("Which genre is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer0"]").innerText.includes("Techno")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer1"]").innerText.includes("Trance")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultUsername"]").innerText.includes("TrashPanda")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultBar0"]").innerText.includes("100%")',
    );
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view final results", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 3")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which festival is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Electric Castle")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Untold")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showFinalResult"]');
    await adminPage.click('[e2e-id="showFinalResult"]');
    await userPage.waitForSelector('[e2e-id="finalUsername"]');
    await userPage.waitForSelector('[e2e-id="download"]');
    await userPage.waitForSelector('[e2e-id="infoButton"]');
  });
});

describe("Feature 3 - Voting Rounds", () => {
  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Activate app", async () => {
    await adminPage.waitForSelector('[e2e-id="start"]')
    await adminPage.click('[e2e-id="start"]')
  });

  it("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  it("Create user", async () => {
    await userPage.waitForSelector('[e2e-id="usernameUser"]');
    await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
    await userPage.click('[e2e-id="create"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
  });

  it("Start the play", async () => {
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"5");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results after timer expires", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 1")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Ann Clue")',
    );
    delay(10000);
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer1"]").innerText.includes("Ann Clue")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultUsername"]").innerText.includes("TrashPanda")',
    );
  });
});

describe("Feature 4 - User Personalization", () => {

  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Activate app", async () => {
    await adminPage.waitForSelector('[e2e-id="start"]')
    await adminPage.click('[e2e-id="start"]')
  });

  it("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  it("Create user", async () => {
    await userPage.waitForSelector('[e2e-id="usernameUser"]');
    await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
    await userPage.click('[e2e-id="create"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
  });
});

describe("Feature 5 - Contribututors Page", () => {
  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Go to manage questions", async () => {
    await adminPage.waitForSelector('[e2e-id="editContributors"]');
    await adminPage.click('[e2e-id="editContributors"]');
  });
});

describe("Feature 6 - Answer Prediction", () => {

});

describe("Feature 7 - Personal Voting Results", () => {

});

describe("Feature 8 - Downtime management and ending the play", () => {
  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Activate app", async () => {
    await adminPage.waitForSelector('[e2e-id="start"]')
    await adminPage.click('[e2e-id="start"]')
  });

  it("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  it("Create user", async () => {
    await userPage.waitForSelector('[e2e-id="usernameUser"]');
    await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
    await userPage.click('[e2e-id="create"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
  });

  it("Start the play", async () => {
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 1", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 1")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Ann Clue")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionText"]").innerText.includes("Which DJ is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer0"]").innerText.includes("Boris Brejcha")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer1"]").innerText.includes("Ann Clue")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultUsername"]").innerText.includes("TrashPanda")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultBar0"]").innerText.includes("100%")',
    );
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 2", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 2")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which genre is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Techno")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Trance")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionText"]").innerText.includes("Which genre is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer0"]").innerText.includes("Techno")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultQuestionAnswer1"]").innerText.includes("Trance")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultUsername"]").innerText.includes("TrashPanda")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="resultBar0"]").innerText.includes("100%")',
    );
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view final results", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionHeader"]").innerText.includes("Question 3")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionText"]").innerText.includes("Which festival is better?")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer0"]").innerText.includes("Electric Castle")',
    );
    await userPage.waitForFunction(
      'document.querySelector("[e2e-id="questionAnswer1"]").innerText.includes("Untold")',
    );
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showFinalResult"]');
    await adminPage.click('[e2e-id="showFinalResult"]');
    await userPage.waitForSelector('[e2e-id="finalUsername"]');
    await userPage.waitForSelector('[e2e-id="download"]');
    await userPage.waitForSelector('[e2e-id="infoButton"]');
  });
  it("End Session", async () => {
    await adminPage.waitForSelector('[e2e-id="endSession"]');
    await adminPage.click('[e2e-id="endSession"]');
    await adminPage.waitForSelector('[e2e-id="usernameAdmin"]');
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });
});

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

afterAll(async () => {
  browser.close();
});

async function resetApp() {
  browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox']
  })
  adminPage = await browser.newPage();
  userPage = await browser.newPage();
  await userPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net");
  await adminPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net/admin");
  await adminPage.waitForSelector('[e2e-id="login"]');
  await adminPage.type('[e2e-id="usernameAdmin"]',"mod");
  await adminPage.type('[e2e-id="passwordAdmin"]',"12345678");
  await adminPage.click('[e2e-id="login"]');
  await AdminApi.deleteAllQuestions(accessToken);
  await AdminApi.deactivateApp(accessToken);
  await AdminApi.addQuestion("Which DJ is better?", "Boris Brejcha", "Ann Clue",accessToken);
  await AdminApi.addQuestion("Which genre is better?", "Techno", "Trance",accessToken);
  await AdminApi.addQuestion("Which festival is better?", "Electric Castle", "Untold",accessToken);
}

async function checkQuestion(questionNr : number, text : string, answer1 : string, answer2 : string) {
  let selector = '[e2e-id="question' + questionNr + 'EditText"]';
  let selectorAns1 = '[e2e-id="question' + questionNr + 'EditAnswer1"]';
  let selectorAns2 = '[e2e-id="question' + questionNr + 'EditAnswer2"]';
  await adminPage.waitForSelector(selector);
  let element = await adminPage.$(selector);
  let value = await adminPage.evaluate(el => el.value, element);
  await expect(value).toBe(text);
  element = await adminPage.$(selectorAns1);
  value = await adminPage.evaluate(el => el.value, element);
  await expect(value).toBe(answer1);
  element = await adminPage.$(selectorAns2);
  value = await adminPage.evaluate(el => el.value, element);
  await expect(value).toBe(answer2);
}
