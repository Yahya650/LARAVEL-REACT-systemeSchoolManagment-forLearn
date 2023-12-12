import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// import { STUDENT_DASHBOARD_ROUTE } from '../Routes'
import { DASHBOARD_ROUTE } from '../App'

const Home = () => {

    const { user } = useAuth()
    const navigate = useNavigate()
    useEffect(() => { user && navigate("/student/" + DASHBOARD_ROUTE) }, [user])

    return (
        <div className='container w-100 d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
            <Link to={"/admin/login"}>
                <div className="card text-bg-dark m-2">
                    <img src="/Images/Home/admin.png" className="card-img" alt="..." style={{ width: "350px" }} />
                    <div className="card-img-overlay">
                        <h5 className="card-title">Admin</h5>
                    </div>
                </div>
            </Link>

            <Link to={"/student/login"}>
                <div className="card text-bg-dark m-2">
                    <img src="/Images/Home/student.png" className="card-img" alt="..." style={{ width: "350px" }} />
                    <div className="card-img-overlay">
                        <h5 className="card-title">Student</h5>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Home
