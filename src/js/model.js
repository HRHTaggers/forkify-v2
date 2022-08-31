import { async } from "regenerator-runtime";
import { API_URL, RECIPES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: ``,
        results: [],
        page: 1,
        resultsPerPage: RECIPES_PER_PAGE,
    },
    bookmarks: [],
};

export const loadRecipe = async function(id) {
    try {

        const data = await getJSON(`${API_URL}/${id}`);

        const { recipe } = data.data;
        state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.pubisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        };
        if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
          state.recipe.bookmarked = true;}
        else {
            state.recipe.bookmarked = false;
        }

        console.log(state.recipe);
    
    } catch(err) {
    
        throw err;
    };
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            };
        });
        state.search.page = 1;
    } catch(err) {
        console.error(`${err}`);
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function(noServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity * noServings) / state.recipe.servings; 
    });

    state.recipe.servings = noServings;
};

export const addBookmark = function(recipe) {
    state.bookmarks.push(recipe);

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const removeBookmark = function(id) {
    const index = state.bookmarks.findIndex(element => element.id === id);
    state.bookmarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookmarked = false;
};