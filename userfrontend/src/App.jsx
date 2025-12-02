import Login from "./components/auth/Login";
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Profile from "./components/profile/Profile";
import Home from "./Home";

import { Toaster } from "react-hot-toast";
import ChangePassword from "./components/auth/ChangePassword";


import ProtectedRoute from "./routes/protectedRoutes";
import About from "./pages/about";
import Booking from "./pages/Booking";
import TarotCard from "./pages/TarotCard";
import Horoscope from "./pages/Horoscope";
import Contact from "./pages/Contact";
import MyBooking from "./components/MyBooking";
import Setting from "./components/Setting";
import Video from "./components/video";




function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position='top-right' />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/about' element={<About />} />
          <Route path='/book' element={<Booking />} />
          <Route path='/cards' element={<TarotCard />} />
          <Route path='/horoscope' element={<Horoscope />} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/video' element={<Video/>} />





            {/* Protected Routes */}
            <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resetpassword"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />



          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBooking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />

       



        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
