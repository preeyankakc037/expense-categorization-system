// ==================================================
// EXPENSE CATEGORY CONFIGURATION
// ==================================================
//
// The GROUP names are used by the UI to organize
// categories.
//
// The CATEGORY values remain the original dataset
// category names so the frontend, backend, database,
// and ML model can use the same category values.
// ==================================================


export const expenseCategoryGroups = [
  {
    group: 'Food',
    categories: [
      {
        value: 'Restaurants',
        label: 'Restaurants',
      },
      {
        value: 'Groceries',
        label: 'Groceries',
      },
    ],
  },

  {
    group: 'Living',
    categories: [
      {
        value: 'Housing',
        label: 'Housing',
      },
      {
        value: 'Utilities',
        label: 'Utilities',
      },
    ],
  },

  {
    group: 'Transportation',
    categories: [
      {
        value: 'Transportation',
        label: 'Transportation',
      },
    ],
  },

  {
    group: 'Healthcare',
    categories: [
      {
        value: 'Healthcare',
        label: 'Healthcare',
      },
    ],
  },

  {
    group: 'Insurance',
    categories: [
      {
        value: 'Insurance',
        label: 'Insurance',
      },
    ],
  },

  {
    group: 'Education',
    categories: [
      {
        value: 'Education',
        label: 'Education',
      },
    ],
  },

  {
    group: 'Lifestyle',
    categories: [
      {
        value: 'Entertainment',
        label: 'Entertainment',
      },
      {
        value: 'Shopping',
        label: 'Shopping',
      },
      {
        value: 'Subscription',
        label: 'Subscription',
      },
      {
        value: 'Personal Care',
        label: 'Personal Care',
      },
      {
        value: 'Travel',
        label: 'Travel',
      },
    ],
  },

  {
    group: 'Fees & Charges',
    categories: [
      {
        value: 'Fees',
        label: 'Fees',
      },
    ],
  },
];


// ==================================================
// FLAT CATEGORY LIST
// ==================================================
//
// Useful when we need all categories in one array,
// for example:
// - validation
// - ML predictions
// - filters
// - dropdowns
// ==================================================

export const expenseCategories =
  expenseCategoryGroups.flatMap(
    (group) => group.categories
  );


// ==================================================
// CATEGORY LOOKUP
// ==================================================
//
// Allows us to find the parent UI group from a
// dataset category.
//
// Example:
// "Restaurants" -> "Food"
// "Insurance"  -> "Insurance"
// "Fees"       -> "Fees & Charges"
// ==================================================

export const categoryToGroup = {};

expenseCategoryGroups.forEach((group) => {

  group.categories.forEach((category) => {

    categoryToGroup[category.value] = group.group;

  });

});