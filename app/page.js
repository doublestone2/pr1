"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

const KAKAO_LINK = "http://pf.kakao.com/_CUPCX/chat";
const REVIEW_PLACEHOLDER = "/reviews/review-placeholder.jpg";

// 실제 링크로 바꿔주세요
const LAWFIRM_SITE_LINK = "https://xn--9z2b2xi4aba940lua.com/";
const NAVER_CAFE_LINK = "https://cafe.naver.com/coincheating";
const INSTAGRAM_LINK = "https://instagram.com/yourprofile";

// 실제 아이콘 경로로 바꿔주세요
const LAWFIRM_ICON = "/icons/lawfirm-link.png";
const NAVER_CAFE_ICON = "/icons/naver-cafe-link.png";
const INSTAGRAM_ICON = "/icons/instagram-link.png";

const MEDIAN_INCOME_2026 = {
  1: 2564238,
  2: 4199292,
  3: 5359036,
  4: 6494738,
  5: 7556719,
  6: 8555952,
  7: 9515150,
};

const MINIMUM_LIVING_COST_2026 = Object.fromEntries(
  Object.entries(MEDIAN_INCOME_2026).map(([size, amount]) => [
    Number(size),
    Math.round(amount * 0.6),
  ])
);

const OCCUPATIONS = ["직장인", "프리랜서", "사업자", "알바", "무직"];
const MARITAL_OPTIONS = ["미혼", "기혼"];
const YES_NO = ["있음", "없음"];
const CHILD_OPTIONS = [0, 1, 2, 3, 4];

const storySections = [
  {
    eyebrow: "국가가 운영하는 채무조정제도",
    title: (
      <>
        매년 10만명 이상의 분들이 이 제도로
        <br />
        대출금 부담을{" "}
        <span className="text-[#7a5c00] text-[1.08em]">확!</span> 줄이고
        있습니다.
      </>
    ),
    desc:
      "자격요건이 된다는 건 큰 혜택입니다. 지금 바로 자격을 확인하세요.",
    image: "/sections/section01.png",
  },
  {
    eyebrow: "매달 선착순 30명만 접수 받아 정확하고 빠르게 진행합니다.",
    title: (
      <>
        국가제도를 100% 활용하실 수 있도록
        <br />
        전문 변호사가 전략을 설계합니다.
      </>
    ),
    desc: (
      <>
        서류만 모아 단순 접수하는 타업체와는 다르게 최고의 결과를 만드는 것을 목표로
        <br />
        각 개인별 스토리를 만들고 법원별로 전략을 세분화 해서 제공합니다.
      </>
    ),
    image: "/sections/section02.png",
  },
  {
    eyebrow: (
      <>
        우리는 의뢰인의
        <br />
        재정 안정이 최우선 입니다.
      </>
    ),
    title: (
      <>
        많은 분들이 기회를 놓치지 않도록
        <br />
        부담을 낮추고 빠르게 진행해드립니다
      </>
    ),
    desc: (
      <>
        로가드는 어려우신 분들을 위해 금융조합을 만들어 장기 분납제도를 운영하고
        <br />
        일정 채권자 수 내에서는 비용을 추가로 붙이지 않습니다.
        <br />
        (최대 5곳까지)
      </>
    ),
    image: "/sections/section03.png",
  },
];

const reviewCards = [
  {
    name: "김 * 연 님 37세 직장인",
    title: "카드 돌려막기 3년, 이젠 진짜 숨쉴 수 있어요",
    body:
      "처음엔 전화할 용기도 안 나서 카톡으로 문의했는데, 생각보다 편하게 얘기할 수 있었어요. 전화 상담까지 이어졌고, 월급이 320만원인데 원리금만 200 넘게 나가던 상황이었거든요. 지금은 매달 45만원씩만 갚으면 돼서 진짜 살 것 같습니다.",
    image: "/reviews/review-01.png",
  },
  {
    name: "최 * 철 님 47세 자영업자(자녀2)",
    title: "코로나 때 빌린 대출이 눈덩이처럼 불어나 막막했습니다...",
    body:
      "가게 문 닫고 나서 은행 4곳, 카드 3장에 9,000만원 가까이 빚이 있었습니다. 혼자 알아볼 땐 '나 같은 사람은 안 되겠지' 싶었는데, 일단 자가진단이라도 해보시길. 저도 반포기 상태로 했다가 상담까지 이어지고 지금은 빚 1000만원만 남았고 월 27만원만 내고 있어서 새로 출발한 느낌입니다. 정말 감사합니다.ㅠ",
    image: "/reviews/review-02.png",
  },
  {
    name: "이 * 선 님 28세 사회초년생",
    title: "부모님한테 말 못 하고 혼자 끙끙 앓다가…",
    body:
      "학자금이랑 생활비 대출, 카드대출이 쌓여서 첫 월급부터 이자 내느라 모으는 게 없이 생활이 안됐어요. 코인투자로 날린 금액이라 부모님께 말씀드리기도 죄송해서 혼자 끙끙댔는데, 로가드에서 편하게 물어볼 수 있어서 쉽게 시작할 수 있었습니다. 수임료가 아깝다고 느꼈는데 수십배 금액인 수천을 지워주신거니 오히려 벌었다고 생각듭니다. 다시는 욕심내지 않겠습니다. 감사합니다.",
    image: "/reviews/review-03.png",
  },
  {
    name: "김 * 아 님 35세 워킹맘",
    title: "아이에게 좋은 옷을 사주지 못해 미안했어요",
    body:
      "이혼하고 혼자 아이 키우면서 대출이 눈덩이처럼 불어나서 막막했어요. 혼자 알아볼 때 몰랐던 부분을 자세하게 짚어 주시고 챙겨 주셔서 편하게 탕감을 받을 수 있었습니다. 이제 월급 받아서 아이에게 더 쓸 수 있어서 너무 행복합니다. 감사합니다.",
    image: "/reviews/review-04.png",
  },
  {
    name: "강 * 준 님 45세 직장인 가장",
    title: "정말 다 포기하고 마지막으로 알아본...",
    body:
      "사업이 망하고 가족을 지켜보겠다고 대출을 더 끌어다 쓴 게 더 버틸 수 없는 지경에 이르렀었어요. 취직해서 월급을 받아와도 가족보다는 은행, 카드사로 빠져나가는 게 80% 였습니다. 아이들이 자라서 돈 쓸 일이 더 많아지니 정말 다 포기하고 싶었습니다. 로가드 아니였다면 저는 방법도 모른체로 인생이 끝났을 수도 있었습니다. 정말 너무 감사드립니다. 다시 잘 살아보겠습니다.",
    image: "/reviews/review-05.png",
  },
  {
    name: "박 * 성 님 53세 자영업자",
    title: "가게 정리를 고민하며 있던 와중에...",
    body:
      "가게 사업하면서 사채도 많이 써보고 금융사 대출은 쓰고 갚고 한 세월이 벌써 10년이 넘었습니다. 그러다 요즘 재료 값도 비싸지고 장사가 잘 안되다 보니 빚을 갚지 못하고 있었습니다. 연체되고 가압류 걸리고, 가게도 폐업하면 돈이 더 들어서 못하고 있었는데 로가드 상담 받고 수임한 후 2개월만에 연체이자 다 없애고, 원금도 80% 이상을 줄일 수 있었습니다. 정말 올해 제일 잘한 일 같습니다.",
    image: "/reviews/review-06.png",
  },
];

