import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosClient } from '../../api/axios'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import LoadingCircle from '../LoadingCircls/LoadingCircle'

const AdminShowStudent = () => {


    const { id } = useParams()

    const [student, setStudent] = useState({})
    // isLoading
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        async function fetchData() {
            try {
                const { data } = await axiosClient.get('admin/show-student/' + id)
                setStudent(data)
            } catch ({ response }) {
                if (response.status === 422) {
                    setError(response.data.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        error && withReactContent(Swal).fire({
            icon: 'error',
            title: 'Oops...',
            text: error
        })
    }, [])

    return (
        <div>
            <h1 className='text-center my-5'>Student</h1>
            {
                !isLoading ?
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
                            <th>{student.id}</th>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.user_name}</td>
                            <td>{student.sexe}</td>
                            <td>{student.updated_at}</td>
                        </tr>
                    </tbody>
                </table> : <div className='w-100 d-flex justify-content-center align-items-center h-100'><div><LoadingCircle /></div></div>
            }
        </div>
    )
}

export default AdminShowStudent
