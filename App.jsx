import { useState, useEffect } from 'react'
import Todo from './models/todo.js'
import deleteIcon from './assets/delete.svg'
import editIcon from './assets/edit.svg'
import axios from 'axios'

function App() {
  const [data, setData] = useState("")
  const [todos, setTodos] = useState([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let response = await fetch("http://localhost:5000/api/todos")
        let d = await response.json()
        setTodos(d)
      } catch (err) {
        console.log(err);
      }
    }
    fetchAllData()
  }, [setTodos])

  const handleSave = async () => {
    if (data.trim() === '') return;
    const newTodo = new Todo({ isCompleted: false, desc: data, isStarred: false });
    setTodos([...todos, newTodo]);
    setData('');
    try {
      await axios.post('http://localhost:5000/api/todos', newTodo);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    setData(todo.desc);
    handleDelete(id)
  }

  const handleDelete = async (id) => {
    const newTodos = todos.filter((todo) => todo._id !== id);
    setTodos(newTodos);
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleToggleCompleted = async (id, checked) => {
    if (checked === true) {
      const newTodos = todos.filter((todo) => todo._id != id)
      setTodos(newTodos)
      setCompleted(false)
      await axios.delete(`http://localhost:5000/api/todos/${id}`)
    }
  }


  return (
    <>
      <div className="main-container lg:h-[500px] lg:w-[800px] sm:h-screen sm:w-screen md:h-screen md:w-screen bg-white rounded-md flex flex-col items-center">
        <div className="input-section mt-3 w-full flex items-center justify-center">
          <input type="text" value={data} onChange={(e) => setData(e.target.value)} className='bg-transparent w-1/2 text-black focus:outline-[#B1AFFF] p-1' placeholder='Type here' />
          <button className='ml-1 bg-blue-200 p-1 text-center rounded-md' onClick={handleSave}>Save</button>
        </div>

        <div className="todos flex flex-col gap-2 w-full mt-3 h-full overflow-y-scroll mb-2">
          {todos.map(todo => {
            return (
              <div key={todo._id} className="todo flex justify-between w-[85%] mx-auto items-center bg-[#EEEEEE] box-border p-1 rounded-sm relative">
                <div className='flex gap-2 items-center'>
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => {
                      setCompleted(!completed)
                      handleToggleCompleted(todo._id, e.target.checked)
                    }}
                  />
                  <p>{todo.desc}</p>
                </div>
                <div className="buttons w-fit">
                  <button className='p-1 rounded-full hover:bg-blue-400 mr-2' onClick={() => handleEdit(todo._id)}><img src={editIcon} alt="edit" /></button>
                  <button className='p-1 rounded-full hover:bg-blue-400' onClick={() => handleDelete(todo._id)}><img src={deleteIcon} alt="delete" /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
export default App
