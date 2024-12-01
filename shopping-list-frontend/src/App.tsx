import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShoppingListPage from './pages/ShoppingListPage';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lists/:id" element={<ShoppingListPage />} />
            </Routes>
        </Router>
    );
};

export default App;
