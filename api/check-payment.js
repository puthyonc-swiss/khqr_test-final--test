const BAKONG_TOKEN   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNDNmOTZjYmUzODBkNDgwMSJ9LCJpYXQiOjE3Nzg3MzE3NTEsImV4cCI6MTc4NjUwNzc1MX0.jr5yfk6bgEr7sUpTAc_2uQnaFKWB0DVP776drouWm7g";
const BAKONG_API_URL = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { md5 } = req.body;

  if (!md5 || typeof md5 !== "string" || md5.length < 10) {
    return res.status(400).json({ error: "Invalid md5 value" });
  }

  try {
    const response = await fetch(BAKONG_API_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${BAKONG_TOKEN}`
      },
      body: JSON.stringify({ md5 })
    });

    const data = await response.json();
    console.log(`Check MD5: ${md5.slice(0,12)}... → responseCode: ${data.responseCode}`);
    return res.status(200).json(data);

  } catch (err) {
    console.error("Bakong API error:", err.message);
    return res.status(502).json({ error: "Failed to reach Bakong API", detail: err.message });
  }
};
