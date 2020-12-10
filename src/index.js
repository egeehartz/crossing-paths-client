import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"
import { Crossings } from "./components/Crossings"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Crossings />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
