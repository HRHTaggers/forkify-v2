import { async } from "regenerator-runtime";
import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: ``,
        results: [],
    },
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
                publisher: recipe.pubisher,
                image: recipe.image_url,
            };
        });
    } catch(err) {
        console.error(`${err}`);
        throw err;
    }
};