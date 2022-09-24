import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from '../reducers/userSlice';
import questionReducer from '../reducers/questionSlice';
import answerReducer from '../reducers/answerSlice';
import componentReducer from '../reducers/componentSlice';

const persistConfig = {
  key: "root",
  storage
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedQuestionReducer = persistReducer(persistConfig, questionReducer);
const persistedAnswerReducer = persistReducer(persistConfig, answerReducer);
const persistedComponentReducer = persistReducer(persistConfig, componentReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    question: persistedQuestionReducer,
    answer: persistedAnswerReducer,
    component: persistedComponentReducer,
  },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
