from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # Looks for index.html inside the "templates" folder
    return render_template('index.html')

if __name__ == '__main__':
    # Runs the server on http://127.0.0.1:5000/
    app.run(debug=True)