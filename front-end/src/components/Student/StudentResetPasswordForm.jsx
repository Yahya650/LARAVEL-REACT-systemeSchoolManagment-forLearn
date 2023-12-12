import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useParams, useSearchParams } from 'react-router-dom';


const StudentResetPasswordForm = () => {

    const auth = useAuth()
    const [searchParams] = useSearchParams()
    const { token } = useParams()

    const schema = yup.object({
        password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
        password_confirmation: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
    })

    const { register, handleSubmit, /* control, */ formState: { errors, isLoading, isSubmitSuccessful, isSubmitted, isSubmitting, isDirty, isValid, submitCount } } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onChange'
        });


    const submitForm = async ({ password_confirmation, password }) => {
        await auth.resetPassWord({ email: searchParams.get('email'), token, password_confirmation, password, guard: 'student' });
    }


    return (
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            {
                <>
                    {
                        auth.errors.email && <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>{auth.errors.email}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    }
                    {isLoading && <p className="alert alert-primary py-1 my-3 mt-5" role="alert">Form is Loading...</p>}
                    {
                        !isLoading && <form onSubmit={handleSubmit(submitForm)} className='p-5' style={{ border: '1px solid black', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                            <h1 className='text-center mb-3'>Reset Password student</h1>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">New Password</label>
                                <input type="text" {...register('password')} disabled={isSubmitting} className={`form-control ${errors.password || auth.errors.password ? "is-invalid" : ""}`} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                {errors.password && <><p className='text-danger'>{errors.password.message}</p><br /></>}
                                {auth.errors.password && <p className='text-danger'>{auth.errors.password}</p>}
                                <label htmlFor="exampleInputEmail1" className="form-label">Confirme Password</label>
                                <input type="text" {...register('password_confirmation')} disabled={isSubmitting} className={`form-control`} id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting && 'loading...'} {!isSubmitting && 'Reset'}</button>
                        </form>
                    }
                </>
            }

        </div>

    )

}

export default StudentResetPasswordForm
