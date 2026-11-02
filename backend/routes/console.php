<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

Artisan::command('madeby:admin {email} {--name=MADEBY Admin}', function () {
    $email = $this->argument('email');
    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $this->error('A valid email is required.');

        return 1;
    }
    $password = $this->secret('Admin password (at least 12 characters)');
    if (strlen($password ?? '') < 12) {
        $this->error('Password must have at least 12 characters.');

        return 1;
    }
    $user = User::firstOrNew(['email' => $email]);
    $user->name = $this->option('name');
    $user->password = Hash::make($password);
    $user->is_admin = true;
    $user->save();
    $this->info('Admin account saved.');
})->purpose('Create or update an authorized MADEBY administrator');
