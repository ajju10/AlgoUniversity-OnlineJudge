'use client';

import { useParams } from 'react-router-dom';
import { Button, FileInput, Label } from 'flowbite-react';
import { useState } from 'react';
import axios from 'axios';

export default function Problem() {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const form = new FormData();
      form.append('title', 'My Code File');
      form.append('file', selectedFile);
      form.append('email', localStorage.getItem('email'));

      const res = await axios.post(`http://localhost:8000/problem/${id}/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      console.log(res.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div id='fileUpload' className='max-w-md'>
      <div className='mb-2 block'>
        <Label htmlFor='file' value='Upload file' />
      </div>
      <FileInput
        id='file'
        helperText='Upload C++ File'
        onChange={onFileChange}
      />
      <Button onClick={handleFileUpload}>Submit</Button>
    </div>
  );
}
