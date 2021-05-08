import React, { useEffect } from 'react';
import './App.css';

function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

const App = () => {
  useEffect(()=> {
    bindEvent(window, 'message', function (e) {
      console.log(e);
    });
  }, []);

  return (
    <div className="App"/>
  );
}

export default App;
