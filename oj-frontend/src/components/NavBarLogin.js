'use client';

import { Navbar } from 'flowbite-react';

import logo from '../logo.svg';

export default function NavBarLogin() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  return (
    <Navbar fluid rounded className='bg-teal-400'>
      <Navbar.Brand href='/'>
        <img src={logo} className='mr-3 h-6 sm:h-9' alt='logo' />
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          Online Judge
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href='/problems'>Problems</Navbar.Link>
        <div className='columns-2'>
          <Navbar.Link href='#'>{localStorage.getItem('email')}</Navbar.Link>
          <Navbar.Link href='/' onClick={handleLogout}>Logout</Navbar.Link>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
