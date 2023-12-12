import React, { useState } from 'react';
import { Input, Stack, Button, FormErrorMessage } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { axiosClient } from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,

} from '@chakra-ui/react'

const StudentProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: null });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');




  const { user, setUser } = useAuth();

  const handleSubmit_addEmail = async (e) => {
    e.preventDefault();

    // Check for email validation errors
    if (!validateEmail(email)) {
      return;
    }


    setIsLoading(true);

    try {
      const { data } = await axiosClient.post('student/add-email', { id: user.id, email });
      toast.success(data.message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      setUser(data.student);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        withReactContent(Swal).fire({
          icon: 'error',
          title: error.response.data.message,
        });
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit_changePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword, confirmNewPassword)) {
      return;
    }
    if (oldPassword === newPassword) {
      toast.error('New password cannot be the same as old password', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    if (oldPassword === '') {
      toast.error('Please enter your old password', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axiosClient.post('student/change-password', {
        id: user.id,
        oldPassword,
        newPassword,
        confirmNewPassword,
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
      setUser(data.student);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        withReactContent(Swal).fire({
          icon: 'error',
          title: error.response.data.message,
        });
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setIsLoading(false);
    }

  };

  const validatePassword = (newPwd, confirmPwd) => {
    const errorsObj = {};

    if (newPwd.length < 6) {
      errorsObj.newPassword = 'New password must be at least 6 characters long';
    }

    if (newPwd !== confirmPwd) {
      errorsObj.confirmNewPassword = 'Passwords do not match';
    }

    setErrors(errorsObj);

    return Object.keys(errorsObj).length === 0;
  };



  return (
    <div>
      <h1 className='mb-5'>StudentProfile</h1>

      <Accordion allowToggle defaultIndex={[1]}>
        <AccordionItem >
          <h2>
            <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }}>
              <Box as="span" flex='1' textAlign='left'>
                <h1 className={'text-center text-body-secondary'}><i>Password Recovery Information</i></h1>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={10}>
            <div className='mt-5 border-3 p-2 rounded'>
              <form onSubmit={handleSubmit_addEmail}>
                <h3 className='border-bottom'>Password Recovery Information</h3>
                <label htmlFor='email'><h6>Please enter your email address</h6></label>
                <div className="mb-3">
                  <Input
                    focusBorderColor=''
                    disabled={isLoading}
                    id="email"
                    name='email'
                    defaultValue={user && user.email ? user.email : ''}
                    onChange={(e) => {
                      const newEmail = e.target.value;
                      setEmail(newEmail);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: validateEmail(newEmail) ? '' : 'Please enter a valid email address',
                      }));
                    }}
                    placeholder='Email'
                    isInvalid={!!errors.email}
                  />
                  {errors.email && <p className='text-danger'>{errors.email}</p>}
                  <div id="emailHelp" className="form-text">This email is used in case of password loss.</div>
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
            </div>

          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton  _expanded={{ bg: 'tomato', color: 'white' }}>
              <Box as="span" flex='1' textAlign='left'>
                <h1 className={'text-center text-body-secondary'}><i>Change Password</i></h1>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <div className='mt-5 border-3 p-2 rounded'>
              <form onSubmit={handleSubmit_changePassword}>
                <h3>Password Change</h3>
                <div className="mb-3">
                  <label htmlFor="oldPassword">old Password</label>
                  <Input
                    focusBorderColor=''
                    type="password"
                    disabled={isLoading}
                    id="oldPassword"
                    name='oldPassword'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder='Old Password'
                  />
                  <p className='text-danger'>{errors.oldPassword}</p>

                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword">New Password</label>
                  <Input
                    focusBorderColor=''
                    type="password"
                    disabled={isLoading}
                    id="newPassword"
                    name='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New Password'
                    isInvalid={!!errors.newPassword}
                  />
                  <p className='text-danger'>{errors.newPassword}</p>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <Input
                    focusBorderColor=''
                    type="password"
                    disabled={isLoading}
                    id="confirmNewPassword"
                    name='confirmNewPassword'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder='Confirm New Password'
                    isInvalid={!!errors.confirmNewPassword}
                  />
                  <p className='text-danger'>{errors.confirmNewPassword}</p>
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
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <ToastContainer />


    </div>
  );
};

export default StudentProfile;
