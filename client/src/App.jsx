import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import LoginComponent from "./app/pages/Login.jsx";
import Register from "./app/pages/Register.jsx";
import "./App.css";
import ForgotPassword from "./app/pages/ForgotPassword.jsx";
import NotFound from "./app/pages/NotFound.jsx";
import Home from "./app/pages/Home.jsx";
import EditorComponent from "./app/components/My Postings/editor/EditorComponent.jsx";
import ReadPost from "./app/pages/My Postings/ReadPost.jsx";
import Account from "./app/pages/Account.jsx";
import PostEditor from "./app/pages/My Postings/PostEditor.jsx";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <Navigate to="/sign-in" /> : <Navigate to="/home" />
          }
        />

        <Route
          path="/sign-up"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/sign-in"
          element={!isLoggedIn ? <LoginComponent /> : <Navigate to="/" />}
        />

        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/view/:postId" element={<ReadPost />} />
        <Route path="/editor/:postId" element={<EditorComponent />} />
        <Route path="/edit-content/:postId" element={<PostEditor />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
