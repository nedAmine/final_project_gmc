import { useDispatch } from "react-redux";
import { logout } from "../../context/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleLogout = /*async*/ () => {
    //await new Promise(resolve => setTimeout(resolve, 2000));

    dispatch(logout());               // clear the store
    localStorage.removeItem("token"); // remove token
    navigate("/");          // manual redirection
  };

  return <Button onClick={handleLogout}>{t("cnx.logout")}</Button>;
}