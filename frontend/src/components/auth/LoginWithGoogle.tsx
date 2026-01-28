import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../services/auth.service";
import Button from "../ui/Button";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../context/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";


export default function LoginWithGoogle() {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;
        if (!token) {
          console.log("not!!");
          alert("Google token not found");
          return;
        }

        // // Call backend API
        const res = await loginWithGoogle(token);
        dispatch(loginSuccess(res.data));
      } catch (error) {      
        console.log(error);
        alert("Google login failed");
      }
    },
    onError: () => {
      alert("Google login error");
    },
    flow: "implicit", // or "auth-code" if i want to use the secret on the backend side!
  });

  return (
    <Button className="xxxx" onClick={() => googleLogin()}>
      <FontAwesomeIcon icon={faGoogle} /> {t("cnx.connectWithGoogle")}
    </Button>
  );
}