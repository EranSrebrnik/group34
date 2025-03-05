document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[name="staff"]').forEach(staffRadio => {
        staffRadio.addEventListener("change", fetchAvailableTimes);
    });

    document.getElementById("appointment-date").addEventListener("change", fetchAvailableTimes);

    // טעינת זמני תורים ברירת מחדל
    fetchAvailableTimes();
});

function fetchAvailableTimes() {
    let selectedDate = document.getElementById("appointment-date").value;
    let selectedStaff = document.querySelector('input[name="staff"]:checked')?.value;
    let timeSlotsContainer = document.getElementById("time-slots");

    if (!selectedDate || !selectedStaff) {
        timeSlotsContainer.innerHTML = "<p>בחר ספר ותאריך כדי לראות זמני תורים פנויים</p>";
        return;
    }

    fetch(`/available_times?date=${selectedDate}&staff=${selectedStaff}`)
        .then(response => response.json())
        .then(data => {
            timeSlotsContainer.innerHTML = "";
            data.forEach(slot => {
                let timeButton = document.createElement("button");
                timeButton.classList.add("time-slot");
                timeButton.textContent = slot.time;

                if (slot.booked) {
                    timeButton.classList.add("unavailable");
                    timeButton.disabled = true;
                } else {
                    timeButton.classList.add("available");
                    timeButton.onclick = () => selectTime(timeButton, slot.time);
                }

                timeSlotsContainer.appendChild(timeButton);
            });
        })
        .catch(error => {
            console.error("Error fetching available times:", error);
            timeSlotsContainer.innerHTML = "<p>שגיאה בטעינת הזמנים</p>";
        });
}

function selectTime(button, time) {
    document.getElementById("selected-time").value = time;

    document.querySelectorAll(".time-slot").forEach(btn => {
        btn.classList.remove("selected");
        btn.style.backgroundColor = "";
    });

    button.classList.add("selected");
    button.style.backgroundColor = "#FF9999";
}

// מניעת שליחת הטופס בלי בחירת תור
document.querySelector("form").addEventListener("submit", function (event) {
    let selectedTime = document.getElementById("selected-time").value;
    if (!selectedTime) {
        alert("אנא בחר שעה לפני שליחת הבקשה.");
        event.preventDefault();
    }
});
