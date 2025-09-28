console.log("send-reminder firing at", new Date().toISOString());
console.log("env check", {
  hasSecret: !!process.env.LINE_CHANNEL_SECRET,
  hasToken: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
  hasUser: !!process.env.LINE_USER_ID,
});

const OA_ID = "@theballmusicstudio";
const TEXT =
  "您好，小編～我想預約明天（週三）14:00 的打鼓練習室，姓名：Monica，大安店|訂單編號：10920233。謝謝！";

function buildOALink() {
  return `https://line.me/R/oaMessage/${encodeURIComponent(
    OA_ID
  )}/?${encodeURIComponent(TEXT)}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  const body = {
    to: process.env.LINE_USER_ID, // updated to match your env var
    messages: [
      {
        type: "flex",
        altText: "預約鼓室（20:30 點我）",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "預約鼓室", weight: "bold", size: "xl" },
              {
                type: "text",
                text: "20:30 點按鈕 → 自動開啟 @theballmusicstudio 並預填文字",
                wrap: true,
                size: "sm",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                action: {
                  type: "uri",
                  label: "一鍵開啟店家聊天室",
                  uri: buildOALink(),
                },
              },
            ],
          },
        },
      },
    ],
  };

  const resp = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    return res.status(500).send(t);
  }
  return res.status(200).send("ok");
}
