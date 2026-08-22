import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "USER",
      };

      console.log("Sending registration request:", requestData);
      console.log("API URL:", import.meta.env.VITE_API_URL);

      const response = await api.post(
        "/api/auth/register",
        requestData
      );

      console.log("Registration successful:", response.data);

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        if (Array.isArray(detail)) {
          const messages = detail.map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return item.msg || "Invalid input";
          });

          setError(messages.join(", "));
        } else {
          setError(String(detail));
        }

      } else if (error.response) {
        setError(
          `Registration failed. Server returned status ${error.response.status}.`
        );

      } else if (error.request) {
        setError(
          "Cannot connect to the backend. Please check the Railway backend URL."
        );

      } else {
        setError("Registration failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box",

        background:
          "radial-gradient(circle at top left, #6366f1 0%, transparent 35%), radial-gradient(circle at bottom right, #06b6d4 0%, transparent 35%), linear-gradient(135deg, #0f172a, #1e293b)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "35px",
          boxSizing: "border-box",

          background: "rgba(255, 255, 255, 0.12)",

          border:
            "1px solid rgba(255, 255, 255, 0.25)",

          borderRadius: "24px",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255,255,255,0.15)",

          color: "white",
        }}
      >
        {/* Header */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
              color: "white",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.75)",
              fontSize: "14px",
            }}
          >
            Register for the Rumor Detection System
          </p>
        </div>

        {/* Error */}

        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px",
              borderRadius: "10px",

              background:
                "rgba(239,68,68,0.15)",

              border:
                "1px solid rgba(248,113,113,0.35)",

              color: "#fecaca",

              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}

        <form onSubmit={handleSubmit}>
          {/* Username */}

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="username"
              style={labelStyle}
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          {/* Email */}

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={labelStyle}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="password"
              style={labelStyle}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          {/* Confirm Password */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="confirmPassword"
              style={labelStyle}
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",

              border: "none",
              borderRadius: "12px",

              background:
                "linear-gradient(135deg, #6366f1, #06b6d4)",

              color: "white",

              fontSize: "16px",
              fontWeight: "600",

              cursor: loading
                ? "not-allowed"
                : "pointer",

              boxShadow:
                "0 8px 20px rgba(99,102,241,0.35)",

              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}

            <Link
              to="/login"
              style={{
                color: "#67e8f9",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "14px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "13px 15px",
  boxSizing: "border-box",

  border:
    "1px solid rgba(255,255,255,0.25)",

  borderRadius: "12px",

  outline: "none",

  background:
    "rgba(255,255,255,0.10)",

  color: "white",

  fontSize: "15px",

  backdropFilter: "blur(10px)",

  WebkitBackdropFilter: "blur(10px)",
};

export default Register;