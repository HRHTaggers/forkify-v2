import * as model from "./model";
import recipeView from "./views/recipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
    alert(err);
  }
};

controlRecipes();

//Display recipe on page load/hashchange
[`hashchange`, `load`].forEach(event => window.addEventListener(event, controlRecipes));