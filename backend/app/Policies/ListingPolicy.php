<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function create(User $user): bool
    {
        return (bool) $user->is_admin;
    }

    public function update(User $user, Listing $listing): bool
    {
        return (bool) $user->is_admin;
    }

    public function delete(User $user, Listing $listing): bool
    {
        return (bool) $user->is_admin;
    }
}
