import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ForYou from "./pages/ForYou";
import Book from "./pages/Book";
import Player from "./pages/Player";
import Settings from "./pages/Settings";
import ChoosePlan from "./pages/ChoosePlan";

import AuthModal from "./components/AuthModal";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/for-you" element={<ForYou />} />

        <Route path="/book/:id" element={<Book />} />

        <Route path="/player/:id" element={<Player />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/choose-plan" element={<ChoosePlan />} />
      </Routes>

      <AuthModal />
    </>
  );
}

export default App;