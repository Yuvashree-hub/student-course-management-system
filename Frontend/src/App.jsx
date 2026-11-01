import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import RealtimeBridge from './components/RealtimeBridge';
import Toast from './components/Toast';

// Student pages
import Home from './pages/student/Home';
import Login from './pages/student/Login';
import Register from './pages/student/Register';
import ForgotPassword from './pages/student/ForgotPassword';
import ResetPassword from './pages/student/ResetPassword';
import Dashboard from './pages/student/Dashboard';
import Courses from './pages/student/Courses';
import Learning from './pages/student/Learning';
import Profile from './pages/student/Profile';
import Notifications from './pages/student/Notifications';
import Chat from './pages/student/Chat';
import Certificate from './pages/student/Certificate';
import CourseLearn from './pages/student/CourseLearn';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageStudents from './pages/admin/ManageStudents';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <RealtimeBridge />
      <Navbar />
      <Toast />
      <main className="app-body">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Student (protected) */}
          <Route path="/dashboard" element={<RequireAuth role="student"><Dashboard /></RequireAuth>} />
          <Route path="/learning" element={<RequireAuth role="student"><Learning /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth role="student"><Profile /></RequireAuth>} />
          <Route path="/learn/:enrollmentId" element={<RequireAuth role="student"><CourseLearn /></RequireAuth>} />
          <Route path="/certificate/:enrollmentId" element={<RequireAuth role="student"><Certificate /></RequireAuth>} />

          {/* Any logged-in user */}
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/courses" element={<RequireAuth role="admin"><ManageCourses /></RequireAuth>} />
          <Route path="/admin/students" element={<RequireAuth role="admin"><ManageStudents /></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
