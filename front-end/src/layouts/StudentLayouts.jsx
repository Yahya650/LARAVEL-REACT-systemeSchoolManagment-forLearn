import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { LOGIN_ROUTE } from '../Routes';
import _header from './_header';
// import { ADMIN_DASHBOARD_ROUTE } from '../App';
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '../App';

const StudentLayouts = () => {

    const { user, guard, isAuth, isGuest, ownerStudent } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (guard !== null) {
            if (isGuest('admin', 'student')) {
                navigate("/student/" + LOGIN_ROUTE, { replace: true })
            } else if (isAuth('admin')) {
                navigate("/admin/" + DASHBOARD_ROUTE, { replace: true })
            }
        }
        else {
            navigate("/student/" + LOGIN_ROUTE, { replace: true })
        }
    }, [guard])


    return (
        <>
            <_header />
            <main className='container'>
                {
                    user && <h1 className='text-center my-5 border py-4 rounded-5'>Hi Student <small className="text-body-secondary">{user.name}</small> Your admin is <small className="text-body-secondary">{ownerStudent.name}</small></h1>
                }

                <Outlet />
            </main>
            {/* <_footer /> */}
        </>
    )
}

export default StudentLayouts
