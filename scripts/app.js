//import axios
import axios from 'axios';
// Select elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results');
const apiKey = '40db974f836a4c99af3584081fbcdc5d';

// Select elements for ingredients
const ingredientsForm = document.querySelector('#ingredients-form');
const ingredientsInput = document.querySelector('#ingredients-input');

// Event listener for the search form
if(searchForm) {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const query = searchInput.value;

    // Store the search query in the session storage
    sessionStorage.setItem('query', query);

    // Navigate to the results.html page
    window.location.href = 'results.html';
  });
}

// Event listener for the ingredients form
if (ingredientsForm) {
  ingredientsForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const ingredients = ingredientsInput.value;

    const recipes = await getRecipesByIngredients(ingredients);

    displayRecipes(recipes);
  });
}
// Function to fetch recipes from the API
export function getRecipes(query) {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => displayRecipes(data.results))
    .catch(error => console.error('Error:', error));
}

async function getRecipesByIngredients(ingredients) {
  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}`;

  try {
    const response = await axios.get(url);
    const recipes = response.data;
    return recipes;
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    return [];
  }
}

export function displayRecipes(recipes) {
  const resultsContainer = document.querySelector('#results');
  if (resultsContainer) {
    const html = recipes.map(recipe => {
      let recipeLink = `<a href="recipe.html?id=${recipe.id}">Go to Recipe</a>`;
      return `
        <div class="recipe">
          <img src="${recipe.image}" alt="${recipe.title}">
          <h2>${recipe.title}</h2>
          ${recipeLink}
        </div>
      `;
    }).join('');
    resultsContainer.innerHTML = html;
  }
}

// Get the search query from the session storage
const query = sessionStorage.getItem('query');

// Fetch and display the recipes
if (window.location.pathname.endsWith('results.html') && query && resultsContainer) {
  getRecipes(query);
}