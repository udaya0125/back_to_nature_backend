<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->change();
            $table->foreignId('trekking_id')->nullable()->change();
            $table->foreignId('activity_id')->nullable()->change();
            $table->foreignId('tour_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
            $table->foreignId('trekking_id')->nullable(false)->change();
            $table->foreignId('activity_id')->nullable(false)->change();
            $table->foreignId('tour_id')->nullable(false)->change();
        });
    }
};
