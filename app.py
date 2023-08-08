import glob

from flask_cors import CORS
from flask_socketio import SocketIO
from flask import Flask, request, jsonify, send_from_directory
import os
import timeit

from converter import handle_file, tbl_to_txt


all_files = []

app = Flask(__name__, static_folder="my-app/build")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
UPLOAD_FOLDER = '.\DataFiles\\'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



@app.route('/')
def index():
    """
        Used for set up the app
    """
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/static/js/<path:path>')
def send_js(path):
    """
        Used for set up the app
    """
    return send_from_directory(os.path.join(app.static_folder, 'static', 'js'), path)


@app.route('/static/css/<path:path>')
def send_css(path):
    """
        Used for set up the app
    """
    return send_from_directory(os.path.join(app.static_folder, 'static', 'css'), path)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
        Used for set up the app
    """
    if path != "" and os.path.exists("my-app/build/" + path):
        return send_from_directory("my-app/build", path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/static/<path:path>')
def send_static_files(path):
    """
        Used for set up the app
    """
    return send_from_directory('my-app/build/static', path)


@app.route('/upload', methods=['POST'])
def upload():
    """
    Used for collect files dropped by user. We create an Upload Folder and then handle each file:
    Step 1: uncompress file if it is a compressed file
    Step 2: Manage lim files and file without extension
    """
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    files = request.files.getlist("file")

    for file in files:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        processed_file = handle_file(file_path)

        if processed_file is not None:
            all_files.append(processed_file)

    files.clear()

    return jsonify({'result': 'success'}), 200


@app.route('/options', methods=['GET', 'POST'])
def options():
    """
    Used for registering data in the database. We check if the user wants to register J-V measures.
    Then, we use the correct function for each type of file (txt, tbl or lim)
    tbl files are converted into txt.
    Finally, Upload Folder is cleared
    """
    if request.method == 'POST':
        start_time = timeit.default_timer()

        for file in all_files:

            filename = file.split("\\")[-1]

            tbl_to_txt(file)

            socketio.emit('message', {'data': f"Processing {filename}"})

        all_files.clear()

        if os.path.isdir("DataFiles"):
            for f in glob.glob("DataFiles\*"):
                os.remove(f)

        end_time = timeit.default_timer()
        print(f"Finished in {end_time - start_time} seconds")

        return jsonify({'result': 'success'})

    else:
        return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run(debug=True, port=3000)