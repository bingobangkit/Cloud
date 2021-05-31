const { nanoid } = require('nanoid');
const orders = require('./orders');

const addOrderHandler = (request, h) => {
  const {
    name,
    address,
    amount,
    payment,
  } = request.payload;

  /* 
    property processing by server
  */
  const id = nanoid(16);
  const orderedAt = new Date().toISOString();
  const updatedAt = orderedAt;

  const newOrder = {
    id,
    name,
    address,
    amount,
    payment,
    orderedAt,
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
    address,
    amount,
    payment,
  } = request.query;

  /* 
    query is null
  */
  if (!name && !address && !amount && !payment) {
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
};

const getOrderByIdHandler = (request, h) => {
  const { orderId } = request.params;
  const order = orders.filter((n) => n.id === orderId)[0];

  /* 
    orderid is exist
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
    orderid is not found
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