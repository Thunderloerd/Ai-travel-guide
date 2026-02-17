from flask import Flask, request, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # allow browser requests

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    resp = requests.post("http://localhost:11434/api/generate",
                         json=data, stream=True)

    def stream():
        for line in resp.iter_lines():
            if line:
                yield line.decode("utf-8") + "\n"

    return Response(stream(), mimetype="application/json")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
