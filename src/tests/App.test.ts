import puppeteer from "puppeteer";
import AdminApi from "../api/AdminApi";
import { RootState, store } from "../app/store";
import { useAppDispatch, useAppSelector } from '../app/hooks';

const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb2QiLCJpYXQiOjE2NjY2ODQ4MzcsImV4cCI6MTY2Njk0NDAzN30._Lmt51H1VnuBFt_OvidJV5brZb-0vrXR7XvwV2lBqHAusEpIVajeb-BdbEHHB5gWmsUoFf3bRyvhFAdZqpCjZg";
let browser;
let adminPage;
let userPage;

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

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

async function checkText(e2eID : string, value : string) {
  let element = await userPage.$('[e2e-id="'+e2eID+'"]')
  let text = await (await element.getProperty('textContent')).jsonValue()
  await expect(text).toBe(value);
}

describe("Feature 1 - Questions database and display", () => {
  beforeAll(async () => {
    await resetApp();
  });

  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Go to manage questions", async () => {
    await adminPage.waitForSelector('[e2e-id="editQuestions"]');
    await adminPage.click('[e2e-id="editQuestions"]');
    await adminPage.waitForSelector('[e2e-id="questionText"]');
  });

  it("Add question", async () => {
    await adminPage.type('[e2e-id="questionText"]',"Where would you like to go?");
    await adminPage.type('[e2e-id="questionAnswer1"]',"Berlin");
    await adminPage.type('[e2e-id="questionAnswer2"]',"Ibiza");
    await adminPage.waitForSelector('[e2e-id="questionSave"]');
    await adminPage.click('[e2e-id="questionSave"]');
  });

  it("View Questions", async () => {
    await adminPage.waitForSelector('[e2e-id="questionAccordion"]');
    await adminPage.click('[e2e-id="questionAccordion"]');
    await adminPage.waitForSelector('[e2e-id="questionNr1"]');
  });

  it("Check Questions", async () => {
    await checkQuestion(1,"Which DJ is better?", "Boris Brejcha", "Ann Clue");
    await checkQuestion(2,"Which genre is better?", "Techno", "Trance");
    await checkQuestion(3,"Which festival is better?", "Electric Castle", "Untold");
    await checkQuestion(4,"Where would you like to go?", "Berlin", "Ibiza");
  });

  it("Edit Question", async () => {
    await adminPage.click('[e2e-id="question1EditText"]', {clickCount: 3})
    await adminPage.type('[e2e-id="question1EditText"]',"What is your favorite stage?");
    await adminPage.click('[e2e-id="question1EditAnswer1"]', {clickCount: 3})
    await adminPage.type('[e2e-id="question1EditAnswer1"]',"Main Stage");
    await adminPage.click('[e2e-id="question1EditAnswer2"]', {clickCount: 3})
    await adminPage.type('[e2e-id="question1EditAnswer2"]',"Booha");
    await adminPage.waitForSelector('[e2e-id="question1EditSave"]');
    await adminPage.click('[e2e-id="question1EditSave"]');
    await delay(1000);
    await checkQuestion(1,"What is your favorite stage?", "Main Stage", "Booha");
  });

  it("Delete Question", async () => {
    await adminPage.waitForSelector('[e2e-id="question1EditDelete"]');
    await adminPage.click('[e2e-id="question1EditDelete"]');
    await delay(1000);
    await checkQuestion(1,"Which genre is better?", "Techno", "Trance");
  });

  it("Go back", async () => {
    await adminPage.waitForSelector('[e2e-id="back"]');
    await adminPage.click('[e2e-id="back"]');
    await adminPage.waitForSelector('[e2e-id="editQuestions"]');
  });

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

