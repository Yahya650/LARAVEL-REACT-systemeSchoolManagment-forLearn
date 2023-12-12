import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import _header from './StudentLayouts/_studentheader';
import { LOGIN_ROUTE} from '../Routes';

const AuthLayouts = () => {

    const { user, guard } = useAuth()
    const navigate = useNavigate()
    useEffect(() => { !user && navigate("/" + guard + LOGIN_ROUTE) }, [user])


    return (
        <>
            <_header />
            <main className='container'>
                <Outlet />
            </main>
            {/* <_footer /> */}
        </>
    )
}

export default AuthLayouts
