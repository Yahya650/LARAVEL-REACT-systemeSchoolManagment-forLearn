import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { axiosClient } from '../../api/axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import LoadingCircle from '../LoadingCircls/LoadingCircle';
import { ToastContainer, toast } from 'react-toastify';
import "jQuery/tmp/jquery";
import 'react-toastify/dist/ReactToastify.css';
import FormAddStudent from '../Student/FormAddStudent';
import { Input, Stack, Button, StackDivider } from '@chakra-ui/react';
import FormUpdateStudent from '../Student/FormUpdateStudent';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { DeleteIcon, EditIcon, ViewIcon, AddIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';




const AdminDashboard = () => {

    const { user, SendEmailverificationNotification, setReloadPage, guard } = useAuth()
    const [isLoadingDelete, setIsLoadingDelete] = useState(false); // Loading btn Delete
    const [isLoadingResetPass, setIsLoadingResetPass] = useState(false);
    const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
    const [Students, setStudents] = useState([]);
    const [Total, setTotal] = useState(null);

    const [reloadStudents, setReloadStudents] = useState(false); // loading while fetching data students
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)


    async function fetchData(ifWantLoading = true, currentPage = 1) {
        if (ifWantLoading) {
            setReloadStudents(true);
        }
        try {
            const { data } = await axiosClient.get('admin/all-students?page=' + currentPage);
            setTotal(data.total)
            setPageCount(data.last_page);
            setStudents(data.data);
        } catch (error) {
            withReactContent(Swal).fire({
                icon: "error",
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        } finally {
            setReloadStudents(false);
        }
    }

    useEffect(() => {
        fetchData();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
    }, [])

    const handlePageClick = async page => {
        setIsLoadingPaginate(true)
        const { selected } = page;
        const val_currentPage = selected + 1;
        await fetchData(false, val_currentPage);
        setCurrentPage(val_currentPage)
        setIsLoadingPaginate(false)
    }

    const resetPassword_student = async (id_student) => {
        setIsLoadingResetPass(true);
        try {
            const { data } = await axiosClient.put('admin/reset-password-student/' + id_student);
            withReactContent(Swal).fire({
                icon: "success",
                title: data.message,
                html: <div>Student: <b><i>{Students.filter(student => student.id === id_student)[0].name}</i> <br /> </b> New Password is: <b>{data.newPassword}</b></div>
            });
            fetchData(false, currentPage)

        } catch ({ response }) {
            if (response.status === 422) {
                toast.error(response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
            }
        } finally {
            setIsLoadingResetPass(false);
        }


    }

    const delete_student = async (id_student) => {

        Swal.fire({
            title: "Are you sure?",
            text: "are you sure you want to delete this student?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "green",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoadingDelete(true);
                try {
                    const { data } = await axiosClient.delete('admin/delete-student/' + id_student);
                    withReactContent(Swal).fire({
                        icon: "success",
                        title: data.message,
                    })
                    fetchData(false, currentPage)
                } catch ({ response }) {
                    if (response.status === 422) {
                        withReactContent(Swal).fire({
                            icon: "error",
                            title: 'Oops...',
                            text: response.data.message
                        })
                    }
                } finally {
                    setIsLoadingDelete(false);
                }
            }
        });


    }

    return (
        <div>
            <ToastContainer />
            <h1 className='text-center my-5'><b>Admin Dashboard</b></h1>

            {
                user &&
                <table className="table table-responsive table-dark my-5 table-hover">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>email_verified</th>
                            <th>created_at</th>
                            <th>updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>{user.id}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.email_verified_at ? 'true' : <div> false <a type="button" className='link-opacity-25-hover' onClick={async () => {
                                setReloadPage(true);
                                await SendEmailverificationNotification(guard);
                                setReloadPage(false);
                            }}>send verification link again</a></div>}</td>
                            <td>{user.created_at}</td>
                            <td>{user.updated_at}</td>
                        </tr>
                    </tbody>
                </table>
            }

            <div>
                <h1 className='text-center my-5'>This your all students</h1>
                <div className='d-flex justify-content-between'>
                    <button type="button" className="btn btn-primary mb-3 pb-2" data-bs-toggle="modal" data-bs-target="#addStudent">
                        <AddIcon />
                    </button>
                    <div className='ms-3'>You have: <b>{Total}</b> Student</div>
                    <div><Input onChange={(e) => { setStudents(Students.filter(student => student.name.toLowerCase().includes(e.target.value.toLowerCase()))); e.target.value === '' && fetchData(false, currentPage) }} type="text" name="search" id="" placeholder="Search by name" variant='filled' /></div>
                </div>
                <div className="modal fade" id="addStudent" tabIndex="-1" aria-labelledby="addStudentLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="addStudentLabel">Add Student</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <FormAddStudent fetchData={(e = true) => fetchData(e, currentPage)} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {
                !reloadStudents ?
                    <>
                        <table className="table table-responsive table-primary text-center position-relative">
                            {
                                isLoadingPaginate && <div className='position-absolute top-50 start-50 translate-middle'>
                                    <div>
                                        <CircularProgress isIndeterminate color='green.300' size={'100px'} />
                                    </div>
                                </div>
                            }
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>UserName</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>created_at</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Students.map((student, index) => (
                                        <tr key={index}>
                                            <th>{student.id}</th>
                                            <td>{student.name}</td>
                                            <td>{student.user_name}</td>
                                            <td>{student.sexe}</td>
                                            <td>{student.email}</td>
                                            <td>{new Date(student.created_at).toLocaleDateString() + ' ' + new Date(student.created_at).toLocaleTimeString()}</td>
                                            <td>
                                                {/* <div className="text-center"> */}
                                                <Stack direction='row' spacing={1} justify='center' divider={<StackDivider borderColor='gray.200' />} >
                                                    <Button
                                                        colorScheme='red'
                                                        id={"btnDelete" + student.id}
                                                        onClick={() => delete_student(student.id)}
                                                        isLoading={isLoadingDelete}
                                                        loadingText='Deleting'
                                                        spinnerPlacement='start'
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                    <Button
                                                        onClick={() => resetPassword_student(student.id)}
                                                        colorScheme='gray'
                                                        isLoading={isLoadingResetPass}
                                                        id={"btnDelete" + student.id}
                                                        loadingText='Reseting'
                                                        spinnerPlacement='start'
                                                    >
                                                        Reset Password
                                                    </Button>
                                                    <button className='btn btn-info' onClick={() => student.genereted_password ? withReactContent(Swal).fire('The Password is : ' + student.genereted_password) : withReactContent(Swal).fire({
                                                        icon: "warning",
                                                        text: 'No password generated yet'
                                                    })}><ViewIcon /> Password</button>
                                                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target={"#UpdateStudent" + student.id}>
                                                        <EditIcon />
                                                    </button>
                                                    <Link to={`/admin/show-student/${student.id}`}><button type="button" className="btn btn-primary"><ViewIcon /></button></Link>
                                                </Stack>
                                                {/* </div> */}
                                                {/* Modal for update Student */}
                                                <FormUpdateStudent student={student} fetchData={(e = true) => fetchData(e, currentPage)} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </> : <div className='w-100 d-flex justify-content-center align-items-center '><div><LoadingCircle /></div></div>
            }


            <ul className='my-5 py-5'> <b>dachi lli ghdi ndir lyom</b>
                <li>n7ayd lmchkil dyal ila kan user dakhl mn 2 dyal les page wa7dadayr fiha login wlakhra lla</li>
                <li>mchkil dyal delete</li>
                <li>nzid tswira l student</li>
                <li>khasni n7adad lwa9t dyal token f verify email, mchkil fl verifycation email admin</li>
            </ul>
        </div >
    )
}

export default AdminDashboard;

