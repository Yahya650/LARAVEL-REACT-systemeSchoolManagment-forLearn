import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { ChakraProvider } from '@chakra-ui/react';


// Components Student
import StudentFormLogin from './components/Student/StudentFormLogin';
import StudentDashboard from './components/Student/StudentDashboard';
import StudentFormRegister from './components/Student/StudentFormRegister';
import StudentResetPasswordForm from './components/Student/StudentResetPasswordForm';
import StudentForgotPassword from './components/Student/StudentForgotPassword';

// Components Admin
import AdminFormLogin from './components/Admin/AdminFormLogin';
import AdminFormRegister from './components/Admin/AdminFormRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminForgotPassword from './components/Admin/AdminForgotPassword';
import AdminResetPasswordForm from './components/Admin/AdminResetPasswordForm';

// Layouts
// import MasterLayout from './layouts/MasterLayout';
import GuestLayout from './layouts/GuestLayout';
import StudentLayouts from './layouts/StudentLayouts';
import AdminLayouts from './layouts/AdminLayouts';

// Other Pages
import Home from './components/Home';
import NoteFound from './components/NoteFound';
import StudentProfile from './components/Student/StudentProfile';
import AdminShowStudent from './components/Admin/AdminShowStudent';
import AuthContext from './context/AuthContext';


export const INDEX_ROUTE = '/';
export const LOGIN_ROUTE = 'login';
export const REGISTER_ROUTE = 'register';
export const DASHBOARD_ROUTE = 'dashboard';
export const FORGOT_PASSWORD_ROUTE = 'forgot-password';
export const RESET_PASSWORD_ROUTE = 'password-reset/:token';
export const SHOW_ROUTE = 'show-student/:id';
// export const ADMIN_DASHBOARD_ROUTE = '/admin/dashboard';
// export const LOGOUT_ROUTE = '/logout';

function App() {

  return (
    <BrowserRouter>
      <ChakraProvider>
        <AuthContext>
          <Routes>

            <Route path={'*'} element={<NoteFound />} />
            <Route path={INDEX_ROUTE} element={<Home />} />

            <Route element={<StudentLayouts />} path='/student'>
              <Route path={DASHBOARD_ROUTE} element={<StudentDashboard />} />
              <Route path={'profile'} element={<StudentProfile />} />
            </Route>

            <Route element={<AdminLayouts />} path='/admin'>
              <Route index element={<AdminDashboard />} />
              <Route path={DASHBOARD_ROUTE} element={<AdminDashboard />} />
              <Route path={SHOW_ROUTE} element={<AdminShowStudent />} />
            </Route>

            <Route element={<GuestLayout />}>
              <Route path='admin'>
                <Route path={LOGIN_ROUTE} element={<AdminFormLogin />} />
                <Route path={REGISTER_ROUTE} element={<AdminFormRegister />} />
                <Route path={RESET_PASSWORD_ROUTE} element={<AdminResetPasswordForm />} />
                <Route path={FORGOT_PASSWORD_ROUTE} element={<AdminForgotPassword />} />
              </Route>

              <Route path='student'>
                <Route path={LOGIN_ROUTE} element={<StudentFormLogin />} />
                <Route path={RESET_PASSWORD_ROUTE} element={<StudentResetPasswordForm />} />
                <Route path={FORGOT_PASSWORD_ROUTE} element={<StudentForgotPassword />} />
              </Route>
            </Route>

          </Routes>
        </AuthContext>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
