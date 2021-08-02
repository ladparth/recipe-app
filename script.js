const meals = document.getElementById('meals');
let favRecipe = [];

async function getRandomMeal(){
    const resp = await fetch('http://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    //console.log(randomMeal);

    addMeal(randomMeal, true);
}

getRandomMeal();


async function getMealById(id){
    const resp = await fetch('http://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
    //console.log(mealName);
}

//getMealById(52922);

async function getMealsBySearch(term){
    const meals = await fetch('http://www.themealdb.com/api/json/v1/1/search.php?s='+term);

}

function addMeal(mealData, random = false){

    const meal = document.createElement('div');
    meal.classList.add('meal');
    
    meal.innerHTML = `
        <div class="meal-header">
            ${random ? `
            <span class="random">
            Random Recipe
            </span>` : ''}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>
    `

    const favBtn = meal.querySelector('.meal-body .fav-btn');

    favBtn.addEventListener('click',() =>{
        favBtn.classList.toggle('active');
        favRecipe.push(mealData.idMeal);
        addMealToFav(mealData.idMeal);
    });


    meals.appendChild(meal);
}

async function addMealToFav(mealId){
    const meal = await getMealById(mealId);

    const favs = document.querySelector('ul');
    const fav = document.createElement('li');
    
    fav.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <span>${meal.strMeal}</span>
    `
    favs.appendChild(fav);
}