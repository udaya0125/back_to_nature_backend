<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\TrekkingController;
use App\Http\Controllers\FaqController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // ------------------------------------------------------------------------------
    // Admin Dashboard Route
    // ------------------------------------------------------------------------------

    Route::get("/",function(){
        return Inertia::render("AdminPages/Dashboard");
    });

    // ------------------------------------------------------------------------------
    // Admin Category Route
    // ------------------------------------------------------------------------------

    Route::get("/category",function(){
        return Inertia::render("AdminPages/Category");
    });

    Route::get('/ourcategories', [CategoryController::class, 'index'])->name('ourcategories.index');
    Route::post('/ourcategories', [CategoryController::class, 'store'])->name('ourcategories.store');
    Route::put('/ourcategories/{id}', [CategoryController::class, 'update'])->name('ourcategories.update');
    Route::delete('/ourcategories/{id}', [CategoryController::class, 'destroy'])->name('ourcategories.destroy');
    Route::get('categorywithsubcategory',[CategoryController::class,'indexWithSubCategory'])->name('categorywithsubcategory.indexWithSubCategory');

    // ------------------------------------------------------------------------------
    // Admin Sub-Category Route
    // ------------------------------------------------------------------------------

    Route::get("/sub-category",function(){
        return Inertia::render("AdminPages/SubCategory");
    });

    Route::get('/oursubcategories', [SubCategoryController::class, 'index'])->name('oursubcategories.index');
    Route::post('/oursubcategories', [SubCategoryController::class, 'store'])->name('oursubcategories.store');
    Route::put('/oursubcategories/{id}', [SubCategoryController::class, 'update'])->name('oursubcategories.update');
    Route::delete('/oursubcategories/{id}', [SubCategoryController::class, 'destroy'])->name('oursubcategories.destroy');

    // ------------------------------------------------------------------------------
    // Admin Tours Route
    // ------------------------------------------------------------------------------

    Route::get("/tours",function(){
        return Inertia::render("AdminPages/Tours");
    });

    Route::get('/ourtours', [TourController::class, 'index'])->name('ourtours.index');
    Route::post('/ourtours', [TourController::class, 'store'])->name('ourtours.store');
    Route::put('/ourtours/{id}', [TourController::class, 'update'])->name('ourtours.update');
    Route::delete('/ourtours/{id}', [TourController::class, 'destroy'])->name('ourtours.destroy');

    // ------------------------------------------------------------------------------
    // Admin Trekking Route
    // ------------------------------------------------------------------------------

    Route::get("/trekking",function(){
        return Inertia::render("AdminPages/Trekking");
    });

    Route::get('/ourtrekkings', [TrekkingController::class, 'index'])->name('ourtrekkings.index');
    Route::post('/ourtrekkings', [TrekkingController::class, 'store'])->name('ourtrekkings.store');
    Route::put('/ourtrekkings/{id}', [TrekkingController::class, 'update'])->name('ourtrekkings.update');
    Route::delete('/ourtrekkings/{id}', [TrekkingController::class, 'destroy'])->name('ourtrekkings.destroy');

    // ------------------------------------------------------------------------------
    // Admin Activities Route
    // ------------------------------------------------------------------------------

    Route::get("/activities",function(){
        return Inertia::render("AdminPages/Activities");
    });

    Route::get('/ouractivities', [ActivitiesController::class, 'index'])->name('ouractivities.index');
    Route::post('/ouractivities', [ActivitiesController::class, 'store'])->name('ouractivities.store');
    Route::put('/ouractivities/{id}', [ActivitiesController::class, 'update'])->name('ouractivities.update');
    Route::delete('/ouractivities/{id}', [ActivitiesController::class, 'destroy'])->name('ouractivities.destroy');

    // ------------------------------------------------------------------------------
    // Admin User Management Route
    // ------------------------------------------------------------------------------

    Route::get("/user-management",function(){
        return Inertia::render("AdminPages/UserManagement");
    });

    // ###################################
    // User Management API Route
    //####################################

    Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');      
    Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');     
    Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update'); 
    Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');

    // ------------------------------------------------------------------------------
    // Admin Activity Logs Route
    // ------------------------------------------------------------------------------

    Route::get("/activity-logs",function(){
        return Inertia::render("AdminPages/ActivityLogs");
    });

    // ###################################
    // Activity Logs API Route
    //####################################

    Route::get('/ourlogs', [ActivityLogsController::class, 'index'])->name('ourlogs.index');  


    Route::get("/faqs",function(){
        return Inertia::render("AdminPages/FAQ");
    });

    Route::get('/ourfaqs', [FaqController::class, 'index'])->name('ourfaqs.index');
    Route::post('/ourfaqs', [FaqController::class, 'store'])->name('ourfaqs.store');
    Route::put('/ourfaqs/{id}', [FaqController::class, 'update'])->name('ourfaqs.update');
    Route::delete('/ourfaqs/{id}', [FaqController::class, 'destroy'])->name('ourfaqs.destroy');

});

require __DIR__.'/auth.php';
