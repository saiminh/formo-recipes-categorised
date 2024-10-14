function init() {
  const recipesModules = document.querySelectorAll('.formo2022-recipes-categorised')
  recipesModules.forEach(module => {
    const query = module.querySelector('.formo2022-recipes-query')
    const children = query.querySelectorAll('.formo2022-recipe')
    children.forEach(child => {
      child.setAttribute('data-ingredient-hidden', false);
      child.setAttribute('data-preptime-hidden', false);
      child.setAttribute('data-meal-hidden', false);
    })
    
    adjustQueryWidth(module);
  })
}

function adjustQueryWidth(module) {
  const isMobile = window.innerWidth < 782;
  const query = module.querySelector('.formo2022-recipes-query');
  const numberOfRecipes = query.querySelectorAll('.formo2022-recipe').length;
  const activeChildren = numberOfRecipes - recipesHidden(query);
  let childrenPerRow = Math.ceil(activeChildren / 2);
  if (childrenPerRow === 1) childrenPerRow = 2;
  let screens = isMobile ? (activeChildren / 4) : (activeChildren / 8);
  if (screens < 1) screens = 1;
  const noRecipeNotice = document.querySelector('.formo2022-no-recipes');
  addNavArrows(module, screens);
  if (activeChildren === 0) {
    noRecipeNotice.classList.add('shown');
  } 
  else if (screens === 1 && activeChildren > 0 && activeChildren < 6) {
    module.classList.add('gridflow-row');
    noRecipeNotice.classList.remove('shown');
  }
  else {
    noRecipeNotice.classList.remove('shown');
    module.classList.remove('gridflow-row');
  }
}

let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;

window.addEventListener('resize', () => {
  const widthChanged = window.innerWidth !== prevWidth;
  if (widthChanged) {
    const members = getRecipesData(document.querySelector('.formo2022-recipes-next'));
    members.query.style.transform = `translateX(0px)`;
  }
  prevWidth = window.innerWidth;
  prevHeight = window.innerHeight;
})

function getRecipesData(eventTarget) {
  const container = document.querySelector('.formo2022-recipes-query-outer');
  const containerWidth = container?.getBoundingClientRect().width || 0;
  const recipes = eventTarget.closest('.formo2022-recipes-categorised');
  const visibleRecipes = recipes.querySelectorAll('.formo2022-recipe:not([data-ingredient-hidden="true"])') || null;
  const query = recipes.querySelector('.formo2022-recipes-query');

  const data = {
    query: query,
    visibleRecipes: visibleRecipes,
    width: visibleRecipes ? Math.round(visibleRecipes[0].getBoundingClientRect().width) : 0,
    position: visibleRecipes ? visibleRecipes[0].getBoundingClientRect() : 0,
    containerPosition: container ? container.getBoundingClientRect() : 0,
    containerWidth: Math.round(containerWidth),
  }
  return data;
}

let isMoving = false;
const animationDuration = 300;

function addNavArrows(module, screens) {
  if( module.querySelector('.formo2022-recipes-next') ) {
    module.querySelector('.formo2022-recipes-next').remove();
  };
  if( module.querySelector('.formo2022-recipes-prev') ) {
    module.querySelector('.formo2022-recipes-prev').remove();
  };
  if (screens <= 1) return;
  const next = document.createElement('button');
  const prev = document.createElement('button');
  next.classList.add('formo2022-recipes-next');
  prev.classList.add('formo2022-recipes-prev');
  next.innerHTML = '>';
  prev.innerHTML = '<';
  module.appendChild(prev);
  prev.style.opacity = 0.4;
  module.appendChild(next);

  next.addEventListener('click', (e) => {
    if (isMoving) return;
    isMoving = true;

    const members = getRecipesData(e.target);
    const currentPosition =  Math.round(members.position.x) - Math.round(members.containerPosition.x);
    const overlap = members.containerWidth - Math.round(members.query.getBoundingClientRect().width);

    const isAtEnd = currentPosition <= overlap + 10;
    if ( isAtEnd ){ 
      isMoving = false;
      return 
    }

    const isMobile = window.innerWidth < 782;
    const factor = isMobile ? 2 : 4;

    const newPosition = currentPosition - members.width * factor;
    members.query.style.transform = `translateX(${newPosition}px)`;

    if ( newPosition <= overlap + 10 ) {
      next.style.opacity = 0.4;
      prev.style.opacity = 1;
    }
    else {
      next.style.opacity = 1;
      prev.style.opacity = 1;
    }
    // console.log('next ' + currentPosition + ' and ' + newPosition);
    setTimeout(() => { isMoving = false }, animationDuration);
  })

  prev.addEventListener('click', (e) => {
    if (isMoving) return;
    isMoving = true;
    const recipes = getRecipesData(e.target);

    const currentPosition =  Math.round(recipes.position.x) - Math.round(recipes.containerPosition.x);

    const isAtStart = Math.abs(Math.round(recipes.containerPosition.x) - Math.round(recipes.position.x)) <= 50  
    if ( isAtStart ){
      isMoving = false;
      return;
    } 

    const isMobile = window.innerWidth < 782;
    const factor = isMobile ? 2 : 4;

    const newPosition = currentPosition + Math.round(recipes.width) * factor; 
    recipes.query.style.transform = `translateX(${newPosition}px)`;
    if ( Math.floor(newPosition) <= 0 && Math.ceil(newPosition) >= -10 ){
      prev.style.opacity = 0.4;
      next.style.opacity = 1;
    }
    else {
      prev.style.opacity = 1;
      next.style.opacity = 1;
    }
    // console.log('prev ' + currentPosition + ' and ' + newPosition);
    setTimeout(() => { isMoving = false }, animationDuration);
  })
}