const footerIconLinks = [
  {
    title: "매일법률사무소",
    href: LAWFIRM_SITE_LINK,
    image: LAWFIRM_ICON,
    alt: "로펌 사이트 바로가기",
  },
  {
    title: "로가드 카페",
    href: NAVER_CAFE_LINK,
    image: NAVER_CAFE_ICON,
    alt: "네이버 카페 바로가기",
  },
  {
    title: "로가드 인스타그램",
    href: INSTAGRAM_LINK,
    image: INSTAGRAM_ICON,
    alt: "인스타 프로필 바로가기",
  },
];

const loadingMessages = [
  "월소득과 부양가족 수를 확인하고 있어요.",
  "2026년 기준 최저생계비를 반영하고 있어요.",
  "월 변제 가능금액과 36개월 총변제금을 계산하고 있어요.",
  "예상 탕감액과 적합 여부를 정리하고 있어요.",
];

const PRIVACY_POLICY_TEXT = `개인정보처리방침 안내

매일법률사무소(이하 “회사”)는 통신비밀보호법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 정보통신서비스제공자가 준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보취급방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.

1. 수집하는 개인정보의 항목 및 수집방법
가. 수집하는 개인정보의 항목
회사는 회원가입, 상담, 콘텐츠구매, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

필수사항 : 아이디, 비밀번호, 비밀번호 찾기 질문과 답변, 이메일 주소, 닉네임
선택사항 : 이름, 전화번호
또한 서비스 이용과정이나 사업처리 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.

IP Address, 쿠키, 접속로그, 서비스 이용 기록, 불량 이용 기록, 결제기록

나. 개인정보 수집방법
회사는 다음과 같은 방법으로 개인정보를 수집합니다.

홈페이지 회원가입, 상담게시판, 이메일, 이벤트 응모, 배송요청
협력회사로부터의 제공
생성정보 수집 툴을 통한 수집

2. 개인정보의 수집 및 이용목적
가. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
콘텐츠 제공, 구매 및 요금 결제, 요금추심

나. 회원 관리
회원제 서비스 이용 및 제한적 본인 확인제에 따른 본인확인, 개인식별, 불량회원의 부정 이용방지와 비인가 사용방지, 가입의사 확인, 가입 및 가입횟수 제한, 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 추후 법정 대리인 본인확인, 분쟁 조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달

다. 신규서비스 개발 및 마케팅 및 광고에 활용
신규 서비스(제품) 개발 및 특화 , 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계, 이벤트 등 광고성 정보 전달

3. 개인정보의 공유 및 제공
회사는 이용자의 개인정보를 "2. 개인정보의 수집목적 및 이용목적"에서 고지한 범위내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 공개하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

이용자가 사전에 공개에 동의한 경우
법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

4. 개인정보의 취급위탁
회사는 이용자의 동의없이 개인정보 취급을 외부 업체에 위탁하지 않습니다. 향후 그러한 필요가 생길 경우, 위탁 대상자와 위탁 업무 내용에 대해 고객님에게 통지하고 필요한 경우 사전 동의를 받도록 하겠습니다.

5. 개인정보의 보유 및 이용기간
이용자 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래와 같이 이유로 명시한 기간 동안 보존합니다.

가. 회사 내부 방침에 의한 정보보유 사유
부정이용기록

보존 이유 : 부정 이용 방지
보존 기간 : 1년 
나. 관련법령에 의한 정보보유 사유
상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.

상거래 관련 기록

보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
보존 기간 : 계약 또는 청약철회 등에 관한 기록 : 5년
대금결제 및 재화 등의 공급에 관한 기록 : 5년
소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
본인확인에 관한 기록 

보존 이유 : 정보통신망 이용촉진 및 정보보호 등에 관한 법률 
보존 기간 : 6개월 
방문에 관한 기록 

보존 이유 : 통신비밀보호법 
보존 기간 : 3개월

6. 개인정보 파기절차 및 방법
이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.

회사의 개인정보 파기절차 및 방법은 다음과 같습니다.

가. 파기절차
이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.
나. 파기방법
종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

7. 이용자 및 법정대리인의 권리와 그 행사방법
이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.
이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을 위해서는 '회원정보 보기'(또는 '회원정보수정' 등)을, 가입해지(동의철회)를 위해서는 "탈퇴"를 클릭하여 직접 열람, 정정 또는 탈퇴가 가능합니다.
이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3 자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.
회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 "5. 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.

8. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
회사는 개인화되고 맞춤화된 서비스를 제공하기 위해서 이용자의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는 아주 작은 텍스트 파일로 이용자 컴퓨터의 하드디스크에 저장됩니다.

가. 쿠키의 사용 목적
이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 뉴스편집, 이용자 규모 등을 파악하여 이용자에게 최적화된 정보 제공을 위하여 사용합니다.

나. 쿠키의 설치/운영 및 거부
이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 일부 서비스는 이용에 어려움이 있을 수 있습니다.

9. 개인정보의 기술적/관리적 보호 대책
회사는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.

가. 기술적인 대책
회원님의 개인정보는 비밀번호에 의해 보호되며, 파일 및 전송 데이터를 암호화하거나 파일 잠금기능(Lock)을 사용하여 중요한 데이터는 별도의 보안기능을 통해 보호되고 있습니다.
당사는 백신프로그램을 이용하여 컴퓨터바이러스에 의한 피해를 방지하기 위한 조치를 취하고 있습니다. 백신프로그램은 주기적으로 업데이트되며 갑작스런 바이러스가 출현될 경우 백신이 나오는 즉시 이를 적용함으로써 개인정보가 침해되는 것을 방지하고 있습니다.
당사는 암호알고리즘을 이용하여 네트워크 상의 개인정보를 안전하게 전송할 수 있는 보안장치(SSL 또는 SET)를 채택하고 있습니다.
해킹 등에 의해 귀하의 개인정보가 유출되는 것을 방지하기 위하여, 외부로부터의 침입을 차단하는 장치를 이용하고 있으며 주요 서버마다 침입탐지시스템을 설치하여 24시간 침입을 감시하고 있습니다.
나. 관리적인 대책
위와 같은 노력 이외에 회원님 스스로도 제3자에게 비밀번호 등이 노출되지 않도록 주의하셔야 합니다. 특히 비밀번호 등이 공공장소에 설치한 PC를 통해 유출되지 않도록 항상 유의하시기 바랍니다. 회원님의 ID와 비밀번호는 반드시 본인만 사용하시고 비밀번호를 자주 바꿔주시는 것이 좋습니다.
당사는 개인정보 취급직원을 개인정보 관리업무를 수행하는 자 및 업무상 개인정보의 취급이 불가피 한 자로 엄격히 제한하고 담당직원에 대한 수시 교육을 통하여 본 정책의 준수를 강조하고 있으며, 보안부서의 이행점검을 통하여 본 정책의 이행사항 및 담당직원의 준수여부를 확인하여 문제가 발견될 경우 바로 시정조치하고 있습니다.

10. 개인정보관리책임자 연락처
귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자에게 신고하실 수 있습니다.

회사는 이용자의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.

개인정보관리책임자
성명 : 김민석(주), 배형섭(부)
전화번호 : 02-6283-1100
이메일 : maeil@lawmaeil.com
기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.

개인정보침해신고센터 (www.cyberprivacy.or.kr / 1336)
대검찰청 인터넷범죄수사센터 (http://sppo.go.kr / 02-3480-3600)
경찰청 사이버테러대응센터 (www.ctrc.go.kr / 02-392-0330)

11. 고지의 의무
현 개인정보취급방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 홈페이지의 "공지사항"을 통해 고지할 것입니다.

공고일자 : 2024년 11월 11일
시행일자 : 2024년 11월 11일
수정일자 : 2024년 11월 11일`;

