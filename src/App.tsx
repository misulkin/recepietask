import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import SelectedPage from "./pages/SelectedPage";

function App() {
    return (
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/selected" element={<SelectedPage />} />
        </Routes>
    );
}

export default App;