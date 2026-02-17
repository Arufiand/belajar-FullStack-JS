import ReactDOM from "react-dom/client";
import NoteApp from "./NoteApp.jsx";
import { StrictMode } from "react";
import PersonApp from "./PersonApp.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*<NoteApp />*/}
    <PersonApp />
  </StrictMode>,
);
