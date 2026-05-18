<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\TrekkingController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\FaqController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // API route to fetch authenticated user information
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // ###########################################################################################
    // API route to fetch Categories
    // ###########################################################################################


    Route::get('/categories', [CategoryController::class, 'index']);

    // ###########################################################################################
    // API route to fetch Sub-Categories
    // ###########################################################################################


    Route::get('/subcategories', [SubCategoryController::class, 'index']);

    // ###########################################################################################
    // API route to fetch Tours, Trekkings, and Activities
    // ###########################################################################################


    Route::get('/tours', [TourController::class, 'indexShow']);

    // ###########################################################################################
    // API route to fetch Trekkings
    // ###########################################################################################

    Route::get('/tours/{slug}', [TourController::class, 'indexShowTourSlug']);


    Route::get('/trekkings', [TrekkingController::class, 'indexShow']);

    // ############################################################################################
    // API route to fetch Activities
    // ############################################################################################

    Route::get('/trekkings/{slug}', [TrekkingController::class, 'indexShowTrekkingSlug']);

    Route::get('/activities', [ActivitiesController::class, 'indexShow']);

    Route::get('/activities/{slug}', [ActivitiesController::class, 'indexShowActivitySlug']);

    Route::get('/faqs', [FaqController::class, 'index']);


    // ############################################################################################
    // API route to fetch Tours, Trekkings, and Activities for Navbar
    // ############################################################################################

    Route::get('/navbartours', [TourController::class, 'indexNavbar']);

    Route::get('/navbartrekkings', [TrekkingController::class, 'indexNavbar']);

    Route::get('/navbaractivities', [ActivitiesController::class, 'indexNavbar']);