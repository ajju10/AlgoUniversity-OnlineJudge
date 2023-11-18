'use client';

import { Card } from 'flowbite-react';

import logo192 from '../assets/logo192.png';
import NavBarLogout from './NavBarLogout';
import NavBarLogin from './NavBarLogin';

export default function Home() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <>
      {isLoggedIn ? <NavBarLogin /> : <NavBarLogout />}
      <div className='grid grid-rows-4 grid-flow-col gap-7 bg-zinc-300'>
        <div className='flex justify-center'>
          <img src={logo192} alt='logo' />
        </div>
        <div className='flex justify-center'>
          <Card className='w-auto bg-green-200'>
            <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Welcome to Online Judge
            </h5>
            <p className='font-normal text-gray-700 dark:text-gray-400'>
              Built using MERN (MongoDB, Express, React, Node.js) stack.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
