from flask import Flask, render_template

app = Flask(__name__)

# דף הבית
@app.route('/')
def home():
    return render_template('index.html')

# עמוד אודות
@app.route('/about')
def about():
    return render_template('about.html')

# עמוד הזמנת תורים
@app.route('/appointments')
def appointments():
    return render_template('appointments.html')

# עמוד פרופיל משתמש
@app.route('/profile')
def profile():
    return render_template('profile.html')

# עמוד כניסה
@app.route('/signin')
def signin():
    return render_template('signIn.html')

# עמוד הרשמה
@app.route('/signup')
def signup():
    return render_template('signUp.html')

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
