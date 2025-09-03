// 接 webhook：對 OA 傳「register」時，回覆你並在日誌印出 userId
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const events = (req.body && req.body.events) || [];
  for (const ev of events) {
    if (ev.type === "message" && ev.message?.type === "text") {
      const userId = ev.source?.userId;
      console.log("YOUR_USER_ID =", userId); // ← 部署後在 Vercel Logs 找這行，複製起來

      if (ev.message.text.trim().toLowerCase() === "register") {
        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            replyToken: ev.replyToken,
            messages: [{ type: "text", text: "註冊成功✅（我已記錄你的 userId）" }]
          })
        });
      }
    }
  }
  return res.status(200).end();
}
