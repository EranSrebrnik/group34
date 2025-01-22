// בחר את כל הכפתורים
const serviceButtons = document.querySelectorAll('.service-btn');

// הוספת מאזין אירוע לכל כפתור
serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // הסר את המחלקה active מכל הכפתורים
        serviceButtons.forEach(btn => btn.classList.remove('active'));

        // הוסף את המחלקה active לכפתור שנלחץ
        button.classList.add('active');
    });
});
