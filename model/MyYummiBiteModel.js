import { action, computed, makeObservable, observable, observe } from "mobx";
import React, { createContext } from "react";
import { fire } from "../database/firebase";


const URL_BASE = 'https://api.spoonacular.com/recipes';
const apiKey = "";
const numberOfRecipes = 1;


class MyYummiBiteModel {
    constructor() {
        this.randomRecipe = null;  
        this.favRecipes = [];      
        this.filters = [];       
        this.categorys = [];  
        this.activeCategory = null;
        this.recipesWithCategorys = [];

        makeObservable(this, {
            randomRecipe: observable,
            favRecipes: observable,
            filters: observable,
            recipeInfo: observable,
            categorys: observable,
            recipesWithCategorys: observable,
            activeCategory: observable,
            removeCategory: action,
            addFavRecipe: action,
            loadRandomRecipe: action,
            addFilter: action,
            addCategory: action,
            removeFilter: action,
            setRandomRecipe: action,
            setRecipeInfo: action,
            removeFavRecipe: action,
            setCategory: action,
            setActiveCategory: action,
        })
    }

    addFavRecipe(idParam, imageParam) {

        this.favRecipes.push({
            id: idParam,
            img: imageParam,
        });
    }

    addFilter(filter) {
        this.filters.push(filter);
    }

    addCategory(category) {
        this.categorys.push(category);
    }

    removeFilter(filter) {
        let index = this.filters.indexOf(filter);
        this.filters.splice(index, 1);
    }

    removeCategory(category) {
        let index = this.categorys.indexOf(category);
        this.categorys.splice(index, 1);
    }

    removeFavRecipe(recipe) {
        let index = this.favRecipes.indexOf(recipe);
        this.favRecipes.splice(index, 1);
    }

    setRandomRecipe(recipe) {
        this.randomRecipe = recipe;
    }

    setRecipeInfo(recipeInfo) {
        this.recipeInfo = recipeInfo;
    }

    setCategory(recipeParam, categoryParam, imageParam) {
        let flag = false;

        this.recipesWithCategorys.forEach((object) => {
            if (object.recipe === recipeParam) {
                object.category = categoryParam;
                flag = true;
            }
        });

        if (!flag) {
            this.recipesWithCategorys.push({
                recipe: recipeParam,
                category: categoryParam,
                image: imageParam
            });
        }
    }

    setActiveCategory(category) {
        this.activeCategory = category;
        console.log(this.activeCategory);
    }

    async loadRandomRecipe() {
        //de moment utilitzarem l'endpoint "complexSearch" en lloc del random, ja que també permet obtenir receptes random i a més podem guardar mes informacio que en la del random
        //hem de saber si tenim o no filtres activats
        if (this.filters.length === 0) {
            const response = await fetch(`${URL_BASE}/complexSearch?apiKey=${apiKey}&number=${numberOfRecipes}&sort=random&addRecipeNutrition=true`);
            const json = await response.json();
            this.setRandomRecipe(json.results);
        } else {
            const response = await fetch(`${URL_BASE}/complexSearch?apiKey=${apiKey}&number=${numberOfRecipes}&sort=random&addRecipeNutrition=true&cuisine=${this.filters}`);
            const json = await response.json();
            this.setRandomRecipe(json.results);
        }
    }
}

export const getRecipeInfo = async (id, setRecipeInfo) => {
    const response = await fetch(`${URL_BASE}/${id}/information?apiKey=${apiKey}&includeNutrition=true`);
    const recipeInfo = await response.json();
    /* console.log(`${URL_BASE}/${id}/information?apiKey=${apiKey}&includeNutrition=true`);
    console.log(recipeInfo); */
    setRecipeInfo(recipeInfo);
}

const model = new MyYummiBiteModel();

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => (
    <ModelContext.Provider value={model}>
        {children}
    </ModelContext.Provider>
);

