import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ItemManagement from '../src/components/ItemManagement/ItemManagement';
import BillManagement from '../src/components/BillManagement/BillManagement';
import Navbar from '../src/components/Navbar/Navbar';




function App() {
    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path="/" element={<ItemManagement />} />
                        <Route path="/billManagement" element={<BillManagement />} />
                        <Route path="/navbar" element={<Navbar />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

