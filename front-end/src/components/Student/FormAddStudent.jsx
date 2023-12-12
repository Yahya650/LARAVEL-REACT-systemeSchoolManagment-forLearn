import React, { useState } from 'react';
import { Input, Stack, Button } from '@chakra-ui/react';
import { axiosClient } from '../../api/axios';
import { toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const FormAddStudent = ({fetchData}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        userName: '',
        gender: '',
    });

    const handleSubmitAddStudent = async (e) => {
        e.preventDefault();

        // Check for validation errors
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axiosClient.post('admin/create-student', {
                name_add: name,
                userName_add: userName,
                sexe_add: gender,
            });

            setName('')
            setUserName('')
            setGender('')
            setErrors({
                name: '',
                userName: '',
                gender: '',
            })

            fetchData(false);
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

        } catch (error) {
            console.log(error);
            if (error.response.status === 422) {
                withReactContent(Swal).fire({
                    icon: "error",
                    title: 'Oops...',
                    text: error.response.data.message
                })
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
            errors.name_update = 'Only alphabets are allowed for this field';
        }

        if (!userName.trim()) {
            errorsObj.userName = 'Username is required';
        } else if (userName.length < 3) {
            errorsObj.userName = 'Username must be at least 3 characters long';
        }

        if (!gender) {
            errorsObj.gender = 'Please select a gender';
        }

        setErrors(errorsObj);

        return Object.keys(errorsObj).length === 0;
    };

    return (
        <form onSubmit={handleSubmitAddStudent}>
            <h3>Add Student</h3>
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
                <label htmlFor="userName">Username</label>
                <Input
                    focusBorderColor=''
                    type="text"
                    disabled={true}
                    id="userName"
                    name='userName'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder='Username'
                    isInvalid={!!errors.userName}
                />
                <a className='link-opacity-25-hover' type='button' onClick={async () => { const { data: { user_name } } = await axiosClient.get('admin/generate-username'); setUserName(user_name + '@student.ma'); }}>Generate unique user name</a>
                <p className='text-danger'>{errors.userName}</p>
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
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
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
                    Save
                </Button>
            </Stack>
        </form>
    );
};

export default FormAddStudent;
