
document.getElementById('query').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchRecipes();
  }
});

function searchRecipes() {
  const query = document.getElementById('query').value;
  const appId = 'YourID';
  const appKey = 'YourKey';
  const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayRecipes(data.hits);
    })
    .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
  
    recipes.forEach(recipe => {
      const { label, url, image } = recipe.recipe;
      
      const card = document.createElement('div');
      card.classList.add('recipe-card');
      
      const cardImage = document.createElement('img');
      cardImage.src = image;
      cardImage.alt = label;
      
      const cardTitle = document.createElement('h3');
      cardTitle.textContent = label;
      
      const cardLink = document.createElement('a');
      cardLink.href = url;
      cardLink.textContent = 'View Recipe';
      cardLink.target = '_blank';
      
      card.appendChild(cardImage);
      card.appendChild(cardTitle);
      card.appendChild(cardLink);
      
      recipeList.appendChild(card);
    });
  }
  
