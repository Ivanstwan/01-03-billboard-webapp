import { useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="grid h-screen place-items-center">
        <Button>Click Me!</Button>
        <Button size="lg">Click Me!</Button>
        <Button size="lg" variant="destructive">
          Click Me!
        </Button>
        <Button size="lg" variant="outline">
          Click Me!
        </Button>
      </div>
    </>
  );
}

export default App;
