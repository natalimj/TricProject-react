import React from "react";
import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { Route, Routes, BrowserRouter} from "react-router-dom";
import Admin from './components/admin/AdminMainPage';
import Page404 from './components/404Page';
import StartPage from './components/user/StartPage';
import ManageQuestions from "./components/admin/ManageQuestions";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/admin/AdminLogin";
import PrivateRoutes from "./components/PrivateRoute";
import { PersistGate } from "redux-persist/integration/react";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import PlayInfo from "./components/admin/ManagePlayInfo";
import DisplayResult from "./components/admin/DisplayResult";
import VideoPage from "./components/admin/VideoPage";


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route element={<PrivateRoutes />}>
                <Route path='/admin' element={<Admin />} />
                <Route path="/admin/questions" element={<ManageQuestions />} />
                <Route path="/admin/playInfo" element={<PlayInfo />} />
                <Route path="/admin/result" element={<DisplayResult />} />
                <Route path="/admin/video" element={<VideoPage />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </BrowserRouter>
          <NotificationContainer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;