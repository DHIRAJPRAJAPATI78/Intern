import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/admin", 
  withCredentials: true,
});


// LOGIN (Step 1: send OTP)
export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/login", data);
      return res.data; // { message, step }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// VERIFY OTP (Step 2: verify OTP & login)
export const verifyAdminOtp = createAsyncThunk(
  "admin/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/verify-otp", data);
      return res.data; // { message, admin }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);

// RESEND OTP
export const resendAdminOtp = createAsyncThunk(
  "admin/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/resend-otp", data);
      return res.data; // { message }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Resend OTP failed");
    }
  }
);

// LOGOUT
export const logoutAdmin = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.post("/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

// GET PROFILE
export const getAdminProfile = createAsyncThunk(
  "admin/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/getProfile");
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile fetch failed");
    }
  }
);

// UPDATE PROFILE
export const updateAdminProfile = createAsyncThunk(
  "admin/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.put("/update/profile", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);

// PASSWORD RESET (after login)
export const resetAdminPassword = createAsyncThunk(
  "admin/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/password/update", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

// FORGOT PASSWORD (email link)
export const forgotAdminPassword = createAsyncThunk(
  "admin/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/password/forgot", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Forgot password failed");
    }
  }
);

// RESET PASSWORD FROM LINK
export const resetAdminPasswordFromLink = createAsyncThunk(
  "admin/resetPasswordFromLink",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/password/reset/${token}`, { password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

// REGISTER ADMIN (superadmin only)
export const registerAdminUser = createAsyncThunk(
  "admin/registerAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/register", data);
      return res.data; // { message, token, admin }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Admin registration failed");
    }
  }
);

// LIST EXPERTS
export const listExperts = createAsyncThunk(
  "admin/listExperts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/experts");
      return res.data.experts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch experts");
    }
  }
);

/* ---------------------- SLICE ---------------------- */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    error: null,
    message: null,
    admin: null,
    profile: null,
    experts: [],
    otpStep: null, // login → OTP step
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminMessage: (state) => {
      state.message = null;
    },
    clearOtpStep: (state) => {
      state.otpStep = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* LOGIN */
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.otpStep = action.payload.step; // "verify-otp"
      })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* VERIFY OTP */
      .addCase(verifyAdminOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyAdminOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.message = action.payload.message;
        state.otpStep = null;
      })
      .addCase(verifyAdminOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* RESEND OTP */
      .addCase(resendAdminOtp.pending, (state) => { state.loading = true; })
      .addCase(resendAdminOtp.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(resendAdminOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* LOGOUT */
      .addCase(logoutAdmin.pending, (state) => { state.loading = true; })
      .addCase(logoutAdmin.fulfilled, (state) => { state.loading = false; state.admin = null; state.message = "Logged out successfully"; })
      .addCase(logoutAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* PROFILE */
      .addCase(getAdminProfile.pending, (state) => { state.loading = true; })
      .addCase(getAdminProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(getAdminProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateAdminProfile.pending, (state) => { state.loading = true; })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.admin;
        state.message = action.payload.message;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* PASSWORD */
      .addCase(resetAdminPassword.pending, (state) => { state.loading = true; })
      .addCase(resetAdminPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(resetAdminPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(forgotAdminPassword.pending, (state) => { state.loading = true; })
      .addCase(forgotAdminPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(forgotAdminPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(resetAdminPasswordFromLink.pending, (state) => { state.loading = true; })
      .addCase(resetAdminPasswordFromLink.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(resetAdminPasswordFromLink.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* REGISTER ADMIN (SUPERADMIN) */
      .addCase(registerAdminUser.pending, (state) => { state.loading = true; })
      .addCase(registerAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.admin = action.payload.admin;
      })
      .addCase(registerAdminUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      /* LIST EXPERTS */
      .addCase(listExperts.pending, (state) => { state.loading = true; })
      .addCase(listExperts.fulfilled, (state, action) => { state.loading = false; state.experts = action.payload; })
      .addCase(listExperts.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearAdminError, clearAdminMessage, clearOtpStep } = adminSlice.actions;
export default adminSlice.reducer;
