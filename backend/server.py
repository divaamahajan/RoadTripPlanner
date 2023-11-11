from flask import Flask, jsonify, request

app = Flask(__name__)

input = {
    'start' : ['lat', 'long' ],
    'end' : ['lat', 'long' ],
    'stop_time' : 60  # in mins
}

TRIP = {}

@app.route('/input', methods=['POST'])
def add_route():
    try:
        data = request.get_json()

        # Validate the input
        if 'start' not in data or 'end' not in data or 'stop_time' not in data:
            return jsonify({'error': 'Invalid input. Please provide start, end, and stop_time'}), 400

        start = data['start']
        end = data['end']
        stop_time = data['stop_time']

        # Validate the coordinates
        if len(start) != 2 or len(end) != 2:
            return jsonify({'error': 'Invalid coordinates. Please provide lat and long for start and end'}), 400

        # Create a route dictionary
        TRIP = {
            'start': {'lat': start[0], 'long': start[1]},
            'end': {'lat': end[0], 'long': end[1]},
            'stop_time': stop_time
        }
        
        print(TRIP)
        
        return jsonify({'message': 'Route added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'data': 'HELLO '})

if __name__ == '__main__':
    app.run(debug=True)
