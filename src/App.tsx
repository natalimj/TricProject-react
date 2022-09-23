import React from 'react';
import logo from './logo.svg';
import { PersistGate } from "redux-persist/integration/react";
import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Admin from './components/Admin';
import Page404 from './components/Page404';
import StartPage from './components/StartPage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;


/*
<header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Counter />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <span>
              <span>Learn </span>
              <a
                className="App-link"
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                React
              </a>
              <span>, </span>
              <a
                className="App-link"
                href="https://redux.js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Redux
              </a>
              <span>, </span>
              <a
                className="App-link"
                href="https://redux-toolkit.js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Redux Toolkit
              </a>
              ,<span> and </span>
              <a
                className="App-link"
                href="https://react-redux.js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                React Redux
              </a>
            </span>
            <p>
              TRIC Project
            </p>
          </header>
*/ 