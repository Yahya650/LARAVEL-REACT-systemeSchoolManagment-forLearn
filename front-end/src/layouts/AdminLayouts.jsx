import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import _header from './_header';
// import { ADMIN_DASHBOARD_ROUTE } from '../App';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import LoadingCircle from '../components/LoadingCircls/LoadingCircle';
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '../App';



const AdminLayouts = () => {

    const { user, guard, isAuth, isGuest, SendEmailverificationNotification, setReloadPage, status } = useAuth();

    const navigate = useNavigate()

    const [searshParams] = useSearchParams();
    useEffect(() => {
        if (guard !== null) {
            if (isGuest('admin', 'student')) {
                navigate("/admin/" + LOGIN_ROUTE, { replace: true })
            } else if (isAuth('student')) {
                navigate("/student/" + DASHBOARD_ROUTE, { replace: true })
            }
        } else {
            navigate("/admin/" + LOGIN_ROUTE, { replace: true })
        }

        user && !user.email_verified_at && !status.type &&
            withReactContent(Swal).fire({
                icon: "warning",
                title: "Verify Email",
                text: "Please verify your email to access all features",
                footer: <a type="button" className='link-opacity-70-hover' onClick={async () => {
                    Swal.close();
                    setReloadPage(true);
                    await SendEmailverificationNotification(guard);
                    setReloadPage(false);
                }}>send verification link again</a>,
            })

        searshParams.get('token_expired') &&
            withReactContent(Swal).fire({
                icon: "warning",
                title: "Verify Email",
                text: "email verification link is expired",
                footer: <a type="button" className='link-opacity-25-hover' onClick={async () => {
                    Swal.close();
                    setReloadPage(true);
                    await SendEmailverificationNotification(guard);
                    setReloadPage(false);
                }}>send verification link</a>,
            })


        status.type === 'success' &&
            withReactContent(Swal).fire({
                icon: "success",
                title: "Sent!",
                text: status.msg,
            })
    }, [guard])

    return (
        <>
            <_header />
            <main className='container'>
                {
                    status.type === 'error' &&
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>{status.msg}</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                }

                {
                    user && <h1 className='text-center my-5 border py-4 rounded-5'>Hi Admin <small className="text-body-secondary">{user.name}</small> </h1>
                }


                <Outlet />

            </main>
            {/* <_footer /> */}
        </>
    )
}

export default AdminLayouts
