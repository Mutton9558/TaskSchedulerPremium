import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Submit from "./Submit";
import Activities from "./Activities.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Activities" element={<Activities />} />
      <Route path="/submit-after-login" element={<Submit />} />
    </Routes>
  </Router>
);
