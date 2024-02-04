import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBarLogin from './NavBarLogin';
import NavBarLogout from './NavBarLogout';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const isLoggedIn = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("API URL", apiUrl);

  const fetchProblems = async () => {
    const res = await axios.get(`${apiUrl}/get/problems`);
    setProblems(res.data.result);
  };

  useEffect(() => {
    fetchProblems()
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      {isLoggedIn ? <NavBarLogin /> : <NavBarLogout />}
      <div className='container mx-auto mt-2 mb-2'>
        <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Problem Set
        </h5>
      </div>
      <div className='container mx-auto'>
        <Table className='table-auto'>
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Total Submissions</Table.HeadCell>
            <Table.HeadCell>Difficulty</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {problems.map((problem) => {
              return (
                <Table.Row key={problem._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                    <Link to={`/problems/${problem.code}`}>{problem.name}</Link>
                  </Table.Cell>
                  <Table.Cell>{problem.totalSubmissions}</Table.Cell>
                  <Table.Cell>{problem.difficulty}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}