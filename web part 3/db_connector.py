
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta


uri = "mongodb+srv://shirshir:shirshir@cluster0.43wwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

cluster = MongoClient(uri, server_api=ServerApi('1'))
mydatabase = cluster['webproject']
users_collection = mydatabase['users']
appointments_collection = mydatabase["appointments"]
# salons_collection = db["salons"]  # טבלת מספרות

# פונקציה להוספת משתמש חדש
def insert_user(user_data):
    return users_collection.insert_one(user_data)
# פונקציה לקבלת כל המשתמשים
def get_users():
    return list(users_collection.find({}, {"_id": 0}))  # מחזיר רשימת משתמשים ללא ה-ID


# פונקציה להוספת תור חדש
def insert_appointment(appointment_data):
    return appointments_collection.insert_one(appointment_data)


# פונקציה לקבלת כל התורים
def get_appointments():
    return list(appointments_collection.find({}, {"_id": 0}))

# פונקציה לעדכון משתמש לפי אימייל
def update_user(email, new_data):
     return users_collection.update_one({"email": email}, {"$set": new_data})

# פונקציה למחיקת משתמש לפי אימייל
def delete_user(email):
    return users_collection.delete_one({"email": email})

def get_user_by_email(email):
    return users_collection.find_one({"email": email})

def get_fixed_times():
    return [f"{hour}:00" for hour in range(9, 19)]  # 09:00 עד 18:00

def generate_appointments_for_days(staff_name, num_days=30):
    """יוצר תורים קבועים לכל ספר ל-30 הימים הקרובים (לא כולל שישי ושבת)"""
    today = datetime.today()

    for day_offset in range(num_days):
        date_obj = today + timedelta(days=day_offset)
        date_str = date_obj.strftime("%Y-%m-%d")

        # דילוג על שישי (4) ושבת (5)
        if date_obj.weekday() in [4, 5]:
            continue

        start_time = datetime.strptime("08:00", "%H:%M")
        end_time = datetime.strptime("19:00", "%H:%M")
        delta = timedelta(hours=1)  # קביעת תורים של שעה

        while start_time < end_time:
            time_str = start_time.strftime("%H:%M")

            # בדיקה שהתור לא קיים כבר במסד הנתונים
            existing_appointment = appointments_collection.find_one({
                "staff": staff_name,
                "date": date_str,
                "time": time_str
            })

            if not existing_appointment:
                appointments_collection.insert_one({
                    "staff": staff_name,
                    "date": date_str,
                    "time": time_str,
                    "booked": False  # תור פנוי כברירת מחדל
                })

            start_time += delta  # קידום לשעה הבאה

    # יצירת תורים לכל הספרים ל-30 ימים קדימה
    for staff in ["daniel", "yael", "shira", "michal"]:
        generate_appointments_for_days(staff_name=staff, num_days=30)
