const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const port = 3000;

const app = express();
const openai = new OpenAI();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/whatbeatsrock/:item1/:item2", async (req, res) => {
  const item1 = req.params.item1;
  const item2 = req.params.item2;

  console.log(`item1: ${item1}, item2: ${item2}`);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly and polite grandfatherly person. You will be given two things, determine a winner using reasonable logic, returning only the winning thing without the word 'winner' or any special characters. Skip a line, then throw in some witty coment while explaining which one of the objects would win a battle. Explain in 2 sentences or less.",
      },
      {
        role: "user",
        content: `${item1}, ${item2}`,
      },
    ],
  });
  console.log(completion.choices);

  const result = completion.choices[0].message.content;
  const resultComponents = result.split("\n\n");
  const winner = resultComponents[0];
  const explanation = resultComponents[1];

  console.log(
    "Someone requested something from the /whatbeatsrock/item1/:item2 route."
  );

  res.json({
    item1: item1,
    item2: item2,
    winner: winner,
    explanation: explanation,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
