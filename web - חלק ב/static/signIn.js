const messages = {
    email: "אנא הזן כתובת אימייל תקינה.",
    password: "הסיסמה חייבת להיות באורך של לפחות 6 תווים."
};

function showError(input, message) {
// Check if an error message already exists next to this input
    let errorElement = input.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains("error-message")) {
        // Create a new error message span if none exists
        errorElement = document.createElement("span");
        errorElement.classList.add("error-message");
        errorElement.style.color = "red";
        errorElement.style.marginLeft = "1rem";
        errorElement.style.whiteSpace = "nowrap"; // Prevent text wrapping

        // Insert the error message immediately after the input field
        input.insertAdjacentElement("afterend", errorElement);
    }

    // Set the error message text
    errorElement.textContent = message;
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.remove(); // Remove the error message entirely
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, messages.email);
        return false;
    }
    clearError(email);
    return true;
}

function validatePassword(password) {
    if (password.value.length < 6) {
        showError(password, messages.password);
        return false;
    }
    clearError(password);
    return true;
}

// Main logic (executed when DOM is ready)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    form.addEventListener("submit", function (event) {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            event.preventDefault();
        }
    });
});
