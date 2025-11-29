
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin/login" element={<Login/>}/>
          <Route path="/admin/forgot-password" element={<ForgotPassword/>}/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
