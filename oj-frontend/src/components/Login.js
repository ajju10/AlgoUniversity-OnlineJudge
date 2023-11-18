import axios from 'axios'
import { Card, Label, TextInput, Checkbox, Button } from 'flowbite-react'

async function onSignIn(e) {
  console.log('Sign In Clicked on submit')
  console.log('Email:', e.target.email1.value)
  console.log('Password:', e.target.password1.value)
  e.preventDefault()
  const data = JSON.stringify({
    email: e.target.email1.value,
    password: e.target.password1.value,
  });
  const res = await axios.post('http://localhost:8000/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(res.data);
  // Save token in local storage
  localStorage.setItem('token', res.data.result.token);
  // Redirect to problems page
  window.location.href = '/problems';
}

export default function Login() {
  return (
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
        <div className='flex items-center gap-2'>
          <Checkbox id='remember' />
          <Label htmlFor='remember'>Remember me</Label>
        </div>
        <Button type='submit'>Sign In</Button>
      </form>
    </Card>
  )
}
