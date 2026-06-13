import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import TodoItem from '../components/TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeSnapshot;

    // Ensure the user is logged in
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
        unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ id: doc.id, ...doc.data() });
          });
          setTodos(todosArray);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [navigate]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        createdAt: serverTimestamp()
      });
      setNewTodo('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        completed: !todo.completed
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="todo-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>To-Do List</h2>
        <button onClick={handleLogout} className="btn-secondary" style={{padding: '6px 12px', fontSize: '14px'}}>Logout</button>
      </div>
      <form onSubmit={addTodo} className="todo-form">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>
      
      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={() => toggleComplete(todo)} 
            onDelete={() => deleteTodo(todo.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
