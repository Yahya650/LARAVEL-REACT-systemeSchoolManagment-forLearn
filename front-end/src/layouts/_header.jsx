import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// import { ADMIN_DASHBOARD_ROUTE } from '../App'
// import { STUDENT_DASHBOARD_ROUTE } from '../Routes'
import { useEffect } from 'react'
import { DASHBOARD_ROUTE } from '../App'

const _header = () => {

    const { logout, guard } = useAuth()
    // useEffect(() => console.log(guard), [guard])
    // console.log(guard);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">

                <NavLink className="navbar-brand" to={'/'}>{guard === 'student' && 'Student Navbar'} {guard === 'admin' && 'Admin Navbar'}{!guard && 'NavBar'}</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            {/* <NavLink className="nav-link" to={"/"}>Home</NavLink> */}
                        </li>
                        {

                            guard &&
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={guard === 'admin' ? "/admin/" + DASHBOARD_ROUTE : "/student/" + DASHBOARD_ROUTE}>Dashboard</NavLink>
                                </li>
                                {
                                    guard === 'student' &&
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to={"/student/profile"}>Profile</NavLink>
                                        </li>
                                    </>
                                }

                                <li className="nav-item">
                                    <button className='btn btn-danger' onClick={() => logout(guard)}>logout</button>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default _header
