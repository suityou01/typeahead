import React from 'react';
import { PinsScriptEditor } from './components/pins-script-editor';

function App() {
  return (
    <PinsScriptEditor
      rows="30"
      cols="50"
      fontFamily="Monaco"
    ></PinsScriptEditor>
  );
}

export default App;
