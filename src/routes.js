const {
    addOrderHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    editOrderByIdHandler,
    deleteOrderByIdHandler,
  } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/Orders',
      handler: addOrderHandler,
    },

    {
      method: 'GET',
      path: '/Orders',
      handler: getAllOrdersHandler,
    },

    {
      method: 'GET',
      path: '/Orders/{OrderId}',
      handler: getOrderByIdHandler,
    },

    {
      method: 'PUT',
      path: '/Orders/{OrderId}',
      handler: editOrderByIdHandler,
    },

    {
      method: 'DELETE',
      path: '/Orders/{OrderId}',
      handler: deleteOrderByIdHandler,
    },
    
    {
      method: '*',
      path: '/{any*}',
      handler: () => 'Halaman tidak ditemukan',
    },
  ];
  
  module.exports = routes;