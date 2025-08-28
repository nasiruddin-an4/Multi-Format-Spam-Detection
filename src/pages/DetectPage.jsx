import { useState } from "react";

const DetectPage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Spam Detection</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Type or paste text here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {loading ? "Analyzing..." : "Detect Spam"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 rounded-lg border bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Results</h2>
          <p className="text-gray-600">
            Classification:{" "}
            <span className="font-medium">{result.classification}</span>
          </p>
          <p className="text-gray-600">
            Confidence:{" "}
            <span className="font-medium">{result.confidence}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DetectPage;
