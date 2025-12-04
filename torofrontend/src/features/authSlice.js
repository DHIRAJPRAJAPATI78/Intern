import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// "http://localhost:3000/expert"
const API = axios.create({
  baseURL:"https://torobackend-8kmx.onrender.com/expert",
  withCredentials: true,
});

/* 
 REGISTER EXPERT
 */
export const registerExpert = createAsyncThunk(
  "expert/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

/* 
 LOGIN EXPERT
 */
export const loginExpert = createAsyncThunk(
  "expert/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* 
 LOGOUT EXPERT
 */
export const logoutExpert = createAsyncThunk(
  "expert/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.post("/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

/* 
 GET EXPERT PROFILE
*/
export const getExpertProfile = createAsyncThunk(
  "expert/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/profile");
      return res.data.expert;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

/* 
UPDATE PROFILE (with images + formData)
 */
export const updateExpertProfile = createAsyncThunk(
  "expert/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.put("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* 
 DELETE PROFILE (req.expert.id)
 */
export const deleteExpertProfile = createAsyncThunk(
  "expert/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.delete("/profile/delete");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

/* 
 CHANGE PASSWORD
 */
export const changeExpertPassword = createAsyncThunk(
  "expert/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/password/change", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

/* 
 EXPERT SLICE
 */

const expertSlice = createSlice({
  name: "expert",
  initialState: {
    loading: false,
    error: null,
    expert: null,
    message: null,
    profile: null,
  },

  reducers: {
    clearExpertError: (state) => {
      state.error = null;
    },
    clearExpertMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerExpert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerExpert.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerExpert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginExpert.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginExpert.fulfilled, (state, action) => {
        state.loading = false;
        state.expert = action.payload;
      })
      .addCase(loginExpert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGOUT */
      .addCase(logoutExpert.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutExpert.fulfilled, (state, action) => {
        state.loading = false;
        state.expert = null;
        state.message = action.payload.message;
      })
      .addCase(logoutExpert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET PROFILE */
      .addCase(getExpertProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExpertProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getExpertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE PROFILE */
      .addCase(updateExpertProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpertProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.expert;
        state.message = action.payload.message;
      })
      .addCase(updateExpertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE PROFILE */
      .addCase(deleteExpertProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpertProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.expert = null;
        state.profile = null;
        state.message = action.payload.message;
      })
      .addCase(deleteExpertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CHANGE PASSWORD */
      .addCase(changeExpertPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeExpertPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(changeExpertPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExpertError, clearExpertMessage } = expertSlice.actions;
export default expertSlice.reducer;
