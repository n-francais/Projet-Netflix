import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    // Valider le nom
    if (!formData.name) {
      newErrors.name = "Nom requis";
    }
    // Valider l'email
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    // Valider le mot de passe
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Au moins 6 caractères";
    }
    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }
    setLoading(true);
    setApiError("");

    const result = await registerUser(
      formData.email,
      formData.password,
      formData.name,
    );

    if (result.success) {
      navigate("/");
    } else {
      setApiError(result.error || "Erreur lors de l'inscription");
    }

    setLoading(false);
  };

  const inputClass = (field) =>
    `w-full bg-netflix-gray/50 text-white rounded px-4 py-3 outline-none placeholder-netflix-text border ${
      touched[field] && errors[field]
        ? "border-primary"
        : "border-transparent focus:border-white/30"
    }`;

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <h1 className="text-primary text-5xl font-bold tracking-wider mb-8">
        NETFLIX
      </h1>

      {/* Formulaire */}
      <div className="border border-white/20 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6">S'inscrire</h2>

        {apiError && (
          <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Nom */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom"
              value={formData.name}
              onChange={handleChange("name")}
              onBlur={() => handleBlur("name")}
              className={inputClass("name")}
            />
            {touched.name && errors.name && (
              <p className="text-primary text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              className={inputClass("email")}
            />
            {touched.email && errors.email && (
              <p className="text-primary text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              className={inputClass("password")}
            />
            {touched.password && errors.password && (
              <p className="text-primary text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmer mot de passe */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              className={inputClass("confirmPassword")}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-primary text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded transition-colors disabled:opacity-60"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-netflix-text text-sm mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
