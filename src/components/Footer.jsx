const Footer = ({absolute}) =>{
    return <footer className={`${absolute ? 'absolute-position' : undefined}`}>
        © 2024 Endless
    </footer>
}

export default Footer