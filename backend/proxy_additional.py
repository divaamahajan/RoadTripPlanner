@app.route("/getnearbyinfo", methods=['GET'])
def getNearby():
    url = "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng"
    lat,long = 37.766798,-122.433094
    max_val = 20
    querystring = {"latitude":f"{lat}","longitude":f"{long}","limit":f"{max_val}","currency":"USD","distance":"2","open_now":"false","lunit":"km","lang":"en_US"}

    headers = {
        "X-RapidAPI-Key": "e14abafa05msh523b478b2eb875ep1d959ejsn4aa6f50f385d",
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    data = response.json()['data']

    restaurants = []
    for place in data:
        # Check if 'name', 'latitude', and 'longitude' exist in the current place
        if 'name' in place and 'latitude' in place and 'longitude' in place:
            name = place['name']
            latitude = place['latitude']
            longitude = place['longitude']
             
            restaurants.append({'Name': name, 'Latitude': latitude, 'Longitude': longitude})

    return jsonify({'data':restaurants})

@app.route("/getparking", methods=['GET'])
def getParking():
    token = request.headers.get('Authorization')
    headers = {
    'accept': 'text/xml',
    'Authorization': f'Bearer {token}'
    }
    lat,long = 37.783335, -122.439405
    radius_meters = 200
    url = f'https://api.iq.inrix.com/lots/v3?point={lat}%7C{long}&radius={radius_meters}&limit=3'

    response = requests.get(url,headers=headers)

    return response.json()