function toggleIngredient(event) {
  const module = event.currentTarget.closest('.formo2022-recipes-categorised');
  const ingredients = module.querySelector('.formo2022-recipes-ingredients');
  const activeingredientFilter = ingredients.querySelector('[data-filter-active="true"]');
  const activeingredient = activeingredientFilter ? activeingredientFilter.getAttribute('data-filter') : 'none';
  const query = module.querySelector('.formo2022-recipes-query')
  resetPosition(query);
  const children = query.querySelectorAll('.formo2022-recipe')
  const ingredient = event.currentTarget.getAttribute('data-filter');
  if (ingredient === activeingredient) {
    activeingredientFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.removeAttribute('data-filter-active');
    children.forEach(child => {
      if (child.getAttribute('data-ingredient-hidden') === 'true') {
        child.setAttribute('data-ingredient-hidden', false);
      }
    })
  } else {
    activeingredientFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.setAttribute('data-filter-active', true);
    children.forEach(child => {
      const childingredient = child.getAttribute('data-ingredient');
      if (ingredient === 'none') {
        child.removeAttribute('data-ingredient-hidden');
      } else {
        if (childingredient?.includes(ingredient)) {
          child.removeAttribute('data-ingredient-hidden');
        } else {
          child.setAttribute('data-ingredient-hidden', true);
        }
      }
    })
  }
  adjustQueryWidth(module);
}

function togglePreptime(event) {
  const module = event.currentTarget.closest('.formo2022-recipes-categorised');
  const preptimes = module.querySelector('.formo2022-recipes-preptimes');
  const activepreptimeFilter = preptimes.querySelector('[data-filter-active="true"]');
  const activepreptime = activepreptimeFilter ? activepreptimeFilter.getAttribute('data-filter') : 'none';
  const query = module.querySelector('.formo2022-recipes-query')
  resetPosition(query);
  const children = query.querySelectorAll('.formo2022-recipe')
  const preptime = event.currentTarget.getAttribute('data-filter');
  if (preptime === activepreptime) {
    activepreptimeFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.removeAttribute('data-filter-active');
    children.forEach(child => {
      if (child.getAttribute('data-preptime-hidden') === 'true') {
        child.setAttribute('data-preptime-hidden', false);
      }
    })
  } else {
    activepreptimeFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.setAttribute('data-filter-active', true);
    children.forEach(child => {
      const childpreptime = child.getAttribute('data-preptime');
      if (preptime === 'none') {
        child.removeAttribute('data-preptime-hidden');
      } else {
        if (childpreptime?.includes(preptime)) {
          child.removeAttribute('data-preptime-hidden');
        } else {
          child.setAttribute('data-preptime-hidden', true);
        }
      }
    })
  }
  adjustQueryWidth(module);
}

function toggleMeal(event) {
  const module = event.currentTarget.closest('.formo2022-recipes-categorised');
  const meals = module.querySelector('.formo2022-recipes-meals');
  const activemealFilter = meals.querySelector('[data-filter-active="true"]');
  const activemeal = activemealFilter ? activemealFilter.getAttribute('data-filter') : 'none';
  const query = module.querySelector('.formo2022-recipes-query')
  resetPosition(query);
  const children = query.querySelectorAll('.formo2022-recipe')
  const meal = event.currentTarget.getAttribute('data-filter');
  if (meal === activemeal) {
    activemealFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.removeAttribute('data-filter-active');
    children.forEach(child => {
      if (child.getAttribute('data-meal-hidden') === 'true') {
        child.setAttribute('data-meal-hidden', false);
      }
    })
  } else {
    activemealFilter?.setAttribute('data-filter-active', false);
    event.currentTarget.setAttribute('data-filter-active', true);
    children.forEach(child => {
      const childmeal = child.getAttribute('data-meal');
      if (meal === 'none') {
        child.removeAttribute('data-meal-hidden');
      } else {
        if (childmeal?.includes(meal)) {
          child.removeAttribute('data-meal-hidden');
        } else {
          child.setAttribute('data-meal-hidden', true);
        }
      }
    })
  }
  adjustQueryWidth(module);
}

function recipesHidden(query) {
  const children = query.querySelectorAll('.formo2022-recipe');
  let hidden = 0;
  // for every child of children check the attributes data-ingredient-hidden, data-preptime-hidden, data-meal-hidden. If one of them is set to true, increase hidden by 1
  children.forEach(child => {
    if (child.getAttribute('data-ingredient-hidden') === 'true' || child.getAttribute('data-preptime-hidden') === 'true' || child.getAttribute('data-meal-hidden') === 'true') {
      hidden++;
    }
  })
  return hidden;
}

document.querySelectorAll('.formo2022-recipes-ingredients > a').forEach(ingredient => {
  ingredient.addEventListener('click', toggleIngredient)
})
document.querySelectorAll('.formo2022-recipes-preptimes > a').forEach(preptime => {
  preptime.addEventListener('click', togglePreptime)
})
document.querySelectorAll('.formo2022-recipes-meals > a').forEach(meal => {
  meal.addEventListener('click', toggleMeal)
})

// const filters = document.querySelectorAll('.formo2022-recipes-filters > div');
// filters.forEach(filter => {
//   const label = filter.querySelector('.legend');
//   label.addEventListener('touchend', () => {
//     filter.classList.toggle('open');

//     // create an eventlistener for the first click outside of the filter and remove open
//     document.addEventListener('touchend', (e) => {
//       if (e.target !== label && e.target.getAttribute('data-filter')) {
//         filter.classList.remove('open');
//         document.removeEventListener('touchend', () => {});
//       }
//     })

//   })
// })

function resetPosition(query) {
  query.style.transform = 'translateX(0px)';
}

init();