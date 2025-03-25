import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from "./Nav.jsx";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;