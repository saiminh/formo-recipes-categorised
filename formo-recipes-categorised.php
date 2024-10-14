<?php
/**
 * Plugin Name:       Formo Recipes Categorised
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       formo-recipes-categorised
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

 function render_query_recipes( $block_attributes, $content) {
  global $result;
  
  
  $ingredients = get_terms( array(
    'taxonomy' => 'main_ingredient',
    'hide_empty' => false,
  ) );
  // create HTML string for each ingredient 
  $ingredientsAsString = '';
  foreach ($ingredients as $ingredient) {
    $ingredientsAsString = $ingredientsAsString.'<a data-filter="'.$ingredient->slug.'" data-filter-active="false">'.$ingredient->name.'</a>';
  }
  
  $preptimes = get_terms( array(
    'taxonomy' => 'preptime',
    'hide_empty' => false,
  ) );
  // create HTML string for each preptime 
  $preptimesAsString = '';
  foreach ($preptimes as $preptime) {
    $preptimesAsString = $preptimesAsString.'<a data-filter="'.$preptime->slug.'" data-filter-active="false">'.$preptime->name.'</a>';
  }
  
  $meals = get_terms( array(
    'taxonomy' => 'meal',
    'hide_empty' => false,
  ) );
  // create HTML string for each meal 
  $mealsAsString = '';
  foreach ($meals as $meal) {
    $mealsAsString = $mealsAsString.'<a data-filter="'.$meal->slug.'" data-filter-active="false">'.$meal->name.'</a>';
  }

  if (function_exists('pll__')) {
    $mainingredientsName  = pll__('Main Ingredients');
    $preptimeName = pll__('Preparation time');
    $mealName = pll__('Meal');
  } else {
    $mainingredientsName  = 'Main Ingredients';
    $preptimeName = 'Preparation time';
    $mealName = 'Meal';
  }

  $result = '';
  $result = $result.'<div class="formo2022-recipes-categorised">';
    $result = $result.'<div class="formo2022-recipes-filters">';
      $result = $result.'<div class="formo2022-recipes-meals"><span class="legend">'.$mealName.'</span>'.$mealsAsString.'</div>';
      $result = $result.'<div class="formo2022-recipes-preptimes"><span class="legend">'.$preptimeName.'</span>'.$preptimesAsString.'</div>';
        $result = $result.'<div class="formo2022-recipes-ingredients"><span class="legend">'.$mainingredientsName.'</span>'.$ingredientsAsString.'</div>';
    $result = $result.'</div>';
    $result = $result.'<div class="formo2022-recipes-query-outer">';
      $result = $result.'<div class="formo2022-recipes-query">';

  $args = array(  
    'post_type' => 'formo2022_recipe',
    'post_status' => 'publish',
    'posts_per_page' => -1, 
    'order' => 'ASC',
  );
  global $more;
  $loop = new WP_Query( $args ); 
      
  if ( !$loop->have_posts() ) {
      $result = $result.'<p class="no-recipes">There are no recipes at the moment.</p>';
  } 
  else {
    while ( $loop->have_posts() ) { 
      $loop->the_post();
      //get the department value of the current post and convert them to a string
      $mainingredient = get_the_terms( get_the_ID(), 'main_ingredient' );
      $mainingredientNameString = '';
      $mainingredientSlugString = '';
      if ($mainingredient !== false) {
        if (count($mainingredient) > 1) {
          $i = 0;
          foreach ($mainingredient as $ingredient) {
            if ($i == 0) {
              $mainingredientNameString = $ingredient->name;
              $mainingredientSlugString = $ingredient->slug;
            } else {
              $mainingredientNameString = $mainingredientNameString.' & '.$ingredient->name;
              $mainingredientSlugString = $mainingredientSlugString.', '.$ingredient->slug;
            }
            $i++;
          }
        } 
        else {
          $mainingredientNameString = $mainingredient[0]->name;
          $mainingredientSlugString = $mainingredient[0]->slug;
        }
      } 
      else {
        $mainingredientNameString = 'no-main-ingredient-assigned';
        $mainingredientSlugString = 'no-main-ingredient-assigned';
      }
      
      $preptime = get_the_terms( get_the_ID(), 'preptime' );
      $preptimeNameString = '';
      $preptimeSlugString = '';
      if ($preptime !== false && $preptime !== null) {
        if (count($preptime) > 1) {
          $i = 0;
          foreach ($preptime as $t) {
            if ($i == 0) {
              $preptimeNameString = $t->name;
              $preptimeSlugString = $t->slug;
            } else {
              $preptimeNameString = $preptimeNameString.' & '.$t->name;
              $preptimeSlugString = $preptimeSlugString.', '.$t->slug;
            }
            $i++;
          }
        } 
        else {
          $preptimeNameString = $preptime[0]->name;
          $preptimeSlugString = $preptime[0]->slug;
        }
      } 
      else {
        $preptimeNameString = 'no-preptime-assigned';
        $preptimeSlugString = 'no-preptime-assigned';
      }
      
      $meal = get_the_terms( get_the_ID(), 'meal' );
      $mealNameString = '';
      $mealSlugString = '';
      if ($meal !== false && $meal !== null) {
        if (count($meal) > 1) {
          $i = 0;
          foreach ($meal as $t) {
            if ($i == 0) {
              $mealNameString = $t->name;
              $mealSlugString = $t->slug;
            } else {
              $mealNameString = $mealNameString.' & '.$t->name;
              $mealSlugString = $mealSlugString.', '.$t->slug;
            }
            $i++;
          }
        } 
        else {
          $mealNameString = $meal[0]->name;
          $mealSlugString = $meal[0]->slug;
        }
      } 
      else {
        $mealNameString = 'no-preptime-assigned';
        $mealSlugString = 'no-preptime-assigned';
      }
      


      $recipethumbnail = get_the_post_thumbnail( get_the_ID() );
      $permalink = get_the_permalink();
      // if $recipethumbnail contains a sizes="*anything*" attribute, replace it it to 'sizes="(max-width: 782px) 40vw, 22vw"'
      if (strpos($recipethumbnail, 'sizes=') !== false) {
        $recipethumbnail = preg_replace('/sizes=".*?"/', 'sizes="(max-width: 782px) 40vw, 22vw"', $recipethumbnail);
      } else {
        $recipethumbnail = preg_replace('/<img/', '<img sizes="(max-width: 782px) 40vw, 22vw"', $recipethumbnail);
      }
      $recipename = get_the_title();
        
      $result = $result.
        '<div class="formo2022-recipe" data-ingredient="'.$mainingredientSlugString.'" data-preptime="'.$preptimeSlugString.'" data-meal="'.$mealSlugString.'">'.
          '<a class="formo2022-recipe-inner" href="'.$permalink.'">'.
            '<figure class="formo2022-recipe-thumbnail">'.$recipethumbnail.'</figure>'.
            '<div class="formo2022-recipe-content">'.
              '<h2 class="formo2022-recipe-fullname">'.$recipename.'</h2>'.
              '<div class="formo2022-recipe-description">with '.$mainingredientNameString.'</div>'.
            '</div>'.
          '</a>'.
        '</div>';
      $more = 1;
    }
    wp_reset_postdata(); 
  }
  $result = $result.
  '<div class="formo2022-no-recipes">'.
    '<p>No recipes found.</p>'.
  '</div>';
  $result = $result.'</div>';
  $result = $result.'</div>';
  $result = $result.'</div>';
  return $result;
}

function create_block_formo_recipes_categorised_block_init() {
	register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'render_query_recipes',
  ) );
}
add_action( 'init', 'create_block_formo_recipes_categorised_block_init' );
