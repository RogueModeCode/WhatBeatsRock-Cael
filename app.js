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
        role: "user",
        content:
          `You will be given two objects. Return the emoji representing the second object 
           given (it will never be rock). Also, determine which is the winning object using reasonable logic as 
           well as an explanation with a max of 2 short sentences about 
           why the winning object won, but make sure you aren't too wordy. Here's two 
           examples of how to return it (in json).
           
               given: 'paper, rock'
               return:
            {
               "emoji" : "📝"
               "winner" : "paper"
               "details" : "paper covers rock in the classic game of rock, paper, scissors, so of course paper wins."
            }

             given: 'ant, rock'
             return:
            {
               "emoji" : "🐜"
               "winner" : "rock"
               "details" : "rocks can easily crush ants, they stand no chance against a rock's mass."
            }`,
      },
      {
        role: "user",
        content: `${item1}, ${item2}`,
      },
    ],
  });
  console.log(completion.choices);

  const content = completion.choices[0].message.content;
  const result = JSON.parse(content);
  const winner = result.winner;
  const emoji = result.emoji;
  const details = result.details;

  console.log(
    "Someone requested something from the /whatbeatsrock/item1/:item2 route."
  );

  res.json({
    item1: item1,
    item2: item2,
    winner: winner,
    emoji: emoji,
    details: details,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
