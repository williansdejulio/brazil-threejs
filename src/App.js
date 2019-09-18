import React from "react";
import BrazilMap from "./components/scenes/brazilMap/BrazilMap";
import CubeTest from "./components/scenes/cubeTest/CubeTest"

export class App extends React.Component {

  render() {
    const brazil = true; // false

    return (
      <>
        {brazil && <BrazilMap />}
        {!brazil && <CubeTest />}
      </>
    );
  }
}

export default App;