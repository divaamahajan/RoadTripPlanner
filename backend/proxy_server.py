from flask import Flask, jsonify, request
import requests
import json, xmltodict

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

app_id = ""
hash_token = ""


# to query, call: http://localhost:8000/gettoken
@app.route('/gettoken', methods=['GET'])
def get_token():
    # Set up URL to query

    app_id = "eb8lmx7x2e"
    hash_token = "ZWI4bG14N3gyZXx5Q0dmQTZ6UjNoNlJONTI0eTlnNE4zclRYcFAzMmYwcThRSkpNSUFI"
    url = f"https://api.iq.inrix.com/auth/v1/appToken?appId={app_id}&hashToken={hash_token}"
    
    # Set up query method
    request_options = {
        'method': 'GET',
    }

    # Query INRIX for token
    response = requests.get(url)
    rjson = response.json()
    # Return token
    return rjson



@app.route('/getroute', methods=['GET'])
def findRoute():
    start = request.headers.get('start')
    dest = request.headers.get('dest')
    token = request.headers.get('Authorization')
    print(token)
    url = 'https://api.iq.inrix.com/findRoute'
    headers = {
    'accept': 'application/json',
    'Authorization': f'Bearer ${token}'
    }
    params = {
        'wp_1': start,
        'wp_2': dest,
        'routeOutputFields': 'P',
        'format': 'json',
    }

    response = requests.get(url, headers=headers, params=params)

    # Print the response or do further processing
    return response.json()



@app.route("/getpolygon", methods=['GET'])
def getPoly():
    token = request.headers.get('Authorization')
    url = 'https://api.iq.inrix.com/drivetimePolygons?center=37.770315%7C-122.446527&rangeType=A&duration=30'
    headers = {
    'accept': 'text/xml',
    'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        # If the response is in XML format, you can access it using response.text
        xml_response = response.text
        # Process the XML response as needed
        # For example, you can convert it to JSON using xmltodict library
        # json_response = xmltodict.parse(xml_response)
        # return json_response

        # Alternatively, you can return the XML directly if that's what you need
        json_response = json.dumps(xmltodict.parse(xml_response), indent=2)
        return json_response, 200
    else:
        return {'error': 'Failed to fetch data'}, response.status_code




# Starting server using the run function
if __name__ == '__main__':
    port = 8000
    app.run(port=port)
    print(f"Server has been started at http://127.0.0.1:{port}/")
