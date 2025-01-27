// require express and it's router component
const express = require('express');
const router = express.Router();

// require the middlewares and callback functions from the controller directory
const { create, expenseById, read, update, remove, expenseByDate } = require('../controllers');

// POST route to create an expense
router.post('/expense/create', create);

//  GET route to read an expense
router.get('/expense/:id', expenseById, read);

//  PUT route to update an expense
router.put('/expense/:id', expenseById, update);

//  DELETE route to remove an expense
router.delete('/expense/:id', remove);

//  GET route to read a list of expenses
router.get('/expense/list/:expenseDate', expenseByDate, (req, res, next) => {
    console.log("received date in request params:", req.params.expenseByDate);
    next();
}, expenseByDate, (req, res) => {
    console.log("data fetched from DB:", req.expense);
    res.json(req.expense);
});
module.exports = router;