import { Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Problem from './components/Problem';
import NotFound from './components/NotFound';
import ProblemList from './components/ProblemList';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/problems'>
          <Route index element={<ProblemList />} />
          <Route path=':id' element={<Problem />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
