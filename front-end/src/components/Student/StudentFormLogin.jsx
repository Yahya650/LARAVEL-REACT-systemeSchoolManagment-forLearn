import React, { useEffect, useState } from 'react'
// import { axiosClient } from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import { LOGIN_ROUTE, STUDENT_DASHBOARD_ROUTE } from '../Routes';
import { useForm } from 'react-hook-form';
// import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';


const myStyle = {
    minHeight: '80vh',
};



const StudentFormLogin = () => {

    const auth = useAuth()

    const schema = yup.object({
        email_or_username: yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$|^[a-zA-Z0-9_]+$/, "Invalid email or username"),
        password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(12, ""),
    })


    const { register, handleSubmit, /* control, */ formState: { errors, isLoading, isSubmitSuccessful, isSubmitted, isSubmitting, isDirty, isValid, submitCount } } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onChange'
        });

    const submitForm = async ({ email_or_username, password }) => {
        await auth.login({ email: email_or_username, password, guard: 'student' })
    };


    return (
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            {isSubmitting && <p className="alert alert-primary py-1 mt-5" role="alert">is Submitting... wait the response !</p>}
            {
                <>
                    {isLoading && <p className="alert alert-primary py-1 my-3 mt-5" role="alert">Form is Loading...</p>}
                    {
                        auth.status.type === 'success' &&
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>{auth.status.msg}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    }
                    {
                        !isLoading && <form onSubmit={handleSubmit(submitForm)} className='p-5' style={{ border: '1px solid black', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                            <h1 className='text-center mb-3'>Student Login</h1>
                            <div className="mb-3">
                                <label htmlFor="email_or_username" className="form-label">Email / UserName</label>
                                <input {...register('email_or_username')} disabled={isSubmitting} type="text" className={`form-control ${errors.email_or_username || auth.errors.email_or_username ? "is-invalid" : ""}`} id="email_or_username" />
                                {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                                {errors.email_or_username && <><span className='text-danger'>{errors.email_or_username.message}</span><br /></>}
                                {auth.errors.email_or_username && <span className='text-danger'>{auth.errors.email_or_username}</span>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Password" className="form-label">Password</label>
                                <input {...register('password')} disabled={isSubmitting} type="text" className={`form-control ${errors.password || auth.errors.password ? "is-invalid" : ""}`} id="Password" />
                                {errors.password && <><span className='text-danger'>{errors.password.message}</span><br /></>}
                                {auth.errors.password && <span className='text-danger'>{auth.errors.password}</span>}
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting && 'Loading...'} {!isSubmitting && 'Submit'}</button>
                            {/* <Link to={"/student/register"}>if you dont have account click here for create it</Link> */}
                            <br />
                            <p>if you dont have email in you account, contact with admin for give you new password</p>
                            <p>if you have email click here for create new password<Link className="link-opacity-25-hover" to={'/student/forgot-password'}> Forgot Password ? </Link></p>
                        </form>
                    }
                </>
            }
        </div>
    )
}


export default StudentFormLogin;