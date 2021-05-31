const { nanoid } = require('nanoid');
const orders = require('./orders');

const addOrderHandler = (request, h) => {
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

  /* 
    property processing by server
  */
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newOrder = {
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

  orders.push(newOrder);
  const isSuccess = orders.filter((order) => order.id === id).length > 0;

  /* 
    property is complete
  */
  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Order berhasil ditambahkan',
        data: {
          orderId: id,
        },
      })
      .code(201);
    return response;
  }

  /* 
    Generic Failure  
  */ 
  const response = h
    .response({
      status: 'fail',
      message: 'Order gagal ditambahkan',
    })
    .code(500);
  return response;
};

const getAllOrdersHandler = (request, h) => {
  const { 
    name, 
    reading, 
    finished 
  } = request.query;

  /* 
    query is null
  */
  if (!name && !reading && !finished) {
    const response = h
      .response({
        status: 'success',
        data: {
          orders: orders.map((order) => ({
            id: order.id,
            name: order.name,
            publisher: order.publisher,
          })),
        },
      })
      .code(200);
    return response;
  }

  /* 
    query based on name
  */
  if (name) {
    const filteredOrdersName = orders.filter((order) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(order.name);
    });

    const response = h
      .response({
        status: 'success',
        data: {
          orders: filteredOrdersName.map((order) => ({
            id: order.id,
            name: order.name,
            publisher: order.publisher,
          })),
        },
      })
      .code(200);
    return response;
  }
  
  /* 
    query based on reading
  */
  if (reading) {
    const filteredOrdersReading = orders.filter(
      (order) => Number(order.reading) === Number(reading),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          orders: filteredOrdersReading.map((order) => ({
            id: order.id,
            name: order.name,
            publisher: order.publisher,
          })),
        },
      })
      .code(200);
    return response;
  }

   /* 
    query based on finished
  */
  const filteredOrdersFinished = orders.filter(
    (order) => Number(order.finished) === Number(finished),
  );

  const response = h
    .response({
      status: 'success',
      data: {
        orders: filteredOrdersFinished.map((order) => ({
          id: order.id,
          name: order.name,
          publisher: order.publisher,
        })),
      },
    })
    .code(200);
  return response;
};

const getOrderByIdHandler = (request, h) => {
  const { orderId } = request.params;
  const order = orders.filter((n) => n.id === orderId)[0];

  /* 
    bookid is exist
  */
  if (order !== undefined) {
    const response = h
      .response({
        status: 'success',
        data: {
          order,
        },
      })
      .code(200);
    return response;
  }

  /* 
    bookid is not found
  */
  const response = h
    .response({
      status: 'fail',
      message: 'Order tidak ditemukan',
    })
    .code(404);
  return response;
};

const editOrderByIdHandler = (request, h) => {
  const { orderId } = request.params;

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

  /* 
    property name is null
  */
  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui order. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  /* 
    property readpage > pagecount
  */
  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui order. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = orders.findIndex((order) => order.id === orderId);

  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

  /* 
    edit is success
  */
    const response = h
      .response({
        status: 'success',
        message: 'Order berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  /* 
    bookid is not found
  */
  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui order. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

const deleteOrderByIdHandler = (request, h) => {
  const { orderId } = request.params;
  const index = orders.findIndex((order) => order.id === orderId); 

  if (index !== -1) {
    orders.splice(index, 1);

    /* 
      bookid is exist
    */
    const response = h
      .response({
        status: 'success',
        message: 'Order berhasil dihapus',
      })
      .code(200);
    return response;
  }

  /* 
    bookid is not found
  */
  const response = h
    .response({
      status: 'fail',
      message: 'Order gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  addOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  editOrderByIdHandler,
  deleteOrderByIdHandler,
};