import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" Component={Homepage} />
      <Route path='/chats' Component={Chatpage}/>
    </Routes>
    </div>
  );
}

export default App;