function ResultSupportCards({ onTrackCta }) {
  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
          다른 어려움 확인
        </p>

        <h5 className="mt-3 text-2xl font-extrabold leading-[1.35] text-slate-900">
          혹시, 다른 어려움도 있으신가요?
        </h5>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          채무 문제 외에도 혼자 감당하시기 어려운 일이 있으실 수 있습니다.
          <br />
          조심스럽게, 여쭤봅니다.
        </p>

        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          <label className="flex items-start gap-3">
            <input type="checkbox" disabled className="mt-1 h-4 w-4" />
            <span>
              보이스피싱·리딩방·코인·투자 사기로 재산 피해를 입으셨나요?
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" disabled className="mt-1 h-4 w-4" />
            <span>
              불법 사채나 대부업체의 과도한 추심에 시달리고 계신가요?
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" disabled className="mt-1 h-4 w-4" />
            <span>
              전세 사기나 보증금 반환 문제로 어려움을 겪고 계신가요?
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" disabled className="mt-1 h-4 w-4" />
            <span>
              이혼·가사 문제, 형사 사건 등 다른 법률적 도움이 필요하신가요?
            </span>
          </label>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          매일법률사무소는 채무조정 외에도 다양한 영역에서 의뢰인을 도와드리고
          있습니다.
          <br />
          어떤 상황이든, 먼저 말씀만 주시면 조심스럽게 함께 살펴보겠습니다.
        </p>

        <div className="mt-6">
          <a
            href={KAKAO_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={() => onTrackCta("kakao_consult", "result_support_card")}
            className="pressable inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
          >
            카카오톡으로 상담하기
          </a>
        </div>
      </div>

      <div className="rounded-[30px] border border-slate-200 bg-[#fffdf4] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
          로가드 카페 안내
        </p>

        <h5 className="mt-3 text-2xl font-extrabold leading-[1.35] text-slate-900">
          혼자 고민하지 마세요.
          <br />
          로가드가 여러분의 삶을 지켜드립니다.
        </h5>

        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          <p>
            바로 상담이 부담스러우시다면, 로가드 카페에서 비슷한 상황을 겪으신
            <br />
            다른 분들의 이야기와 해결 사례를 먼저 확인해 보실 수 있어요.
          </p>

          <p>
            개인회생·파산, 사기 피해 대응, 불법 추심 해결까지
            <br />
            실제 경험과 도움이 되는 정보가 모여 있습니다.
          </p>

          <p>
            생각보다 많은 분들이 같은 길을 걸어오셨고,
            <br />
            지금은 웃으며 과거를 돌아보고 계십니다.
          </p>
        </div>

        <div className="mt-6">
          <a
            href={NAVER_CAFE_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={() => onTrackCta("cafe_visit", "result_support_card")}
            className="pressable inline-flex w-full items-center justify-center rounded-2xl border border-[#c9a23e] bg-gradient-to-b from-[#c79b25] to-[#9d7417] px-6 py-4 text-sm font-bold text-white"
          >
            로가드 카페 둘러보기
          </a>
        </div>
      </div>
    </div>
  );
}

function FadeInSection({
  children,
  className = "",
  delay = 0,
  threshold = 0.14,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CTAButton({
  href,
  onClick,
  variant = "yellow",
  children,
  full = false,
}) {
  const base =
    "pressable inline-flex min-h-[68px] items-center justify-center rounded-[24px] px-7 py-5 text-center text-[17px] font-extrabold leading-none md:min-h-[72px] md:px-8 md:py-5 md:text-[18px]";
  const width = full ? "w-full" : "";
  const styles =
    variant === "yellow"
      ? "bg-[#fee500] text-slate-900"
      : variant === "diagnosis"
      ? "border border-[#c9a23e] bg-gradient-to-b from-[#c79b25] to-[#9d7417] text-white"
      : "bg-slate-900 text-white";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={`${base} ${width} ${styles}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${width} ${styles}`}
    >
      {children}
    </button>
  );
}

function FooterIconLink({ href, image, alt, title }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="pressable flex w-full max-w-[210px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white px-5 py-5 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-4 text-[14px] font-bold leading-6 text-slate-700">
        {title}
      </p>
    </a>
  );
}

function StorySection({ section, onOpenDiagnosis, onTrackCta, sectionId }) {
  return (
    <div className="mx-auto max-w-4xl">
      <FadeInSection>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase leading-[1.8] tracking-[0.18em] text-[#7a5c00]">
            {section.eyebrow}
          </p>

          <h3 className="mt-4 text-3xl font-extrabold leading-[1.28] tracking-tight text-slate-900 md:text-4xl">
            {section.title}
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.95] text-slate-600">
            {section.desc}
          </p>

          <FadeInSection delay={120}>
            <div className="mx-auto mt-9 max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
  <img
    src={section.image}
    alt={typeof section.title === "string" ? section.title : "섹션 이미지"}
    className="h-[260px] w-full object-contain bg-white md:h-[575px]"
  />
</div>
          </FadeInSection>

          
        </div>
      </FadeInSection>
    </div>
  );
}

function ProgressRing({ progress }) {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90 transform">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#fee500"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold text-slate-900">{progress}%</div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          조회중
        </div>
      </div>
    </div>
  );
}

function StepOptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable rounded-2xl border px-4 py-4 text-sm font-bold transition ${
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-900 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const sanitized = String(value).replace(/[^0-9.]/g, "");
  return Number(sanitized || 0);
}

function formatManwonFromWon(value) {
  return `${Math.round((value || 0) / 10000).toLocaleString("ko-KR")}만원`;
}

