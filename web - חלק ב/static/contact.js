const messages = {
    fullName: "אנא הזן שם מלא.",
    email: "אנא הזן כתובת אימייל תקינה.",
    phone: "אנא הזן מספר טלפון תקין המתחיל ב-05.",
    message: "אנא הזן הודעה.",
};

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("span");
        errorElement.classList.add("error-message");
        errorElement.style.color = "red";
        errorElement.style.marginLeft = "1rem";
        input.insertAdjacentElement("afterend", errorElement);
    }
    errorElement.textContent = message;
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.remove();
    }
}

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

function validatePhone(phone) {
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phone.value)) {
        showError(phone, messages.phone);
        return false;
    }
    clearError(phone);
    return true;
}

function validateMessage(message) {
    if (!message.value.trim()) {
        showError(message, messages.message);
        return false;
    }
    clearError(message);
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const fullName = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {
        const isFullNameValid = validateFullName(fullName);
        const isEmailValid = validateEmail(email);
        const isPhoneValid = validatePhone(phone);
        const isMessageValid = validateMessage(message);

        if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            event.preventDefault();
        }
    });
});
