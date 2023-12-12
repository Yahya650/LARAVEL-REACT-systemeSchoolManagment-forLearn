import React, { createContext, useContext, useEffect, useState } from 'react'
import { axiosClient } from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '../App'
import LoadingCircle from '../components/LoadingCircls/LoadingCircle'


export const UserStateContext = createContext({
    login: () => { },
    register: () => { },
    logout: () => { },
    setCheck: () => { },
    setUser: () => { },
    setGuard: () => { },
    isGuest: () => { },
    isAuth: () => { },
    setReloadPage: () => { },
    forgotPassWord: () => { },
    resetPassWord: () => { },
    setStatus: () => { },
    SendEmailverificationNotification: () => { },
    guard: null,
    status: null,
    user: {},
    errors: [],
    check: false,
    ownerStudent: null
})

const AuthContext = ({ children }) => {

    const [user, setUser] = useState(null)
    const [guard, setGuard] = useState(null)
    const [errors, setErrors] = useState([])
    const [ownerStudent, setOwnerStudent] = useState({
        "name": null,
        "email": null,
    })
    const [reloadPage, setReloadPage] = useState(false)
    const [status, setStatus] = useState({ msg: null, type: null })
    const navigate = useNavigate()

    async function fetchData() {
        if (!user) {
            setReloadPage(true)
            try {
                const { data } = await axiosClient.get('/' + 'student' + '/profile');
                setGuard('student')
                setUser(data.user);
                setOwnerStudent(data.admin)
                setReloadPage(false);
            } catch (error) {
                try {
                    const { data } = await axiosClient.get('/' + 'admin' + '/profile');
                    setGuard('admin')
                    setUser(data.user);
                    setOwnerStudent(data.admin)
                    setReloadPage(false);
                } catch (error) {
                    setUser(null);
                    setGuard(null);
                    setOwnerStudent({
                        "name": null,
                        "email": null,
                    })
                    setReloadPage(false)
                }
            }
        }

    }

    useEffect(() => {
        setErrors([])
        fetchData();
    }, [])

    const csrf = async () => await axiosClient.get("/sanctum/csrf-cookie", {
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true
    });


    const isAuth = (guardV) => {
        if (guardV === guard && user) return true
        else return false
    }


    const isGuest = (...guardV) => {
        if (!guardV.includes(guard) && !user) return true
        else return false;
    }


    const getUser = async (guard) => {
        setReloadPage(true)
        try {
            const { data } = await axiosClient.get('/' + guard + '/profile');
            setGuard(guard);
            setOwnerStudent(data.admin)
            setUser(data.user);
            setReloadPage(false);
        } catch (error) {
            if (error.response.status === 401) {
                setUser(null);
                setGuard(null);
                setReloadPage(false)
                setOwnerStudent({
                    "name": null,
                    "email": null,
                })
            }
        }
    }


    const login = async ({ email, password, guard }) => {
        try {
            await csrf();
            if (guard === 'student') {
                await axiosClient.post(guard + "/login", { email_or_username: email, password });
            } else {
                await axiosClient.post(guard + "/login", { email, password });
            }
            setErrors([])
            await getUser(guard);
            setGuard(guard)
            navigate(guard === "student" ? "/student/" + DASHBOARD_ROUTE : "/admin/" + DASHBOARD_ROUTE, { replace: true })
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                console.log(error);
            }
        }
    }


    const register = async ({ name, email, password, password_confirmation, guard }) => {
        try {
            await csrf();
            await axiosClient.post("/" + guard + "/register", { name, email, password, password_confirmation });
            setGuard(guard)
            setErrors([])
            await getUser(guard);
            // console.log('test');
            navigate(guard === "student" ? "/student/" + DASHBOARD_ROUTE : "/admin/" + DASHBOARD_ROUTE, { replace: true })
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                // console.log(error);
            }
        }
    }

    const forgotPassWord = async (guard, email) => {
        try {
            await csrf();
            const res = await axiosClient.post("/" + guard + '/forgot-password', { email });

            if (res.data.type === 'success') {
                setStatus({ msg: res.data.status, type: 'success' })
            } else {
                setStatus({ msg: res.data.status, type: 'error' })
            }
            setErrors([])

            // setInterval(() => {
            //     setStatus({ msg: null, type: null })
            // }, 7000);


        } catch (error) {
            // console.log(error);
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                // console.log(error);
            }
            // setReloadPage(false)
        }
    }

    const resetPassWord = async ({ email, password, password_confirmation, guard, token }) => {
        try {

            await csrf();
            const res = await axiosClient.post("/" + guard + '/reset-password', { email, password, password_confirmation, token });
            setErrors([])

            if (res.data.type === 'success') {
                setStatus({ msg: res.data.status, type: 'success' })
            } else {
                setStatus({ msg: res.data.status, type: 'error' })
            }

            setInterval(() => {
                setStatus({ msg: null, type: null })
                clearInterval()
            }, 7000);

            navigate('/' + guard + '/login', { replace: true })
            // setReloadPage(false)
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                // console.log(error);
            }
            // setReloadPage(false)
        }
    }

    const SendEmailverificationNotification = async (guard) => {
        try {
            await csrf();
            const res = await axiosClient.post(guard + '/email/verification-notification');
            // console.log(res);
            if (res.data.type === 'success') {
                setStatus({ msg: res.data.status, type: 'success' })
                // navigate
            } else {
                setStatus({ msg: res.data.status, type: 'error' })
            }

            setInterval(() => {
                setStatus({ msg: null, type: null })
                clearInterval()
            }, 7000);
        } catch (error) {
            // console.log(error);
        }
    }

    const logout = async (guard) => {
        setReloadPage(true)
        try {
            await csrf();
            await axiosClient.post("/" + guard + '/logout');
            setErrors([])
            setGuard(null)
            setUser(null)
            navigate('/', { replace: true })
            setReloadPage(false)
        } catch (error) {
            // console.log(error);
        }
    }


    return (
        <UserStateContext.Provider value={{
            login,
            register,
            logout,
            csrf,
            setGuard,
            setUser,
            isGuest,
            isAuth,
            forgotPassWord,
            resetPassWord,
            setStatus,
            SendEmailverificationNotification,
            setReloadPage,
            status,
            ownerStudent,
            guard,
            user,
            errors
        }}>
            {
                !reloadPage ?
                    children : <div className='w-100 d-flex justify-content-center align-items-center' style={{ height: '100vh' }}><div><LoadingCircle /></div></div>
            }


        </UserStateContext.Provider>
    )
}

export const useAuth = () => useContext(UserStateContext);

export default AuthContext;
