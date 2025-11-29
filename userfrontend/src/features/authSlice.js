import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/user",
  withCredentials: true,
});


// REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);


// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logout",
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
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/profile/${id}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/profile/update/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// DELETE PROFILE
export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/profile/delete/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/password/change", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

// FORGOT PASSWORD

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await API.post("/password/forgot", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send reset link");
    }
  }
);

//. RESET PASSWORD

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ id, token, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/resetpassword/${id}/${token}`, { password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);


// slices
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    user: null,
    message: null,
    profile: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGOUT */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.message = "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET PROFILE */
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.profile = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE PROFILE */
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE PROFILE */
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        state.message = action.payload.message;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CHANGE PASSWORD */
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* RESET PASSWORD */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearUserMessage } = userSlice.actions;

export default userSlice.reducer;
