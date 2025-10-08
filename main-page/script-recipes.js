const firstName = localStorage.getItem("firstName");
if (!firstName) {
    window.location.href = "../login-page/login.html";
}

document.getElementById("userName").textContent = firstName;

document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("firstName");
    window.location.href = "../login-page/login.html";
});

let allRecipes = [];
let filteredRecipes = [];
let displayedCount = 0;
const RECIPES_PER_PAGE = 6;

const recipesGrid = document.getElementById("recipesGrid");
const searchBar = document.getElementById("searchBar");
const cuisineSelect = document.getElementById("cuisineSelect");
const showingCount = document.getElementById("showingCount");
const totalCount = document.getElementById("totalCount");
const showMoreBtn = document.getElementById("showMoreBtn");

async function fetchRecipes() {
    try {
        const response = await fetch("https://dummyjson.com/recipes");
        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];
        
        populateCuisineFilter();
        displayRecipes();
        updateCounts();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipesGrid.innerHTML = '<div class="loading">Failed to load recipes. Please try again.</div>';
    }
}

function populateCuisineFilter() {
    const cuisines = [...new Set(allRecipes.map(recipe => recipe.cuisine))];
    cuisines.forEach(cuisine => {
        const option = document.createElement("option");
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineSelect.appendChild(option);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";
    
    const roundedRating = Math.round(recipe.rating);
    const stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
    const numericalRating = recipe.rating.toFixed(1);
    
    const ingredientsText = recipe.ingredients.slice(0, 3).join(", ");
    
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" onerror="this.src='https://via.placeholder.com/304x99?text=Recipe'">
        <div class="recipe-content">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-info">
                <span>${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                <span>${recipe.difficulty}</span>
                <span>${recipe.cuisine}</span>
            </div>
            <div class="recipe-ingredients">Ingredients: ${ingredientsText}${recipe.ingredients.length > 3 ? '...' : ''}</div>
            <div class="recipe-rating">
                <span class="stars">${stars}</span>
                <span>(${numericalRating})</span>
            </div>
            <button class="recipe-button">View Full Recipe</button>
        </div>
    `;
    
    return card;
}

function displayRecipes() {
    if (displayedCount === 0) {
        recipesGrid.innerHTML = "";
    }
    
    const recipesToShow = filteredRecipes.slice(displayedCount, displayedCount + RECIPES_PER_PAGE);
    
    if (recipesToShow.length === 0 && displayedCount === 0) {
        recipesGrid.innerHTML = '<div class="no-results">No recipes found matching your search.</div>';
        showMoreBtn.classList.add("hidden");
        return;
    }
    
    recipesToShow.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesGrid.appendChild(card);
    });
    
    displayedCount += recipesToShow.length;
    updateCounts();
    
    if (displayedCount >= filteredRecipes.length) {
        showMoreBtn.classList.add("hidden");
    } else {
        showMoreBtn.classList.remove("hidden");
    }
}

function updateCounts() {
    showingCount.textContent = displayedCount;
    totalCount.textContent = filteredRecipes.length;
}

function filterRecipes() {
    const searchTerm = searchBar.value.toLowerCase().trim();
    const selectedCuisine = cuisineSelect.value;
    
    filteredRecipes = allRecipes.filter(recipe => {
        const matchesSearch = !searchTerm || 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.cuisine.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
        
        return matchesSearch && matchesCuisine;
    });
    
    displayedCount = 0;
    recipesGrid.innerHTML = "";
    displayRecipes();
}

let debounceTimer;
function debounce(func, delay) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

searchBar.addEventListener("input", debounce(filterRecipes, 300));
cuisineSelect.addEventListener("change", filterRecipes);
showMoreBtn.addEventListener("click", displayRecipes);

fetchRecipes();