import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/UserContext.jsx";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import TransportList from "./TransportList.jsx";
import BookingDetails from "./BookingDetails.jsx";
import PersonalPlan from "./PersonalPlan.jsx";
import Preferences from "./Preferences.jsx";
import SeatSelection from "./SeatsSelection.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Aiplanner from "./Aiplanner.jsx";
import Destinations from "./Destinations.jsx";
import IndiaDestinationsPage from "./IndiaDestinationsPage.jsx";
import Book from "./Book.jsx";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <ScrollToTop/>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/destination/:destination" element={<Destinations />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/transports" element={<TransportList />} />
                    <Route path="/booking" element={<BookingDetails />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="/personal-plan" element={<PersonalPlan />} />
                    <Route path="/seatselection" element={<SeatSelection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/Aiplanner" element={<Aiplanner />} />
                    <Route path="/destinations" element={<IndiaDestinationsPage />} />
                    <Route path="/book" element={<Book />} />

                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;