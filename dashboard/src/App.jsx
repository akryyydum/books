import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import AddBooks from "./pages/AddBooks";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
    <BrowserRouter>
      <Navbar />
      <div className="content">
      <Routes>
        <Route path="/" element={<AddBooks />} />
      </Routes>
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