function getDiagnosisPayload(form) {
  const monthlyIncomeWon = toNumber(form.monthlyIncome) * 10000;
  const creditLoanWon = toNumber(form.creditLoan) * 10000;
  const securedLoanWon = toNumber(form.securedLoan) * 10000;
  const totalDebtWon = creditLoanWon + securedLoanWon;

  const realEstateValueWon =
    form.assetsStatus === "있음" ? toNumber(form.realEstateValue) * 10000 : 0;
  const depositValueWon =
    form.assetsStatus === "있음" ? toNumber(form.depositValue) * 10000 : 0;

  const vehicleValueWon =
    form.hasVehicle === "있음" ? toNumber(form.vehicleValue) * 10000 : 0;

  const totalAssetsWon = realEstateValueWon + depositValueWon + vehicleValueWon;
  const childCount =
    form.maritalStatus === "기혼" ? Number(form.minorChildren || 0) : 0;

  const familySize = Math.max(
    1,
    Math.min(7, 1 + (form.maritalStatus === "기혼" ? 1 : 0) + childCount)
  );

  const minimumLivingCostWon =
    MINIMUM_LIVING_COST_2026[familySize] || MINIMUM_LIVING_COST_2026[7];

  const monthlyDisposableIncomeWon = Math.max(
    0,
    monthlyIncomeWon - minimumLivingCostWon
  );

  const expectedRepayment36Won = monthlyDisposableIncomeWon * 36;
  const estimatedInterestWon = totalDebtWon * 0.08 * 3;
  const totalClaimWon = totalDebtWon + estimatedInterestWon;
  const expectedTotalRepaymentWon = Math.min(
    totalClaimWon,
    expectedRepayment36Won
  );
  const expectedReductionWon = Math.max(
    0,
    totalClaimWon - expectedTotalRepaymentWon
  );
  const reductionRate =
    totalClaimWon > 0 ? (expectedReductionWon / totalClaimWon) * 100 : 0;

  const reasons = [];
  if (["무직"].includes(form.occupation)) {
    reasons.push("현재 직업이 무직으로 선택되었습니다.");
  }
  if (monthlyIncomeWon < 1530000) {
    reasons.push("월 평균 소득이 153만원 미만으로 입력되었습니다.");
  }
  if (totalAssetsWon > totalDebtWon) {
    reasons.push("총 보유자산이 총 채무보다 많은 것으로 입력되었습니다.");
  }

  return {
    occupation: form.occupation,
    monthlyIncomeWon,
    maritalStatus: form.maritalStatus,
    minorChildren: childCount,
    hasVehicle: form.hasVehicle,
    vehicleValueWon,
    assetsStatus: form.assetsStatus,
    creditLoanWon,
    securedLoanWon,
    totalDebtWon,
    realEstateValueWon,
    depositValueWon,
    totalAssetsWon,
    familySize,
    minimumLivingCostWon,
    monthlyDisposableIncomeWon,
    expectedRepayment36Won,
    expectedTotalRepaymentWon,
    estimatedInterestWon,
    totalClaimWon,
    expectedReductionWon,
    reductionRate,
    suitable: reasons.length === 0,
    unsuitableReasons: reasons,
  };
}

function getCurrentStepValid(step, form) {
  if (step === 1) return !!form.occupation;
  if (step === 2) return true;
  if (step === 3) {
    if (!form.maritalStatus) return false;
    if (form.maritalStatus === "기혼") {
      return form.minorChildren !== "" && form.minorChildren !== null;
    }
    return true;
  }
  if (step === 4) return !!form.hasVehicle;
  if (step === 5) return true;
  if (step === 6) return !!form.assetsStatus;
  return true;
}

