<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;

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

    // ------------------------------------------------------------------------------
    // Admin Trekking Route
    // ------------------------------------------------------------------------------

    Route::get("/trekking",function(){
        return Inertia::render("AdminPages/Trekking");
    });

    // ------------------------------------------------------------------------------
    // Admin Activities Route
    // ------------------------------------------------------------------------------

    Route::get("/activities",function(){
        return Inertia::render("AdminPages/Activities");
    });

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

});

require __DIR__.'/auth.php';
