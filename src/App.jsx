import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLogin from './pages/TeacherLogin';
import StudentSignup from './pages/StudentSignup';
import TodoList from './pages/TodoList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<TeacherLogin />} />
          <Route path="/signup" element={<StudentSignup />} />
          <Route path="/todos" element={<TodoList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
