import mysql.connector


def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # default user in XAMPP
        password="",  # default password is empty
        database="story"  # your database name
    )

def create_user(username, contact, password, age):
    db = connect_db()
    cursor = db.cursor()
    query = "INSERT INTO users (username, contact, password, age) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (username, contact, password, age))
    db.commit()
    cursor.close()
    db.close()

# Function to fetch all users
def get_all_users():
    db = connect_db()
    cursor = db.cursor()
    query = "SELECT * FROM users"
    cursor.execute(query)
    users = cursor.fetchall()
    cursor.close()
    db.close()
    return users

