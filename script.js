const mealsEle = document.getElementById('meals');

const searchTerm =document.getElementById('search-term');
const searchBtn =document.getElementById('search');

async function getRandomMeal(){
    const resp = await fetch('http://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    //console.log(randomMeal);

    addMeal(randomMeal, true);
}

getRandomMeal();
addMealToFav();

async function getMealById(id){
    const resp = await fetch('http://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
    //console.log(mealName);
}

//getMealById(52922);

async function getMealsBySearch(term){
    const resp = await fetch('http://www.themealdb.com/api/json/v1/1/search.php?s='+term);
    const respData = await resp.json();
    const meal = respData.meals;

    return meal;

}

function addMeal(mealData, random = false){

    const meal = document.createElement('div');
    meal.classList.add('meal');
    
    meal.innerHTML = `
        <div class = "meal-items">
            <div class="meal-header">
                ${random ? `
                <span class="random" onclick =location.reload();>
                Random Recipe
                </span>` : ''}
                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            </div>
            <div class="meal-body">
                <h4>${mealData.strMeal}</h4>
                <button class="fav-btn"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `

    const favBtn = meal.querySelector('.meal-body .fav-btn');

    favBtn.addEventListener('click',() =>{

        if(favBtn.classList.contains('active')){
            removeFromFavLS(mealData.idMeal);
            favBtn.classList.remove('active');
            removeMealFromFavDOM(mealData);
        }else{
            addToFavLS(mealData.idMeal);
            favBtn.classList.add('active');
            addMealToFavDOM(mealData);
        }

        // favRecipe.push(mealData.idMeal);
        // addMealToFav(mealData.idMeal);
    });


    mealsEle.appendChild(meal);
}

function addToFavLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}
function removeFromFavLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter((id)=>id !== mealId)));
}

function getMealsFromLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}   

async function addMealToFav(){
    
    const mealIds = getMealsFromLS();

    for(let i=0;i<mealIds.length;i++){
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealToFavDOM(meal);
    }
}

function addMealToFavDOM(mealData){
    const favs = document.querySelector('ul');
    const fav = document.createElement('li');
    fav.setAttribute('id',`${mealData.idMeal}`);
    fav.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class = "clear"><i class="fas fa-times"></i></button>
        `
    favs.appendChild(fav);

    const removeBtn = fav.querySelector('.clear');

    removeBtn.addEventListener("click",()=>{
        removeFromFavLS(mealData.idMeal);
        removeMealFromFavDOM(mealData);
    });
}

function removeMealFromFavDOM(mealData){
    const favs = document.querySelector('ul');
    const fav = document.getElementById(`${mealData.idMeal}`);
    favs.removeChild(fav);
}

searchBtn.addEventListener('click',async ()=>{
    mealsEle.innerHTML = '';
    const search = searchTerm.value;
    const meals = await getMealsBySearch(search);
   if(meals){
       meals.forEach((meal)=>{
           addMeal(meal);
       });
   }
});