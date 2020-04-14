const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositório não encontrado' });
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;
  const { url, title, techs } = request.body;

  const repository = {
    ...repositories[repositoryIndex],
    url,
    title,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete('/repositories/:id', checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post(
  '/repositories/:id/like',
  checkRepositoryExists,
  (request, response) => {
    const { repositoryIndex } = request;

    repositories[repositoryIndex].likes += 1;

    return response.status(200).json(repositories[repositoryIndex]);
  }
);

module.exports = app;
