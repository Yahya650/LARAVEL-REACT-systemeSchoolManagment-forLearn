import { createBrowserRouter } from "react-router-dom";
import AuthLayouts from '../src/layouts/AuthLayouts';
import GuestLayout from "../src/layouts/GuestLayout";
import MasterLayout from "../src/layouts/MasterLayout";
import FormLogin from "../src/components/FormLogin";
import FormRegister from "../src/components/FormRegister";
import StudentDashboard from "../src/components/Student/StudentDashboard";




export const INDEX_ROUTE = '/';
export const LOGIN_ROUTE = '/login';
export const REGISTER_ROUTE = '/register';
export const STUDENT_DASHBOARD_ROUTE = '/student/dashboard';
export const LOGOUT_ROUTE = '/logout';

export const router = createBrowserRouter([
    {
        element: <MasterLayout />,
        children: [
            {
                path: '/',
                element: <h1 className="container">Home</h1>
            },
            {
                path: '*',
                element: <h1 className="container">NotFound</h1>
            },
        ]
    },
    {
        element: <GuestLayout />,
        children: [
            {
                path: LOGIN_ROUTE,
                element: <FormLogin />
            },
            {
                path: REGISTER_ROUTE,
                element: <FormRegister />
            },
        ]
    },
    {
        element: <AuthLayouts />,
        children: [
            {
                path: STUDENT_DASHBOARD_ROUTE,
                element: <StudentDashboard />
            },
        ]
    }

])