import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pdf from "./pages/pdf";
import CodeExplainerPage from "./pages/CodeExplainerPage";
import Roadmap from "./pages/Roadmap";
import Quiz from "./pages/quiz";
import ResumePage from "./pages/ResumePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pdf" element={<Pdf />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/code"element={<CodeExplainerPage/>}/>
        <Route path="/resume" element={<ResumePage/>} />
    </Routes>
  );
}


export default App;
