import API_BASE_URL from "./config";
export const LOGIN = API_BASE_URL + "auth/login";
export const REGISTER = API_BASE_URL + "auth/register";
export const UPDATE_PROFILE = API_BASE_URL + "auth/update";
export const SEND_VERIFICATION = API_BASE_URL + "auth/resend-verification";
export const PARTICIPANTS_LIST = API_BASE_URL + "auth/all";
export const SEARCH_USER = API_BASE_URL + "auth/search";
export const GET_QUESTIONS = API_BASE_URL + "questions/all";
export const SUBMIT_ANSWER = API_BASE_URL + "questions/submit";
export const QUESTION_WITH_ANSWER = API_BASE_URL + "questions/with-answer/";
export const ALL_QUESTIONS = API_BASE_URL + "questions/allquest/";
export const ADD_QUESTION = API_BASE_URL + "questions";
export const SINGLE_QUESTION = API_BASE_URL + "questions/single/";
export const DELETE_TESTCASE = API_BASE_URL + "questions/delete_testcase/";
export const ADMIN_DASHBOARD = API_BASE_URL + "auth/admindashboard";
export const SPHERE_SUBMISSION_STATUS = API_BASE_URL + "editor/submissions/";
export const SPHERE_STREAMS = API_BASE_URL + "editor/streams";
export const START_CHAT = API_BASE_URL + "chat/start";
export const CHAT_LIST = API_BASE_URL + "chat/chats";
export const START_CHAT_BY_ROOM = API_BASE_URL + "chat/startroom";





