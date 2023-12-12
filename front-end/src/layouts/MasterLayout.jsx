import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { STUDENT_DASHBOARD_ROUTE } from '../Routes'
import { useAuth } from '../context/AuthContext'
import _header from './_header';

const MasterLayout = () => {

    return (
        <>
            <_header />
            <main>
                <Outlet />
            </main>
            {/* <_footer /> */}
        </>
    )
}

export default MasterLayout
