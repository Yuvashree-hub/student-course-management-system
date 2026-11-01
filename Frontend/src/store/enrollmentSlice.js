// src/store/enrollmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as enrollmentApi from '../api/enrollmentApi';
import { errorMessage } from '../utils/format';
import { logout } from './authSlice';

export const fetchMyEnrollments = createAsyncThunk('enrollments/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await enrollmentApi.getMyEnrollments();
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const enrollCourse = createAsyncThunk('enrollments/enroll', async (courseId, { rejectWithValue }) => {
  try {
    return (await enrollmentApi.enrollInCourse(courseId)).enrollment;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const unenrollCourse = createAsyncThunk('enrollments/unenroll', async (id, { rejectWithValue }) => {
  try {
    await enrollmentApi.unenrollFromCourse(id);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const initial = { list: [], loading: false, error: null, actionError: null, loaded: false };

// stats are derived on the client so they update instantly after every action
export const selectEnrollmentStats = (state) => {
  const list = state.enrollments.list;
  const overall = list.length ? Math.round(list.reduce((s, e) => s + e.progress, 0) / list.length) : 0;
  return {
    enrolledCount: list.length,
    completedCount: list.filter((e) => e.status === 'Completed').length,
    overallProgress: overall,
  };
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState: initial,
  reducers: { clearActionError: (s) => { s.actionError = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyEnrollments.fulfilled, (s, a) => { s.loading = false; s.loaded = true; s.list = a.payload.enrollments; })
      .addCase(fetchMyEnrollments.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(enrollCourse.fulfilled, (s, a) => { s.actionError = null; s.list.unshift(a.payload); })
      .addCase(enrollCourse.rejected, (s, a) => { s.actionError = a.payload; })
      .addCase(unenrollCourse.fulfilled, (s, a) => { s.list = s.list.filter((e) => e.id !== a.payload); })
      .addCase(unenrollCourse.rejected, (s, a) => { s.actionError = a.payload; })
      .addCase(logout, () => initial);
  },
});

export const { clearActionError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
