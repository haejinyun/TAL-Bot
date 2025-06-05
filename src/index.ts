import dotenv from "dotenv";
dotenv.config();
import { WebClient } from "@slack/web-api";
import { google } from "googleapis";
import fs from "fs";

const slackToken = process.env.SLACK_BOT_TOKEN!;
const channelId = process.env.SLACK_CHANNEL_ID!;
const sheetId = process.env.GOOGLE_SHEET_ID!;
const sheetRange = process.env.GOOGLE_SHEET_RANGE!;
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;

let credentials: any;
if (serviceAccountJson.trim().startsWith("{")) {
  // 환경변수에 JSON 전체가 들어있는 경우
  credentials = JSON.parse(serviceAccountJson);
} else {
  // 파일 경로가 들어있는 경우
  credentials = JSON.parse(fs.readFileSync(serviceAccountJson, "utf8"));
}

async function getTodayMenu(): Promise<string> {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: sheetRange,
  });
  const rows = res.data.values as string[][];
  if (!rows || rows.length === 0) return "오늘의 메뉴를 찾을 수 없습니다.";

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  // 첫 행이 헤더라고 가정
  const dateIdx = rows[0].findIndex((h) => /date|날짜/i.test(h));
  const menuIdx = rows[0].findIndex((h) => /menu|메뉴/i.test(h));
  if (dateIdx === -1 || menuIdx === -1)
    return "시트에 날짜/메뉴 컬럼이 없습니다.";

  const found = rows.find((row, i) => i > 0 && row[dateIdx] === todayStr);
  if (!found) return "오늘의 메뉴가 없습니다.";
  return found[menuIdx];
}

async function sendMenuToSlack(menu: string): Promise<void> {
  const slack = new WebClient(slackToken);
  await slack.chat.postMessage({
    channel: channelId,
    text: `🍽️ 오늘의 점심 메뉴: ${menu}`,
  });
}

(async () => {
  try {
    const menu = await getTodayMenu();
    await sendMenuToSlack(menu);
    console.log("메뉴 전송 완료:", menu);
  } catch (err) {
    console.error("에러 발생:", err);
  }
})();
