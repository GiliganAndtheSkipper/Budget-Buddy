export const fetchExpenses = async (date) => {
  const selectDate = date ? new Date(date).getTime() : Date.now();
  try {
    console.log(`Fetching: http://localhost:8000/api/expense/list/${selectDate}`);
    const res = await fetch(`http://localhost:8000/api/expense/list/${selectDate}`);

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      throw new Error(`Failed to fetch expenses, Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    return [];
  }
};


export const resHandler = async (res, status) => {
  try {
    if (res.status === status) {
      return null;
    }
    const data = await res.json();
    if (data && data.emptyFields) {
      return data.emptyFields;
    }
    return null;
  } catch (error) {
  console.error("Error processing response:", error);
  return { error: "Unexpected response format" };
  }
};

export const createExpense = async (data) => {
  try {
    const res = await fetch(`http://localhost:8000/api/expense/create`, {
      method: 'POST',
      body: data,
    });
    return resHandler(res, 201);
  } catch (error) {
    console.error("Error creating expense:", error);
    return { error: "Failed to create expense" };
  }
};

export const updateExpense = async (_id, data) => {
  try {
    const res = await fetch(`http://localhost:8000/api/expense/${_id}`, {
      method: 'PUT',
      body: data,
    });
    return resHandler(res, 200);
  } catch (error) {
    console.error("Error updating expense:", error);
    return { error: "Failed to update expense" };
  }
};

export const fetchExpense = async (_id) => {
  
  try {
    const res = await fetch(`http://localhost:8000/api/expense/${_id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch expense with ID: ${_id}, Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching expense:", error);
    return null;
  }
};

export const deleteExpense = async (_id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/expense/${_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete expense with ID: ${_id}, Status: ${res.status}`);
  }

  return res.status === 204 ? { message: "Deleted successfully" } : await res.json();
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { error: "Failed to delete expense" };
  }
};
  

export const formSetter = (data, form) => {
  if (!(data instanceof FormData)) {
    console.error("Invalid data object passed to formSetter");
    return;
  }

  if (typeof form !== 'object' || form === null) {
    console.error("Invalid form object passed to formSetter");
    return;
  }

  Object.keys(form).forEach((key) => {
    data.set(key, form[key]);
  });
};

export const expenseByCategory = (expenses) => {
if (!Array.isArray(expenses)) {
  console.error("Invalid expenses data provided");
  return [];
}
  const categoryBreakdown = expenses.reduce((total, num) => {
    const curTotal = total;
    if (curTotal[num.category]) {
      curTotal[num.category] += Number(num.price);
    } else {
      curTotal[num.category] = Number(num.price);
    }
    return curTotal;
  }, {});
  
  return Object.keys(categoryBreakdown).map((category) => ({
    x: category,
    y: categoryBreakdown[category],
  }));
};
