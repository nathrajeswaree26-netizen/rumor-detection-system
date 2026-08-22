import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

  // Handle login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.username || !formData.password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/login",
        formData
      );

      const data = response.data;

      console.log("Login response:", data);

      // Store JWT token
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response) {
        setError(
          `Login failed. Server returned ${error.response.status}.`
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the backend. Please check your backend connection."
        );
      } else {
        setError("Login failed. Please try again.");
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

          border: "1px solid rgba(255, 255, 255, 0.25)",

          borderRadius: "24px",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255,255,255,0.15)",

          color: "white",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Rumor Detection
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Sign in to your account
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.15)",
              border:
                "1px solid rgba(248,113,113,0.35)",
              color: "#fecaca",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

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

              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",

              cursor: loading
                ? "not-allowed"
                : "pointer",

              boxShadow:
                "0 8px 20px rgba(99,102,241,0.35)",

              opacity: loading ? 0.7 : 1,

              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}

            <Link
              to="/register"
              style={{
                color: "#67e8f9",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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

  color: "#ffffff",
  fontSize: "15px",

  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",

  transition: "all 0.3s ease",
};

export default Login;