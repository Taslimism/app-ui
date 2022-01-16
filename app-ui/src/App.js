import React from 'react';
import Canvas from './BasicConnection';


function App() {
    const sourceColor = 'rgb(192,192,0)';
    const destColor = 'rgb(0,192,192)';



    return (
        <div className="total-container">
            <Canvas sourceColor={sourceColor} destColor={destColor} />
        </div>
    );
}

export default App;