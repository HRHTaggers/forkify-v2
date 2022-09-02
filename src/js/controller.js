import * as model from "./model";
import { MODAL_CLOSE_SEC } from "./config";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

const controlRecipes = async function () {
  try {
    //Identify recipe ID
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Show selected result in results view (class)
    resultsView.update(model.getSearchResultsPage());

    //Show selected bookmarks in bookmark view (class)
    bookmarksView.update(model.state.bookmarks);

    //Loading spinner
    recipeView.renderSpinner();

    //Find Recipe
    await model.loadRecipe(id);

    //Display Recipe
    recipeView.render(model.state.recipe);

  } catch (err) {

    recipeView.renderError(`We could not find that recipe. Please try another one.`);
    console.log(err);
  
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

const controlAddBookmark = function() {
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.removeBookmark(model.state.recipe.id);
    recipeView.update(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {

  //Render spinner
  addRecipeView.renderSpinner();

  //Upload form inputs to API
  await model.uploadRecipe(newRecipe);

  //Render recipe
  recipeView.render(model.state.recipe);

  //Display success message
  addRecipeView.renderSuccess();

  //Add bookmark to bookmarkView
  bookmarksView.render(model.state.bookmarks);

  //Update URL to include ID
  window.history.pushState(null, ``, `#${model.state.recipe.id}`);

  //Close form modal
  setTimeout(function() {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);
  
  } catch(err) {
  
    console.log(err);
    addRecipeView.renderError(err.message);
  
  }
}

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdate(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarksView.addHandlerRender(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
