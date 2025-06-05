# Lunch Bot

슬랙 채널에 매일 점심 메뉴를 자동으로 전송하는 봇입니다. 메뉴는 구글 시트에서 불러옵니다.

## 환경 변수(.env)

- SLACK_BOT_TOKEN: 슬랙 봇 토큰
- SLACK_CHANNEL_ID: 메시지를 보낼 채널 ID
- GOOGLE_SERVICE_ACCOUNT_JSON: 구글 서비스 계정 키 파일 경로
- GOOGLE_SHEET_ID: 구글 시트 ID
- GOOGLE_SHEET_RANGE: 시트 범위 (예: Sheet1!A1:C100)

## 구글 시트 연동

1. [Google Cloud Console](https://console.cloud.google.com/)에서 서비스 계정 생성
2. Google Sheets API 활성화
3. 서비스 계정 이메일을 시트에 공유(편집자 권한)
4. 서비스 계정 키(JSON) 다운로드 후 `service-account.json`으로 저장

## 슬랙 연동

1. [Slack API](https://api.slack.com/apps)에서 봇 생성
2. Bot Token OAuth & Permissions에서 chat:write 권한 추가
3. 봇을 워크스페이스에 설치 후 토큰과 채널 ID 확보

## 실행

```bash
npm install
npm start
```

## GitHub Actions로 자동화

`.github/workflows/lunchbot.yml` 참고 (평일 오전 11:30 자동 실행)
