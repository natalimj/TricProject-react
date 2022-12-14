import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from '../reducers/userSlice';
import questionReducer from '../reducers/questionSlice';
import answerReducer from '../reducers/answerSlice';
import componentReducer from '../reducers/componentSlice';
import statusReducer from '../reducers/statusSlice';
import adminReducer from '../reducers/adminSlice';
import playDataReducer from '../reducers/playDataSlice';


/**
 * Creates a store object, 
 * combines different reducer functions into a single reducer object
 * and uses persisted Redux store to save the application state in the local storage
 * 
 * @ Daria-Maria Popa
 */
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
  playData: playDataReducer,
})

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
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
