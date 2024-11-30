import SignIn from "pages/login/login";
// import { useNavigate } from "react-router-dom";
import store from "store";


const verification = async () => {
    // const navigate = useNavigate();
    try {

        const token = localStorage.getItem('access_token')

        if (token) {
            store.dispatch(SignIn({ type: 'verification', data: undefined }))
            sessionStorage.removeItem("page_loading")
        } else {
            // navigate("/");
        }

    } catch (error) {

    }
}

export default verification;