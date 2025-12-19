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

  // --- Added (30 more) ---

  {
    id: 810101,
    title: 'Chicken Tikka Masala Bowl',
    image: 'https://img.spoonacular.com/recipes/810101-636x393.jpg',
    readyInMinutes: 50,
    servings: 4,
    summary: 'Creamy, spiced chicken tikka masala served over fluffy basmati rice.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 610, unit: 'kcal' }] },
    cuisines: ['Indian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken thighs', amount: 1.5, unit: 'lbs' },
      { id: 2, name: 'yogurt', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'tomato puree', amount: 1, unit: 'cup' },
      { id: 4, name: 'garam masala', amount: 2, unit: 'tsp' },
      { id: 5, name: 'basmati rice', amount: 2, unit: 'cups' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Marinate chicken with yogurt and spices for 15 minutes.' },
          { number: 2, step: 'Sear chicken until lightly browned.' },
          { number: 3, step: 'Simmer in tomato sauce until cooked through and thick.' },
          { number: 4, step: 'Serve over cooked basmati rice.' },
        ],
      },
    ],
  },
  {
    id: 810102,
    title: 'Thai Green Curry with Vegetables',
    image: 'https://img.spoonacular.com/recipes/810102-636x393.jpg',
    readyInMinutes: 35,
    servings: 4,
    summary: 'A fragrant Thai green curry with coconut milk and crisp-tender vegetables.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 420, unit: 'kcal' }] },
    cuisines: ['Thai', 'Asian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'green curry paste', amount: 2, unit: 'tbsp' },
      { id: 2, name: 'coconut milk', amount: 1, unit: 'can' },
      { id: 3, name: 'bell pepper', amount: 1, unit: '' },
      { id: 4, name: 'zucchini', amount: 1, unit: '' },
      { id: 5, name: 'jasmine rice', amount: 2, unit: 'cups' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Warm curry paste in a pot for 30 seconds.' },
          { number: 2, step: 'Add coconut milk and bring to a gentle simmer.' },
          { number: 3, step: 'Add vegetables and cook until tender-crisp.' },
          { number: 4, step: 'Serve with jasmine rice.' },
        ],
      },
    ],
  },
  {
    id: 810103,
    title: 'Greek Chicken Souvlaki Pitas',
    image: 'https://img.spoonacular.com/recipes/810103-636x393.jpg',
    readyInMinutes: 30,
    servings: 4,
    summary: 'Juicy lemon-oregano chicken wrapped in warm pita with tzatziki.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 540, unit: 'kcal' }] },
    cuisines: ['Greek', 'Mediterranean'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breast', amount: 1.25, unit: 'lbs' },
      { id: 2, name: 'pita bread', amount: 4, unit: '' },
      { id: 3, name: 'lemon juice', amount: 3, unit: 'tbsp' },
      { id: 4, name: 'oregano', amount: 2, unit: 'tsp' },
      { id: 5, name: 'tzatziki', amount: 0.75, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Marinate chicken with lemon juice, oregano, salt, and oil.' },
          { number: 2, step: 'Grill or pan-sear chicken until cooked through.' },
          { number: 3, step: 'Warm pitas and slice chicken.' },
          { number: 4, step: 'Assemble pitas with chicken and tzatziki.' },
        ],
      },
    ],
  },
  {
    id: 810104,
    title: 'Shakshuka with Feta',
    image: 'https://img.spoonacular.com/recipes/810104-636x393.jpg',
    readyInMinutes: 25,
    servings: 3,
    summary: 'Eggs poached in a spiced tomato-pepper sauce, finished with crumbled feta.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 360, unit: 'kcal' }] },
    cuisines: ['Middle Eastern', 'Mediterranean'],
    dishTypes: ['breakfast', 'brunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'eggs', amount: 6, unit: '' },
      { id: 2, name: 'crushed tomatoes', amount: 1, unit: 'can' },
      { id: 3, name: 'bell pepper', amount: 1, unit: '' },
      { id: 4, name: 'paprika', amount: 1, unit: 'tsp' },
      { id: 5, name: 'feta cheese', amount: 0.5, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté pepper and spices until fragrant.' },
          { number: 2, step: 'Add tomatoes and simmer to thicken slightly.' },
          { number: 3, step: 'Make wells and crack in eggs.' },
          { number: 4, step: 'Cover and cook until whites set; top with feta.' },
        ],
      },
    ],
  },
  {
    id: 810105,
    title: 'Avocado Toast with Poached Egg',
    image: 'https://img.spoonacular.com/recipes/810105-636x393.jpg',
    readyInMinutes: 15,
    servings: 2,
    summary: 'Creamy avocado on toasted bread topped with a perfectly poached egg.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 410, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'brunch'],
    extendedIngredients: [
      { id: 1, name: 'bread slices', amount: 2, unit: '' },
      { id: 2, name: 'avocado', amount: 1, unit: '' },
      { id: 3, name: 'eggs', amount: 2, unit: '' },
      { id: 4, name: 'lemon juice', amount: 1, unit: 'tsp' },
      { id: 5, name: 'chili flakes', amount: 0.25, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Toast the bread until golden.' },
          { number: 2, step: 'Mash avocado with lemon juice, salt, and pepper.' },
          { number: 3, step: 'Poach eggs to desired doneness.' },
          { number: 4, step: 'Top toast with avocado and eggs; finish with chili flakes.' },
        ],
      },
    ],
  },
  {
    id: 810106,
    title: 'Overnight Oats with Berries',
    image: 'https://img.spoonacular.com/recipes/810106-636x393.jpg',
    readyInMinutes: 10,
    servings: 1,
    summary: 'No-cook overnight oats with yogurt, milk, and fresh berries.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 320, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'rolled oats', amount: 0.5, unit: 'cup' },
      { id: 2, name: 'milk', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'greek yogurt', amount: 0.25, unit: 'cup' },
      { id: 4, name: 'honey', amount: 1, unit: 'tbsp' },
      { id: 5, name: 'mixed berries', amount: 0.5, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Combine oats, milk, yogurt, and honey in a jar.' },
          { number: 2, step: 'Stir well and cover.' },
          { number: 3, step: 'Refrigerate overnight.' },
          { number: 4, step: 'Top with berries and serve cold.' },
        ],
      },
    ],
  },
  {
    id: 810107,
    title: 'Classic French Omelette',
    image: 'https://img.spoonacular.com/recipes/810107-636x393.jpg',
    readyInMinutes: 10,
    servings: 1,
    summary: 'Soft, tender French omelette finished with herbs and a touch of butter.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 290, unit: 'kcal' }] },
    cuisines: ['French', 'European'],
    dishTypes: ['breakfast', 'brunch'],
    extendedIngredients: [
      { id: 1, name: 'eggs', amount: 3, unit: '' },
      { id: 2, name: 'butter', amount: 1, unit: 'tbsp' },
      { id: 3, name: 'chives', amount: 1, unit: 'tbsp' },
      { id: 4, name: 'salt', amount: 0.25, unit: 'tsp' },
      { id: 5, name: 'black pepper', amount: 0.25, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Whisk eggs with salt and pepper until uniform.' },
          { number: 2, step: 'Melt butter in a nonstick pan over medium-low heat.' },
          { number: 3, step: 'Stir eggs gently until barely set.' },
          { number: 4, step: 'Fold into an oval and finish with chives.' },
        ],
      },
    ],
  },
  {
    id: 810108,
    title: 'Salmon Poke Bowl',
    image: 'https://img.spoonacular.com/recipes/810108-636x393.jpg',
    readyInMinutes: 20,
    servings: 2,
    summary: 'Fresh salmon poke with soy-sesame dressing over rice with crunchy toppings.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 520, unit: 'kcal' }] },
    cuisines: ['Hawaiian', 'Japanese', 'Asian'],
    dishTypes: ['lunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'sushi rice', amount: 1, unit: 'cup' },
      { id: 2, name: 'salmon', amount: 8, unit: 'oz' },
      { id: 3, name: 'soy sauce', amount: 2, unit: 'tbsp' },
      { id: 4, name: 'sesame oil', amount: 1, unit: 'tbsp' },
      { id: 5, name: 'cucumber', amount: 0.5, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook sushi rice and let cool slightly.' },
          { number: 2, step: 'Cube salmon and toss with soy sauce and sesame oil.' },
          { number: 3, step: 'Slice cucumber and prepare toppings.' },
          { number: 4, step: 'Assemble bowls with rice and salmon; serve immediately.' },
        ],
      },
    ],
  },
  {
    id: 810109,
    title: 'Korean Beef Bulgogi Lettuce Wraps',
    image: 'https://img.spoonacular.com/recipes/810109-636x393.jpg',
    readyInMinutes: 25,
    servings: 4,
    summary: 'Sweet-savory bulgogi-style beef served in crisp lettuce cups.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 430, unit: 'kcal' }] },
    cuisines: ['Korean', 'Asian'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'ground beef', amount: 1, unit: 'lb' },
      { id: 2, name: 'soy sauce', amount: 3, unit: 'tbsp' },
      { id: 3, name: 'brown sugar', amount: 1, unit: 'tbsp' },
      { id: 4, name: 'garlic', amount: 3, unit: 'cloves' },
      { id: 5, name: 'butter lettuce', amount: 1, unit: 'head' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook beef in a skillet until browned.' },
          { number: 2, step: 'Stir in soy sauce, sugar, and garlic; simmer 2 minutes.' },
          { number: 3, step: 'Separate lettuce leaves and rinse.' },
          { number: 4, step: 'Spoon beef into lettuce cups and serve.' },
        ],
      },
    ],
  },
  {
    id: 810110,
    title: 'Spaghetti Carbonara',
    image: 'https://img.spoonacular.com/recipes/810110-636x393.jpg',
    readyInMinutes: 20,
    servings: 4,
    summary: 'A classic Roman pasta with eggs, cheese, and crispy pancetta.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 670, unit: 'kcal' }] },
    cuisines: ['Italian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'spaghetti', amount: 12, unit: 'oz' },
      { id: 2, name: 'pancetta', amount: 6, unit: 'oz' },
      { id: 3, name: 'eggs', amount: 3, unit: '' },
      { id: 4, name: 'parmesan', amount: 1, unit: 'cup' },
      { id: 5, name: 'black pepper', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook pasta in salted water until al dente.' },
          { number: 2, step: 'Crisp pancetta in a skillet.' },
          { number: 3, step: 'Whisk eggs with parmesan and pepper.' },
          { number: 4, step: 'Toss hot pasta with pancetta; remove from heat and stir in egg mixture.' },
        ],
      },
    ],
  },
  {
    id: 810111,
    title: 'Margherita Flatbread Pizza',
    image: 'https://img.spoonacular.com/recipes/810111-636x393.jpg',
    readyInMinutes: 18,
    servings: 2,
    summary: 'Quick flatbread pizza with tomato, mozzarella, and fresh basil.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 480, unit: 'kcal' }] },
    cuisines: ['Italian'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'flatbread', amount: 2, unit: '' },
      { id: 2, name: 'tomato sauce', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'mozzarella', amount: 1, unit: 'cup' },
      { id: 4, name: 'fresh basil', amount: 0.25, unit: 'cup' },
      { id: 5, name: 'olive oil', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 475°F.' },
          { number: 2, step: 'Spread sauce on flatbreads and top with mozzarella.' },
          { number: 3, step: 'Bake 8-10 minutes until bubbly.' },
          { number: 4, step: 'Top with basil and drizzle with olive oil.' },
        ],
      },
    ],
  },
  {
    id: 810112,
    title: 'Pesto Chicken Pasta',
    image: 'https://img.spoonacular.com/recipes/810112-636x393.jpg',
    readyInMinutes: 25,
    servings: 4,
    summary: 'Tender chicken and pasta tossed in bright basil pesto.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 590, unit: 'kcal' }] },
    cuisines: ['Italian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'penne pasta', amount: 12, unit: 'oz' },
      { id: 2, name: 'chicken breast', amount: 1, unit: 'lb' },
      { id: 3, name: 'basil pesto', amount: 0.5, unit: 'cup' },
      { id: 4, name: 'cherry tomatoes', amount: 1, unit: 'cup' },
      { id: 5, name: 'parmesan', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook pasta until al dente and reserve a splash of water.' },
          { number: 2, step: 'Sauté chicken pieces until cooked through.' },
          { number: 3, step: 'Toss pasta with pesto, chicken, and tomatoes.' },
          { number: 4, step: 'Loosen with pasta water if needed; finish with parmesan.' },
        ],
      },
    ],
  },
  {
    id: 810113,
    title: 'Mushroom Risotto',
    image: 'https://img.spoonacular.com/recipes/810113-636x393.jpg',
    readyInMinutes: 45,
    servings: 4,
    summary: 'Creamy risotto with sautéed mushrooms and parmesan.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 520, unit: 'kcal' }] },
    cuisines: ['Italian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'arborio rice', amount: 1.5, unit: 'cups' },
      { id: 2, name: 'mushrooms', amount: 2, unit: 'cups' },
      { id: 3, name: 'vegetable broth', amount: 5, unit: 'cups' },
      { id: 4, name: 'onion', amount: 1, unit: '' },
      { id: 5, name: 'parmesan', amount: 0.5, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté onion and mushrooms until golden.' },
          { number: 2, step: 'Stir in rice and toast for 1 minute.' },
          { number: 3, step: 'Add hot broth gradually, stirring until absorbed.' },
          { number: 4, step: 'Finish with parmesan and rest 2 minutes before serving.' },
        ],
      },
    ],
  },
  {
    id: 810114,
    title: 'Spanish Tortilla (Potato Omelette)',
    image: 'https://img.spoonacular.com/recipes/810114-636x393.jpg',
    readyInMinutes: 40,
    servings: 6,
    summary: 'Classic Spanish tortilla made with tender potatoes, onion, and eggs.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 330, unit: 'kcal' }] },
    cuisines: ['Spanish', 'European'],
    dishTypes: ['breakfast', 'brunch', 'lunch', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'potatoes', amount: 4, unit: '' },
      { id: 2, name: 'onion', amount: 1, unit: '' },
      { id: 3, name: 'eggs', amount: 6, unit: '' },
      { id: 4, name: 'olive oil', amount: 0.5, unit: 'cup' },
      { id: 5, name: 'salt', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Slice potatoes and onion; gently fry in olive oil until tender.' },
          { number: 2, step: 'Drain excess oil and mix potatoes with beaten eggs.' },
          { number: 3, step: 'Cook in a skillet until set on the bottom.' },
          { number: 4, step: 'Flip and cook until set; rest before slicing.' },
        ],
      },
    ],
  },
  {
    id: 810115,
    title: 'Paella-Style Seafood Rice',
    image: 'https://img.spoonacular.com/recipes/810115-636x393.jpg',
    readyInMinutes: 55,
    servings: 4,
    summary: 'Paella-inspired rice with shrimp, mussels, and saffron aroma.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 560, unit: 'kcal' }] },
    cuisines: ['Spanish', 'Mediterranean'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'short-grain rice', amount: 1.75, unit: 'cups' },
      { id: 2, name: 'shrimp', amount: 12, unit: '' },
      { id: 3, name: 'mussels', amount: 1, unit: 'lb' },
      { id: 4, name: 'saffron', amount: 1, unit: 'pinch' },
      { id: 5, name: 'chicken broth', amount: 4, unit: 'cups' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Warm broth with saffron and keep hot.' },
          { number: 2, step: 'Toast rice briefly in a wide pan.' },
          { number: 3, step: 'Add broth and simmer without stirring until rice is nearly tender.' },
          { number: 4, step: 'Nestle seafood on top; cook until done and liquid is absorbed.' },
        ],
      },
    ],
  },
  {
    id: 810116,
    title: 'Mexican Chicken Fajitas',
    image: 'https://img.spoonacular.com/recipes/810116-636x393.jpg',
    readyInMinutes: 25,
    servings: 4,
    summary: 'Sizzling chicken fajitas with peppers and onions, ready in minutes.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 470, unit: 'kcal' }] },
    cuisines: ['Mexican', 'Latin American'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breast', amount: 1.25, unit: 'lbs' },
      { id: 2, name: 'bell peppers', amount: 3, unit: '' },
      { id: 3, name: 'onion', amount: 1, unit: '' },
      { id: 4, name: 'fajita seasoning', amount: 2, unit: 'tbsp' },
      { id: 5, name: 'tortillas', amount: 8, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Slice chicken and vegetables into strips.' },
          { number: 2, step: 'Season chicken and cook until browned.' },
          { number: 3, step: 'Sauté peppers and onion until tender-crisp.' },
          { number: 4, step: 'Serve in warm tortillas.' },
        ],
      },
    ],
  },
  {
    id: 810117,
    title: 'Beef Tacos with Pico de Gallo',
    image: 'https://img.spoonacular.com/recipes/810117-636x393.jpg',
    readyInMinutes: 20,
    servings: 4,
    summary: 'Crispy tacos filled with seasoned beef and fresh pico de gallo.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 520, unit: 'kcal' }] },
    cuisines: ['Mexican', 'Latin American'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'ground beef', amount: 1, unit: 'lb' },
      { id: 2, name: 'taco shells', amount: 8, unit: '' },
      { id: 3, name: 'tomatoes', amount: 2, unit: '' },
      { id: 4, name: 'onion', amount: 0.5, unit: '' },
      { id: 5, name: 'taco seasoning', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Brown beef and stir in taco seasoning with a splash of water.' },
          { number: 2, step: 'Dice tomatoes and onion to make pico de gallo.' },
          { number: 3, step: 'Warm taco shells according to package directions.' },
          { number: 4, step: 'Fill shells with beef and top with pico.' },
        ],
      },
    ],
  },
  {
    id: 810118,
    title: 'Creamy Tomato Basil Soup',
    image: 'https://img.spoonacular.com/recipes/810118-636x393.jpg',
    readyInMinutes: 30,
    servings: 4,
    summary: 'Silky tomato soup blended smooth and finished with basil and cream.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 310, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['soup', 'lunch'],
    extendedIngredients: [
      { id: 1, name: 'crushed tomatoes', amount: 1, unit: 'can' },
      { id: 2, name: 'vegetable broth', amount: 3, unit: 'cups' },
      { id: 3, name: 'heavy cream', amount: 0.5, unit: 'cup' },
      { id: 4, name: 'fresh basil', amount: 0.25, unit: 'cup' },
      { id: 5, name: 'garlic', amount: 2, unit: 'cloves' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté garlic briefly in a pot.' },
          { number: 2, step: 'Add tomatoes and broth; simmer 15 minutes.' },
          { number: 3, step: 'Blend until smooth.' },
          { number: 4, step: 'Stir in cream and basil; warm through and serve.' },
        ],
      },
    ],
  },
  {
    id: 810119,
    title: 'Chicken Noodle Soup',
    image: 'https://img.spoonacular.com/recipes/810119-636x393.jpg',
    readyInMinutes: 35,
    servings: 6,
    summary: 'Comforting chicken noodle soup with carrots, celery, and tender noodles.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 260, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['soup', 'lunch', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breast', amount: 1, unit: 'lb' },
      { id: 2, name: 'egg noodles', amount: 8, unit: 'oz' },
      { id: 3, name: 'carrots', amount: 2, unit: '' },
      { id: 4, name: 'celery', amount: 2, unit: 'stalks' },
      { id: 5, name: 'chicken broth', amount: 6, unit: 'cups' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Simmer chicken in broth until cooked; remove and shred.' },
          { number: 2, step: 'Add carrots and celery; cook until tender.' },
          { number: 3, step: 'Add noodles and cook until just done.' },
          { number: 4, step: 'Return chicken to pot; season and serve.' },
        ],
      },
    ],
  },
  {
    id: 810120,
    title: 'Roasted Pumpkin Soup',
    image: 'https://img.spoonacular.com/recipes/810120-636x393.jpg',
    readyInMinutes: 55,
    servings: 5,
    summary: 'Roasted pumpkin blended into a smooth, cozy soup with warm spices.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 240, unit: 'kcal' }] },
    cuisines: ['European'],
    dishTypes: ['soup', 'lunch'],
    extendedIngredients: [
      { id: 1, name: 'pumpkin', amount: 4, unit: 'cups' },
      { id: 2, name: 'onion', amount: 1, unit: '' },
      { id: 3, name: 'vegetable broth', amount: 4, unit: 'cups' },
      { id: 4, name: 'nutmeg', amount: 0.25, unit: 'tsp' },
      { id: 5, name: 'cream', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Roast pumpkin until very tender.' },
          { number: 2, step: 'Sauté onion, then add broth and roasted pumpkin.' },
          { number: 3, step: 'Simmer 10 minutes, then blend until smooth.' },
          { number: 4, step: 'Season with nutmeg and swirl in cream.' },
        ],
      },
    ],
  },
  {
    id: 810121,
    title: 'Caesar Salad with Grilled Chicken',
    image: 'https://img.spoonacular.com/recipes/810121-636x393.jpg',
    readyInMinutes: 20,
    servings: 2,
    summary: 'Classic Caesar salad topped with juicy grilled chicken and crunchy croutons.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 510, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['salad', 'lunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'romaine lettuce', amount: 1, unit: 'head' },
      { id: 2, name: 'grilled chicken', amount: 8, unit: 'oz' },
      { id: 3, name: 'caesar dressing', amount: 0.25, unit: 'cup' },
      { id: 4, name: 'croutons', amount: 1, unit: 'cup' },
      { id: 5, name: 'parmesan', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Chop romaine and add to a bowl.' },
          { number: 2, step: 'Toss with dressing until coated.' },
          { number: 3, step: 'Top with sliced grilled chicken.' },
          { number: 4, step: 'Finish with croutons and parmesan.' },
        ],
      },
    ],
  },
  {
    id: 810122,
    title: 'Quinoa Mediterranean Bowl',
    image: 'https://img.spoonacular.com/recipes/810122-636x393.jpg',
    readyInMinutes: 25,
    servings: 3,
    summary: 'Quinoa bowl with cucumber, tomatoes, olives, and a lemon-olive oil dressing.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 390, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['lunch', 'salad', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'quinoa', amount: 1, unit: 'cup' },
      { id: 2, name: 'cucumber', amount: 1, unit: '' },
      { id: 3, name: 'cherry tomatoes', amount: 1, unit: 'cup' },
      { id: 4, name: 'kalamata olives', amount: 0.33, unit: 'cup' },
      { id: 5, name: 'lemon juice', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook quinoa and let cool slightly.' },
          { number: 2, step: 'Chop cucumber and halve tomatoes.' },
          { number: 3, step: 'Combine quinoa with vegetables and olives.' },
          { number: 4, step: 'Dress with lemon juice and olive oil; season to taste.' },
        ],
      },
    ],
  },
  {
    id: 810123,
    title: 'Caprese Salad',
    image: 'https://img.spoonacular.com/recipes/810123-636x393.jpg',
    readyInMinutes: 10,
    servings: 2,
    summary: 'Fresh mozzarella, ripe tomatoes, and basil drizzled with olive oil.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 320, unit: 'kcal' }] },
    cuisines: ['Italian', 'Mediterranean'],
    dishTypes: ['salad', 'appetizer', 'side dish'],
    extendedIngredients: [
      { id: 1, name: 'tomatoes', amount: 2, unit: '' },
      { id: 2, name: 'fresh mozzarella', amount: 8, unit: 'oz' },
      { id: 3, name: 'fresh basil', amount: 0.25, unit: 'cup' },
      { id: 4, name: 'olive oil', amount: 2, unit: 'tbsp' },
      { id: 5, name: 'balsamic glaze', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Slice tomatoes and mozzarella.' },
          { number: 2, step: 'Layer on a plate with basil leaves.' },
          { number: 3, step: 'Drizzle with olive oil and balsamic.' },
          { number: 4, step: 'Season with salt and pepper and serve.' },
        ],
      },
    ],
  },
  {
    id: 810124,
    title: 'Roasted Vegetable Tray Bake',
    image: 'https://img.spoonacular.com/recipes/810124-636x393.jpg',
    readyInMinutes: 40,
    servings: 4,
    summary: 'A simple sheet-pan roast of colorful vegetables with herbs.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 280, unit: 'kcal' }] },
    cuisines: ['European'],
    dishTypes: ['side dish', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'sweet potato', amount: 1, unit: '' },
      { id: 2, name: 'zucchini', amount: 2, unit: '' },
      { id: 3, name: 'red onion', amount: 1, unit: '' },
      { id: 4, name: 'olive oil', amount: 2, unit: 'tbsp' },
      { id: 5, name: 'italian herbs', amount: 2, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 425°F.' },
          { number: 2, step: 'Chop vegetables into similar sizes.' },
          { number: 3, step: 'Toss with oil, herbs, salt, and pepper.' },
          { number: 4, step: 'Roast 30-35 minutes, stirring halfway.' },
        ],
      },
    ],
  },
  {
    id: 810125,
    title: 'Garlic Butter Shrimp',
    image: 'https://img.spoonacular.com/recipes/810125-636x393.jpg',
    readyInMinutes: 12,
    servings: 3,
    summary: 'Quick sautéed shrimp in a garlicky butter sauce with lemon.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 290, unit: 'kcal' }] },
    cuisines: ['American', 'Mediterranean'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'shrimp', amount: 1, unit: 'lb' },
      { id: 2, name: 'butter', amount: 2, unit: 'tbsp' },
      { id: 3, name: 'garlic', amount: 4, unit: 'cloves' },
      { id: 4, name: 'lemon juice', amount: 1, unit: 'tbsp' },
      { id: 5, name: 'parsley', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Pat shrimp dry and season with salt.' },
          { number: 2, step: 'Melt butter and sauté garlic until fragrant.' },
          { number: 3, step: 'Cook shrimp 1-2 minutes per side until pink.' },
          { number: 4, step: 'Finish with lemon juice and parsley.' },
        ],
      },
    ],
  },
  {
    id: 810126,
    title: 'Baked Lemon Herb Cod',
    image: 'https://img.spoonacular.com/recipes/810126-636x393.jpg',
    readyInMinutes: 22,
    servings: 4,
    summary: 'Flaky baked cod with lemon, herbs, and olive oil.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 260, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'cod fillets', amount: 1.5, unit: 'lbs' },
      { id: 2, name: 'lemon', amount: 1, unit: '' },
      { id: 3, name: 'olive oil', amount: 2, unit: 'tbsp' },
      { id: 4, name: 'dried oregano', amount: 1, unit: 'tsp' },
      { id: 5, name: 'garlic powder', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 400°F.' },
          { number: 2, step: 'Place cod in a baking dish and season with herbs and garlic powder.' },
          { number: 3, step: 'Drizzle with olive oil and lemon juice.' },
          { number: 4, step: 'Bake 12-15 minutes until flaky.' },
        ],
      },
    ],
  },
  {
    id: 810127,
    title: 'Vegetarian Chili',
    image: 'https://img.spoonacular.com/recipes/810127-636x393.jpg',
    readyInMinutes: 40,
    servings: 6,
    summary: 'A hearty vegetarian chili with beans, tomatoes, and warm spices.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 350, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'black beans', amount: 1, unit: 'can' },
      { id: 2, name: 'kidney beans', amount: 1, unit: 'can' },
      { id: 3, name: 'diced tomatoes', amount: 1, unit: 'can' },
      { id: 4, name: 'chili powder', amount: 2, unit: 'tsp' },
      { id: 5, name: 'onion', amount: 1, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté onion until softened.' },
          { number: 2, step: 'Add spices and cook 30 seconds.' },
          { number: 3, step: 'Stir in beans and tomatoes.' },
          { number: 4, step: 'Simmer 25 minutes; season and serve.' },
        ],
      },
    ],
  },
  {
    id: 810128,
    title: 'BBQ Pulled Chicken Sandwiches',
    image: 'https://img.spoonacular.com/recipes/810128-636x393.jpg',
    readyInMinutes: 35,
    servings: 6,
    summary: 'Shredded BBQ chicken piled onto buns with crunchy slaw.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 540, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breast', amount: 2, unit: 'lbs' },
      { id: 2, name: 'bbq sauce', amount: 1, unit: 'cup' },
      { id: 3, name: 'burger buns', amount: 6, unit: '' },
      { id: 4, name: 'coleslaw mix', amount: 3, unit: 'cups' },
      { id: 5, name: 'apple cider vinegar', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook chicken until tender and easy to shred.' },
          { number: 2, step: 'Shred chicken and toss with BBQ sauce.' },
          { number: 3, step: 'Mix slaw with vinegar and a pinch of salt.' },
          { number: 4, step: 'Assemble sandwiches with BBQ chicken and slaw.' },
        ],
      },
    ],
  },
  {
    id: 810129,
    title: 'Teriyaki Chicken Stir-Fry',
    image: 'https://img.spoonacular.com/recipes/810129-636x393.jpg',
    readyInMinutes: 20,
    servings: 4,
    summary: 'Fast teriyaki chicken stir-fry with broccoli and carrots.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 460, unit: 'kcal' }] },
    cuisines: ['Japanese', 'Asian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breast', amount: 1, unit: 'lb' },
      { id: 2, name: 'teriyaki sauce', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'broccoli florets', amount: 3, unit: 'cups' },
      { id: 4, name: 'carrots', amount: 2, unit: '' },
      { id: 5, name: 'sesame seeds', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté chicken until lightly browned.' },
          { number: 2, step: 'Add vegetables and stir-fry until tender-crisp.' },
          { number: 3, step: 'Pour in teriyaki sauce and simmer 2 minutes.' },
          { number: 4, step: 'Serve and garnish with sesame seeds.' },
        ],
      },
    ],
  },
  {
    id: 810130,
    title: 'Falafel Wrap with Tahini Sauce',
    image: 'https://img.spoonacular.com/recipes/810130-636x393.jpg',
    readyInMinutes: 35,
    servings: 4,
    summary: 'Crispy falafel tucked into wraps with crunchy veggies and tahini sauce.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 520, unit: 'kcal' }] },
    cuisines: ['Middle Eastern', 'Mediterranean'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chickpeas', amount: 2, unit: 'cups' },
      { id: 2, name: 'tahini', amount: 0.25, unit: 'cup' },
      { id: 3, name: 'garlic', amount: 2, unit: 'cloves' },
      { id: 4, name: 'pita bread', amount: 4, unit: '' },
      { id: 5, name: 'cucumber', amount: 1, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Pulse chickpeas with garlic and seasoning to a coarse paste.' },
          { number: 2, step: 'Form small patties and pan-fry or bake until crisp.' },
          { number: 3, step: 'Mix tahini with lemon and water for sauce.' },
          { number: 4, step: 'Assemble wraps with falafel, veggies, and tahini.' },
        ],
      },
    ],
  },
  {
    id: 810131,
    title: 'Hummus and Veggie Plate',
    image: 'https://img.spoonacular.com/recipes/810131-636x393.jpg',
    readyInMinutes: 10,
    servings: 2,
    summary: 'A quick snack plate with hummus and colorful fresh vegetables.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 280, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['snack', 'appetizer'],
    extendedIngredients: [
      { id: 1, name: 'hummus', amount: 0.75, unit: 'cup' },
      { id: 2, name: 'carrot sticks', amount: 1, unit: 'cup' },
      { id: 3, name: 'cucumber', amount: 1, unit: '' },
      { id: 4, name: 'cherry tomatoes', amount: 1, unit: 'cup' },
      { id: 5, name: 'olive oil', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Arrange hummus in a bowl on a plate.' },
          { number: 2, step: 'Slice vegetables into bite-size pieces.' },
          { number: 3, step: 'Plate vegetables around hummus.' },
          { number: 4, step: 'Drizzle hummus with olive oil and serve.' },
        ],
      },
    ],
  },
  {
    id: 810132,
    title: 'Banana Pancakes',
    image: 'https://img.spoonacular.com/recipes/810132-636x393.jpg',
    readyInMinutes: 20,
    servings: 3,
    summary: 'Fluffy banana pancakes with a naturally sweet, tender crumb.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 420, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'brunch'],
    extendedIngredients: [
      { id: 1, name: 'bananas', amount: 2, unit: '' },
      { id: 2, name: 'flour', amount: 1, unit: 'cup' },
      { id: 3, name: 'milk', amount: 0.75, unit: 'cup' },
      { id: 4, name: 'eggs', amount: 1, unit: '' },
      { id: 5, name: 'baking powder', amount: 2, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Mash bananas and whisk with egg and milk.' },
          { number: 2, step: 'Stir in flour and baking powder until just combined.' },
          { number: 3, step: 'Cook pancakes on a greased skillet until bubbles form, then flip.' },
          { number: 4, step: 'Serve warm with toppings of choice.' },
        ],
      },
    ],
  },
  {
    id: 810133,
    title: 'Chocolate Chip Cookies',
    image: 'https://img.spoonacular.com/recipes/810133-636x393.jpg',
    readyInMinutes: 28,
    servings: 18,
    summary: 'Chewy chocolate chip cookies with crisp edges and gooey centers.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 190, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['dessert', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'butter', amount: 0.5, unit: 'cup' },
      { id: 2, name: 'brown sugar', amount: 0.75, unit: 'cup' },
      { id: 3, name: 'flour', amount: 1.5, unit: 'cups' },
      { id: 4, name: 'chocolate chips', amount: 1, unit: 'cup' },
      { id: 5, name: 'eggs', amount: 1, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 350°F.' },
          { number: 2, step: 'Cream butter and sugar, then add egg.' },
          { number: 3, step: 'Mix in flour and fold in chocolate chips.' },
          { number: 4, step: 'Scoop onto a sheet and bake 10-12 minutes.' },
        ],
      },
    ],
  },
  {
    id: 810134,
    title: 'Strawberry Yogurt Parfait',
    image: 'https://img.spoonacular.com/recipes/810134-636x393.jpg',
    readyInMinutes: 8,
    servings: 1,
    summary: 'Layered yogurt parfait with strawberries and crunchy granola.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 260, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'dessert', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'greek yogurt', amount: 1, unit: 'cup' },
      { id: 2, name: 'strawberries', amount: 0.75, unit: 'cup' },
      { id: 3, name: 'granola', amount: 0.33, unit: 'cup' },
      { id: 4, name: 'honey', amount: 1, unit: 'tsp' },
      { id: 5, name: 'vanilla extract', amount: 0.25, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Stir vanilla into yogurt.' },
          { number: 2, step: 'Slice strawberries.' },
          { number: 3, step: 'Layer yogurt, strawberries, and granola in a glass.' },
          { number: 4, step: 'Drizzle with honey and serve.' },
        ],
      },
    ],
  },
  {
    id: 810135,
    title: 'Baked Sweet Potato Fries',
    image: 'https://img.spoonacular.com/recipes/810135-636x393.jpg',
    readyInMinutes: 35,
    servings: 3,
    summary: 'Crispy baked sweet potato fries seasoned with paprika and salt.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 220, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['side dish', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'sweet potatoes', amount: 2, unit: '' },
      { id: 2, name: 'olive oil', amount: 1.5, unit: 'tbsp' },
      { id: 3, name: 'paprika', amount: 1, unit: 'tsp' },
      { id: 4, name: 'salt', amount: 0.5, unit: 'tsp' },
      { id: 5, name: 'cornstarch', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 425°F and line a baking sheet.' },
          { number: 2, step: 'Cut sweet potatoes into fries and toss with cornstarch.' },
          { number: 3, step: 'Add oil and seasoning; spread in a single layer.' },
          { number: 4, step: 'Bake 25-30 minutes, flipping halfway.' },
        ],
      },
    ],
  },
  {
    id: 810136,
    title: 'Classic Beef Burger',
    image: 'https://img.spoonacular.com/recipes/810136-636x393.jpg',
    readyInMinutes: 20,
    servings: 4,
    summary: 'Juicy classic beef burgers with your favorite toppings.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 650, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'ground beef', amount: 1.5, unit: 'lbs' },
      { id: 2, name: 'burger buns', amount: 4, unit: '' },
      { id: 3, name: 'cheddar cheese', amount: 4, unit: 'slices' },
      { id: 4, name: 'lettuce', amount: 4, unit: 'leaves' },
      { id: 5, name: 'tomato', amount: 1, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Form beef into 4 patties and season well.' },
          { number: 2, step: 'Cook patties on a hot skillet or grill to desired doneness.' },
          { number: 3, step: 'Toast buns lightly.' },
          { number: 4, step: 'Assemble burgers with cheese and toppings.' },
        ],
      },
    ],
  },
  {
    id: 810137,
    title: 'Vegetable Fried Rice',
    image: 'https://img.spoonacular.com/recipes/810137-636x393.jpg',
    readyInMinutes: 18,
    servings: 4,
    summary: 'Quick vegetable fried rice that’s perfect for weeknights.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 390, unit: 'kcal' }] },
    cuisines: ['Chinese', 'Asian'],
    dishTypes: ['main course', 'side dish'],
    extendedIngredients: [
      { id: 1, name: 'cooked rice', amount: 3, unit: 'cups' },
      { id: 2, name: 'mixed vegetables', amount: 2, unit: 'cups' },
      { id: 3, name: 'soy sauce', amount: 2.5, unit: 'tbsp' },
      { id: 4, name: 'eggs', amount: 2, unit: '' },
      { id: 5, name: 'sesame oil', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Scramble eggs in a hot wok; remove.' },
          { number: 2, step: 'Stir-fry vegetables until tender-crisp.' },
          { number: 3, step: 'Add rice, soy sauce, and sesame oil; toss well.' },
          { number: 4, step: 'Return eggs and mix through; serve.' },
        ],
      },
    ],
  },
  {
    id: 810138,
    title: 'Bacon and Egg Breakfast Burrito',
    image: 'https://img.spoonacular.com/recipes/810138-636x393.jpg',
    readyInMinutes: 15,
    servings: 2,
    summary: 'A satisfying breakfast burrito with bacon, eggs, and melty cheese.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 620, unit: 'kcal' }] },
    cuisines: ['American', 'Mexican'],
    dishTypes: ['breakfast', 'brunch'],
    extendedIngredients: [
      { id: 1, name: 'tortillas', amount: 2, unit: '' },
      { id: 2, name: 'eggs', amount: 4, unit: '' },
      { id: 3, name: 'bacon', amount: 4, unit: 'slices' },
      { id: 4, name: 'cheddar cheese', amount: 0.5, unit: 'cup' },
      { id: 5, name: 'salsa', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook bacon until crisp and chop.' },
          { number: 2, step: 'Scramble eggs until just set.' },
          { number: 3, step: 'Warm tortillas and fill with eggs, bacon, cheese, and salsa.' },
          { number: 4, step: 'Wrap tightly and serve.' },
        ],
      },
    ],
  },
  {
    id: 810139,
    title: 'Roasted Garlic Mashed Potatoes',
    image: 'https://img.spoonacular.com/recipes/810139-636x393.jpg',
    readyInMinutes: 40,
    servings: 6,
    summary: 'Creamy mashed potatoes infused with sweet roasted garlic.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 310, unit: 'kcal' }] },
    cuisines: ['American', 'European'],
    dishTypes: ['side dish'],
    extendedIngredients: [
      { id: 1, name: 'potatoes', amount: 2.5, unit: 'lbs' },
      { id: 2, name: 'garlic', amount: 1, unit: 'head' },
      { id: 3, name: 'butter', amount: 3, unit: 'tbsp' },
      { id: 4, name: 'milk', amount: 0.5, unit: 'cup' },
      { id: 5, name: 'salt', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Roast garlic until soft and caramelized.' },
          { number: 2, step: 'Boil potatoes until fork-tender; drain.' },
          { number: 3, step: 'Mash with butter, milk, and roasted garlic.' },
          { number: 4, step: 'Season and serve warm.' },
        ],
      },
    ],
  },
  {
    id: 810140,
    title: 'Lemon Parmesan Asparagus',
    image: 'https://img.spoonacular.com/recipes/810140-636x393.jpg',
    readyInMinutes: 12,
    servings: 4,
    summary: 'Quick sautéed asparagus finished with lemon and parmesan.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 140, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['side dish'],
    extendedIngredients: [
      { id: 1, name: 'asparagus', amount: 1, unit: 'lb' },
      { id: 2, name: 'olive oil', amount: 1, unit: 'tbsp' },
      { id: 3, name: 'lemon zest', amount: 1, unit: 'tsp' },
      { id: 4, name: 'lemon juice', amount: 1, unit: 'tbsp' },
      { id: 5, name: 'parmesan', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Trim asparagus ends.' },
          { number: 2, step: 'Sauté asparagus in olive oil until crisp-tender.' },
          { number: 3, step: 'Add lemon zest and juice.' },
          { number: 4, step: 'Top with parmesan and serve.' },
        ],
      },
    ],
  },
  {
    id: 810141,
    title: 'Apple Cinnamon Oatmeal',
    image: 'https://img.spoonacular.com/recipes/810141-636x393.jpg',
    readyInMinutes: 12,
    servings: 2,
    summary: 'Warm oatmeal with sautéed apples and cinnamon.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 310, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast'],
    extendedIngredients: [
      { id: 1, name: 'rolled oats', amount: 1, unit: 'cup' },
      { id: 2, name: 'milk', amount: 2, unit: 'cups' },
      { id: 3, name: 'apple', amount: 1, unit: '' },
      { id: 4, name: 'cinnamon', amount: 1, unit: 'tsp' },
      { id: 5, name: 'maple syrup', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Simmer oats with milk until thickened.' },
          { number: 2, step: 'Dice apple and sauté with cinnamon until softened.' },
          { number: 3, step: 'Stir apples into oatmeal.' },
          { number: 4, step: 'Sweeten with maple syrup and serve.' },
        ],
      },
    ],
  },
  {
    id: 810142,
    title: 'Greek Yogurt Chicken Salad',
    image: 'https://img.spoonacular.com/recipes/810142-636x393.jpg',
    readyInMinutes: 15,
    servings: 3,
    summary: 'Light chicken salad made creamy with Greek yogurt and crunchy celery.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 340, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['lunch', 'salad'],
    extendedIngredients: [
      { id: 1, name: 'cooked chicken', amount: 3, unit: 'cups' },
      { id: 2, name: 'greek yogurt', amount: 0.5, unit: 'cup' },
      { id: 3, name: 'celery', amount: 2, unit: 'stalks' },
      { id: 4, name: 'dijon mustard', amount: 1, unit: 'tsp' },
      { id: 5, name: 'lemon juice', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Dice or shred cooked chicken.' },
          { number: 2, step: 'Chop celery finely.' },
          { number: 3, step: 'Mix yogurt with mustard and lemon juice.' },
          { number: 4, step: 'Combine everything, season, and serve chilled.' },
        ],
      },
    ],
  },
  {
    id: 810143,
    title: 'Coconut Lentil Curry',
    image: 'https://img.spoonacular.com/recipes/810143-636x393.jpg',
    readyInMinutes: 35,
    servings: 5,
    summary: 'A comforting lentil curry simmered with coconut milk and spices.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 410, unit: 'kcal' }] },
    cuisines: ['Indian'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'red lentils', amount: 1.5, unit: 'cups' },
      { id: 2, name: 'coconut milk', amount: 1, unit: 'can' },
      { id: 3, name: 'curry powder', amount: 2, unit: 'tsp' },
      { id: 4, name: 'onion', amount: 1, unit: '' },
      { id: 5, name: 'spinach', amount: 3, unit: 'cups' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Sauté onion with curry powder until fragrant.' },
          { number: 2, step: 'Add lentils, coconut milk, and water; simmer until tender.' },
          { number: 3, step: 'Stir in spinach until wilted.' },
          { number: 4, step: 'Season and serve with rice or bread.' },
        ],
      },
    ],
  },
  {
    id: 810144,
    title: 'Baked Mac and Cheese',
    image: 'https://img.spoonacular.com/recipes/810144-636x393.jpg',
    readyInMinutes: 45,
    servings: 6,
    summary: 'Creamy baked mac and cheese with a golden breadcrumb topping.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 720, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'elbow macaroni', amount: 12, unit: 'oz' },
      { id: 2, name: 'cheddar cheese', amount: 2, unit: 'cups' },
      { id: 3, name: 'milk', amount: 2, unit: 'cups' },
      { id: 4, name: 'butter', amount: 3, unit: 'tbsp' },
      { id: 5, name: 'breadcrumbs', amount: 0.5, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Cook macaroni until just al dente.' },
          { number: 2, step: 'Make cheese sauce with butter, milk, and cheddar.' },
          { number: 3, step: 'Combine pasta and sauce; transfer to a baking dish.' },
          { number: 4, step: 'Top with breadcrumbs and bake until golden.' },
        ],
      },
    ],
  },
  {
    id: 810145,
    title: 'Spinach and Feta Stuffed Chicken',
    image: 'https://img.spoonacular.com/recipes/810145-636x393.jpg',
    readyInMinutes: 35,
    servings: 4,
    summary: 'Chicken breasts stuffed with spinach and feta, baked until juicy.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 490, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['main course', 'dinner'],
    extendedIngredients: [
      { id: 1, name: 'chicken breasts', amount: 4, unit: '' },
      { id: 2, name: 'spinach', amount: 3, unit: 'cups' },
      { id: 3, name: 'feta cheese', amount: 0.75, unit: 'cup' },
      { id: 4, name: 'garlic', amount: 2, unit: 'cloves' },
      { id: 5, name: 'olive oil', amount: 1, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 400°F.' },
          { number: 2, step: 'Sauté spinach with garlic until wilted; mix with feta.' },
          { number: 3, step: 'Stuff chicken, secure with toothpicks, and brush with oil.' },
          { number: 4, step: 'Bake 20-25 minutes until cooked through.' },
        ],
      },
    ],
  },
  {
    id: 810146,
    title: 'Classic Guacamole',
    image: 'https://img.spoonacular.com/recipes/810146-636x393.jpg',
    readyInMinutes: 10,
    servings: 4,
    summary: 'Creamy guacamole with lime, onion, and tomato.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 180, unit: 'kcal' }] },
    cuisines: ['Mexican', 'Latin American'],
    dishTypes: ['appetizer', 'snack', 'dip'],
    extendedIngredients: [
      { id: 1, name: 'avocados', amount: 2, unit: '' },
      { id: 2, name: 'lime juice', amount: 1.5, unit: 'tbsp' },
      { id: 3, name: 'red onion', amount: 0.25, unit: '' },
      { id: 4, name: 'tomato', amount: 1, unit: '' },
      { id: 5, name: 'cilantro', amount: 2, unit: 'tbsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Mash avocados in a bowl.' },
          { number: 2, step: 'Stir in lime juice, chopped onion, and tomato.' },
          { number: 3, step: 'Add cilantro and season with salt.' },
          { number: 4, step: 'Serve immediately or cover tightly to prevent browning.' },
        ],
      },
    ],
  },
  {
    id: 810147,
    title: 'Crispy Baked Chicken Wings',
    image: 'https://img.spoonacular.com/recipes/810147-636x393.jpg',
    readyInMinutes: 55,
    servings: 4,
    summary: 'Oven-baked wings that turn out crispy without deep frying.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 640, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['appetizer', 'dinner', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'chicken wings', amount: 2.5, unit: 'lbs' },
      { id: 2, name: 'baking powder', amount: 1, unit: 'tbsp' },
      { id: 3, name: 'salt', amount: 1, unit: 'tsp' },
      { id: 4, name: 'garlic powder', amount: 1, unit: 'tsp' },
      { id: 5, name: 'hot sauce', amount: 0.25, unit: 'cup' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Preheat oven to 425°F and place a rack on a baking sheet.' },
          { number: 2, step: 'Pat wings dry and toss with baking powder and seasoning.' },
          { number: 3, step: 'Bake 45-50 minutes, flipping halfway.' },
          { number: 4, step: 'Toss with hot sauce and serve.' },
        ],
      },
    ],
  },
  {
    id: 810148,
    title: 'Berry Smoothie',
    image: 'https://img.spoonacular.com/recipes/810148-636x393.jpg',
    readyInMinutes: 5,
    servings: 1,
    summary: 'A quick blended berry smoothie with banana and yogurt.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 280, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['breakfast', 'drink', 'snack'],
    extendedIngredients: [
      { id: 1, name: 'mixed berries', amount: 1, unit: 'cup' },
      { id: 2, name: 'banana', amount: 1, unit: '' },
      { id: 3, name: 'greek yogurt', amount: 0.5, unit: 'cup' },
      { id: 4, name: 'milk', amount: 0.5, unit: 'cup' },
      { id: 5, name: 'honey', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Add all ingredients to a blender.' },
          { number: 2, step: 'Blend until smooth.' },
          { number: 3, step: 'Adjust thickness with milk if needed.' },
          { number: 4, step: 'Serve immediately.' },
        ],
      },
    ],
  },
  {
    id: 810149,
    title: 'Tuna Melt Sandwich',
    image: 'https://img.spoonacular.com/recipes/810149-636x393.jpg',
    readyInMinutes: 12,
    servings: 2,
    summary: 'Classic tuna melt with melty cheese and toasted bread.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 520, unit: 'kcal' }] },
    cuisines: ['American'],
    dishTypes: ['lunch', 'main course'],
    extendedIngredients: [
      { id: 1, name: 'canned tuna', amount: 1, unit: 'can' },
      { id: 2, name: 'mayonnaise', amount: 2, unit: 'tbsp' },
      { id: 3, name: 'bread slices', amount: 4, unit: '' },
      { id: 4, name: 'cheddar cheese', amount: 4, unit: 'slices' },
      { id: 5, name: 'dijon mustard', amount: 1, unit: 'tsp' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Mix tuna with mayo and mustard.' },
          { number: 2, step: 'Spread tuna on bread and top with cheese.' },
          { number: 3, step: 'Toast in a skillet until golden and cheese melts.' },
          { number: 4, step: 'Slice and serve warm.' },
        ],
      },
    ],
  },
  {
    id: 810150,
    title: 'Simple Marinated Chickpea Salad',
    image: 'https://img.spoonacular.com/recipes/810150-636x393.jpg',
    readyInMinutes: 15,
    servings: 4,
    summary: 'Bright chickpea salad marinated with lemon, herbs, and olive oil.',
    nutrition: { nutrients: [{ name: 'Calories', amount: 260, unit: 'kcal' }] },
    cuisines: ['Mediterranean'],
    dishTypes: ['salad', 'side dish', 'lunch'],
    extendedIngredients: [
      { id: 1, name: 'chickpeas', amount: 1, unit: 'can' },
      { id: 2, name: 'lemon juice', amount: 2, unit: 'tbsp' },
      { id: 3, name: 'olive oil', amount: 2, unit: 'tbsp' },
      { id: 4, name: 'parsley', amount: 0.25, unit: 'cup' },
      { id: 5, name: 'red onion', amount: 0.25, unit: '' },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: 'Rinse and drain chickpeas.' },
          { number: 2, step: 'Chop parsley and onion.' },
          { number: 3, step: 'Mix lemon juice and olive oil; season.' },
          { number: 4, step: 'Toss everything and let sit 5 minutes before serving.' },
        ],
      },
    ],
  },
];

