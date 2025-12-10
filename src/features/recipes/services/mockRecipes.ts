import type { RecipeSummary } from './spoonacularService';

export const MOCK_RECIPES: RecipeSummary[] = [
  {
    id: 716429,
    title: 'Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs',
    image: 'https://img.spoonacular.com/recipes/716429-636x393.jpg',
    readyInMinutes: 45,
    servings: 2,
    summary:
      'Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs might be a good recipe to expand your main course repertoire.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 584, unit: 'kcal' }],
    },
    cuisines: ['Italian'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'butter', amount: 1, unit: 'tbsp' },
      { id: 2, name: 'cauliflower florets', amount: 2, unit: 'cups' },
      { id: 3, name: 'garlic', amount: 2, unit: 'cloves' },
      { id: 4, name: 'pasta', amount: 6, unit: 'ounces' },
      { id: 5, name: 'scallions', amount: 3, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Bring a large pot of salted water to a boil.' },
          { number: 2, step: 'Add pasta and cook according to package directions.' },
          { number: 3, step: 'Meanwhile, heat butter in a large skillet over medium heat.' },
          { number: 4, step: 'Add garlic and cauliflower, cook for 5 minutes.' },
          { number: 5, step: 'Toss with pasta and top with breadcrumbs.' },
        ],
      },
    ],
  },
  {
    id: 715538,
    title: 'Bruschetta Style Pork & Pasta',
    image: 'https://img.spoonacular.com/recipes/715538-636x393.jpg',
    readyInMinutes: 35,
    servings: 4,
    summary:
      'Bruschetta Style Pork & Pasta is a main course that serves 4. Looking at the bigger picture, this recipe only costs $2.41 per serving.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 521, unit: 'kcal' }],
    },
    cuisines: ['Italian', 'Mediterranean'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'pork tenderloin', amount: 1, unit: 'lb' },
      { id: 2, name: 'penne pasta', amount: 8, unit: 'oz' },
      { id: 3, name: 'tomatoes', amount: 2, unit: 'cups' },
      { id: 4, name: 'basil', amount: 0.25, unit: 'cup' },
      { id: 5, name: 'garlic', amount: 3, unit: 'cloves' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Season pork and grill until cooked through.' },
          { number: 2, step: 'Cook pasta according to package directions.' },
          { number: 3, step: 'Dice tomatoes and mix with basil and garlic.' },
          { number: 4, step: 'Slice pork and serve over pasta with bruschetta topping.' },
        ],
      },
    ],
  },
  {
    id: 715495,
    title: 'Turkey Tomato Cheese Pizza',
    image: 'https://img.spoonacular.com/recipes/715495-636x393.jpg',
    readyInMinutes: 30,
    servings: 6,
    summary: 'Turkey Tomato Cheese Pizza might be just the main course you are searching for.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 285, unit: 'kcal' }],
    },
    cuisines: ['American', 'Italian'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'pizza dough', amount: 1, unit: 'lb' },
      { id: 2, name: 'ground turkey', amount: 0.5, unit: 'lb' },
      { id: 3, name: 'mozzarella cheese', amount: 1.5, unit: 'cups' },
      { id: 4, name: 'tomato sauce', amount: 0.5, unit: 'cup' },
      { id: 5, name: 'Italian seasoning', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 450°F.' },
          { number: 2, step: 'Brown turkey in a skillet.' },
          { number: 3, step: 'Roll out pizza dough and spread sauce.' },
          { number: 4, step: 'Top with turkey and cheese.' },
          { number: 5, step: 'Bake for 12-15 minutes until golden.' },
        ],
      },
    ],
  },
  {
    id: 716276,
    title: 'Doughnuts',
    image: 'https://img.spoonacular.com/recipes/716276-636x393.jpg',
    readyInMinutes: 60,
    servings: 12,
    summary: 'Homemade doughnuts are fluffy, sweet, and perfect for breakfast or dessert.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 320, unit: 'kcal' }],
    },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'dessert', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'flour', amount: 3, unit: 'cups' },
      { id: 2, name: 'sugar', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'milk', amount: 1, unit: 'cup' },
      { id: 4, name: 'eggs', amount: 2, unit: '' },
      { id: 5, name: 'yeast', amount: 2.25, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Mix dry ingredients together.' },
          { number: 2, step: 'Add wet ingredients and knead until smooth.' },
          { number: 3, step: 'Let rise for 1 hour.' },
          { number: 4, step: 'Cut into doughnut shapes.' },
          { number: 5, step: 'Fry until golden and glaze.' },
        ],
      },
    ],
  },
  {
    id: 782601,
    title: 'Red Kidney Bean Jambalaya',
    image: 'https://img.spoonacular.com/recipes/782601-636x393.jpg',
    readyInMinutes: 45,
    servings: 6,
    summary: 'A spicy Cajun-inspired dish with red kidney beans, rice, and vegetables.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 398, unit: 'kcal' }],
    },
    cuisines: ['Cajun', 'American'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'red kidney beans', amount: 2, unit: 'cups' },
      { id: 2, name: 'rice', amount: 1.5, unit: 'cups' },
      { id: 3, name: 'bell peppers', amount: 2, unit: '' },
      { id: 4, name: 'onion', amount: 1, unit: '' },
      { id: 5, name: 'cajun seasoning', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté onion and peppers until soft.' },
          { number: 2, step: 'Add cajun seasoning and cook for 1 minute.' },
          { number: 3, step: 'Add beans, rice, and broth.' },
          { number: 4, step: 'Simmer for 25-30 minutes until rice is cooked.' },
        ],
      },
    ],
  },
  {
    id: 794349,
    title: 'Broccoli and Chickpea Rice Salad',
    image: 'https://img.spoonacular.com/recipes/794349-636x393.jpg',
    readyInMinutes: 25,
    servings: 4,
    summary: 'A healthy and refreshing salad with broccoli, chickpeas, and brown rice.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 245, unit: 'kcal' }],
    },
    cuisines: ['Mediterranean'],
    dishTypes: ['salad', 'lunch', 'side dish'],
    extendedIngredients: [
      { id: 1, name: 'broccoli', amount: 2, unit: 'cups' },
      { id: 2, name: 'chickpeas', amount: 1, unit: 'can' },
      { id: 3, name: 'brown rice', amount: 1, unit: 'cup' },
      { id: 4, name: 'lemon juice', amount: 2, unit: 'tbsp' },
      { id: 5, name: 'olive oil', amount: 3, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook brown rice according to package.' },
          { number: 2, step: 'Steam broccoli until tender-crisp.' },
          { number: 3, step: 'Mix rice, broccoli, and chickpeas.' },
          { number: 4, step: 'Dress with lemon juice and olive oil.' },
        ],
      },
    ],
  },
  {
    id: 715446,
    title: 'Slow Cooker Beef Stew',
    image: 'https://img.spoonacular.com/recipes/715446-636x393.jpg',
    readyInMinutes: 480,
    servings: 8,
    summary: 'Hearty slow cooker beef stew with tender meat and vegetables.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 412, unit: 'kcal' }],
    },
    cuisines: ['American'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'beef chuck', amount: 2, unit: 'lbs' },
      { id: 2, name: 'potatoes', amount: 4, unit: '' },
      { id: 3, name: 'carrots', amount: 4, unit: '' },
      { id: 4, name: 'beef broth', amount: 4, unit: 'cups' },
      { id: 5, name: 'tomato paste', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cut beef into cubes and brown in a skillet.' },
          { number: 2, step: 'Add all ingredients to slow cooker.' },
          { number: 3, step: 'Cook on low for 8 hours or high for 4 hours.' },
        ],
      },
    ],
  },
  {
    id: 640941,
    title: 'Crunchy Brussels Sprouts Side Dish',
    image: 'https://img.spoonacular.com/recipes/640941-636x393.jpg',
    readyInMinutes: 20,
    servings: 4,
    summary: 'Crispy roasted brussels sprouts with a delicious crunch.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 156, unit: 'kcal' }],
    },
    cuisines: ['European'],
    dishTypes: ['side dish'],
    extendedIngredients: [
      { id: 1, name: 'brussels sprouts', amount: 1, unit: 'lb' },
      { id: 2, name: 'olive oil', amount: 2, unit: 'tbsp' },
      { id: 3, name: 'garlic', amount: 2, unit: 'cloves' },
      { id: 4, name: 'parmesan', amount: 0.25, unit: 'cup' },
      { id: 5, name: 'balsamic vinegar', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 400°F.' },
          { number: 2, step: 'Halve brussels sprouts and toss with oil and garlic.' },
          { number: 3, step: 'Roast for 20-25 minutes until crispy.' },
          { number: 4, step: 'Top with parmesan and drizzle with balsamic.' },
        ],
      },
    ],
  },
  {
    id: 663559,
    title: 'Tomato and Lentil Soup',
    image: 'https://img.spoonacular.com/recipes/663559-636x393.jpg',
    readyInMinutes: 40,
    servings: 6,
    summary: 'A warming and nutritious tomato lentil soup.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 234, unit: 'kcal' }],
    },
    cuisines: ['Mediterranean'],
    dishTypes: ['soup', 'lunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'red lentils', amount: 1, unit: 'cup' },
      { id: 2, name: 'crushed tomatoes', amount: 1, unit: 'can' },
      { id: 3, name: 'vegetable broth', amount: 4, unit: 'cups' },
      { id: 4, name: 'onion', amount: 1, unit: '' },
      { id: 5, name: 'cumin', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté onion until translucent.' },
          { number: 2, step: 'Add cumin and cook for 30 seconds.' },
          { number: 3, step: 'Add lentils, tomatoes, and broth.' },
          { number: 4, step: 'Simmer for 30 minutes until lentils are tender.' },
        ],
      },
    ],
  },
  {
    id: 660306,
    title: 'Soba Noodle Salad',
    image: 'https://img.spoonacular.com/recipes/660306-636x393.jpg',
    readyInMinutes: 25,
    servings: 4,
    summary: 'A refreshing Japanese-inspired soba noodle salad with sesame dressing.',
    nutrition: {
      nutrients: [{ name: 'Calories', amount: 298, unit: 'kcal' }],
    },
    cuisines: ['Japanese', 'Asian'],
    dishTypes: ['salad', 'lunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'soba noodles', amount: 8, unit: 'oz' },
      { id: 2, name: 'cucumber', amount: 1, unit: '' },
      { id: 3, name: 'edamame', amount: 1, unit: 'cup' },
      { id: 4, name: 'sesame oil', amount: 2, unit: 'tbsp' },
      { id: 5, name: 'soy sauce', amount: 3, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook soba noodles and rinse with cold water.' },
          { number: 2, step: 'Slice cucumber and prepare edamame.' },
          { number: 3, step: 'Mix sesame oil and soy sauce for dressing.' },
          { number: 4, step: 'Toss everything together and serve cold.' },
        ],
      },
    ],
  },
];

export const getMockRecipes = (count: number, cuisineFilters: string[] = []): RecipeSummary[] => {
  let recipes = [...MOCK_RECIPES];

  if (cuisineFilters.length > 0) {
    recipes = recipes.filter(recipe =>
      recipe.cuisines?.some(cuisine =>
        cuisineFilters.some(filter => cuisine.toLowerCase().includes(filter.toLowerCase()))
      )
    );
  }

  // Shuffle and return requested count
  const shuffled = recipes.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getMockRecipeById = (id: number): RecipeSummary | undefined => {
  return MOCK_RECIPES.find(recipe => recipe.id === id);
};
