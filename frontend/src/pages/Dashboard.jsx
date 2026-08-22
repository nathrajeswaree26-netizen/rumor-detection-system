
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ============================================================
  // PREDICT
  // ============================================================

  const handlePredict = async () => {
    setError("");
    setResult(null);

    if (!text.trim()) {
      setError("Please enter a statement to analyze.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/predict", {
        text: text.trim(),
      });

      console.log("Prediction response:", response.data);

      setResult(response.data);

      // Add prediction to history
      setHistory((previousHistory) => [
        {
          id: Date.now(),
          text: text.trim(),
          predicted_label: response.data.predicted_label,
          confidence: response.data.confidence,
          model_name: response.data.model_name,
        },
        ...previousHistory,
      ]);

    } catch (error) {
      console.error("Prediction error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Unable to connect to the prediction API."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ============================================================
  // BACKEND RESPONSE
  // ============================================================

  const prediction =
    result?.predicted_label ||
    result?.prediction ||
    result?.label ||
    result?.result ||
    result?.classification;

  const confidence =
    result?.confidence ??
    result?.probability ??
    result?.score;

  const modelName =
    result?.model_name ||
    "TF-IDF + Logistic Regression";

  // ============================================================
  // CHECK RUMOR
  // ============================================================

  const predictionText = String(
    prediction || ""
  ).toLowerCase();

  const isRumor =
    predictionText === "rumor" ||
    predictionText === "rumour" ||
    predictionText.includes("rumor") ||
    predictionText.includes("rumour");

  // ============================================================
  // CONFIDENCE
  // ============================================================

  let confidencePercentage = 0;

  if (typeof confidence === "number") {
    confidencePercentage =
      confidence <= 1
        ? confidence * 100
        : confidence;
  }

  confidencePercentage = Math.min(
    Math.max(confidencePercentage, 0),
    100
  );

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="dashboard">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div className="header-content">

          <div className="brand-section">
            <div className="brand-icon">
              🛡️
            </div>

            <div>
              <h1>Rumor Detection System</h1>

              <p>
                Welcome,{" "}
                <strong>
                  {user?.username || "User"}
                </strong>
              </p>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="dashboard-container">

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="dashboard-intro">

          <div className="intro-icon">
            🔍
          </div>

          <div>
            <h2>Analyze Information</h2>

            <p>
              Use our machine learning model to determine
              whether a statement is likely to be a rumor.
            </p>
          </div>

        </section>


        {/* ====================================================
            PREDICTION CARD
        ==================================================== */}

        <section className="prediction-card">

          <div className="card-title">

            <span className="section-badge">
              AI ANALYSIS
            </span>

            <h2>Detect Rumor</h2>

            <p>
              Enter a social media post, news statement,
              or any text you want to analyze.
            </p>

          </div>


          <div className="textarea-wrapper">

            <textarea
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              placeholder="Enter the statement you want to analyze..."
              disabled={loading}
            />

            <span className="character-count">
              {text.length} characters
            </span>

          </div>


          {/* ERROR */}

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}


          {/* PREDICT BUTTON */}

          <button
            className="predict-button"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Detect Rumor
              </>
            )}
          </button>

        </section>


        {/* ====================================================
            RESULT
        ==================================================== */}

        {result && (
          <section className="result-card">

            <div className="result-heading">
              <div>
                <span className="section-badge">
                  ANALYSIS COMPLETE
                </span>

                <h2>Prediction Result</h2>
              </div>

              <div className="result-status">
                ✓ Complete
              </div>
            </div>


            {/* CLASSIFICATION */}

            <div
              className={
                isRumor
                  ? "result-box rumor"
                  : "result-box not-rumor"
              }
            >

              <div className="result-icon">
                {isRumor ? "⚠️" : "✓"}
              </div>

              <div className="result-label">

                <span>
                  Classification
                </span>

                <strong>
                  {prediction
                    ? prediction.toUpperCase()
                    : "UNKNOWN"}
                </strong>

              </div>

            </div>


            {/* CONFIDENCE */}

            {confidence !== undefined && (
              <div className="confidence-section">

                <div className="confidence-header">

                  <span>
                    Model Confidence
                  </span>

                  <strong>
                    {confidencePercentage.toFixed(2)}%
                  </strong>

                </div>

                <div className="confidence-bar">

                  <div
                    className="confidence-fill"
                    style={{
                      width: `${confidencePercentage}%`,
                    }}
                  />

                </div>

              </div>
            )}


            {/* MODEL */}

            <div className="model-info">

              <div className="info-icon">
                🤖
              </div>

              <div>
                <span>Machine Learning Model</span>

                <strong>
                  {modelName}
                </strong>
              </div>

            </div>


            {/* ANALYZED TEXT */}

            <div className="analyzed-text">

              <h3>
                Analyzed Text
              </h3>

              <p>
                {text}
              </p>

            </div>


            {/* API RESPONSE */}

            <details className="response-details">

              <summary>
                View API Response
              </summary>

              <pre>
                {JSON.stringify(
                  result,
                  null,
                  2
                )}
              </pre>

            </details>

          </section>
        )}


        {/* ====================================================
            HISTORY
        ==================================================== */}

        <section className="history-card">

          <div className="history-header">

            <div>

              <span className="section-badge">
                ACTIVITY
              </span>

              <h2>
                Prediction History
              </h2>

              <p>
                Your recent rumor detection results
              </p>

            </div>

            <div className="history-count">
              {history.length}
            </div>

          </div>


          {history.length === 0 ? (

            <div className="empty-history">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No predictions yet
              </h3>

              <p>
                Your prediction history will appear here
                after you analyze some text.
              </p>

            </div>

          ) : (

            <div className="history-list">

              {history.map((item) => {

                const itemConfidence =
                  typeof item.confidence === "number"
                    ? item.confidence <= 1
                      ? item.confidence * 100
                      : item.confidence
                    : 0;

                const itemIsRumor =
                  String(
                    item.predicted_label || ""
                  )
                    .toLowerCase()
                    .includes("rumor") ||
                  String(
                    item.predicted_label || ""
                  )
                    .toLowerCase()
                    .includes("rumour");

                return (
                  <div
                    className="history-item"
                    key={item.id}
                  >

                    <div className="history-text">

                      <p>
                        {item.text}
                      </p>

                    </div>


                    <div className="history-result">

                      <span
                        className={
                          itemIsRumor
                            ? "history-label rumor"
                            : "history-label not-rumor"
                        }
                      >
                        {item.predicted_label
                          ? item.predicted_label.toUpperCase()
                          : "UNKNOWN"}
                      </span>

                      <span className="history-confidence">
                        {itemConfidence.toFixed(2)}%
                      </span>

                    </div>


                    <div className="history-model">

                      🤖 {item.model_name}

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;

