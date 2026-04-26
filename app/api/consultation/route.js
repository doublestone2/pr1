import { google } from "googleapis";
import { NextResponse } from "next/server";
import { sendMetaCapiEvent } from "../../../lib/meta-capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name} 가 설정되지 않았습니다.`);
  }
  return value;
}

function getGoogleAuth() {
  const clientEmail = requiredEnv("GOOGLE_CLIENT_EMAIL");
  const privateKey = requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const eventId = body.eventId;
    const applicant = body.applicant || {};
    const diagnosis = body?.diagnosis || {};
    const privacyAgreed = !!body?.privacyAgreed;

    const name = applicant.name;
    const phone = applicant.phone;
    const email = applicant.email;

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, message: "이름과 전화번호는 필수입니다." },
        { status: 400 }
      );
    }

    const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "상담신청";

    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date();
    const submittedAt = now.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

const row = [
  submittedAt, // 1. 접수일시
  name, // 2. 이름
  phone, // 3. 전화번호
  diagnosis.occupation || "", // 4. 직업
  diagnosis.maritalStatus === "기혼"
    ? `기혼 (${diagnosis.minorChildren ?? 0}명)`
    : diagnosis.maritalStatus || "", // 5. 혼인상태(미성년 자녀 수)
  diagnosis.hasVehicle || "", // 6. 차량 보유 여부
  formatCurrency(diagnosis.vehicleValueWon), // 7. 차량가액(원)
  diagnosis.assetsStatus || "", // 8. 자산 보유 여부
  formatCurrency(diagnosis.realEstateValueWon), // 9. 본인명의 부동산 시세(원)
  formatCurrency(diagnosis.depositValueWon), // 10. 전세·월세 보증금(원)
  formatCurrency(diagnosis.totalAssetsWon), // 11. 총자산(원)
  formatCurrency(diagnosis.monthlyIncomeWon), // 12. 월소득(원)
  formatCurrency(diagnosis.creditLoanWon), // 13. 신용대출 금액(원)
  formatCurrency(diagnosis.securedLoanWon), // 14. 담보대출 금액(원)
 `${Math.round(Number(diagnosis.reductionRate || 0))}%` // 15. 예상 탕감률
];

    await sheets.spreadsheets.values.append({
  spreadsheetId,
  range: `${sheetName}!A:O`,
  valueInputOption: "USER_ENTERED",
  insertDataOption: "INSERT_ROWS",
  requestBody: {
    values: [row],
  },
});

// 구글시트 저장 성공 후 Meta CAPI 전송
try {
  await sendMetaCapiEvent({
    request,
    eventId: eventId || `contact_${Date.now()}`,
    eventName: "Contact",
    phone,
    email,
    sourceUrl: request.headers.get("referer") || process.env.NEXT_PUBLIC_SITE_URL,
  });
} catch (capiError) {
  console.error("Meta CAPI 전송 오류:", capiError);
}

return NextResponse.json({
  ok: true,
  message: "상담신청이 정상적으로 접수되었습니다.",
});

  } catch (error) {
    console.error("consultation route error:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          error?.message || "구글 스프레드시트 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}