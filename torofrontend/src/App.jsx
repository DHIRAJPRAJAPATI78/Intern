import Login from "./components/auth/Login";
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Profile from "./components/profile/Profile";
import Home from "./Home";
import Video from "./components/video";
import IncomingCallPopup from "./components/incomingCallPopup";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <IncomingCallPopup/>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path="/contact" element={<Contact/>} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/video" element={<Video/>} />


        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

