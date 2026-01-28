import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginService } from "../../services/auth.service";
import { loginSuccess } from "../../context/slices/authSlice";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import LoginWithGoogle from "../../components/auth/LoginWithGoogle";
import Button from "../../components/ui/Button";

export default function Login() {
  const dispatch = useDispatch();

  const [loginOrEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await loginService({ loginOrEmail, password });
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      alert(`Login failed: ${err}`);
    }
  };

  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("cnx.login")}</h2>
      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder={t("cnx.password")}
        onChange={e => setPassword(e.target.value)}
      />
      <Button onClick={submit}>{t("cnx.login")}</Button>
      <Link to="/create-account">{t("cnx.noAccSoCreate")}</Link>
      <LoginWithGoogle />
    </div>
  );
}