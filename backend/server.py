from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/test', methods=['GET'])
def test():
    return jsonify({'data': 'HELLO '})

if __name__ == '__main__':
    app.run(debug=True)
