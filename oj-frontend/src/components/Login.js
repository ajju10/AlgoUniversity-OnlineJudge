'use client';

import axios from 'axios';
import { Card, Label, TextInput, Button } from 'flowbite-react';

async function onSignIn(e) {
  const apiUrl = process.env.REACT_APP_API_URL;

  e.preventDefault();
  const data = JSON.stringify({
    email: e.target.email1.value,
    password: e.target.password1.value,
  });

  try {
    const res = await axios.post(`${apiUrl}/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    localStorage.setItem('token', res.data.result.token);
    localStorage.setItem('email', e.target.email1.value);
    // Redirect to home page
    window.location.href = '/';
  } catch (e) {
    console.log(e);
    alert(e.toString());
  }
}

export default function Login() {
  return (
    <div className='flex justify-center items-center bg-zinc-300 h-screen'>
      <Card className='max-w-sm'>
        <form className='flex flex-col gap-4' onSubmit={onSignIn}>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='email1' value='Your email' />
            </div>
            <TextInput
              id='email1'
              type='email'
              placeholder='abc@xyz.com'
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='password1' value='Your password' />
            </div>
            <TextInput id='password1' type='password' required />
          </div>
          <Button type='submit'>Sign In</Button>
        </form>
      </Card>
    </div>
  );
}
