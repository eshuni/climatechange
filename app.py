from flask import Flask, request, render_template

app = Flask(__name__)

@app.route("/")
def index():
  return render_template("Navbar.html")

@app.route("/chartbar")
def chartbar():
  return render_template("chartbar.html")

@app.route("/choropleth")
def choro():
  return render_template("choropleth.html")

@app.route("/motion")
def motion():
  return render_template("motion.html")

@app.route("/weathertrends")
def weathertrends():
  return render_template("weathertrends.html")


if __name__ == "__main__":
  app.run()