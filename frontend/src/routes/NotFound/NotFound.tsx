import "./NotFound.scss";
import Img from "../../assets/404.png";

function NotFound () {
    return (
        <>
            <div className="container">
                <div className="notfound">
                    <img src={Img} alt=""/>
                </div>
            </div>
        </>
    );
}
export default NotFound;