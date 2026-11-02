<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->boolean('is_admin')->default(false));
        Schema::create('creators', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('slug')->unique();
            $t->string('name');
            $t->string('role');
            $t->text('bio');
            $t->string('location');
            $t->string('avatar');
            $t->string('followers')->default('0');
            $t->string('likes')->default('0');
            $t->timestamps();
        });
        Schema::create('categories', function (Blueprint $t) {
            $t->id();
            $t->string('name')->unique();
            $t->string('slug')->unique();
            $t->timestamps();
        });
        Schema::create('listings', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->foreignId('creator_id')->constrained()->restrictOnDelete();
            $t->foreignId('category_id')->constrained()->restrictOnDelete();
            $t->string('type')->index();
            $t->string('title');
            $t->decimal('price', 12, 2)->nullable();
            $t->decimal('price_from', 12, 2)->nullable();
            $t->unsignedInteger('stock')->nullable();
            $t->unsignedInteger('commission_slots')->nullable();
            $t->string('delivery_time')->nullable();
            $t->decimal('rating', 2, 1)->default(0);
            $t->text('description');
            $t->json('tags')->nullable();
            $t->timestamps();
        });
        Schema::create('listing_images', function (Blueprint $t) {
            $t->id();
            $t->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $t->text('path');
            $t->boolean('uploaded')->default(false);
            $t->unsignedInteger('position')->default(0);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_images');
        Schema::dropIfExists('listings');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('creators');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('is_admin'));
    }
};
