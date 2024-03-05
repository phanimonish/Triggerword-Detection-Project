import Audio from "./Audio";
import logo from "./logo.jpg";
import { useState } from "react";

function App() {
  const [res, setRes] = useState();
  const [execTime, setExecTime] = useState();

  function sendAudio(blob) {
    const formData = new FormData();
    const file = new File([blob], "audio.webm");

    formData.append("audio", file);

    const postRequest = {
      method: "POST",
      body: formData,
    };

    fetch("http://localhost:5000/api/audio", postRequest)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const err = (data && data.message) || res.status;
          return Promise.reject(err);
        } else {
          let words = data.result.split("_");
          words = words.map(
            (str) => str.charAt(0).toUpperCase() + str.slice(1)
          );
          setRes(words.join(" ") + "!");
          setExecTime(data.exec_time);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <div className="left-content">
        <img className="logo" src={logo} alt=""></img>
        <h1> Provide a Voice Demo</h1>
        <Audio sendAudio={sendAudio} />
      </div>
      <div className="right-content">
        <h2 className="response">
          {"{ " + (res ? res : "Waiting for input...") + " }"}
        </h2>
        <p>Execution Time: {execTime ? execTime : "0"}</p>
      </div>
    </div>
  );
}

export default App;
