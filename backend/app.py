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
    data = request.json  # Get the JSON data sent from JavaScript
      # Print data to the console (for demonstration)
    features = []
    for i in data:
        features.append(data[i])
    #features = torch.tensor(features).type(torch.float32)
    features = np.array(features).reshape(1,-1)
    print(features)
    preds = model2.predict(features)
    #unscaled = abs(preds*1000-((preds*1000)*(30/100)))
    #print(float(preds.item()))
    #print(scaler.inverse_transform(preds))
    preds = float(preds[0])
    return jsonify({'status': 'success', 'data_received': data,'data_sent':preds}), 200

if __name__ == '__main__':
    app.run(debug=True)
