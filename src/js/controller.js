import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";

import "core-js/stable";
import "regenerator-runtime/runtime";


const controlRecipes = async function () {
  try {
    
    //Identify recipe ID
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Loading spinner
    recipeView.renderSpinner();

    //Find Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //Display Recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {

    recipeView.renderError(`We could not find that recipe. Please try another one.`);
  
  }
};

const controlSearchResults = async function() {
    try {
      const query = searchView.getQuery();
      if (!query) return;

      await model.loadSearchResults(query); 
      console.log(model.state.search.results); 
    } catch(err) {
        console.log(err);
    }
};

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
};
init();
