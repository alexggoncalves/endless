import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Root = () => {
    return (
        <>
            <Header />
            <div className="body">
                <Outlet/>
            </div>
        </>
    );
};

export default Root;
