import instagram from "./../../assets/insta.png";
import facebook from "./../../assets/fb.png";
import spotify from "./../../assets/spotify.png";
import lines from "../../assets/lines.svg";

import "./about.css";

const About = () => {
    return (
        <div className="no-scroll">
            <div className="about-wrapper">
                <div className="about-us">
                    <h2 className="black-text about-title">About us</h2>
                    <p>
                        At Endless, we are passionate curators of musical
                        history and creativity. Our mission is to preserve the
                        rich tapestry of music across genres and eras, providing
                        a digital sanctuary where music enthusiasts, artists,
                        and researchers can explore, discover, and appreciate
                        the diverse and ever-evolving world of sound. With a
                        deep-rooted love for music, we've embarked on a journey
                        to curate an extensive archive that celebrates the
                        artistry, culture, and stories behind each note and
                        lyric. '
                    </p>
                    <p className="about-us">
                        Our team of dedicated music aficionados tirelessly sifts
                        through the annals of music history, unearthing hidden
                        gems, iconic classics, and emerging talents. Whether
                        you're seeking a timeless melody, a forgotten
                        masterpiece, or the latest groundbreaking sounds,
                        Endless is your portal to a world of musical discovery.
                        Join us in celebrating the power of music to inspire,
                        connect, and transcend boundaries as we continue to
                        curate, curate, and curate, keeping the melodies of the
                        past and the rhythms of the present alive for
                        generations to come.
                    </p>
                </div>
                <div className="contacts black-text">
                    <h3 className="contact-title">Contacts us</h3>
                    <div className="contact-label">PHONE</div>
                    <div className="contact-text">+351 912 345 678</div>
                    <div className="contact-label">EMAIL</div>
                    <div className="contact-text">main@mail.com</div>
                    <div className="contact-label">SOCIALS</div>
                    <div className="about-social-icons-wrapper">
                        <img src={instagram} alt="instagram" />
                        <img src={facebook} alt="spotify" />
                        <img src={spotify} alt="facebook" />
                    </div>
                </div>
            </div>
            <div className="divider-lines">
                <img src={lines} alt={"divider lines"} />
            </div>
        </div>
    );
};

export default About;
