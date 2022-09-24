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
        <div className="app">
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