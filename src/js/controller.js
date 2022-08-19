import * as model from "./model";
import recipeView from "./views/recipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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

controlRecipes();

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
};
init();
