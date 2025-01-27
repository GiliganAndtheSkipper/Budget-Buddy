const formidable = require('formidable');
const { endOfDay, startOfDay } = require('date-fns');
const pool = require('../models/database');
const { fieldValidator } = require('../utils/index');

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  
  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(400).json({ error: "Form parsing failed" });
    }
    
    console.log("Received form data:", fields);

    const { title, price, category, essential, created_at } = fields;
    
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    
    let formattedDate;
    try {
      formattedDate = new Date(created_at).toISOString();
    } catch (error) {
      console.error("Invalid date formate:", created_at);
      return res.status(400).json({
        error: "Invalid date format",
        details: "The provided date is not valid",
      });
    }

    const isEssential = essential === "true" || essential === true;

    try {
      const newExpense = await pool.query(
        'INSERT INTO expenses (title, price, category, essential, created_at) VALUES ($1, $2, $3, $4, $5) Returning *',
        [title, price, category, isEssential, formattedDate]
      );
      
      console.log("New expense added:", newExpense.rows[0]);
      return res.status(201).json({ message: "Expense added successfully", expense: newExpense.rows[0] });
    } catch (error) {
      console.error("Database insertion error:", error.message);
      return res.status(500).json({
        error: "Databse error",
        details: error.message,
      });
    }
  });
};
exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  const id = Number(req.params.id);
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    // check for all fields
    const { title, price, category, essential, created_at } = fields;
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    try {
      await pool.query(
        'UPDATE expenses SET title = $1, price = $2, category = $3, essential = $4, created_at = $5 WHERE expense_id = $6',
        [title, price, category, essential, created_at, id]
      );

      return res.status(200).send(`User modified with ID: ${id}`);
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  });
};

exports.expenseById = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const expense = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = $1',
      [id]
    );
    req.expense = expense.rows;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.expenseByDate = async (req, res, next) => {
  const expenseDate = req.params.expenseDate;
  
  console.log("Received expenseDate:", expenseDate);

  // Ensure the date is numeric
  const parsedDate = new Date(Number(expenseDate));
  if (!expenseDate || isNaN(parsedDate.getTime())) {
    console.error("Invalid date format received", expenseDate);
    return res.status(400).json({
      error: "Invalid date format received",
      details: "The provided date is not a valid timestamp",
    });
  }

  console.log("Converted date:", parsedDate);
  try {
    const start = startOfDay(parsedDate).toISOString();
    const end = endOfDay(parsedDate).toISOString();
    
    console.log(`Querying expenses between: ${start} and ${end}`);
    
    const expenseQuery = await pool.query(
      'SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2',
      [start, end]
    );

    req.expense = expenseQuery.rows.length > 0 ? expenseQuery.rows : [];
    return next();
  } catch (error) {
    console.error("Error processing date:", error.message);
    return res.status(400).json({
      error: 'Error fetching expenses by date',
      details: error.message,
    });
  }
};

exports.read = (req, res) => res.json(req.expense);

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await pool.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
    return res.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
