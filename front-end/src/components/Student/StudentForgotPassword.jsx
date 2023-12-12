import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { Await } from 'react-router-dom';



const StudentForgotPassword = () => {

    const auth = useAuth()


    const schema = yup.object({
        email: yup.string().required("Email is required").email("Email is invalid"),
    })

    const { register, handleSubmit, /* control, */ formState: { errors, isLoading, isSubmitSuccessful, isSubmitted, isSubmitting, isDirty, isValid, submitCount } } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onChange'
        });


    const submitForm = async ({ email }) => {
        await auth.forgotPassWord('student', email);

    }

    return (
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            {
                <>
                    {
                        auth.status.type === 'success' &&
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>{auth.status.msg}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    }
                    {
                        auth.status.type === 'error' &&
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>{auth.status.msg}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    }
                    {isLoading && <p className="alert alert-primary py-1 my-3 mt-5" role="alert">Form is Loading...</p>}
                    {
                        !isLoading && <form onSubmit={handleSubmit(submitForm)} className='p-5' style={{ border: '1px solid black', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                            <h1 className='text-center mb-3'>Reset Password student</h1>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" {...register('email')} disabled={isSubmitting} className={`form-control ${errors.email || auth.errors.email ? "is-invalid" : ""}`} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                {errors.email && <><span className='text-danger'>{errors.email.message}</span><br /></>}
                                {auth.errors.email && <span className='text-danger'>{auth.errors.email}</span>}
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting && 'loading...'} {!isSubmitting && 'Send'}</button>
                        </form>
                    }
                </>
            }

        </div>

    )
}

export default StudentForgotPassword
