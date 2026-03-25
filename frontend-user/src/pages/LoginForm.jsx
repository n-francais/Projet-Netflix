import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.password.trim()) newErrors.password = "Mot de passe requis";
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }
    setLoading(true);
    setApiError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setApiError(result.error || "Erreur lors de la connexion");
    }

    setLoading(false);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateForm());
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
        <h2 className="text-white text-2xl font-bold mb-6">Se connecter</h2>

        {apiError && (
          <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
          <div className="mb-6">
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

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="text-netflix-text text-sm mt-6">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