function getLoadingMessage(progress) {
  if (progress < 25) return loadingMessages[0];
  if (progress < 50) return loadingMessages[1];
  if (progress < 75) return loadingMessages[2];
  return loadingMessages[3];
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [consultation, setConsultation] = useState({ name: "", phone: "" });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [form, setForm] = useState({
    occupation: "",
    monthlyIncome: "",
    maritalStatus: "",
    minorChildren: "",
    hasVehicle: "",
    vehicleValue: "",
    creditLoan: "",
    securedLoan: "",
    assetsStatus: "",
    realEstateValue: "",
    depositValue: "",
  });

  const diagnosis = useMemo(() => getDiagnosisPayload(form), [form]);
  const currentStepValid = getCurrentStepValid(step, form);

  const posthogInitialized = useRef(false);
  const enteredAtRef = useRef(new Map());
  const diagnosisSourceRef = useRef("unknown");

  const safeCapture = (eventName, properties = {}) => {
    if (typeof window === "undefined") return;
    if (!posthogInitialized.current) return;
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error("PostHog capture error:", error);
    }
  };

  const trackCtaClick = (ctaName, sectionId) => {
    safeCapture("landing cta clicked", {
      cta_name: ctaName,
      section_id: sectionId,
      current_url: window.location.pathname,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (posthogInitialized.current) return;
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-01-30",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });

    posthogInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!posthogInitialized.current) return;

    const sections = Array.from(document.querySelectorAll("[data-section-id]"));
    const enteredAt = enteredAtRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();

        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section-id");
          if (!sectionId) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!enteredAt.has(sectionId)) {
              enteredAt.set(sectionId, now);

              safeCapture("landing section viewed", {
                section_id: sectionId,
                current_url: window.location.pathname,
              });
            }
          } else if (enteredAt.has(sectionId)) {
            const start = enteredAt.get(sectionId);
            const dwell = now - start;

            safeCapture("landing section exited", {
              section_id: sectionId,
              dwell_ms: dwell,
              current_url: window.location.pathname,
            });

            enteredAt.delete(sectionId);
          }
        });
      },
      {
        threshold: [0.3, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    const flushVisibleSections = () => {
      const now = Date.now();
      enteredAt.forEach((start, sectionId) => {
        safeCapture("landing section exited", {
          section_id: sectionId,
          dwell_ms: now - start,
          current_url: window.location.pathname,
        });
      });
      enteredAt.clear();
    };

    window.addEventListener("pagehide", flushVisibleSections);

    return () => {
      flushVisibleSections();
      observer.disconnect();
      window.removeEventListener("pagehide", flushVisibleSections);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen || step !== 7) return undefined;

    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setStep(8);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [isModalOpen, step]);

  useEffect(() => {
    if (step === 8) {
      safeCapture("diagnosis result viewed", {
        source: diagnosisSourceRef.current,
        suitable: diagnosis.suitable,
        reduction_rate: Math.round(diagnosis.reductionRate || 0),
        expected_reduction_won: diagnosis.expectedReductionWon || 0,
        total_debt_won: diagnosis.totalDebtWon || 0,
      });
    }
  }, [step, diagnosis]);

  const openDiagnosisModal = (sourceSection = "unknown") => {
    diagnosisSourceRef.current = sourceSection;

    safeCapture("diagnosis started", {
      source: sourceSection,
      current_url: window.location.pathname,
    });

    setForm({
      occupation: "",
      monthlyIncome: "",
      maritalStatus: "",
      minorChildren: "",
      hasVehicle: "",
      vehicleValue: "",
      creditLoan: "",
      securedLoan: "",
      assetsStatus: "",
      realEstateValue: "",
      depositValue: "",
    });
    setConsultation({ name: "", phone: "" });
    setSubmitMessage("");
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
    setProgress(0);
    setStep(1);
    setIsModalOpen(true);
  };

  const closeDiagnosisModal = () => {
    safeCapture("diagnosis closed", {
      current_step: step,
      source: diagnosisSourceRef.current,
    });

    setIsModalOpen(false);
    setStep(1);
    setProgress(0);
    setSubmitMessage("");
    setIsSubmitting(false);
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
  };

  const nextStep = () => {
    safeCapture("diagnosis step completed", {
      step_number: step,
      source: diagnosisSourceRef.current,
    });

    if (step < 6) {
      setStep(step + 1);
      return;
    }
    if (step === 6) {
      setStep(7);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 7) {
      safeCapture("diagnosis step back", {
        step_number: step,
        source: diagnosisSourceRef.current,
      });
      setStep(step - 1);
    }
  };

  const handleConsultSubmit = async (e) => {
  e.preventDefault();
  if (!diagnosis.suitable) return;

  if (!consultation.name.trim() || !consultation.phone.trim()) {
    setSubmitMessage("이름과 전화번호를 입력해주세요.");
    return;
  }

  if (!privacyAgreed) {
    setSubmitMessage("개인정보처리방침 안내에 동의해주세요.");
    return;
  }

  try {
    setIsSubmitting(true);
    setSubmitMessage("");

    // ✅ 1. 상담신청 1건마다 고유 eventId 생성
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `contact_${crypto.randomUUID()}`
        : `contact_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const response = await fetch("/api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ✅ 2. 서버 CAPI 전송용 eventId 추가
        eventId,

        applicant: consultation,
        privacyAgreed,
        diagnosis: {
          occupation: diagnosis.occupation,
          monthlyIncomeWon: diagnosis.monthlyIncomeWon,
          maritalStatus: diagnosis.maritalStatus,
          minorChildren: diagnosis.minorChildren,
          hasVehicle: diagnosis.hasVehicle,
          vehicleValueWon: diagnosis.vehicleValueWon,
          assetsStatus: diagnosis.assetsStatus,
          creditLoanWon: diagnosis.creditLoanWon,
          securedLoanWon: diagnosis.securedLoanWon,
          totalDebtWon: diagnosis.totalDebtWon,
          realEstateValueWon: diagnosis.realEstateValueWon,
          depositValueWon: diagnosis.depositValueWon,
          totalAssetsWon: diagnosis.totalAssetsWon,
          familySize: diagnosis.familySize,
          minimumLivingCostWon: diagnosis.minimumLivingCostWon,
          monthlyDisposableIncomeWon: diagnosis.monthlyDisposableIncomeWon,
          expectedRepayment36Won: diagnosis.expectedRepayment36Won,
          expectedTotalRepaymentWon: diagnosis.expectedTotalRepaymentWon,
          estimatedInterestWon: diagnosis.estimatedInterestWon,
          totalClaimWon: diagnosis.totalClaimWon,
          expectedReductionWon: diagnosis.expectedReductionWon,
          reductionRate: diagnosis.reductionRate,
          suitable: diagnosis.suitable,
          unsuitableReasons: diagnosis.unsuitableReasons,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "신청 전송에 실패했습니다.");
    }

    // ✅ 3. 신청 성공 후 같은 eventId로 Meta Pixel 이벤트 전송
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Contact", {}, { eventID: eventId });
    }

    safeCapture("consultation submitted", {
      source: "diagnosis_result",
      diagnosis_source: diagnosisSourceRef.current,
      suitable: diagnosis.suitable,
      reduction_rate: Math.round(diagnosis.reductionRate || 0),
      event_id: eventId,
    });

    setSubmitMessage("상담신청이 정상적으로 접수되었습니다.");
    setSuccessPopupOpen(true);
    setConsultation({ name: "", phone: "" });
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
  } catch (error) {
    setSubmitMessage(error.message || "신청 전송 중 오류가 발생했습니다.");
  } finally {
    setIsSubmitting(false);
  }
};

  const resultDate = new Date().toLocaleDateString("ko-KR");

  return (
    <>
      <main className="min-h-screen bg-[#f8f8f6] text-slate-900 [word-break:keep-all] [overflow-wrap:break-word]">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-3 md:py-3">
            <div className="flex flex-col items-start">
              <img
                src="/head/head01.png"
                alt="로가드 로고"
                className="h-[42px] w-auto object-contain md:h-[140px]"
              />
            </div>

            <p
              className="mt-0 text-[12px] font-black uppercase tracking-[0.1em] text-[#8a6a10] md:text-[30px]"
              style={{
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.95), 0 2px 0 rgba(221,192,108,0.5), 0 5px 12px rgba(60,42,6,0.28)",
              }}
            >
              로가드 회생 ㅣ 국가 채무조정제도
            </p>

            <div className="flex items-center justify-end">
              <img
                src="/head/head02.png"
                alt="매일법률사무소 로고"
                className="h-[34px] w-auto object-contain md:h-[42px]"
              />
            </div>
          </div>
        </header>

        <section
          id="intro"
          data-section-id="hero"
          className="relative overflow-hidden bg-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,229,0,0.28),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 md:px-6 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-4xl">
              <FadeInSection className="text-center">
                <div className="inline-flex rounded-full border border-[#f3e483] bg-[#fff9d9] px-6 py-3 text-[15px] font-semibold text-[#6d5600] md:px-7 md:py-3.5 md:text-base">
                  30초 만에 확인해보세요!
                </div>

                <h1 className="mt-7 text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 md:text-6xl">
                  내 대출금,
                  <br />
                  얼마나 줄일 수 있을까?
                </h1>

                <p className="mt-5 text-2xl font-extrabold leading-[1.35] text-[#7a5c00] md:text-3xl">
                  국가 채무조정 제도
                  <br />
                  무료 자가진단 서비스
                </p>

                <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white md:px-7 md:py-4">
                  <span>이자 100% 탕감</span>
                  <span className="text-slate-400">|</span>
                  <span>원금 최대 95% 탕감 가능</span>
                  <span className="text-slate-400">|</span>
                  <span>자가 진단자 평균 60% 이상 탕감</span>
                </div>

                <p className="mt-7 text-lg leading-[1.9] text-slate-600">
                  빚을 줄이는 방법은 '열심히 일하는 것' 말고도 있습니다.
                  <br />
                  우선 30초 자가진단으로 자격부터 확인해보세요!
                </p>

                <div className="mt-9 grid gap-4 sm:mx-auto sm:max-w-2xl sm:grid-cols-2">
                  <CTAButton
                    href={KAKAO_LINK}
                    variant="yellow"
                    full
                    onClick={() => trackCtaClick("kakao_consult", "hero")}
                  >
                    카카오톡 상담
                  </CTAButton>
                  <CTAButton
                    onClick={() => {
                      trackCtaClick("diagnosis_start", "hero");
                      openDiagnosisModal("hero");
                    }}
                    variant="diagnosis"
                    full
                  >
                    채무탕감 자가진단
                  </CTAButton>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section
          data-section-id="trust"
          className="border-y border-slate-200 bg-slate-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-10 md:px-6">
            <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
              <FadeInSection className="text-center md:text-left">
                <p className="text-[15px] font-semibold uppercase tracking-[0.18em] text-[#fee500] md:text-base">
                  이번 기회를 놓치지 마세요
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-[1.25] md:text-4xl">
                  혹시 나도
                  <br />
                  대출금을 줄일 수 있을까?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.9] text-slate-300 md:mx-0">
                  매달 돌아오는 상환일이 두려우셨나요?
                  <br />
                  이제 나자신과 가족 앞에서 당당해질 때입니다.
                </p>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                  <CTAButton
                    href={KAKAO_LINK}
                    variant="yellow"
                    onClick={() => trackCtaClick("kakao_consult", "trust")}
                  >
                    카카오톡 채널 상담하기
                  </CTAButton>
                  <CTAButton
                    onClick={() => {
                      trackCtaClick("diagnosis_start", "trust");
                      openDiagnosisModal("trust");
                    }}
                    variant="diagnosis"
                  >
                    채무탕감 자가진단 시작하기
                  </CTAButton>
                </div>
              </FadeInSection>

              <FadeInSection
                delay={120}
                className="rounded-[28px] border border-white/10 bg-white/5 p-2 text-center backdrop-blur"
              >
                <div className="rounded-[24px] bg-white p-5 text-slate-900">
                  <p className="text-sm font-semibold text-slate-500">
                    자가진단 확인 항목
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">
                      직업과 월 평균 소득
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">
                      혼인상태와 미성년 자녀 수
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold">
                      자산 대비 부채 규모
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        <section
          data-section-id="story-1"
          className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18"
        >
          <StorySection
            section={storySections[0]}
            sectionId="story-1"
            onTrackCta={trackCtaClick}
            onOpenDiagnosis={openDiagnosisModal}
          />
        </section>

        <section
          data-section-id="story-2"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18">
            <StorySection
              section={storySections[1]}
              sectionId="story-2"
              onTrackCta={trackCtaClick}
              onOpenDiagnosis={openDiagnosisModal}
            />
          </div>
        </section>

        <section
          data-section-id="story-3"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-18">
            <StorySection
              section={storySections[2]}
              sectionId="story-3"
              onTrackCta={trackCtaClick}
              onOpenDiagnosis={openDiagnosisModal}
            />
          </div>
        </section>

        <section
          id="reviews"
          data-section-id="reviews"
          className="mx-auto max-w-7xl px-5 py-16 text-center md:px-6 md:py-20"
        >
          <FadeInSection className="mx-auto mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
              실제 이용자 후기
            </p>
            <h3 className="mt-4 text-4xl font-extrabold tracking-tight leading-[1.28]">
              로가드 회생은
              <br />
              의뢰인의 삶에 집중합니다.
            </h3>
            <p className="mt-5 text-lg leading-[1.9] text-slate-600">
              이번달도 많은 분들이 로가드를 통해 빚을 제대로 탕감 받고
              <br />
              <span className="text-[#7a5c00] text-[1.5em]">
                새로운 인생을 출발하셨습니다.
              </span>
            </p>
          </FadeInSection>

          <FadeInSection delay={120} className="review-marquee text-left">
            <div className="review-marquee-track">
              {[0, 1].map((groupIndex) => (
                <div
                  className="review-marquee-group"
                  key={groupIndex}
                  aria-hidden={groupIndex === 1}
                >
                  {reviewCards.map((item, index) => (
                    <div
                      key={`${groupIndex}-${index}`}
                      className="review-marquee-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image || REVIEW_PLACEHOLDER}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = REVIEW_PLACEHOLDER;
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-flex rounded-full bg-[#fff7c2] px-3 py-1 text-xs font-bold text-[#6d5600]">
                          {item.name}
                        </div>
                        <h4 className="mt-4 text-xl font-extrabold leading-snug">
                          {item.title}
                        </h4>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeInSection>
        </section>

        <section
          data-section-id="final-cta"
          className="border-y border-slate-200 bg-slate-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-6">
            <FadeInSection className="rounded-[34px] bg-white/5 px-6 py-8 text-center backdrop-blur md:px-8 md:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fee500]">
                진단 후 전문가 상담 추천
              </p>
              <h3 className="mt-4 text-3xl font-extrabold leading-[1.28] md:text-4xl">
                자격 요건이 된다면 전문가 무료 상담을 통해
                <br />
                <span className="text-[#fee500] text-[1.14em]">
                  희망을 현실로 만드세요
                </span>
                <br />
              </h3>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.9] text-slate-300">
                자가진단 30초
                <br />
                전문가 무료상담 5분
                <br />
                <br />
                <span className="text-[#fee500] text-[1.18em]">
                  용기 있는 선택은 인생을 바꿉니다.
                </span>
              </p>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <CTAButton
                  href={KAKAO_LINK}
                  variant="yellow"
                  onClick={() => trackCtaClick("kakao_consult", "final-cta")}
                >
                  카카오톡 채널 상담하기
                </CTAButton>
                <CTAButton
                  onClick={() => {
                    trackCtaClick("diagnosis_start", "final-cta");
                    openDiagnosisModal("final-cta");
                  }}
                  variant="diagnosis"
                >
                  채무탕감 자가진단 시작하기
                </CTAButton>
              </div>
            </FadeInSection>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 text-center md:px-6">
            <FadeInSection>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5c00]">
                로가드 회생 / 국가채무조정제도
              </p>
              <h4 className="mt-2 text-2xl font-extrabold text-slate-900">
                매일법률사무소 로가드 무료 법률상담
              </h4>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                상호명: 매일법률사무소 | 대표자: 김민석 | 사업자등록번호:
                489-04-02780
                <br />
                주소: 서울특별시 서초구 서초대로42길 66 매일빌딩
                <br />
                광고책임자: 김민석변호사 | 이메일 :
                doublestone.partners@gmail.com
                <br />
                copyright ⓒ 매일법률사무소 All Rights Reserved.
              </p>
            </FadeInSection>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {footerIconLinks.map((item, index) => (
                <FadeInSection key={item.title} delay={index * 70}>
                  <FooterIconLink
                    href={item.href}
                    image={item.image}
                    alt={item.alt}
                    title={item.title}
                  />
                </FadeInSection>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
              Copyright © 2026. All rights reserved.
            </div>
          </div>
        </footer>

        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200">
            <CTAButton
              href={KAKAO_LINK}
              variant="yellow"
              full
              onClick={() => trackCtaClick("kakao_consult", "bottom-fixed")}
            >
              카톡 상담
            </CTAButton>
            <CTAButton
              onClick={() => {
                trackCtaClick("diagnosis_start", "bottom-fixed");
                openDiagnosisModal("bottom-fixed");
              }}
              variant="diagnosis"
              full
            >
              자격 자가진단
            </CTAButton>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
            <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white p-6 shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={closeDiagnosisModal}
                className="pressable absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700"
              >
                ×
              </button>

              {step <= 6 && (
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        국가 채무조정 제도
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        자격 자가진단
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      {step} / 8
                    </div>
                  </div>

                  <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#fee500] transition-all duration-300"
                      style={{ width: `${(step / 8) * 100}%` }}
                    />
                  </div>

                  {step === 1 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 어떤 일을
                        <br />
                        하고 계신가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        소득 유형에 따라 전략이 달라져요!
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {OCCUPATIONS.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.occupation === option}
                            onClick={() =>
                              setForm((prev) => ({ ...prev, occupation: option }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        월 평균 소득은
                        <br />
                        어느 정도 인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        소득을 고려해 탕감액을 계산해요!
                      </p>
                      <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <label className="block text-sm font-bold text-slate-700">
                          월 평균 소득
                        </label>
                        <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                          <input
                            value={form.monthlyIncome}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                monthlyIncome: e.target.value.replace(/[^0-9]/g, ""),
                              }))
                            }
                            inputMode="numeric"
                            placeholder="예: 280"
                            className="w-full bg-transparent text-lg font-bold outline-none"
                          />
                          <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                            만원
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 혼인상태를
                        <br />
                        알려주세요
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        부양가족 최저 생계비 계산해드려요
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {MARITAL_OPTIONS.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.maritalStatus === option}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                maritalStatus: option,
                                minorChildren:
                                  option === "기혼" ? prev.minorChildren : "",
                              }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>

                      {form.maritalStatus === "기혼" && (
                        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            미성년 자녀 수
                          </label>
                          <div className="mt-4 grid grid-cols-5 gap-3">
                            {CHILD_OPTIONS.map((count) => (
                              <StepOptionButton
                                key={count}
                                selected={
                                  String(form.minorChildren) === String(count)
                                }
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    minorChildren: String(count),
                                  }))
                                }
                              >
                                {count === 0 ? "없음" : `${count}명`}
                              </StepOptionButton>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        본인 명의 차량을
                        <br />
                        가지고 계신가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        리스/렌탈은 아니에요!
                      </p>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {YES_NO.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.hasVehicle === option}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                hasVehicle: option,
                                vehicleValue:
                                  option === "있음" ? prev.vehicleValue : "",
                              }))
                            }
                          >
                            {option}
                          </StepOptionButton>
                        ))}
                      </div>

                      {form.hasVehicle === "있음" && (
                        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            차량가액 (대략적으로)
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.vehicleValue}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  vehicleValue: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 1200"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 5 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        현재 총 대출 금액은
                        <br />
                        얼마인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        신용대출과 담보대출을 나눠 입력해주세요.
                      </p>
                      <div className="mt-8 grid gap-4">
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            신용대출 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.creditLoan}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  creditLoan: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 4500"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                          <label className="block text-sm font-bold text-slate-700">
                            담보대출 금액
                          </label>
                          <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                            <input
                              value={form.securedLoan}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  securedLoan: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                              }
                              inputMode="numeric"
                              placeholder="예: 1500"
                              className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                              만원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div>
                      <h4 className="text-3xl font-extrabold leading-tight text-slate-900">
                        총 보유자산은
                        <br />
                        얼마인가요?
                      </h4>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        자산이 있다면 대략적인 금액도 괜찮아요.
                        <br />
                        먼저 자산 보유 여부를 선택해주세요.
                      </p>

                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {YES_NO.map((option) => (
                          <StepOptionButton
                            key={option}
                            selected={form.assetsStatus === option}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                assetsStatus: option,
                                realEstateValue:
                                  option === "있음" ? prev.realEstateValue : "",
                                depositValue:
                                  option === "있음" ? prev.depositValue : "",
                              }))
                            }
                          >
                            자산 {option}
                          </StepOptionButton>
                        ))}
                      </div>

                      {form.assetsStatus === "있음" && (
                        <div className="mt-8 grid gap-4">
                          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                            <label className="block text-sm font-bold text-slate-700">
                              본인명의 소유 부동산 시세 금액
                            </label>
                            <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                              <input
                                value={form.realEstateValue}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    realEstateValue: e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    ),
                                  }))
                                }
                                inputMode="numeric"
                                placeholder="예: 5000"
                                className="w-full bg-transparent text-lg font-bold outline-none"
                              />
                              <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                                만원
                              </span>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                            <label className="block text-sm font-bold text-slate-700">
                              전세 혹은 월세 보증금 금액
                            </label>
                            <div className="mt-3 flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-4">
                              <input
                                value={form.depositValue}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    depositValue: e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    ),
                                  }))
                                }
                                inputMode="numeric"
                                placeholder="예: 1000"
                                className="w-full bg-transparent text-lg font-bold outline-none"
                              />
                              <span className="shrink-0 whitespace-nowrap text-base font-bold text-slate-500">
                                만원
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className="pressable rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!currentStepValid}
                      className="pressable rounded-2xl bg-slate-900 px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="py-8 text-center">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        국가 채무조정 제도
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        조회중
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      7 / 8
                    </div>
                  </div>
                  <ProgressRing progress={progress} />
                  <p className="mt-8 text-lg font-bold text-slate-900">
                    잠시만 기다려주세요.
                  </p>
                  <p className="mt-3 text-base leading-8 text-slate-600">
                    나에게 맞는 정부제도와 탕감예상금액을 조회하고 있어요!
                  </p>
                  <div className="mt-6 rounded-[28px] bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-700">
                    {getLoadingMessage(progress)}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                        국가 채무조정 제도
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        결과 요약
                      </h3>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      8 / 8
                    </div>
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900">
                    고객님의 결과 요약
                    <br />
                    <span className="text-slate-500">{resultDate} 기준</span>
                  </h4>

                  {diagnosis.suitable ? (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-[30px] border border-slate-200 bg-[#fffdf0] p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          적합
                        </p>
                        <h5 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">
                          예상 탕감액
                          <br />
                          <br />
                          총 {formatManwonFromWon(diagnosis.expectedReductionWon)}
                          을 줄일 수 있어요!
                        </h5>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                          위 결과는 입력하신 정보 기준 1차 예상치이며, 자세한 금액은
                          전문가 상담 및 자료에 따라 달라질 수 있습니다.
                        </p>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              월 소득
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.monthlyIncomeWon)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              가구원 수 기준 최저생계비
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.minimumLivingCostWon)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              월 변제 가능금액
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(
                                diagnosis.monthlyDisposableIncomeWon
                              )}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              36개월 예상 총변제금
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(
                                diagnosis.expectedTotalRepaymentWon
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                          <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm font-bold text-slate-500">
                              원금
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.totalDebtWon)}
                            </p>
                            <p className="mt-4 text-sm font-bold text-slate-500">
                              이자(3년 8%)
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(diagnosis.estimatedInterestWon)}
                            </p>
                          </div>

                          <div className="flex items-center justify-center text-4xl text-slate-300">
                            ↓
                          </div>

                          <div className="rounded-2xl bg-[#fffdf0] p-5">
                            <p className="text-sm font-bold text-slate-500">
                              예상 총변제금
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                              {formatManwonFromWon(
                                diagnosis.expectedTotalRepaymentWon
                              )}
                            </p>
                            <p className="mt-4 text-sm font-bold text-slate-500">
                              예상 탕감률
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-[#7a5c00]">
                              {Math.round(diagnosis.reductionRate)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          다행입니다.
                        </p>
                        <h5 className="mt-3 text-2xl font-extrabold text-slate-900">
                          지금 이 결과를 보시는 순간부터
                          <br />
                          혼자 짊어지시던 무게가 조금씩 가벼워질 수 있습니다. 
                          <br />
                          매일법률사무소 로가드가 끝까지 함께하겠습니다.
                        </h5>

                        <form
                          onSubmit={handleConsultSubmit}
                          className="mt-6 space-y-4"
                        >
                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              이름
                            </label>
                            <input
                              value={consultation.name}
                              onChange={(e) =>
                                setConsultation((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="이름을 입력해주세요"
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                              전화번호
                            </label>
                            <input
                              value={consultation.phone}
                              onChange={(e) =>
                                setConsultation((prev) => ({
                                  ...prev,
                                  phone: e.target.value.replace(/[^0-9-]/g, ""),
                                }))
                              }
                              placeholder="010-0000-0000"
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-900"
                            />
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between gap-3 px-4 py-3">
                              <label className="flex items-center gap-2 text-[12px] leading-5 text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={privacyAgreed}
                                  onChange={(e) =>
                                    setPrivacyAgreed(e.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                />
                                <span>개인정보처리방침 안내 동의</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => setPrivacyOpen((prev) => !prev)}
                                className="text-xs font-bold text-slate-500"
                                aria-expanded={privacyOpen}
                              >
                                {privacyOpen ? "▲" : "▼"}
                              </button>
                            </div>

                            {privacyOpen && (
                              <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
                                <div className="mb-3 text-sm font-bold text-slate-800">
                                  개인정보처리방침안내
                                </div>
                                <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-[12px] leading-6 text-slate-600 whitespace-pre-wrap">
                                  {PRIVACY_POLICY_TEXT}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="pressable w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white disabled:bg-slate-300"
                          >
                            {isSubmitting ? "전송중..." : "상담신청 보내기"}
                          </button>

                          {submitMessage ? (
                            <p className="text-sm font-semibold text-slate-700">
                              {submitMessage}
                            </p>
                          ) : null}
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-[30px] border border-red-100 bg-red-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                          [안내]
                        </p>
                        <h5 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900">
                          조금 더 자세히 살펴볼 필요가 있어요. 
                        </h5>
                        <p className="mt-2 text-base leading-8 text-slate-700">
                          입력해 주신 내용만으로는 개인회생이 조금 어려운 조건이 보여요.
                          <br />
                          그런데, 걱정부터 하지 마세요.
                          <br />
                          수치만으로는 판단하기 어려운 부분이 많고, 실
                          제로는 상황에 따라 충분히 가능한 경우도 많습
                          니다. 전문가와 잠시 이야기 나눠보시면 훨씬 선
                          명해질 거예요.
                        </p>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          확인된 사유
                        </p>
                        <div className="mt-4 space-y-3">
                          {diagnosis.unsuitableReasons.map((reason) => (
                            <div
                              key={reason}
                              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                            >
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5c00]">
                          이 결과가 끝이 아닙니다.
                        </p>
                        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                          <p>
                            위 결과는 입력하신 정보 기준 1차 예상치일 뿐 입니다. 
                          </p>
                          <p>
                            실제로는 서류 한 장, 조건 하나의 차이로 결과 가 완전히 달라지는 경우가 많습니다.
                          <p>
                            부담 없이 카카오톡으로 말씀만 주셔도 됩니다. 상담은 무료이며, 원치 않으시면 언제든 중단하 실 수 있습니다. 
                          </p>
                          </p>
                        </div>
                        <a
                          href={KAKAO_LINK}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackCtaClick("kakao_consult", "diagnosis_unsuitable")
                          }
                          className="pressable mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
                        >
                          카카오톡 상담하기
                        </a>
                      </div>
                    </div>
                  )}

                  <ResultSupportCards onTrackCta={trackCtaClick} />

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
  <button
    type="button"
    onClick={() => {
      safeCapture("diagnosis restarted", {
        source: diagnosisSourceRef.current,
      });
      setStep(1);
    }}
    className="pressable rounded-2xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700"
  >
    다시 진단하기
  </button>

  <a
    href={NAVER_CAFE_LINK}
    target="_blank"
    rel="noreferrer"
    onClick={() => trackCtaClick("cafe_visit", "result_bottom_button")}
    className="pressable inline-flex items-center justify-center rounded-2xl border border-[#c9a23e] bg-gradient-to-b from-[#c79b25] to-[#9d7417] px-6 py-4 text-sm font-bold text-white"
  >
    카페 가기
  </a>

  <button
    type="button"
    onClick={closeDiagnosisModal}
    className="pressable rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white"
  >
    닫기
  </button>
</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes reviewMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .pressable {
          box-shadow:
            0 14px 30px rgba(15, 23, 42, 0.08),
            0 4px 0 rgba(15, 23, 42, 0.09);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease;
        }

        .pressable:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 34px rgba(15, 23, 42, 0.12),
            0 6px 0 rgba(15, 23, 42, 0.1);
          filter: brightness(1.01);
        }

        .pressable:active {
          transform: translateY(1px);
          box-shadow:
            0 10px 20px rgba(15, 23, 42, 0.1),
            0 2px 0 rgba(15, 23, 42, 0.08);
        }

        .pressable:disabled {
          transform: none;
          box-shadow: none;
          filter: none;
        }

        .review-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .review-marquee-track {
          display: flex;
          width: max-content;
          animation: reviewMarquee 52s linear infinite;
          will-change: transform;
        }

        .review-marquee-group {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          padding-right: 24px;
        }

        .review-marquee-card {
          width: 320px;
          flex-shrink: 0;
        }

        .review-marquee:hover .review-marquee-track {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .review-marquee-card {
            width: 286px;
          }

          .review-marquee-track {
            animation-duration: 40s;
          }
        }
      `}</style>
    </>
  );
}