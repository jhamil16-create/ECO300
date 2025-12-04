<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

echo "Testing Authentication...\n";

$email = 'admintest@gmail.com';
$password = 'admintest123';

$user = User::where('Email', $email)->first();

if (!$user) {
    echo "User not found with email: $email\n";
    exit;
}

echo "User found: " . $user->Nombre . " (ID: " . $user->ID_Usuario . ")\n";
echo "Stored Hash: " . $user->Hash_Password . "\n";

$check = Hash::check($password, $user->Hash_Password);

if ($check) {
    echo "Hash::check PASSED. Password matches.\n";
} else {
    echo "Hash::check FAILED. Password does not match.\n";
    
    // Generate a new hash for comparison
    $newHash = Hash::make($password);
    echo "Expected Hash (for '$password'): $newHash\n";
}

// Test Auth::attempt manually just to see
// Note: Auth::attempt uses 'password' key by default, but our model uses 'Hash_Password'
// We need to see if Laravel's Auth::attempt works with our custom configuration
// Our User model has getAuthPassword() returning Hash_Password, so it might work if we pass 'password' in credentials
// but the query needs to find the user first. Auth::attempt finds by keys in credentials (except password).

echo "\nTesting Auth::attempt...\n";
$credentials = ['Email' => $email, 'password' => $password];
if (Auth::attempt($credentials)) {
    echo "Auth::attempt PASSED.\n";
} else {
    echo "Auth::attempt FAILED.\n";
}
