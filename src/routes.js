const {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  editDataBookHandler,
  deleteBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBookHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editDataBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
  },
];

module.exports = routes;
