
from flask import Flask,render_template,request,jsonify,redirect,url_for,session
import Database as db

import base64

app = Flask(__name__)


@app.route("/")
def index():
  session.clear()
  return render_template("GP1.html")

app.secret_key = 'your_secret_key' 

@app.route('/login', methods=['GET', 'POST'])
def login():
    conn = db.connect_db()  # Ensure you're getting the correct database connection
    cursor = conn.cursor()

    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password'].strip()

        # Fetch user from database
        cursor.execute("SELECT password,user_id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user and user[0] == password:  # Direct password match
           
            session['user_id'] = user[1]
            print(user[1])  # Store user_id
            session['username'] = username
            returnTo = session.pop('returnTo', url_for('home'))
            return redirect(returnTo)


 
    return render_template('login.html')


@app.route('/get_comments', methods=['GET'])
def get_comments():
    story_id = request.args.get('story_id')
    session['story_id'] = story_id
    conn = db.connect_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT username, comment_text, created_at FROM comments WHERE story_id = %s ORDER BY created_at DESC",
        (story_id,)
    )
    comments = cursor.fetchall()
    conn.close()

    return jsonify(comments)

@app.route('/explore')
def explore():
    return render_template("explore.html")


@app.route('/add_comment', methods=['POST'])
def add_comment():
    print("Session Data in add_comment:", session)  # Debugging

    if 'user_id' not in session:
        session['returnTo'] = request.referrer  # Save where the user was
        return jsonify({"redirect": url_for("login")})  # JSON redirect

    data = request.json
    comment_text = data.get('comment')
    story_id = session.get('story_id')

    if not comment_text or not story_id:
        return jsonify({"error": "Missing required fields"}), 400

    user_id = session['user_id']
    username = session.get('username', 'Guest')

    conn = db.connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (story_id, user_id, username, comment_text, created_at) VALUES (%s, %s, %s, %s, NOW())",
        (story_id, user_id, username, comment_text)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Comment added successfully!"})

@app.route("/audiobook")
def audiobook():
    return render_template("audioBook.html")

@app.route("/book")
def book():
    return render_template("book.html")

@app.route("/home")
def home():
    return render_template("GP1.html")

@app.route("/thriller")
def thriller():
    return render_template("genre.html")

@app.route("/feelgood")
def feelgood():
    return render_template("genreFeelGood.html")

@app.route("/romance")
def romance():
    return render_template("genreRomance.html")

@app.route("/horror")
def horror():
    return render_template("genreHorror.html")

@app.route("/motivation")
def motivation():
    return render_template("genreMotivatinal.html")

@app.route("/cartoon")
def cartoon():
    return render_template("genreCartoon.html")

@app.route("/Profile")
def profile():
     # JSON redirect
    return render_template("Profile.html")

@app.route('/get_video', methods=['GET'])
def get_video():
    video_id = request.args.get('id')  # Get video ID from request

    conn = db.connect_db()
    cursor = conn.cursor(dictionary=True)

    # Fetch the selected video details
    cursor.execute("SELECT id, title, link, genre FROM videos WHERE id = %s", (video_id,))
    video = cursor.fetchone()

    if not video:
        conn.close()
        return jsonify({"error": "Video not found"}), 404

    genre = video['genre']

    # Fetch recommended videos (same genre, exclude current video)
    cursor.execute("""
        SELECT id, title, link, picture,genre
        FROM videos 
        WHERE genre = %s AND id != %s 
        LIMIT 3
    """, (genre, video_id))

 
    
    recommendations = cursor.fetchall()

    for rec in recommendations:
        if rec["picture"]:
            rec["picture_url"] = f"data:image/jpeg;base64,{base64.b64encode(rec['picture']).decode('utf-8')}"
        else:
            rec["picture_url"] = "/static/default.jpg"

  
    conn.close()

    return render_template("Storypage.html", video=video, recommendations=recommendations)




@app.route("/Signup", methods=['GET', 'POST'])
def Signup():
    if request.method == 'POST':  # When the form is submitted
        print("Form Data Received:", request.form)  # Debugging

        username = request.form.get('username')
        contact = request.form.get('contact')
        password = request.form.get('password')
        age = 18  # Default age

        try:
            db.create_user(username, contact, password, age)
            print("User created successfully")  # Debugging
            return redirect(url_for('home'))  # Redirect after signup
        except Exception as e:
            print("Error:", e)  # Debugging error messages

    # If it's a GET request, render the signup page
    return render_template('Signup.html')

if __name__ == '__main__':
    app.run(debug=True)