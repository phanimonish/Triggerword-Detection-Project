from flask import Flask, request
from flask_cors import CORS
import os
from scipy.io import wavfile
import scipy.signal as sps
import numpy as np
import tensorflow as tf
import uuid
import datetime
import shutil

app = Flask(__name__)
CORS(app)

loaded = tf.saved_model.load("saved")

@app.route('/')
def index():
    return 'Welcome to Techolution!'


@app.route('/api/audio', methods=['POST'])
def input():
    audio = request.files['audio']
    audio.save(audio.filename)

    os.system("ffmpeg -i ./audio.webm ./audio.wav")

    new_rate = 16000
    # Read file
    sample_rate, clip = wavfile.read('audio.wav')

    # Resample data
    number_of_samples = round(len(clip) * float(new_rate) / sample_rate)
    clip = sps.resample(clip, number_of_samples)

    clip = np.asarray(clip, dtype=np.int16)

    filename = uuid.uuid4().hex
    wavfile.write(f'{filename}.wav', new_rate, clip)

    start = datetime.datetime.now()
    result = loaded(tf.constant(f'{filename}.wav'))
    end = datetime.datetime.now()

    res = (result["class_names"].numpy()[0]).decode()

    os.remove("audio.wav")
    os.remove("audio.webm")

    shutil.move(f'./{filename}.wav', f'./data/{res}/{filename}.wav')

    pred = result["predictions"].numpy()
    probs = tf.nn.softmax(pred[0])
    print(probs)
    max_prob = max(probs)
    print(max_prob)

    if max_prob > 0.5:
        return {"result": res, "exec_time": str(end - start)}
    else:
        return {"result": "", "exec_time": str(end - start)}

if __name__ == '__main__':
    app.run(debug=True)