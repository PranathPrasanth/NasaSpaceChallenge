from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
from network import CarbonEmissionModel
import joblib


app = Flask(__name__)
CORS(app)                            

model = CarbonEmissionModel(15,128,64,1)
model.eval()
model.load_state_dict(torch.load("carbon_emission_model.pth"))
model2 = joblib.load("xgb_carbon_emission_model.pkl")

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "service": "NASA Space Challenge Backend"
    })

@app.route('/send-data', methods=['POST'])
def receive_data():
    try:
        data = request.json

        print("Received JSON:", data)

        features = list(data.values())

        print("Features:", features)
        print("Feature count:", len(features))

        features = np.array(features, dtype=float).reshape(1, -1)

        print("Shape:", features.shape)

        preds = model2.predict(features)

        return jsonify({
            "status": "success",
            "data_sent": float(preds[0])
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
