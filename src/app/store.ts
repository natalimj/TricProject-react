import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from '../reducers/userSlice';
import questionReducer from '../reducers/questionSlice';
import answerReducer from '../reducers/answerSlice';
import componentReducer from '../reducers/componentSlice';
import statusReducer from '../reducers/statusSlice';
import adminReducer from '../reducers/adminSlice';

const persistConfig = {
  key: "primary",
  storage
};

const rootReducer = combineReducers({
  user: userReducer,
  question: questionReducer,
  answer: answerReducer,
  component: componentReducer,
  status: statusReducer,
  admin: adminReducer,
})

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
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
