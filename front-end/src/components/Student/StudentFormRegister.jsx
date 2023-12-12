import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Schema } from 'yup';
import * as yup from "yup";
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentFormRegister = () => {

    const auth = useAuth();

    const schema = yup.object({
        email: yup.string().required("Email is required").email("Email is invalid"),
        name: yup.string().matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field").required("first name is required").max(100, "max 100"),
        password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
    })


    const { register, handleSubmit, formState: { errors, isLoading, isSubmitting, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const submitData = async ({ name, email, password, password_confirmation, guard }) => {
        await auth.register({ name, email, password, password_confirmation, guard: 'student' });
    }

    const myStyle = {
        minHeight: '100vh',
    };

    return (
        <div className='d-flex justify-content-center align-items-center flex-column' style={myStyle}>
            {isLoading && <p className="alert alert-primary py-1 my-3 mt-5" role="alert">Form is Loading...</p>}
            {isSubmitting && <p className="alert alert-primary py-1 mt-5" role="alert">is Submitting... wait the response !</p>}
            {
                <form onSubmit={handleSubmit(submitData)} className='p-5' style={{ border: '1px solid black', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                    <h1 className='text-center mb-3'>Student Register</h1>
                    <div className="mb-3">
                        <label htmlFor="FirstName" className="form-label">Name</label>
                        <input type="text" {...register('name')} className={`form-control ${errors.firstname || auth.errors.name ? "is-invalid" : ""}`} id="FirstName" />
                        {
                            errors.name &&
                            <p className="text-danger">
                                {errors.name.message}
                            </p>
                        }
                        {
                            auth.errors.name &&
                            <p className="text-danger">
                                {auth.errors.name}
                            </p>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Emailaddress" className="form-label">Email address</label>
                        <input type="text" disabled={isSubmitting} {...register('email')} className={`form-control ${errors.email || auth.errors.email ? "is-invalid" : ""}`} id="Emailaddress" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        {
                            errors.email &&
                            <p className="text-danger">
                                {errors.email.message}
                            </p>
                        }
                        {
                            auth.errors.email &&
                            <p className="text-danger">
                                {auth.errors.email}
                            </p>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Password" className="form-label">Password</label>
                        <input type="password" disabled={isSubmitting} {...register('password')} className={`form-control ${errors.password || auth.errors.password ? "is-invalid" : ""}`} id="Password" />
                        {
                            errors.password &&
                            <p className="text-danger">
                                {errors.password.message}
                            </p>
                        }
                        {
                            auth.errors.password &&
                            <p className="text-danger">
                                {auth.errors.password}
                            </p>
                        }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Password" className="form-label">Password confirmation</label>
                        <input type="password" disabled={isSubmitting} {...register('password_confirmation')} className={`form-control ${errors.password_confirmation || auth.errors.password_confirmation ? "is-invalid" : ""}`} id="password_confirmation" />
                        {
                            auth.errors.password_confirmation &&
                            <p className="text-danger">
                                {auth.errors.password_confirmation}
                            </p>
                        }
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting && 'Loading...'} {!isSubmitting && 'Submit'}</button> <Link to={"/student/login"}>if you have account click here for login</Link>
                </form>
            }

        </div>
    )
}

export default StudentFormRegister;
