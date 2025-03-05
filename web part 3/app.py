
from flask import Flask, render_template, request, redirect, url_for, session,flash,jsonify
from db_connector import *
app = Flask(__name__)
app.secret_key =  b'+\xcb\x0f\xa0\x02\x12\xd8\x16\xd4w\xb8i\xac\xd0?I'

@app.context_processor
def inject_user():
    if 'user_email' in session:
        return dict(user=session)  # כל הנתונים של המשתמש יהיו זמינים בכל העמודים
    return dict(user=None)

# דף הבית
@app.route('/')
def home():
    return render_template('index.html')

# עמוד אודות
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/appointments', methods=['GET', 'POST'])
def appointments():
    if 'user_email' not in session:
        return redirect(url_for('signin'))

    if request.method == 'POST':
        user_email = session['user_email']
        service = request.form["service"]
        staff = request.form["staff"]
        date = request.form["date"]
        time = request.form["time"]

        # בדיקה אם הספר כבר תפוס בשעה זו
        existing_appointment = appointments_collection.find_one({
            "staff": staff,
            "date": date,
            "time": time
        })

        if existing_appointment:
            flash("שגיאה: הספר תפוס בשעה זו, אנא בחר שעה אחרת.", "error")
            return redirect(url_for('appointments'))  # מונע הכנסת תור כפול

        # הכנסת התור למסד הנתונים **רק אם הוא פנוי**
        appointment_data = {
            "user_email": user_email,
            "service": service,
            "staff": staff,
            "date": date,
            "time": time
        }
        appointments_collection.insert_one(appointment_data)

        flash(f"תורך הוזמן בהצלחה, {session.get('full_name', 'לקוח')}! 🎉", "success")
        return redirect(url_for('appointments'))

    # שליפת תורים של המשתמש
    appointments_list = list(appointments_collection.find({"user_email": session['user_email']}))

    return render_template('appointments.html', appointments=appointments_list, user_email=session['user_email'])

@app.route('/available_times')
def available_times():
    date = request.args.get('date')
    staff = request.args.get('staff')
    if not date or not staff:
        return jsonify({"error": "Missing date or staff"}), 400
    # שעות עבודה קבועות
    WORK_HOURS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
    # שליפת תורים שכבר הוזמנו
    booked_appointments = set(appt["time"] for appt in appointments_collection.find({"date": date, "staff": staff}))
    # יצירת רשימה של כל השעות עם מצב הזמנה
    response = [{"time": time, "booked": time in booked_appointments} for time in WORK_HOURS]
    print(f"📅 תורים ל-{date}, ספר: {staff} --> {response}")  # ✅ הדפסת הנתונים למסוף Flask
    return jsonify(response)


# עמוד פרופיל משתמש
@app.route('/profile')
def profile():
    return render_template('profile.html')

# עמוד כניסה
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = get_user_by_email(email)  # שליפת המשתמש ממסד הנתונים

        if user and user["password"] == password:
            session['user_email'] = user["email"]
            session['full_name'] = user["full_name"]
            session['gender'] = user["gender"]
            session['birthdate'] = user["birthdate"]
            session['phone'] = user["phone"]
            session['address'] = user["address"]
            return redirect(url_for('home'))  # מעבר לעמוד הבית

        return render_template('signIn.html', error_message="אימייל או סיסמה שגויים!")

    return render_template('signIn.html')

# עמוד הרשמה
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        user_data = {
            "full_name": request.form["full-name"],
            "email": request.form["email"],
            "gender": request.form["gender"],
            "birthdate": request.form["birthdate"],
            "phone": request.form["phone"],
            "address": request.form["address"],
            "password": request.form["password"]
        }

        # בדיקה אם האימייל כבר קיים במסד הנתונים
        if get_user_by_email(user_data["email"]):
            return "שגיאה: אימייל זה כבר קיים במערכת."

        insert_user(user_data)  # שמירת הלקוח במסד הנתונים
        return redirect(url_for('signin'))  # לאחר הרשמה, הפניה למסך ההתחברות

    return render_template('signUp.html')
@app.route('/logout')
def logout():
    session.clear()  # מוחק את כל הנתונים מה-session
    return redirect(url_for('home'))  # מפנה לעמוד ההתחברות

# עמוד מספרות
@app.route('/salon')
def salon():
    return render_template('salon.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')
@app.route('/salonprofile')
def salonprofile():
    return render_template('salonprofile.html')


# הפעלת האפליקציה
if __name__ == '__main__':
    app.run(debug=True)



