import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="black-bg white-text">
            <Link className="logo" to={""}>endless</Link>
            <nav>
                <Link to={""}>EXPLORER</Link>
                <Link to={"/archive"}>ARCHIVE</Link>
                <Link to={"/about"}>ABOUT US</Link>
                <Link to={"/suggest"}>SUGGEST A SONG</Link>
            </nav>
        </header>
    );
};

export default Header;