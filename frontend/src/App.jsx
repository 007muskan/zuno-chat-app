import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
