from flask import Flask, jsonify, request
import requests
import json, xmltodict
from math import cos, asin, sqrt, pi

from flask_cors import CORS

def distance(lat1, lon1, lat2, lon2):
    r = 3958.756 # km
    p = pi / 180

    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 2 * r * asin(sqrt(a))

app = Flask(__name__)
CORS(app)


TRIP = {
    'start' : '37.770581,-122.442550',
    'dest' : '37.765297,-122.442527',
    'stopAfter' : 15  # in mins
}


app_id = ""
hash_token = ""
inrix_token=""
PROXY_SERVER = "http://127.0.0.1:8000/"

@app.route('/set_trip', methods=['POST'])
def set_trip():
    try:
        data = request.get_json()

        # Validate the input
        if 'start' not in data or 'dest' not in data or 'stopAfter' not in data:
            return jsonify({'error': 'Invalid input. Please provide start, dest, and stopAfter'}), 400

        start = data['start']
        dest = data['dest']
        stopAfter = data['stopAfter']

        # Validate the coordinates
        if len(start) != 2 or len(dest) != 2:
            return jsonify({'error': 'Invalid coordinates. Please provide lat and long for start and dest'}), 400

        # Create a route dictionary
        global TRIP
        TRIP = {
            'start': {'lat': start[0], 'long': start[1]},
            'dest': {'lat': dest[0], 'long': dest[1]},
            'stopAfter': stopAfter
        }
        
        print(TRIP)
        
        return jsonify({'message': TRIP }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'data': 'HELLO '})


def refresh_tok():
    response = requests.get(PROXY_SERVER+"/gettoken")

    rjson=response.json()
    global inrix_token 
    inrix_token = rjson['result']['token']


def get_route_points_and_avg_speed(start, dest):
    refresh_tok()
    #testing findRoute and getRoute
    response = requests.get(PROXY_SERVER+"/getroute",headers={'Authorization': inrix_token, 'start' : start, 'dest' : dest})
    path_points = response.json()["result"]["trip"]["routes"][0]["points"]["coordinates"]
    avg_speed = response.json()["result"]["trip"]["routes"][0]["averageSpeed"]
    print(path_points)
    print(avg_speed)
    return path_points, avg_speed

@app.route('/stops', methods=['GET'])
def get_stops():
    data, x= get_route_points_and_avg_speed(TRIP['start'], TRIP['dest'])
    return jsonify({'data': data})


if __name__ == '__main__':
    get_route_points_and_avg_speed(TRIP['start'], TRIP['dest'])
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    


