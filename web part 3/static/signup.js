const messages = {
    fullName: "אנא הזן שם מלא.",
    email: "אנא הזן כתובת אימייל תקינה.",
    gender: "אנא בחר את המין שלך.",
    birthdate: "אנא הזן תאריך לידה.",
    phone: "אנא הזן מספר טלפון תקין המתחיל ב-05.",
    address: "אנא הזן כתובת.",
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

// Validation functions
function validateFullName(fullName) {
    if (!fullName.value.trim()) {
        showError(fullName, messages.fullName);
        return false;
    }
    clearError(fullName);
    return true;
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

function validateGender(gender) {
    if (!gender.value) {
        showError(gender, messages.gender);
        return false;
    }
    clearError(gender);
    return true;
}

function validateBirthdate(birthdate) {
    if (!birthdate.value) {
        showError(birthdate, messages.birthdate);
        return false;
    }
    clearError(birthdate);
    return true;
}

function validatePhone(phone) {
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone.value)) {
        showError(phone, messages.phone);
        return false;
    }
    clearError(phone);
    return true;
}

function validateAddress(address) {
    if (!address.value.trim()) {
        showError(address, messages.address);
        return false;
    }
    clearError(address);
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
    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const gender = document.getElementById("gender");
    const birthdate = document.getElementById("birthdate");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const password = document.getElementById("password");

    form.addEventListener("submit", function (event) {
        const isFullNameValid = validateFullName(fullName);
        const isEmailValid = validateEmail(email);
        const isGenderValid = validateGender(gender);
        const isBirthdateValid = validateBirthdate(birthdate);
        const isPhoneValid = validatePhone(phone);
        const isAddressValid = validateAddress(address);
        const isPasswordValid = validatePassword(password);

        if (!isFullNameValid || !isEmailValid || !isGenderValid ||
            !isBirthdateValid || !isPhoneValid || !isAddressValid || !isPasswordValid) {
            event.preventDefault();
        }
    });
});
