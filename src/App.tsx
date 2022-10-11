import React from "react";
import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { Route, Routes, BrowserRouter} from "react-router-dom";
import Admin from './components/Admin';
import Page404 from './components/404Page';
import StartPage from './components/StartPage';
import Questions from "./components/Questions";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login.component";
import PrivateRoutes from "./components/PrivateRoute";


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route element={<PrivateRoutes/>}>
                <Route path="/admin/questions" element={<Questions/>} />
                <Route path='/admin' element={<Admin/>} />
              </Route>
              <Route path="/login" element={<Login />} />
              
              <Route path="*" element={<Page404 />} />
            </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;