const API_BASE = "http://localhost:5004/api/ai";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("getSuggestionBtn");
  const input = document.getElementById("symptomInput");
  const result = document.getElementById("suggestionResult");

  btn.addEventListener("click", async () => {
    const symptoms = input.value.trim();

    if (!symptoms) {
      result.innerHTML = `<em>Please enter a symptom.</em>`;
      return;
    }

    result.innerHTML = `<em>Analyzing...</em>`;

    try {
      const resp = await fetch(`${API_BASE}/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        result.innerHTML = `<strong>Error:</strong> ${data.message || "Unexpected error"}`;
        return;
      }

      // ✅ Extract the analysis object
      const analysis = data.data.analysis;

      // Display nicely
      result.innerHTML = `
        <strong>Possible Conditions:</strong> ${analysis.possible_conditions.join(', ')}<br>
        <strong>Urgency:</strong> ${analysis.urgency}<br>
        <strong>Recommended Action:</strong> ${analysis.recommended_action}<br>
        <strong>General Advice:</strong> ${analysis.general_advice}<br>
        <em>${analysis.disclaimer}</em>
      `;

    } catch (err) {
      console.error("Fetch error:", err);
      result.innerHTML = `<strong>Network error:</strong> ${err.message}`;
    }
  });
});
