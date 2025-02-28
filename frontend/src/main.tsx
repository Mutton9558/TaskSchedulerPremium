import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Submit from "./Submit";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/submit-after-login" element={<Submit />} />
    </Routes>
  </Router>
);
