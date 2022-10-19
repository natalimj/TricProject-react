import puppeteer from "puppeteer";
import AdminApi from "../api/AdminApi";
import { store } from "../app/store";

let browser;
let adminPage;
let userPage;

beforeAll(async () => {
    browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
    })
    adminPage = await browser.newPage();
    userPage = await browser.newPage();
    console.log("1");
    await userPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net");
    await adminPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net/admin");
    await adminPage.waitForSelector('[e2e-id="login"]');
    console.log("2");
    await adminPage.type('[e2e-id="usernameAdmin"]',"mod");
    console.log("3");
    await adminPage.type('[e2e-id="passwordAdmin"]',"12345678");
    console.log("4");
    const localStorage = await adminPage.evaluate(() =>  Object.assign({}, window.localStorage))
    await adminPage.click('[e2e-id="login"]');
    await AdminApi.deleteAllQuestions(store.getState().admin.accessToken);
    await AdminApi.deactivateApp(store.getState().admin.accessToken);
    await AdminApi.addQuestion("Which DJ is better?", "Boris Brejcha", "Ann Clue",store.getState().admin.accessToken);
    await AdminApi.addQuestion("Which genre is better?", "Techno", "Trance",store.getState().admin.accessToken);
    await AdminApi.addQuestion("Which festival is better?", "Electric Castle", "Untold",store.getState().admin.accessToken);
});

describe("Feature 1 - Questions database and display", () => {

});

describe("Feature 2 - Voting System", () => {

});

describe("Feature 3 - Voting Rounds", () => {

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
  });

  afterAll(() => browser.close());
});

describe("Feature 5 - Contribututors Page", () => {

});

describe("Feature 6 - Answer Prediction", () => {

});

describe("Feature 7 - Personal Voting Results", () => {

});

describe("Feature 8 - Downtime management and ending the play", () => {

});