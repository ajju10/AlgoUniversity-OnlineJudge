'use client';

import { Button, Card, Label, TextInput } from 'flowbite-react';
import axios from 'axios';

async function onSignUp(e) {
  e.preventDefault();
  const data = JSON.stringify({
    email: e.target.email1.value,
    password: e.target.password1.value,
  });
  const res = await axios.post('http://localhost:8000/signup', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log(res.data);
  // Redirect to login page
  window.location.href = '/login';
}

export default function Signup() {
  return (
    <div className='flex justify-center items-center bg-zinc-300 h-screen'>
      <Card className='max-w-sm'>
        <form className='flex flex-col gap-4' onSubmit={onSignUp}>
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
          <Button type='submit'>Sign Up</Button>
        </form>
      </Card>
    </div>
  );
}