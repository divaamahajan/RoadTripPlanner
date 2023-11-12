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
    'stopAfter' : 1  # in mins
}


app_id = ""
hash_token = ""
inrix_token=""
PROXY_SERVER = "http://127.0.0.1:8000/"

@app.route('/api/set_trip', methods=['POST'])
def set_trip():
    try:
        data = request.get_json()

        # Validate the input
        #if 'start' not in data or 'dest' not in data or 'stopAfter' not in data:
        #    return jsonify({'error': 'Invalid input. Please provide start, dest, and stopAfter'}), 400

        start = data['start']
        dest = data['dest']
        stopAfter = data['stopAfter']

        # Validate the coordinates
        #if len(start) != 2 or len(dest) != 2:
        #    return jsonify({'error': 'Invalid coordinates. Please provide lat and long for start and dest'}), 400

        # Create a route dictionary
        global TRIP
        TRIP = {
            'start' : start,
            'dest' : dest,
            'stopAfter': stopAfter
        }
        
        print(TRIP)
        
        return jsonify({'message': TRIP }), 201

    except Exception as e:
        print("error : " + str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'data': 'HELLO '})


def refresh_tok():
    response = requests.get(PROXY_SERVER+"/gettoken")

    rjson=response.json()
    global inrix_token 
    inrix_token = rjson['result']['token']


def get_route_stat(start, dest):
    refresh_tok()
    #testing findRoute and getRoute
    response = requests.get(PROXY_SERVER+"/getroute",headers={'Authorization': inrix_token, 'start' : start, 'dest' : dest})
    path_points = response.json()["result"]["trip"]["routes"][0]["points"]["coordinates"]
    avg_speed = response.json()["result"]["trip"]["routes"][0]["averageSpeed"]
    total_dist = response.json()["result"]["trip"]["routes"][0]["totalDistance"]

    return path_points, avg_speed, total_dist

@app.route('/api/path', methods=['GET'])
def get_path():
    data, x= get_route_stat(TRIP['start'], TRIP['dest'])
    return jsonify({'data': data})

@app.route('/api/stops', methods=['GET'])
def get_stops():
    return jsonify(
    {
  "data": [
    {
      "id": 123,
      "type": "restaurant",
      "name": "Chipotle",
      "parkCount": 3,
      "addedTime": 7,
      "location": [40.7128, -74.006]
    },
    {
      "id": 124,
      "type": "cafe",
      "name": "Starbucks",
      "parkCount": 2,
      "addedTime": 5,
      "location": [34.0522, -118.2437]
    },
    {
      "id": 125,
      "type": "bar",
      "name": "The Pub",
      "parkCount": 5,
      "addedTime": 10,
      "location": [51.5074, -0.1278]
    },
    {
      "id": 126,
      "type": "fast food",
      "name": "McDonald's",
      "parkCount": 1,
      "addedTime": 3,
      "location": [37.7749, -122.4194]
    },
    {
      "id": 127,
      "type": "pizza",
      "name": "Pizza Hut",
      "parkCount": 4,
      "addedTime": 8,
      "location": [45.4215, -75.6993]
    },
    {
      "id": 128,
      "type": "diner",
      "name": "Denny's",
      "parkCount": 2,
      "addedTime": 6,
      "location": [40.7128, -74.006]
    }
  ]
})

@app.route('/api/stop_points', methods=['GET'])
def get_stops_new():
    path_array, avg_speed= get_route_stat(TRIP['start'], TRIP['dest'])
    stop_time = TRIP['stopAfter']
    stop_dist = avg_speed * stop_time
    
    prev = path_array[0]
    start = path_array[0]
    stop_point_array = []
    for point in path_array[1:]:
        curr_dist = distance(point[0], point[1], start[0], start[1])
        print(curr_dist)
        print(point)
        if curr_dist == stop_dist : 
            stop_point_array.append(point)
            start = point
        elif curr_dist > stop_dist:
            stop_point_array.append(prev)
            start = prev
        else :
            prev = point
        
    print(stop_point_array)
    
    return jsonify({'data': stop_point_array})
            
        
    


if __name__ == '__main__':
    get_route_points_and_avg_speed(TRIP['start'], TRIP['dest'])
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    


