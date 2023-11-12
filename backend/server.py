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
    'start' : [37.770581,-122.442550],
    'dest' : [37.765297,-122.442527],
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

        # print(data)
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
        
        # print(TRIP)
        
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


def get_str_from_co(point):
    return str(point[0]) + ", " + str(point[1])

def get_route_stat(start, dest):
    refresh_tok()
    # print(start, dest)
    #testing findRoute and getRoute
    st = get_str_from_co(start)
    end = get_str_from_co(dest)
    # print ({'Authorization': 'inrix_token', 'start' : st, 'dest' : end})
    response = requests.get(PROXY_SERVER+"/getroute",headers={'Authorization': inrix_token, 'start' : st, 'dest' : end})
    # print(response)
    # print(response.json())
    path_points = response.json()["result"]["trip"]["routes"][0]["points"]["coordinates"]
    avg_speed = response.json()["result"]["trip"]["routes"][0]["averageSpeed"]
    total_dist = response.json()["result"]["trip"]["routes"][0]["totalDistance"]

    return path_points, float(avg_speed), float(total_dist)

@app.route('/api/path', methods=['GET'])
def get_path():
    global TRIP
    data, x= get_route_stat(TRIP['start'], TRIP['dest'])
    return jsonify({'data': data})

# @app.route('/api/stops', methods=['GET'])
# def get_stops():
#     return jsonify({"data": [
#     { 
#       "stop_id": 1,
#       "locaation" : [40.7128, -74.006],
#       "info" :[
#       {"id" : 1,
#       "name": "XYZ HOTEL",
#       "type" : "restro",
#       "name": "Mission Bernal Campus Parking Garage",
#       "parkCount": 10,
#       "location": [40.7128, -74.006],
#       "address" : "new address"
#       }, 
#       {"id": 2,
#       "name": "ABC HOTEL",
#       "type" : "restro",
#       "parkCount": 2,
#       "location": [34.0522, -118.2437],
#       "address" : "new address"
#       }
#       ]
#     }
# ]})

def get_route_stat(start, dest):
    refresh_tok()
    # print(start, dest)
    #testing findRoute and getRoute
    st = get_str_from_co(start)
    end = get_str_from_co(dest)
    # print ({'Authorization': 'inrix_token', 'start' : st, 'dest' : end})
    response = requests.get(PROXY_SERVER+"/getroute",headers={'Authorization': inrix_token, 'start' : st, 'dest' : end})
    # print(response)
    # print(response.json())
    path_points = response.json()["result"]["trip"]["routes"][0]["points"]["coordinates"]
    avg_speed = response.json()["result"]["trip"]["routes"][0]["averageSpeed"]
    total_dist = response.json()["result"]["trip"]["routes"][0]["totalDistance"]

    return path_points, float(avg_speed), float(total_dist)



def get_stop_info(stop_array):
    refresh_tok()
    data = []
    for idx, point in enumerate(stop_array):
        curr = {
            "stop_id" : idx,
            "stop_location" : [point[1], point[0]],
        }
        response = requests.get(PROXY_SERVER+"/getnearbyinfo",headers={'Authorization': inrix_token,'lat' : str(point[1]), 'long' : str(point[0])})
        # print(response)
        rjson=response.json()
        curr["restro"] = rjson['data']
        response = requests.get(PROXY_SERVER+"/getparking",headers={'Authorization': inrix_token, 'lat' : str(point[1]), 'long' : str(point[0])})
        rjson=response.json()
        # print(response)
        # print("#############################################################################################", rjson)
        curr["parking"] = rjson['data']
        
        data.append(curr)    
    
    return data

@app.route('/api/stops', methods=['GET'])
def get_stops_new():
    global TRIP
    # print(TRIP)
    path_array, avg_speed, total_dist = get_route_stat(TRIP['start'], TRIP['dest'])
    stop_time = float(TRIP['stopAfter']) / 60
    stop_dist = avg_speed * stop_time
    
    prev = path_array[0]
    start = path_array[0]
    stop_point_array = []
    # print("stop_dist: ", stop_dist, "total :" , total_dist)
    if stop_dist < total_dist:
        for point in path_array[1:]:
            curr_dist = distance(point[0], point[1], start[0], start[1])
            # print(curr_dist)
            # print(point)
            if curr_dist == stop_dist : 
                stop_point_array.append(point)
                start = point
            elif curr_dist > stop_dist:
                stop_point_array.append(prev)
                start = prev
            else :
                prev = point
        
    print(stop_point_array)
    
    resp_dict = get_stop_info(stop_point_array)
    # print(resp_dict)
    
    return jsonify({'data': resp_dict})
            
        



if __name__ == '__main__':
    get_route_stat(TRIP['start'], TRIP['dest'])
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    


