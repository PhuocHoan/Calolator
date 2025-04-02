import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold text-center mb-6'>Calculator</h1>
        <h2 className='text-2xl font-semibold text-center mb-4'>
          Tạo một tài khoản
        </h2>
        <RegisterForm />
        <p className='mt-4 text-center'>
          Đã có tài khoản?{' '}
          <a href='/login' className='text-blue-500'>
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
