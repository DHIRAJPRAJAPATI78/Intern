import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


if (typeof global === "undefined") {
  window.global = window;
}
import process from "process";

window.process = process;
createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
