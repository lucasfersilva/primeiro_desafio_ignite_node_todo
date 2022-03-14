const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers
  console.log(username)
  const user = users.find(user => user.username === username)
  
  if(!user){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  request.user = user
  
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name,username} = request.body;
  const userAlreadyExists = users.some(user => user.username === username)
  if(userAlreadyExists){
    return response.status(400).json({error: 'Usuário  já existe '})
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  };

  users.push(user);
 
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {user} = request

  const todo = {
    id: uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo)

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const {id} = request.params
  const todo = user.todos.find(todo => todo.id === id);
  console.log(todo)

  if (todo) {
    todo.title = title;
    todo.deadline = new Date(deadline);
    response.json(todo);
  } else {
    return response.status(404).json({ "error": 'Mensagem do erro' });
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const{id} = request.params;
  
  const IDtodo = user.todos.find(IDtodo => IDtodo.id === id)
  if(!IDtodo){
    return response.status(404).json({error:'todo not found'})
  }
  IDtodo.done = true
  return response.json(IDtodo)
  
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params
  console.log(id)

  const todoIndex = user.todos.findIndex(todoIndex => todoIndex.id === id) 

  if(todoIndex === -1){
    return response.status(404).json({error:'todo not found'})
  }
  user.todos.splice(todoIndex, 1)
  return response.status(204).json()
});

module.exports = app;