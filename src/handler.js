const { nanoid } = require('nanoid');
const books = require('./books');

/* CONSTANT */
const responseFailInvalidId = {
  status: 'fail',
  message: 'Buku gagal dihapus. Id tidak ditemukan',
};

const responseFailEditBookInvalidId = {
  status: 'fail',
  message: 'Gagal memperbarui buku. Id tidak ditemukan',
};

const responseFailInvalidName = {
  status: 'fail',
  message: 'Gagal memperbarui buku. Mohon isi nama buku',
};

const responseFailInvalidPage = {
  status: 'fail',
  message:
  'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
};

const responseFailAddBook = {
  status: 'fail',
  message: 'Gagal menambahkan buku. Mohon isi nama buku',
};

const responseFailAddBookInvalidPage = {
  status: 'fail',
  message:
  'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
};

const responseFailGeneral = {
  status: 'fail',
  message: 'Buku tidak ditemukan',
};

const responseFailAddBookGeneral = {
  status: 'fail',
  message: 'Buku gagal ditambahkan',
};

const responseSuccessDeleteBook = {
  status: 'success',
  message: 'Buku berhasil dihapus',
};

const responseSuccessEditBook = {
  status: 'success',
  message: 'Buku berhasil diperbarui',
};

/* REUSABLE FUNCTION */
function formattedBooks(rawBooks) {
  return rawBooks.map((bookItem) => ({
    id: bookItem.id,
    name: bookItem.name,
    publisher: bookItem.publisher,
  }));
}

function getAllFormattedBooks() {
  return {
    books: formattedBooks(books),
  };
}

/* HANDLER FUNCTION */
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response(responseFailInvalidId);
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response(responseSuccessDeleteBook);
  response.code(200);
  return response;
};

const editDataBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  if (!name) {
    const response = h.response(responseFailInvalidName);
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response(responseFailInvalidPage);
    response.code(400);
    return response;
  }
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response(responseSuccessEditBook);
    response.code(200);
    return response;
  }
  const response = h.response(responseFailEditBookInvalidId);
  response.code(404);
  return response;
};

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((item) => item.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: {
          id: book.id,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response(responseFailGeneral);
  response.code(404);
  return response;
};

const getAllBooksHandler = (request, h) => {
  if (books.length > 0) {
    const { name, reading, finished } = request.query;
    const isNameQueried = name !== undefined;
    const isReadingQueried = reading !== undefined;
    const isFinishedQueried = finished !== undefined;
    if (isNameQueried) {
      const booksFilteredName = books.filter((book) => {
        const nameItemBookLowerCase = book.name.toLowerCase();
        const nameQueryBookLowerCase = name.toLowerCase();
        return nameItemBookLowerCase.includes(nameQueryBookLowerCase);
      });
      const response = h.response({
        status: 'success',
        data: {
          books: formattedBooks(booksFilteredName),
        },
      });
      response.code(200);
      return response;
    } else if (isReadingQueried) {
      if (reading === '0') {
        const unreadingBooks = books.filter((book) => book.reading === false);
        const response = h.response({
          status: 'success',
          data: {
            books: formattedBooks(unreadingBooks),
          },
        });
        response.code(200);
        return response;
      } else if (reading === '1') {
        const readingBooks = books.filter((book) => book.reading === true);
        const response = h.response({
          status: 'success',
          data: {
            books: formattedBooks(readingBooks),
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'success',
        data: getAllFormattedBooks(),
      });
      response.code(200);
      return response;
    } else if (isFinishedQueried) {
      if (finished === '0') {
        const unfinishedBooks = books.filter((book) => book.finished === false);
        const response = h.response({
          status: 'success',
          data: {
            books: formattedBooks(unfinishedBooks),
          },
        });
        response.code(200);
        return response;
      } else if (finished === '1') {
        const finishedBooks = books.filter((book) => book.finished === true);
        const response = h.response({
          status: 'success',
          data: {
            books: formattedBooks(finishedBooks),
          },
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'success',
        data: getAllFormattedBooks(),
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'success',
      data: getAllFormattedBooks(),
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(200);

  return response;
};

const addBookHandler = (request, h) => {
  if (request.payload !== null) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    if (!newBook.name) {
      const response = h.response(responseFailAddBook);
      response.code(400);

      return response;
    } else if (newBook.readPage > newBook.pageCount) {
      const response = h.response(responseFailAddBookInvalidPage);

      response.code(400);
      return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: newBook.id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response(responseFailAddBookGeneral);
    response.code(500);
    return response;
  }
  const response = h.response(responseFailAddBookGeneral);
  response.code(500);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  editDataBookHandler,
  deleteBookHandler,
};
