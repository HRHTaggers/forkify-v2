import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

if(module.hot) {
    module.hot.accept();
}

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
      resultsView.renderSpinner();
    
      const query = searchView.getQuery();
      if (!query) return;

      await model.loadSearchResults(query); 
      
     // resultsView.render(model.state.search.results);
      resultsView.render(model.getSearchResultsPage(1));

    } catch(err) {
        console.log(err);
    }
};

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
};
init();
