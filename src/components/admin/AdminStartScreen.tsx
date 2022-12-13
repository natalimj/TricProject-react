import Constants from "../../util/Constants"
import '../../style/AdminStartScreen.css';
import QRCode from '../../util/icons/QRCode.svg';
import { Link } from "react-router-dom";

/**
 * Component for displaying Welcome Screen 
 * includes information about the application
 * and QR code for accessing the application
 *
 * @ author Daria-Maria Popa
 */
const AdminStartScreen = () => {
    return (
        <div className="admin-start-screen">
            <div className="admin-start-screen--header admin-start-screen--title">
                {Constants.START_SCREEN_TITLE} <Link to="/admin/result">{Constants.START_SCREEN_TITLE_ENDING}</Link>
            </div>
            <div className="admin-start-screen__body">
                <div className="admin-start-screen__steps">
                    <div className="admin-start-screen--header">
                        {Constants.START_SCREEN_STEP} 1
                        <div className="admin-start-screen--content">
                            {Constants.STEP1_TEXT}
                        </div>
                    </div>
                    <div className="admin-start-screen--header">
                        {Constants.START_SCREEN_STEP} 2
                        <div className="admin-start-screen--content">
                            {Constants.STEP2_TEXT}
                        </div>
                    </div>
                    <div className="admin-start-screen--header">
                        {Constants.START_SCREEN_STEP} 3
                        <div className="admin-start-screen--content">
                            {Constants.STEP3_TEXT}
                        </div>
                    </div>
                </div>
                <div className="admin-start-screen__qr">
                    <div className="admin-start-screen__qr--image">
                        <img src={QRCode} alt="QR code" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminStartScreen