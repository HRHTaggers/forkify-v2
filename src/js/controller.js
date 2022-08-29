import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";

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

    //Show selected result in results view (class)
    resultsView.update(model.getSearchResultsPage());

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

      //Render pagination
      paginationView.render(model.state.search);

    } catch(err) {
        console.log(err);
    }
};

const controlPagination = function(goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination
  paginationView.render(model.state.search);
}

const controlServings = function(noServings) {
    //Update no. of servings
    model.updateServings(noServings);

    //Update recipe view
    recipeView.update(model.state.recipe);
};

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdate(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
