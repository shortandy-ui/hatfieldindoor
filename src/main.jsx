import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { storage } from "./storage.js";
import "./index.css";

window.storage = storage;

createRoot(document.getElementById("root")).render(<App />);
