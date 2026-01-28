import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { registerRequest, registerConfirm } from "../../services/auth.service";
import { type registerUser } from "../../types/auth";
import { handleApiError } from "../../utils/handleApiError";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../context/slices/authSlice";

const CreateAccount = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<registerUser>({
    email: "",
    code: "",
    login: "",
    firstname: "",
    lastname: "",
    password: "",
    phone1: "",
    phone2: "",
    address: "",
  });

  const navigate = useNavigate();

  const { t } = useTranslation();

  // gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // étape 1 : demander le code
  const handleNext = async () => {
    try {

      console.log("mail:" + formData.email);

      await registerRequest(formData.email);
      alert("Code envoyé à votre email ✅");
      setStep(2);
    } catch (err) {
      handleApiError(err);
    }
  };

  const reSendCode = async() => {
    try {
      await registerRequest(formData.email);
      alert("Code envoyé à votre email ✅");
    } catch (err) {
      handleApiError(err);
    }
  };

  const dispatch = useDispatch();
  // étape 2 : confirmer l'inscription
  const handleConfirm = async () => {
    try {
      const res = await registerConfirm(formData);
      //alert("Compte créé avec succès 🎉");
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      {step === 1 && (
        <div>
          <h2>Créer un compte</h2>
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
          />
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Vérification email</h2>
          <input type="email" name="email" value={formData.email} disabled />

          <input
            type="text"
            name="code"
            placeholder="Code reçu"
            value={formData.code}
            onChange={handleChange}
          />
          <input
            type="text"
            name="login"
            placeholder="Login"
            value={formData.login}
            onChange={handleChange}
          />
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Nom"
            value={formData.lastname}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone1"
            placeholder="Téléphone 1"
            value={formData.phone1}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone2"
            placeholder="Téléphone 2"
            value={formData.phone2}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            value={formData.address}
            onChange={handleChange}
          />

          <div style={{ marginTop: "10px" }}>
            <Button onClick={() => setStep(1)}>{t("dic.prev")}</Button>
            <Button onClick={reSendCode}>
              Renvoyer le code
            </Button>
            <Button onClick={handleConfirm}>{t("dic.confirm")}</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;