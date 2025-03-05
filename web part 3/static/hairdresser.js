document.addEventListener("DOMContentLoaded", function () {
    const staffRadios = document.querySelectorAll("input[name='staff']");
    const dateInput = document.querySelector(".calendar");
    const timeSlotsContainer = document.getElementById("time-slots");

    const staffSchedules = {
        daniel: {
            validDays: [0, 1, 2, 4],
            hours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
        },
        yael: {
            validDays: [0, 2, 3],
            hours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        },
        shira: {
            validDays: [0, 4],
            hours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
        },
    };

    function isValidDay(date, validDays) {
        const day = new Date(date).getDay();
        return validDays.includes(day);
    }

    function updateTimeSlots(staff, date) {
        timeSlotsContainer.innerHTML = ""; // ניקוי שעות קיימות

        const schedule = staffSchedules[staff];
        if (!isValidDay(date, schedule.validDays)) {
            timeSlotsContainer.innerHTML = "אין תורים זמינים ביום שנבחר.";
            return;
        }

        schedule.hours.forEach((time) => {
            const button = document.createElement("button");
            button.classList.add("time-slot", "available");
            button.textContent = time;

            // מאזין ללחיצה על הכפתור
            button.addEventListener("click", function () {
                // הסרת המחלקה 'selected' מכל הכפתורים
                const allButtons = timeSlotsContainer.querySelectorAll(".time-slot");
                allButtons.forEach((btn) => btn.classList.remove("selected"));

                // הוספת המחלקה 'selected' לכפתור הנבחר
                button.classList.add("selected");

                // הודעה עם השעה שנבחרה
                console.log(`נבחרה השעה: ${time}`);
            });

            timeSlotsContainer.appendChild(button);
        });
    }

    function updateMinMaxDates(staff) {
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 30);

        const schedule = staffSchedules[staff];

        let validMinDate = null;
        for (let d = new Date(today); d <= maxDate; d.setDate(d.getDate() + 1)) {
            if (isValidDay(d, schedule.validDays)) {
                validMinDate = validMinDate || new Date(d);
            }
        }

        dateInput.min = validMinDate ? validMinDate.toISOString().split("T")[0] : "";
        dateInput.max = maxDate.toISOString().split("T")[0];
    }

    staffRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const selectedDate = dateInput.value;
            updateMinMaxDates(this.value);
            if (selectedDate) {
                updateTimeSlots(this.value, selectedDate);
            } else {
                timeSlotsContainer.innerHTML = "בחר תאריך כדי לראות את התורים.";
            }
        });
    });

    dateInput.addEventListener("change", function () {
        const selectedStaff = document.querySelector("input[name='staff']:checked").value;
        updateTimeSlots(selectedStaff, this.value);
    });

    const defaultStaff = "daniel";
    updateMinMaxDates(defaultStaff);
    timeSlotsContainer.innerHTML = "בחר ספר ותאריך כדי לראות את התורים.";
});
