import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopLoader from './components/TopLoader';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import AddGadget from './pages/AddGadget';
import DeleteGadget from './pages/DeleteGadget';
import FavoriteGadget from './pages/FavoriteGadget';
import MySelf from './pages/MySelf';

function App() {
  return (
    <>
      <TopLoader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-gadget" element={<AddGadget />} />
        <Route path="/delete-gadget" element={<DeleteGadget />} />
        <Route path="/favorite-gadget" element={<FavoriteGadget />} />
        <Route path="/myself" element={<MySelf />} />
      </Routes>
    </>
  );
}

export default App;
