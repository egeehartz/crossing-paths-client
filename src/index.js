import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"
import { Crossings } from "./components/Crossings"
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Crossings />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
