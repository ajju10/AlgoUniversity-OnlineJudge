import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await axios.get('http://localhost:8000/get/problems', {
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('token'),
        },
      });
      setProblems(res.data.result);
    };
    fetchProblems().then(() => {
    });
  }, []);

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Title</Table.HeadCell>
        <Table.HeadCell>Submissions</Table.HeadCell>
        <Table.HeadCell>Difficulty</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>
      <Table.Body className='divide-y'>
        {problems.map((problem) => {
          return (
            <Table.Row key={problem._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                <Link to={`/problems/${problem.code}`}>{problem.name}</Link>
              </Table.Cell>
              <Table.Cell>100</Table.Cell>
              <Table.Cell>{problem.difficulty}</Table.Cell>
              <Table.Cell>Submitted</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}