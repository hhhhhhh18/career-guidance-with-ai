import "dotenv/config";

const testOpenAI = async () => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Write a short cover letter for a frontend developer applying to Stripe." },
      ],
    }),
  });

  const result = await response.json();
  console.log("✅ OpenAI Response:\n", result.choices?.[0]?.message?.content || result);
};

testOpenAI().catch(console.error);