'use client';

import { useParams } from 'react-router-dom';
import { Button, FileInput, Label, Table, Tabs } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MarkdownEditor from '@uiw/react-markdown-editor';
import NavBarLogin from './NavBarLogin';
import NavBarLogout from './NavBarLogout';
import { getFileType, getInitialMDText } from '../utils';

export default function Problem() {
  const { id } = useParams();
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('');
  const [results, setResults] = useState([]);
  const [problemData, setProblemData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const isLoggedIn = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProblemDetails()
      .then((res) => {
        console.log(res);
        // Fetch submission details here
        fetchSubmissionDetails()
          .catch(err => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const onFileChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      let language = getFileType(file.name);
      setLanguage(language);
      let text = getInitialMDText(language);
      const content = await file.text();
      const mdContent = '```' + text + '\n' + content + '\n```';
      setSourceCode(mdContent);
    } else {
      setSourceCode('');
      setLanguage('');
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile === null) {
      alert('Please select a file first');
    } else {
      try {
        const form = new FormData();
        form.append('title', 'My Code File');
        form.append('file', selectedFile);
        form.append('email', localStorage.getItem('email'));

        const res = await axios.post(
          `${apiUrl}/problem/${id}/upload`,
          form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: isLoggedIn,
            },
          },
        );
        alert(res.data.verdict);
      } catch (e) {
        alert(`${language.toUpperCase()} is not supported yet.`);
      }
    }
  };

  const fetchProblemDetails = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
    const res = await axios.get(`${apiUrl}/get/problem/${id}`, {
      headers: {
        Authorization: isLoggedIn,
      },
    });
    setProblemData(res.data);
  };

  const fetchSubmissionDetails = async () => {
    const email = localStorage.getItem('email');
    const res = await axios.get(`${apiUrl}/get/problem/${id}/${email}/submission`, {
      headers: {
        Authorization: isLoggedIn,
      },
    });
    const submissions = res.data.submissions;
    setResults(submissions);
  };

  return (
    <>
      {isLoggedIn ? <NavBarLogin /> : <NavBarLogout />}
      <div className='container mx-auto'>
        <Tabs aria-label='Tabs with underline' style='underline'>
          <Tabs.Item active title='Task'>
            <div className='container'>
              <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                {problemData.name}
              </h5>
              <p className='font-normal text-gray-700 dark:text-gray-400'>
                {problemData.statement}
              </p>
            </div>
          </Tabs.Item>
          <Tabs.Item title='Submit'>
            <div className='flex flex-col gap-4'>
              <div id='fileUpload' className='max-w-md'>
                <div className='mb-2 block'>
                  <Label htmlFor='file' value='Upload file' />
                </div>
                <FileInput
                  id='file'
                  onChange={onFileChange}
                />
                <br />
                <Button onClick={handleFileUpload}>Submit</Button>
              </div>

              <div>
                <h2>{language}</h2>
                <MarkdownEditor.Markdown source={sourceCode} height='400px' />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title='Submissions'>
            <Table>
              <Table.Head>
                <Table.HeadCell>Timestamp</Table.HeadCell>
                <Table.HeadCell>Language</Table.HeadCell>
                <Table.HeadCell>Result</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {results.map((result) => {
                  return (
                    <Table.Row
                      key={result._id}
                      className='bg-white dark:border-gray-700 dark:bg-gray-800'
                    >
                      <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                        {result.createdAt}
                      </Table.Cell>
                      <Table.Cell>{result.language}</Table.Cell>
                      <Table.Cell>{result.verdict}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Tabs.Item>
        </Tabs>
      </div>
    </>
  );
}
