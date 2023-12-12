import React, { useEffect, useState } from 'react';
import { Input, Stack, Button, } from '@chakra-ui/react';
import { axiosClient } from '../../api/axios';
import { toast } from 'react-toastify';

const FormUpdateStudent = ({ student, fetchData }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(student.name);

    const [gender, setGender] = useState(student.sexe);

    const [errors, setErrors] = useState({
        name: '',
        gender: '',
    });

    useEffect(() => {
        setName(student.name)
        setGender(student.sexe)
    }, [student])

    const handleSubmitUpdateStudent = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axiosClient.put(`admin/update-student/${student.id}`, {
                name_update: name,
                sexe_update: gender,
            });

            toast.success(data.message, {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });

            fetchData(false);

            setName(data.student.name)
            setGender(data.student.sexe)
            setErrors({
                name: '',
                gender: '',
            })
        } catch (error) {
            if (error.response.status === 422) {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errorsObj = {};

        if (!name.trim()) {
            errorsObj.name = 'Name is required';
        } else if (name.length < 3) {
            errorsObj.name = 'Name must be at least 3 characters long';
        } else if (!/^[a-zA-Z ]+$/.test(name)) {
            errorsObj.name = 'Only alphabets are allowed for this field';
        }

        if (!gender) {
            errorsObj.gender = 'Please select a gender';
        }

        setErrors(errorsObj);

        return Object.keys(errorsObj).length === 0;
    };

    return (
        <div className="modal fade" id={"UpdateStudent" + student.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Student update</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-start">
                        {/* <FormUpdateStudent student={student} fetchData={(e = true) => fetchData(e)} /> */}
                        <form onSubmit={handleSubmitUpdateStudent}>
                            <h3>Update Student Information</h3>
                            <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <Input

                                    focusBorderColor=''
                                    type="text"
                                    disabled={isLoading}
                                    id="name"
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Name'
                                    isInvalid={!!errors.name}

                                />
                                <p className='text-danger'>{errors.name}</p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender">Gender</label>
                                <Input
                                    focusBorderColor=''
                                    as='select'
                                    disabled={isLoading}
                                    id="gender"
                                    name='gender'
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    isInvalid={!!errors.gender}
                                >
                                    <option value='' disabled>Select Gender</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                </Input>
                                <p className='text-danger'>{errors.gender}</p>
                            </div>
                            <Stack direction='row' spacing={4}>
                                <Button
                                    {...isLoading ? { isLoading } : null}
                                    loadingText='Submitting'
                                    type='submit'
                                    colorScheme='teal'
                                    variant='outline'
                                >
                                    Update
                                </Button>
                            </Stack>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FormUpdateStudent;