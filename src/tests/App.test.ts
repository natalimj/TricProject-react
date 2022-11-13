import puppeteer from "puppeteer";
import AdminApi from "../api/AdminApi";
import IQuestionData from "../models/Question";
import IAnswerData from "../models/Answer";

const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb2QiLCJpYXQiOjE2NjgyNTMwODksImV4cCI6MTY2ODUxMjI4OX0.D_D5r6cQ_36xdhaekZ1eqx8uk-KmDRVuxG0j8kbd3WpjRQABlOVqO2Um_b4_PMu8Zk0LJXjlKZxPgHAu7VcdFQ";
let browser;
let adminPage;
let userPage;

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

async function resetApp() {
  await AdminApi.deactivateApp(accessToken);
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

  const answer1: IAnswerData = {
    answerId: null,
    answerText: "Yes",
    firstCategory : "Pragmatic",
    secondCategory : "Conservative"
  }
  const answer2: IAnswerData = {
    answerId: null,
    answerText: "No",
    firstCategory : "Idealist",
    secondCategory : "Progressive"
  }
  const question1: IQuestionData = {
    questionNumber: 1,
    questionText: 'Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?',
    answers: [answer1,answer2],
    time: 10,
    theme: "Immigration"
  }
  const question2: IQuestionData = {
    questionNumber: 2,
    questionText: 'You work one hour by car far from home. If you travel by train you pollute less, but it takes two hours. Would you still travel by train?',
    answers: [answer1,answer2],
    time: 10,
    theme: "Climate Change"
  }
  const question3: IQuestionData = {
    questionNumber: 3,
    questionText: 'In order to be healthy your doctor prescribed a fish-based diet. Your fish is mass-bred andsavagely slaughtered while it`s still alive. Would you stop eating fish risking your own health?',
    answers: [answer1,answer2],
    time: 10,
    theme: "Mass Breeding"
  }
  const question4: IQuestionData = {
    questionNumber: 4,
    questionText: 'In your country a retirement home with 20 old people needs a high amount of heating in order to keep them healthy. It`s proven that high heating consumption rises the CO2 level, which can end in floods that put at risk the life of an entire village in the other part of the world. Would you close the heating?',
    answers: [answer1,answer2],
    time: 10,
    theme: "Energy Consumption"
  }
  const question5: IQuestionData = {
    questionNumber: 5,
    questionText: 'You are in a hole with another person, and both of you are too weak to come out. There is just a piece of bread. If you both eat the bread you will endure a bit longer, but you both are eventually going to die. If you only eat the bread, you will save yourself, but the other person will die. Would you eat the whole piece of bread?',
    answers: [answer1,answer2],
    time: 10,
    theme: "Global Population"
  }
  await AdminApi.addQuestion(question1,accessToken);
  await AdminApi.addQuestion(question2,accessToken);
  await AdminApi.addQuestion(question3,accessToken);
  await AdminApi.addQuestion(question4,accessToken);
  await AdminApi.addQuestion(question5,accessToken);
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

  test("Go to manage questions", async () => {
    await adminPage.waitForSelector('[e2e-id="editQuestions"]');
    await adminPage.click('[e2e-id="editQuestions"]');
    await adminPage.waitForSelector('[e2e-id="questionText"]');
  });

  test("Add question", async () => {
    await adminPage.type('[e2e-id="questionText"]',"Where would you like to go?");
    await adminPage.type('[e2e-id="questionAnswer1"]',"Berlin");
    await adminPage.type('[e2e-id="questionAnswer2"]',"Ibiza");
    await adminPage.waitForSelector('[e2e-id="questionSave"]');
    await adminPage.click('[e2e-id="questionSave"]');
  });

  test("View Questions", async () => {
    await adminPage.waitForSelector('[e2e-id="questionAccordion"]');
    await adminPage.click('[e2e-id="questionAccordion"]');
    await adminPage.waitForSelector('[e2e-id="questionNr1"]');
  });

  test("Check Questions", async () => {
     await checkQuestion(1,"Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?", "Yes", "No");
     await checkQuestion(2,"You work one hour by car far from home. If you travel by train you pollute less, but it takes two hours. Would you still travel by train?", "Yes", "No");
     await checkQuestion(3,"In order to be healthy your doctor prescribed a fish-based diet. Your fish is mass-bred andsavagely slaughtered while it`s still alive. Would you stop eating fish risking your own health?", "Yes", "No");
     await checkQuestion(4,"In your country a retirement home with 20 old people needs a high amount of heating in order to keep them healthy. It`s proven that high heating consumption rises the CO2 level, which can end in floods that put at risk the life of an entire village in the other part of the world. Would you close the heating?", "Yes", "No");
     await checkQuestion(5,"You are in a hole with another person, and both of you are too weak to come out. There is just a piece of bread. If you both eat the bread you will endure a bit longer, but you both are eventually going to die. If you only eat the bread, you will save yourself, but the other person will die. Would you eat the whole piece of bread?", "Yes", "No");
  });

  test("Edit Question", async () => {
    await adminPage.screenshot({
      path: 'screenshots/feature1/beforeeditquestion.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="question1EditText"]');
    await adminPage.click('[e2e-id="question1EditText"]', {clickCount: 3});
    await adminPage.type('[e2e-id="question1EditText"]',"What is your favorite stage?");
    await adminPage.click('[e2e-id="question1EditAnswer1"]', {clickCount: 3});
    await adminPage.type('[e2e-id="question1EditAnswer1"]',"Main Stage");
    await adminPage.click('[e2e-id="question1EditAnswer2"]', {clickCount: 3});
    await adminPage.type('[e2e-id="question1EditAnswer2"]',"Booha");
    await delay(2000);
    await adminPage.screenshot({
      path: 'screenshots/feature1/aftereditquestion.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="question1EditSave"]');
    await adminPage.click('[e2e-id="question1EditSave"]');
    await adminPage.screenshot({
      path: 'screenshots/feature1/clickedsave.jpg'
    });
    await delay(2000);
    await adminPage.screenshot({
      path: 'screenshots/feature1/beforecheckedit.jpg'
    });
    await checkQuestion(1,"What is your favorite stage?", "Main Stage", "Booha");
    await adminPage.screenshot({
      path: 'screenshots/feature1/aftercheckedit.jpg'
    });
  });

  test("Delete Question", async () => {
    await adminPage.screenshot({
      path: 'screenshots/feature1/beforedeletequestion.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="question1EditDelete"]');
    await adminPage.click('[e2e-id="question1EditDelete"]');
    await adminPage.screenshot({
      path: 'screenshots/feature1/afterdeletequestion.jpg'
    });
    await adminPage.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await adminPage.waitForSelector('[e2e-id="questionAccordion"]');
    await adminPage.click('[e2e-id="questionAccordion"]');
    await adminPage.screenshot({
      path: 'screenshots/feature1/afterreload.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="question1EditDelete"]');
    await checkQuestion(1,"You work one hour by car far from home. If you travel by train you pollute less, but it takes two hours. Would you still travel by train?", "Yes", "No");
  });

  test("Go back", async () => {
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

  test("Activate app", async () => {
    await adminPage.screenshot({
      path: 'screenshots/feature2/activateappbefore.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="start"]')
    await adminPage.click('[e2e-id="start"]')
  });

  test("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="agree"]');
    await userPage.click('[e2e-id="agree"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  test("Create user", async () => {
    await userPage.screenshot({
      path: 'screenshots/feature2/beforecreateuser.jpg'
    });
    await userPage.waitForSelector('[e2e-id="usernameUser"]');
    await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
    await userPage.screenshot({
      path: 'screenshots/feature2/afterinputuserdata.jpg'
    });
    await userPage.click('[e2e-id="create"]');
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/spinneraftercreateuser.jpg'
    });
  });

  test("Start the play", async () => {
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.screenshot({
      path: 'screenshots/feature2/isshowquestionloaded.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
    await adminPage.screenshot({
      path: 'screenshots/feature2/hasthequestionbeenclicked.jpg'
    });

  });

/*   test("Vote and view results 1", async () => {
    await userPage.screenshot({
      path: 'screenshots/feature2/waitingtoloadvoting1.jpg'
    });
    await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/sawquestion.jpg'
    });
    await checkText("questionHeader","Question 1");
    await checkText("questionText","Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?");
    await checkText("questionAnswer0","Yes");
    await checkText("questionAnswer1","No");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(2000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await delay(2000);
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await delay(2000);
    await checkText("resultQuestionText","Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?");
    await checkText("resultQuestionAnswer0","Yes");
    await checkText("resultQuestionAnswer1","No");
    await checkText("resultUsername","TrashPanda");
    await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  }); */

/*   test("Vote and view results 2", async () => {
    await userPage.screenshot({
      path: 'screenshots/feature2/waitingtoloadvoting2.jpg'
    });
    ////await userPage.waitForSelector('[e2e-id="questionText"]');
    // await checkText("questionHeader","Question 2");
    // await checkText("questionText","Which genre is better?");
    // await checkText("questionAnswer0","Techno");
    // await checkText("questionAnswer1","Trance");
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(2000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await delay(1000);
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await adminPage.waitForSelector('[e2e-id="showResults"]');
    await adminPage.click('[e2e-id="showResults"]');
    await delay(2000);
    await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
    await delay(2000);
    // await checkText("resultQuestionText","Which genre is better?");
    // await checkText("resultQuestionAnswer0","Techno");
    // await checkText("resultQuestionAnswer1","Trance");
    // await checkText("resultUsername","TrashPanda");
    // await checkText("resultBar0","100%");
    await adminPage.waitForSelector('[e2e-id="timerField"]');
    await adminPage.type('[e2e-id="timerField"]',"100");
    await adminPage.waitForSelector('[e2e-id="showQuestion"]');
    await adminPage.click('[e2e-id="showQuestion"]');
  });

  test("Vote and view final results", async () => {
    ////await userPage.waitForSelector('[e2e-id="questionText"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/finalvotebefore.jpg'
    });
    // await checkText("questionHeader","Question 3");
    // await checkText("questionText","Which festival is better?");
    // await checkText("questionAnswer0","Electric Castle");
    // await checkText("questionAnswer1","Untold");
    await userPage.screenshot({
      path: 'screenshots/feature2/finalvoteaftercheck.jpg'
    });
    await userPage.click('[e2e-id="questionAnswer0"]');
    await delay(2000);
    await userPage.click('[e2e-id="questionConfirm"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/afterclicking.jpg'
    });
    await userPage.waitForSelector('[e2e-id="spinner"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/spinnermaybe.jpg'
    });
    await adminPage.waitForSelector('[e2e-id="showFinalResult"]');
    await adminPage.screenshot({
      path: 'screenshots/feature2/adminshowresult.jpg'
    });
    await adminPage.click('[e2e-id="showFinalResult"]');
    await delay(2000);
    await adminPage.screenshot({
      path: 'screenshots/feature2/showfinalresult.jpg'
    });
    await userPage.screenshot({
      path: 'screenshots/feature2/userfinalpage.jpg'
    });
    await userPage.waitForSelector('[e2e-id="finalUsername"]');
    await userPage.waitForSelector('[e2e-id="download"]');
    await userPage.waitForSelector('[e2e-id="infoButton"]');
    await userPage.screenshot({
      path: 'screenshots/feature2/userfinalpageaftercheck.jpg'
    });
  }); */

  afterAll(async () => {
    await AdminApi.deactivateApp(accessToken);
    await browser.close();
  });
});

// describe("Feature 3 - Voting Rounds", () => {
//   beforeAll(async () => {
//     await resetApp();
//   });

//   test("App is inactive", async () => {
//     await userPage.waitForSelector('[e2e-id="inactive"]');
//   });

//   test("Activate app", async () => {
//     await adminPage.waitForSelector('[e2e-id="start"]')
//     await adminPage.click('[e2e-id="start"]')
//   });

//   test("Join the app", async () => {
//     await userPage.waitForSelector('[e2e-id="join"]');
//     await userPage.click('[e2e-id="join"]');
//     await userPage.waitForSelector('[e2e-id="agree"]');
//     await userPage.click('[e2e-id="agree"]');
//     await userPage.waitForSelector('[e2e-id="create"]');
//   });

//   test("Create user", async () => {
//     await userPage.screenshot({
//       path: 'screenshots/feature3/beforecreateuser.jpg'
//     });
//     await userPage.waitForSelector('[e2e-id="usernameUser"]');
//     await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
//     await userPage.screenshot({
//       path: 'screenshots/feature3/afterinputuserdata.jpg'
//     });
//     await userPage.click('[e2e-id="create"]');
//     await userPage.waitForSelector('[e2e-id="spinner"]');
//     await userPage.screenshot({
//       path: 'screenshots/feature3/spinneraftercreateuser.jpg'
//     });
//   });

//   test("Start the play", async () => {
//     await adminPage.waitForSelector('[e2e-id="timerField"]');
//     await adminPage.waitForSelector('[e2e-id="showQuestion"]');
//     await adminPage.click('[e2e-id="showQuestion"]');
//     await adminPage.setViewport({ width: 1920, height: 1080 });
//     await adminPage.screenshot({
//       path: 'screenshots/feature3/adminSentQuestion.jpg'
//     });
//     await adminPage.waitForSelector('[e2e-id="showResults"]');
//     await adminPage.screenshot({
//       path: 'screenshots/feature3/adminWaiting.jpg'
//     });
//   });

//   test("Vote and view results after timer expires", async () => {
//     await userPage.waitForSelector('[e2e-id="questionText"]');
//     await checkText("questionHeader","Question 1");
//     await checkText("questionText","Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?");
//     await checkText("questionAnswer0","Yes");
//     await checkText("questionAnswer1","No");
//     await userPage.screenshot({
//       path: 'screenshots/feature3/userQuestion.jpg'
//     });
//     delay(5000);
//     await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
//     await checkText("resultQuestionText","Would you welcome permanently people in mortal danger in your own home, sharing therefore with them your own food, water and salary?");
//     await checkText("resultQuestionAnswer0","Yes");
//     await checkText("resultQuestionAnswer1","No");
//     await checkText("resultUsername","TrashPanda");
//   });

//   afterAll(async () => {
//     await AdminApi.deactivateApp(accessToken);
//     await browser.close();
//   });
// });

// describe("Feature 4 - User Personalization", () => {
//   beforeAll(async () => {
//     await resetApp();
//   });

//   test("App is inactive", async () => {
//     await userPage.waitForSelector('[e2e-id="inactive"]');
//   });

//   test("Activate app", async () => {
//     await adminPage.waitForSelector('[e2e-id="start"]')
//     await adminPage.click('[e2e-id="start"]')
//   });

//   test("Join the app", async () => {
//     await userPage.waitForSelector('[e2e-id="join"]');
//     await userPage.click('[e2e-id="join"]');
//     await userPage.waitForSelector('[e2e-id="agree"]');
//     await userPage.click('[e2e-id="agree"]');
//     await userPage.waitForSelector('[e2e-id="create"]');
//   });

//   test("Create user", async () => {
//     await userPage.screenshot({
//       path: 'screenshots/feature4/beforecreateuser.jpg'
//     });
//     await userPage.waitForSelector('[e2e-id="usernameUser"]');
//     await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
//     await userPage.screenshot({
//       path: 'screenshots/feature4/afterinputuserdata.jpg'
//     });
//     await userPage.click('[e2e-id="create"]');
//     await userPage.waitForSelector('[e2e-id="spinner"]');
//     await userPage.screenshot({
//       path: 'screenshots/feature4/spinneraftercreateuser.jpg'
//     });
//   });

//   afterAll(async () => {
//     await AdminApi.deactivateApp(accessToken);
//     await browser.close();
//   });
// });

describe("Feature 5 - Contribututors Page", () => {
  beforeAll(async () => {
    await resetApp();
  });

  test("App is inactive", async () => {
    await userPage.waitForSelector('[e2e-id="inactive"]');
  });

  test("Go to manage questions", async () => {
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

// describe("Feature 8 - Downtime management and ending the play", () => {
//   beforeAll(async () => {
//     await resetApp();
//   });

//   test("App is inactive", async () => {
//     await userPage.waitForSelector('[e2e-id="inactive"]');
//   });

//   test("Activate app", async () => {
//     await adminPage.screenshot({
//       path: 'screenshots/feature8/activateappbefore.jpg'
//     });
//     await adminPage.waitForSelector('[e2e-id="start"]')
//     await adminPage.click('[e2e-id="start"]')
//   });

//   test("Join the app", async () => {
//     await userPage.waitForSelector('[e2e-id="join"]');
//     await userPage.click('[e2e-id="join"]');
//     await userPage.waitForSelector('[e2e-id="agree"]');
//     await userPage.click('[e2e-id="agree"]');
//     await userPage.waitForSelector('[e2e-id="create"]');
//   });

//   test("Create user", async () => {
//     await userPage.waitForSelector('[e2e-id="usernameUser"]');
//     await userPage.type('[e2e-id="usernameUser"]',"TrashPanda");
//     await userPage.click('[e2e-id="create"]');
//     await userPage.waitForSelector('[e2e-id="spinner"]');
//   });

//   test("Start the play", async () => {
//     await adminPage.waitForSelector('[e2e-id="timerField"]');
//     await adminPage.type('[e2e-id="timerField"]',"100");
//     await adminPage.waitForSelector('[e2e-id="showQuestion"]');
//     await adminPage.click('[e2e-id="showQuestion"]');
//   });

  // test("Vote and view results 1", async () => {
  //   ////await userPage.waitForSelector('[e2e-id="questionText"]');
  //   // await checkText("questionHeader","Question 1");
  //   // await checkText("questionText","Which DJ is better?");
  //   // await checkText("questionAnswer0","Boris Brejcha");
  //   // await checkText("questionAnswer1","Ann Clue");
  //   await userPage.click('[e2e-id="questionAnswer0"]');
  //   await delay(2000);
  //   await userPage.click('[e2e-id="questionConfirm"]');
  //   await delay(1000);
  //   ////await userPage.waitForSelector('[e2e-id="spinner"]');
  //   ////await adminPage.waitForSelector('[e2e-id="showResults"]');
  //   await adminPage.click('[e2e-id="showResults"]');
  //   await delay(2000);
  //   ////await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
  //   await delay(2000);
  //   // await checkText("resultQuestionText","Which DJ is better?");
  //   // await checkText("resultQuestionAnswer0","Boris Brejcha");
  //   // await checkText("resultQuestionAnswer1","Ann Clue");
  //   // await checkText("resultUsername","TrashPanda");
  //   // await checkText("resultBar0","100%");
  //   ////await adminPage.waitForSelector('[e2e-id="timerField"]');
  //   await adminPage.click('[e2e-id="timerField"]', {clickCount: 3})
  //   await adminPage.type('[e2e-id="timerField"]',"100");
  //   ////await adminPage.waitForSelector('[e2e-id="showQuestion"]');
  //   await adminPage.click('[e2e-id="showQuestion"]');
  // });

  // test("Vote and view results 2", async () => {
  //   ////await userPage.waitForSelector('[e2e-id="questionText"]');
  //   // await checkText("questionHeader","Question 2");
  //   // await checkText("questionText","Which genre is better?");
  //   // await checkText("questionAnswer0","Techno");
  //   // await checkText("questionAnswer1","Trance");
  //   await userPage.click('[e2e-id="questionAnswer0"]');
  //   await delay(2000);
  //   await userPage.click('[e2e-id="questionConfirm"]');
  //   await delay(1000);
  //   ////await userPage.waitForSelector('[e2e-id="spinner"]');
  //   ////await adminPage.waitForSelector('[e2e-id="showResults"]');
  //   await adminPage.click('[e2e-id="showResults"]');
  //   await delay(2000);
  //   ////await userPage.waitForSelector('[e2e-id="resultQuestionText"]');
  //   await delay(2000);
  //   // await checkText("resultQuestionText","Which genre is better?");
  //   // await checkText("resultQuestionAnswer0","Techno");
  //   // await checkText("resultQuestionAnswer1","Trance");
  //   // await checkText("resultUsername","TrashPanda");
  //   // await checkText("resultBar0","100%");
  //   ////await adminPage.waitForSelector('[e2e-id="timerField"]');
  //   await adminPage.type('[e2e-id="timerField"]',"100");
  //   ////await adminPage.waitForSelector('[e2e-id="showQuestion"]');
  //   await adminPage.click('[e2e-id="showQuestion"]');
  // });

  // test("Vote and view final results", async () => {
  //   ////await userPage.waitForSelector('[e2e-id="questionText"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/finalvotebefore.jpg'
  //   });
  //   // await checkText("questionHeader","Question 3");
  //   // await checkText("questionText","Which festival is better?");
  //   // await checkText("questionAnswer0","Electric Castle");
  //   // await checkText("questionAnswer1","Untold");
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/finalvoteaftercheck.jpg'
  //   });
  //   await userPage.click('[e2e-id="questionAnswer0"]');
  //   await delay(2000);
  //   await userPage.click('[e2e-id="questionConfirm"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/afterclicking.jpg'
  //   });
  //   ////await userPage.waitForSelector('[e2e-id="spinner"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/spinnermaybe.jpg'
  //   });
  //   ////await adminPage.waitForSelector('[e2e-id="showFinalResult"]');
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/adminshowresult.jpg'
  //   });
  //   await adminPage.click('[e2e-id="showFinalResult"]');
  //   await delay(2000);
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/showfinalresult.jpg'
  //   });
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/userfinalpage.jpg'
  //   });
  //   ////await userPage.waitForSelector('[e2e-id="finalUsername"]');
  //   ////await userPage.waitForSelector('[e2e-id="download"]');
  //   ////await userPage.waitForSelector('[e2e-id="infoButton"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/userfinalpageaftercheck.jpg'
  //   });
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/beforeending.jpg'
  //   });
  //   ////await adminPage.waitForSelector('[e2e-id="endSession"]');
  //   await adminPage.click('[e2e-id="endSession"]');
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/endedSession.jpg'
  //   });
  //   ////await adminPage.waitForSelector('[e2e-id="usernameAdmin"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/inactive1.jpg'
  //   });
  //   ////await userPage.waitForSelector('[e2e-id="inactive"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/inactive2.jpg'
  //   });
  // });
  
  // test("End Session", async () => {
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/beforeending.jpg'
  //   });
  //   await adminPage.waitForSelector('[e2e-id="endSession"]');
  //   await adminPage.click('[e2e-id="endSession"]');
  //   await adminPage.screenshot({
  //     path: 'screenshots/feature8/endedSession.jpg'
  //   });
  //   await adminPage.waitForSelector('[e2e-id="usernameAdmin"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/inactive1.jpg'
  //   });
  //   await userPage.waitForSelector('[e2e-id="inactive"]');
  //   await userPage.screenshot({
  //     path: 'screenshots/feature8/inactive2.jpg'
  //   });
  // });

  // afterAll(async () => {
  //   await AdminApi.deactivateApp(accessToken);
  //   await browser.close();
  // });
// });
