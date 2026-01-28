import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../context/store";
import { useTranslation } from "react-i18next";
import { toggleTheme, toggleLanguage } from "../../context/slices/uiSlice";
import { selectCartTotal } from "../../context/slices/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse, faCartShopping, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const total = useSelector(selectCartTotal);
  const user = useSelector((s: RootState) => s.auth.user);
  const theme = useSelector((s: RootState) => s.ui.theme);
  const lang = useSelector((s: RootState) => s.ui.language);
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="left">
        <Link to="/"><FontAwesomeIcon icon={faHouse} /></Link>
        <Link to="/about">{t("nav.about")}</Link>
        <Link to="/shop">{t("nav.shop")}</Link>
        <Link to="/contact">{t("nav.contact")}</Link>
        {user? (
          <>
            <Link to={user.userType === "admin" ? "/admin/dashboard" : "/client/dashboard"} title={user.name}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <LogoutButton />
          </>
        ) : 
        (
          <Link to="/login">{t("cnx.login")}</Link>
        )}
      </div>

      <div className="right">
        <div className="cart">
          <FontAwesomeIcon icon={faCartShopping} /> | {total.toFixed(2)} TND
        </div>

        {/* Toggle switches */}
        <div className="toggles">
          <button onClick={() => dispatch(toggleTheme())}>
            {theme === "light" ? (<><FontAwesomeIcon icon={faMoon} /> {t("nav.dark")}</>) : 
            (<><FontAwesomeIcon icon={faSun} /> {t("nav.light")}</>)}
          </button>

          <button onClick={() => dispatch(toggleLanguage())}>
            {lang === "fr" ? "🇬🇧" : "🇫🇷"}
          </button>
        </div>
      </div>
    </nav>
  );
}