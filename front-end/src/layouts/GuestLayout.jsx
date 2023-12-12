import React, { useEffect } from 'react'
import _header from './_header';
import _footer from './_footer';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { LOGIN_ROUTE, STUDENT_DASHBOARD_ROUTE } from '../Routes';
// import { ADMIN_DASHBOARD_ROUTE } from '../App';
import { DASHBOARD_ROUTE } from '../App';

const GuestLayout = () => {
  const { user, guard, isAuth, isGuest } = useAuth()
  const navigate = useNavigate()
  // useEffect(() => { user && navigate(guard === 'student' ? STUDENT_DASHBOARD_ROUTE : ADMIN_DASHBOARD_ROUTE) }, [user])

  useEffect(() => {

    // !auth('admin') && guest('admin', 'student') && navigate("/admin" + LOGIN_ROUTE)
    if (guard !== null) {
      if (isAuth('student')) {
        navigate('/student/' + DASHBOARD_ROUTE, {replace: true})
      } else if (isAuth('admin')) {
        navigate('/admin/' + DASHBOARD_ROUTE, {replace: true})
      }
    }
  }, [guard])

  return (
    <>
      {/* <_header /> */}
      <main className='container'>
        <Outlet />
      </main>
      {/* <_footer /> */}
    </>
  )
}

export default GuestLayout
