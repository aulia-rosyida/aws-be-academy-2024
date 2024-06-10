const { nanoid } = require("nanoid");
const books = require("./books");

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  } else {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
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
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    response.code(400);

    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  } else {
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

      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }
};

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((item) => item.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: "success",
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
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const getAllBooksHandler = (_, h) => {
  if (books.length > 0) {
    const tempBooks = books.map((bookItem) => ({
      id: bookItem.id,
      name: bookItem.name,
      publisher: bookItem.publisher,
    }));

    const response = h.response({
      status: "success",
      data: {
        books: tempBooks,
      },
    });
    response.code(200);

    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.code(200);

    return response;
  }
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
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });

      response.code(400);

      return response;
    } else if (newBook.readPage > newBook.pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });

      response.code(400);
      return response;
    } else {
      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: newBook.id,
          },
        });
        response.code(201);
        return response;
      } else {
        const response = h.response({
          status: "fail",
          message: "Buku gagal ditambahkan",
        });

        response.code(500);
        return response;
      }
    }
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    });

    response.code(500);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  editDataBookHandler,
  deleteBookHandler,
};