describe("Feature 2 - Voting System", () => {
  beforeAll(async () => {
    await resetApp();
  });
  
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
    await adminPage.click('[e2e-id="timerField"]', {clickCount: 3})
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 1", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await checkText("questionHeader","Question 1");
    await checkText("questionText","Which DJ is better?");
    await checkText("questionAnswer0","Boris Brejcha");
    await checkText("questionAnswer1","Ann Clue");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(1000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await delay(2000);
    await checkText("resultQuestionText","Which DJ is better?");
    await checkText("resultQuestionAnswer0","Boris Brejcha");
    await checkText("resultQuestionAnswer1","Ann Clue");
    await checkText("resultUsername","TrashPanda");
    await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.click('[e2e-id="timerField"]', {clickCount: 3})
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 2", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await checkText("questionHeader","Question 2");
    await checkText("questionText","Which genre is better?");
    await checkText("questionAnswer0","Techno");
    await checkText("questionAnswer1","Trance");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(1000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await checkText("resultQuestionText","Which genre is better?");
    await checkText("resultQuestionAnswer0","Techno");
    await checkText("resultQuestionAnswer1","Trance");
    await checkText("resultUsername","TrashPanda");
    await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view final results", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await checkText("questionHeader","Question 3");
    await checkText("questionText","Which festival is better?");
    await checkText("questionAnswer0","Electric Castle");
    await checkText("questionAnswer1","Untold");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showFinalResult"]');
    await adminPage.click('[e2e-id="showFinalResult"]');
    await userPage.waitForSelector('[e2e-id="finalUsername"]');
    await userPage.waitForSelector('[e2e-id="download"]');
    await userPage.waitForSelector('[e2e-id="infoButton"]');
  });

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

describe("Feature 3 - Voting Rounds", () => {
  beforeAll(async () => {
    await resetApp();
  });

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
    await checkText("questionHeader","Question 1");
    await checkText("questionText","Which DJ is better?");
    await checkText("questionAnswer0","Boris Brejcha");
    await checkText("questionAnswer1","Ann Clue");
    delay(1000);
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await checkText("resultQuestionText","Which DJ is better?");
    await checkText("resultQuestionAnswer0","Boris Brejcha");
    await checkText("resultQuestionAnswer1","Ann Clue");
    await checkText("resultUsername","TrashPanda");
  });

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

describe("Feature 4 - User Personalization", () => {
  beforeAll(async () => {
    await resetApp();
  });

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

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

describe("Feature 5 - Contribututors Page", () => {
  beforeAll(async () => {
    await resetApp();
  });

  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  it("Go to manage questions", async () => {
    await adminPage.waitForSelector('[e2e-id="editContributors"]');
    await adminPage.click('[e2e-id="editContributors"]');
  });
  
  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

// describe("Feature 6 - Answer Prediction", () => {

// });

// describe("Feature 7 - Personal Voting Results", () => {

// });

describe("Feature 8 - Downtime management and ending the play", () => {
  beforeAll(async () => {
    await resetApp();
  });

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
    await checkText("questionHeader","Question 1");
    await checkText("questionText","Which DJ is better?");
    await checkText("questionAnswer0","Boris Brejcha");
    await checkText("questionAnswer1","Ann Clue");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(1000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await checkText("resultQuestionText","Which DJ is better?");
    await checkText("resultQuestionAnswer0","Boris Brejcha");
    await checkText("resultQuestionAnswer1","Ann Clue");
    await checkText("resultUsername","TrashPanda");
    await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.click('[e2e-id="timerField"]', {clickCount: 3})
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view results 2", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await checkText("questionHeader","Question 2");
    await checkText("questionText","Which genre is better?");
    await checkText("questionAnswer0","Techno");
    await checkText("questionAnswer1","Trance");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(1000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await checkText("resultQuestionText","Which genre is better?");
    await checkText("resultQuestionAnswer0","Techno");
    await checkText("resultQuestionAnswer1","Trance");
    await checkText("resultUsername","TrashPanda");
    await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  it("Vote and view final results", async () => {
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await checkText("questionHeader","Question 3");
    await checkText("questionText","Which festival is better?");
    await checkText("questionAnswer0","Electric Castle");
    await checkText("questionAnswer1","Untold");
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

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

