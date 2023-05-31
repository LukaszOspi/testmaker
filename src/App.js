import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import FileUploader from "./components/FileUploader";
import JSONSearchEngine from "./components/JSONSearchEngine";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <nav className="menu">
          <ul>
            <li>
              <Link to="/">File Uploader</Link>
            </li>
            <li>
              <Link to="/search">JSON Search Engine</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<FileUploader />} />
          <Route path="/search" element={<JSONSearchEngine />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
