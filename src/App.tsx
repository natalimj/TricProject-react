import React from "react";
import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Admin from './components/Admin';
import Page404 from './components/404Page';
import StartPage from './components/StartPage';
import Questions from "./components/ManageQuestions";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/questions" element={<Questions />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;