export const getMockRecipes = (
  count: number,
  cuisineFilters: string[] = [],
  mealType?: string | null
): RecipeSummary[] => {
  let recipes = [...MOCK_RECIPES];

  if (cuisineFilters.length > 0) {
    recipes = recipes.filter(recipe =>
      recipe.cuisines?.some(cuisine =>
        cuisineFilters.some(filter => cuisine.toLowerCase().includes(filter.toLowerCase()))
      )
    );
  }

  const normalizedMealType = mealType?.trim().toLowerCase();
  if (normalizedMealType) {
    if (normalizedMealType === 'vegetarian') {
      recipes = recipes.filter(recipe => {
        const vegetarianFlag = recipe.vegetarian;
        if (typeof vegetarianFlag === 'boolean') return vegetarianFlag;

        const haystack = `${recipe.title ?? ''} ${recipe.summary ?? ''}`.toLowerCase();
        return haystack.includes('vegetarian');
      });
    } else {
      recipes = recipes.filter(recipe =>
        recipe.dishTypes?.some(dishType => dishType.trim().toLowerCase() === normalizedMealType)
      );
    }
  }

  const shuffled = recipes.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getMockRecipeById = (id: number): RecipeSummary | undefined => {
  return MOCK_RECIPES.find(recipe => recipe.id === id);
};
