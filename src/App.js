import React, { useEffect, useState } from 'react';
import DropboxUpload from './Dropbox';
import './App.css';

function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

const App = () => {
  const [exampleColor, setExampleColor] = useState('');
  const [firstOptions, setFirstOptions] = useState(''); // eslint-disable-line
  const [secondOptions, setSecondOptions] = useState(''); // eslint-disable-line

  useEffect(()=> {
    bindEvent(window, 'message', function (e) {
      console.log(e.data);
      const { color, firstinputs, secondinputs } = e.data;
      setExampleColor(color);
      setFirstOptions(firstinputs);
      setSecondOptions(secondinputs);
    });
  }, []);

  return (
    <div
      className="App"
        style={{
          backgroundColor: exampleColor
        }}
    >
      Test
      <DropboxUpload/>
    </div>
  );
}

export default App;
