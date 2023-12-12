import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import PasswordInput from '../../chakra_components/Inputs'

const StudentDashboard = () => {

    const { user } = useAuth()

    return (
        <div>
            <h1 className='text-center my-5'>Student Dashboard</h1>
            {
                user &&
                <table className="table table-dark my-5 table-hover">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">UserName</th>
                            <th scope="col">Gender</th>
                            <th scope="col">updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>{user.id}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.user_name}</td>
                            <td>{user.sexe}</td>
                            <td>{user.updated_at}</td>
                        </tr>
                    </tbody>
                </table>
            }

            {/* {
                user && <>
                    {JSON.stringify(user)}
                </>
            } */}

        </div>
    )
}

export default StudentDashboard;
