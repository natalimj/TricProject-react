const Constants = {
	BASE_URL: "https://tricproject.azurewebsites.net/",
	SOCKET_URL: "https://tricproject.azurewebsites.net/ws-message",
	//BASE_URL: "http://localhost:8080/",
	//SOCKET_URL: "http://localhost:8080/ws-message",


	/* INITIAL STATES */
	initialResultState: {
		question: {
			questionNumber: 0,
			questionText: '',
			answers: [],
			time: 0,
			theme: ""
		},
		firstAnswerRate: 0.0,
		secondAnswerRate: 0.0,
		firstAnswer: {
			answerText: "",
			firstCategory: "",
			secondCategory: ""
		},
		secondAnswer: {
			answerText: "",
			firstCategory: "",
			secondCategory: ""
		}
	},

	themes: [
		{ value: 'Select theme', label: 'Select theme', disabled: true },
		{ value: 'Immigration', label: 'Immigration' },
		{ value: 'Climate change', label: 'Climate change' },
		{ value: 'Energy consumption', label: 'Energy consumption' },
		{ value: 'Mass breeding', label: 'Mass breeding' },
		{ value: 'Global population', label: 'Global population' }
	],

	categories: [
		{ value: 'Select category', label: 'Select category', disabled: true },
		{ value: 'Conservative', label: 'Conservative' },
		{ value: 'Progressive', label: 'Progressive' },
		{ value: 'Pragmatic', label: 'Pragmatic' },
		{ value: 'Idealist', label: 'Idealist' }
	],

	/* LABELS */
	APP_TITLE: "TRIC",
	JOIN_BUTTON: "Join",
	CREATE_USER_FIELD: "Create User",
	LOGIN_USER_FIELD: "Login User",
	USERNAME_FIELD: "Username",
	PASSWORD_FIELD: "Password",
	AVATAR_FIELD: "Select an avatar",
	SUBMIT_BUTTON: "Submit",
	QUESTION_FIELD: "Question",
	VOTE_RESULT_FIELD: "Vote Result",
	FINAL_VOTE_RESULT_FIELD: "Final Vote Result",
	CONFIRM_BUTTON: "Confirm",
	WAITING_PROMPT_RESULT: "Gathering votes...",
	WAITING_PROMPT_BEGIN: "Waiting for the first question...",
	WAITING_DEFAULT : "Waiting...",
	WAITING_PROMPT_VOTE :"Waiting for new voting period",
	DOWNLOAD: "DOWNLOAD",
	DIGITAL_PROFILE_FIELD: "YOUR DIGITAL PROFILE",
	USER_RESPONSE: "Your response",
	FINAL_RESULT_BUTTON: "Show Final Result",
	RESULT_FIELD: "Result",
	FINAL_RESULT_FIELD: "Your Profile",
	FINAL_RESULT_PROFILE_BUTTON: "See Your Final Profile",
	RESULT_BUTTON: "Show Result",
	QUESTION_BUTTON: "Show Question",
	START_BUTTON: "Start",
	END_BUTTON: "End Session",
	PAGE_404_MESSAGE: "There's nothing here: 404!",
	ADMIN_TITLE: "Admin",
	NO_ACTIVE_PLAY: "No ongoing play right now.",
	MORE_INFO_TEXT: "Find more about us and when the next play will be here: ",
	MORE_INFO_LINK: "https://www.humanlab.studio/index.html",
	EDIT_PLAY_INFO: "Edit Play Info",
	EDIT_QUESTIONS: "Edit Questions",
	NEW_QUESTION_TITLE: "New Question",
	SAVE_BUTTON: "Save",
	QUESTION_LIST_TITLE: "Questions",
	ONLINE_USERS: "Online users:",
	ON_SCREEN_FIELD: "is on screen...",
	TIME_REMANING: "seconds remaining",
	TIME_FOR: "Time* for Question",
	HUMANLAB: "HumanLab",
	QUESTIONS_FIELD: "Questions",
	ALL_QUESTIONS_FIELD: "Show All Questions",
	CAST_LIST_TITLE: "Cast",
	NEW_CAST_TITLE: "New Cast",
	PLAY_INFO_TITLE: "Play Info",
	EDIT_BUTTON: "Edit",
	DELETE_BUTTON: "Delete",
	NEXT_QUESTION_TEXT: "Next question is:",
	SET_TIME_INFO: "*Time is expressed in SECONDS",
	TIME_LENGTH_INFO: "*MAX time length is 36000s",
	DEVELOPERS_TITLE: "Developers",
	CATEGORY1: "Conservative",
	CATEGORY2: "Progressive",
	CATEGORY3: "Pragmatic",
	CATEGORY4: "Idealist",
	FINAL_RESULT_TEXT: "Final Result Text",
	WHAT_IS_TRIC: "What is TRIC?",
	DISPLAY_QUESTION : "Display question on admin screen",
	WE_CHOSE_TEXT: "We chose:",
	PERSONAL_INFORMATION_AGREEMENT: "Do you agree to selling your soul to HumanLab for eternity? Therby becoming a slave in this and all future lives.",
	AGREE_BUTTON: "Agree",
	DISAGREE_BUTTON: "Disagree",
	COUNTDOWN : "Countdown"
}

export default Constants;
