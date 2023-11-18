import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import ProblemList from './components/ProblemList';
import Problem from './components/Problem';
import NotFound from './components/NotFound';

function App() {
  const [token, setToken] = useState('');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/problems">
          <Route index element={<ProblemList />} />
          <Route path=":id" element={<Problem />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
