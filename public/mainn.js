function logout() {
    const result = confirm("Are you sure you want to logout?");
    if (result) {
        // Redirect to the server logout route
        window.location.href = '/logout';
    }
}

// function reset() {
//     const result = confirm("Are you sure you want to Reset Password?");
//     if (result) {
//         // Redirect to the server logout route
//         window.location.href = '/reset';
//     }
// }