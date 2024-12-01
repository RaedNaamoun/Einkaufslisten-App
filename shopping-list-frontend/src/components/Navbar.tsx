import './styles.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src="/einkaufsliste.png" alt="Einkaufsliste icon" />
            <h1>Einkaufsliste App</h1>
            <Link className='home' to="/">Home</Link>
        </nav>
    );
};

export default Navbar;
