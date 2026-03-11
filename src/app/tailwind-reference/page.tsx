export default function TailwindReferencePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-cyan-400 mb-1">TailwindCSS 치트시트</h1>
        <p className="text-gray-500 text-sm mb-10">CSS는 아는데 Tailwind 숫자·이름이 헷갈릴 때 보는 페이지</p>

        {/* ── 1. 스케일 ──────────────────────────────────────────── */}
        <Card title="📏 스페이싱 스케일 — 숫자가 몇 px인가?" accent="cyan">
          <p className="text-gray-400 text-xs mb-4">
            <span className="text-white font-bold">1단위 = 0.25rem = 4px</span>
            &nbsp;·&nbsp; p-4 = 16px &nbsp;·&nbsp; px-3 = 좌우 12px &nbsp;·&nbsp; py-1 = 상하 4px &nbsp;·&nbsp; mb-12 = 48px
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-1 pr-4 w-16">클래스</th>
                  <th className="text-left py-1 pr-4 w-16">rem</th>
                  <th className="text-left py-1 pr-4 w-16">px</th>
                  <th className="text-left py-1">시각</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0", "0", "0"],
                  ["0.5", "0.125", "2"],
                  ["1", "0.25", "4"],
                  ["1.5", "0.375", "6"],
                  ["2", "0.5", "8"],
                  ["2.5", "0.625", "10"],
                  ["3", "0.75", "12"],
                  ["3.5", "0.875", "14"],
                  ["4", "1", "16"],
                  ["5", "1.25", "20"],
                  ["6", "1.5", "24"],
                  ["7", "1.75", "28"],
                  ["8", "2", "32"],
                  ["9", "2.25", "36"],
                  ["10", "2.5", "40"],
                  ["11", "2.75", "44"],
                  ["12", "3", "48"],
                  ["14", "3.5", "56"],
                  ["16", "4", "64"],
                  ["20", "5", "80"],
                  ["24", "6", "96"],
                  ["28", "7", "112"],
                  ["32", "8", "128"],
                  ["36", "9", "144"],
                  ["40", "10", "160"],
                  ["44", "11", "176"],
                  ["48", "12", "192"],
                  ["52", "13", "208"],
                  ["56", "14", "224"],
                  ["60", "15", "240"],
                  ["64", "16", "256"],
                  ["72", "18", "288"],
                  ["80", "20", "320"],
                  ["96", "24", "384"],
                ].map(([n, rem, px]) => {
                  const bar = Math.min(parseInt(px) / 3, 280);
                  return (
                    <tr key={n} className="border-b border-gray-900 hover:bg-gray-900/50">
                      <td className="py-0.5 pr-4 text-yellow-300">{n}</td>
                      <td className="py-0.5 pr-4 text-gray-400">{rem}rem</td>
                      <td className="py-0.5 pr-4 text-gray-300">{px}px</td>
                      <td className="py-0.5">
                        <div className="h-2 bg-cyan-500/70 rounded-sm" style={{ width: bar || 2 }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs mt-3">
            * px- / py- / pt- / pb- / pl- / pr- / mx- / my- / mt- / mb- / ml- / mr- / gap- / space-x- / space-y- / w- / h- / top- / left- 등 모두 이 스케일 사용
          </p>
        </Card>

        {/* ── 2. 글자 크기 ──────────────────────────────────────── */}
        <Card title="🔤 text-{size} — 글자 크기" accent="violet">
          <div className="space-y-1">
            {[
              ["xs", "0.75rem", "12px", "font-size: 0.75rem / line-height: 1rem"],
              ["sm", "0.875rem", "14px", "font-size: 0.875rem / line-height: 1.25rem"],
              ["base", "1rem", "16px", "기본값 (브라우저 기본과 동일)"],
              ["lg", "1.125rem", "18px", "font-size: 1.125rem / line-height: 1.75rem"],
              ["xl", "1.25rem", "20px", "font-size: 1.25rem / line-height: 1.75rem"],
              ["2xl", "1.5rem", "24px", "font-size: 1.5rem / line-height: 2rem"],
              ["3xl", "1.875rem", "30px", "font-size: 1.875rem / line-height: 2.25rem"],
              ["4xl", "2.25rem", "36px", "font-size: 2.25rem / line-height: 2.5rem"],
              ["5xl", "3rem", "48px", "font-size: 3rem / line-height: 1"],
              ["6xl", "3.75rem", "60px", ""],
              ["7xl", "4.5rem", "72px", ""],
              ["8xl", "6rem", "96px", ""],
              ["9xl", "8rem", "128px", ""],
            ].map(([size, rem, px, note]) => (
              <div key={size} className="flex items-baseline gap-3 py-1 border-b border-gray-900">
                <span className="font-mono text-yellow-300 text-xs w-16 shrink-0">text-{size}</span>
                <span className="font-mono text-gray-400 text-xs w-16 shrink-0">{rem}</span>
                <span className="font-mono text-gray-500 text-xs w-10 shrink-0">{px}</span>
                <span
                  className="font-mono text-violet-300 leading-none shrink-0"
                  style={{ fontSize: rem }}
                >
                  Ag
                </span>
                {note && <span className="text-gray-600 text-xs hidden md:inline">{note}</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* ── 3. 브레이크포인트 ─────────────────────────────────── */}
        <Card title="📱 반응형 브레이크포인트 — sm / md / lg / xl / 2xl" accent="green">
          <p className="text-gray-400 text-xs mb-4">
            Tailwind는 <span className="text-white">모바일 우선(Mobile First)</span>. 아무 접두사 없으면 모든 화면에 적용,
            접두사는 &quot;해당 너비 이상&quot;일 때만 적용.
          </p>
          <div className="space-y-3 mb-6">
            {[
              ["(없음)", "0px ~", "모든 화면 (모바일 기본)", "bg-gray-800"],
              ["sm:", "640px ~", "태블릿 (SE, 소형 패드)", "bg-green-900/60"],
              ["md:", "768px ~", "태블릿 (iPad 세로)", "bg-teal-900/60"],
              ["lg:", "1024px ~", "데스크탑 소 (iPad 가로)", "bg-cyan-900/60"],
              ["xl:", "1280px ~", "데스크탑", "bg-blue-900/60"],
              ["2xl:", "1536px ~", "대형 모니터", "bg-indigo-900/60"],
            ].map(([pfx, range, desc, bg]) => (
              <div key={pfx} className={`${bg} rounded-lg px-4 py-3 flex items-center gap-4`}>
                <span className="font-mono text-yellow-300 text-sm w-14 shrink-0">{pfx}</span>
                <span className="font-mono text-white text-sm w-24 shrink-0">{range}</span>
                <span className="text-gray-300 text-sm">{desc}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono space-y-1">
            <p className="text-gray-500 mb-2">{"// 사용 예시"}</p>
            <p>
              <span className="text-gray-500">{"// 모바일: 1열 / 태블릿: 2열 / 데스크탑: 3열"}</span>
            </p>
            <p>
              <span className="text-cyan-300">{"<div"}</span>
              <span className="text-green-300">{` className=`}</span>
              <span className="text-yellow-300">&quot;grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3&quot;</span>
              <span className="text-cyan-300">{">"}</span>
            </p>
            <p className="mt-2">
              <span className="text-gray-500">{"// 모바일: 숨김 / md 이상: 보임"}</span>
            </p>
            <p>
              <span className="text-cyan-300">{"<div"}</span>
              <span className="text-green-300">{` className=`}</span>
              <span className="text-yellow-300">&quot;hidden md:block&quot;</span>
              <span className="text-cyan-300">{">"}</span>
            </p>
            <p className="mt-2">
              <span className="text-gray-500">{"// 모바일: text-sm / xl 이상: text-xl"}</span>
            </p>
            <p>
              <span className="text-cyan-300">{"<p"}</span>
              <span className="text-green-300">{` className=`}</span>
              <span className="text-yellow-300">&quot;text-sm xl:text-xl&quot;</span>
              <span className="text-cyan-300">{">"}</span>
            </p>
          </div>
        </Card>

        {/* ── 4. 색상 쉐이드 ────────────────────────────────────── */}
        <Card title="🎨 색상 쉐이드 — 50 / 100 / … / 900 / 950" accent="pink">
          <p className="text-gray-400 text-xs mb-4">
            숫자가 작을수록 밝고, 클수록 어둡다. <span className="text-white">500이 기준색</span>.
          </p>
          {(["red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"] as const).map((color) => (
            <div key={color} className="flex items-center gap-1 mb-1">
              <span className="text-gray-500 font-mono text-xs w-14 shrink-0">{color}</span>
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div
                  key={shade}
                  className="flex-1 h-6 rounded-sm"
                  style={{ backgroundColor: tailwindColor(color, shade) }}
                />
              ))}
            </div>
          ))}
          <div className="flex justify-between mt-1 px-14">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => (
              <span key={s} className="text-[10px] font-mono text-gray-600 flex-1 text-center">{s}</span>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">
            사용법: <span className="text-yellow-300 font-mono">text-blue-500</span> &nbsp;/&nbsp;
            <span className="text-yellow-300 font-mono">bg-red-100</span> &nbsp;/&nbsp;
            <span className="text-yellow-300 font-mono">border-purple-700</span> &nbsp;/&nbsp;
            <span className="text-yellow-300 font-mono">ring-green-400</span>
          </p>
        </Card>

        {/* ── 5. 자주 쓰는 패턴 ─────────────────────────────────── */}
        <Card title="⚡ 자주 쓰는 패턴 모음" accent="orange">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                label: "가운데 정렬 (수평·수직)",
                code: "flex items-center justify-center",
                desc: "flexbox로 수평·수직 모두 중앙",
              },
              {
                label: "블록 요소 수평 가운데",
                code: "mx-auto",
                desc: "max-w-xl mx-auto 같이 자주 씀",
              },
              {
                label: "이미지 꽉 채우기",
                code: "w-full h-full object-cover",
                desc: "<img> 태그에 사용",
              },
              {
                label: "텍스트 한 줄 말줄임",
                code: "truncate",
                desc: "overflow:hidden + ellipsis + nowrap 한번에",
              },
              {
                label: "텍스트 그라디언트",
                code: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent",
                desc: "",
              },
              {
                label: "고정 비율 박스",
                code: "aspect-video",
                desc: "16:9 / aspect-square = 1:1",
              },
              {
                label: "호버 시 색상 변경",
                code: "bg-blue-600 hover:bg-blue-500 transition-colors duration-200",
                desc: "",
              },
              {
                label: "포커스 링 (접근성)",
                code: "focus:outline-none focus:ring-2 focus:ring-cyan-400",
                desc: "",
              },
              {
                label: "absolute 부모 설정",
                code: "relative",
                desc: "자식에 absolute 쓰려면 부모에 relative 필수",
              },
              {
                label: "화면 전체 덮기 (딤)",
                code: "fixed inset-0 bg-black/50 z-50",
                desc: "모달 배경 등에 사용",
              },
              {
                label: "카드 기본형",
                code: "bg-white rounded-xl shadow-lg p-6",
                desc: "",
              },
              {
                label: "스크롤 내부 영역",
                code: "overflow-y-auto max-h-96",
                desc: "높이 제한 + 스크롤",
              },
            ].map(({ label, code, desc }) => (
              <div key={label} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <p className="text-gray-300 text-xs mb-1 font-medium">{label}</p>
                <code className="text-yellow-300 text-xs font-mono break-all">{code}</code>
                {desc && <p className="text-gray-600 text-xs mt-1">{desc}</p>}
              </div>
            ))}
          </div>
        </Card>

        {/* ── 6. 방향 접두사 빠른 참조 ──────────────────────────── */}
        <Card title="🧭 방향 접두사 — p / m / border / rounded 공통" accent="teal">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              ["p-{n}", "padding 전체"],
              ["px-{n}", "padding 좌·우"],
              ["py-{n}", "padding 상·하"],
              ["pt-{n}", "padding 위"],
              ["pb-{n}", "padding 아래"],
              ["pl-{n}", "padding 왼쪽"],
              ["pr-{n}", "padding 오른쪽"],
              ["m-{n}", "margin 전체"],
              ["mx-{n}", "margin 좌·우"],
              ["my-{n}", "margin 상·하"],
              ["mt-{n}", "margin 위"],
              ["mb-{n}", "margin 아래"],
              ["ml-{n}", "margin 왼쪽"],
              ["mr-{n}", "margin 오른쪽"],
              ["mx-auto", "margin 좌우 auto"],
              ["border", "테두리 전체"],
              ["border-x", "테두리 좌·우"],
              ["border-y", "테두리 상·하"],
              ["border-t", "테두리 위"],
              ["border-b", "테두리 아래"],
              ["rounded-t-{s}", "위 두 모서리"],
              ["rounded-b-{s}", "아래 두 모서리"],
              ["rounded-l-{s}", "왼쪽 두 모서리"],
              ["rounded-r-{s}", "오른쪽 두 모서리"],
            ].map(([cls, desc]) => (
              <div key={cls} className="flex gap-2 items-start bg-gray-900 rounded px-3 py-2">
                <span className="font-mono text-yellow-300 text-xs shrink-0">{cls}</span>
                <span className="text-gray-500 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 7. State / Variant ─────────────────────────────────── */}
        <Card title="🎯 상태 접두사 — hover / focus / 반응형 조합" accent="indigo">
          <p className="text-gray-400 text-xs mb-4">
            모든 유틸리티 클래스 앞에 붙일 수 있다.{" "}
            <span className="text-white font-mono">조건:클래스</span> 형태.
            중복 가능: <span className="text-yellow-300 font-mono">md:hover:text-white</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {[
              ["hover:", "마우스 오버"],
              ["focus:", "포커스 (input 등)"],
              ["focus-visible:", "키보드 Tab 포커스만"],
              ["active:", "클릭 중"],
              ["disabled:", "비활성화 상태"],
              ["checked:", "체크박스 체크됨"],
              ["placeholder:", "placeholder 스타일"],
              ["first:", "첫 번째 자식"],
              ["last:", "마지막 자식"],
              ["odd:", "홀수 자식"],
              ["even:", "짝수 자식"],
              ["dark:", "다크모드"],
              ["group-hover:", "부모(group) 호버 시"],
              ["peer-checked:", "형제(peer) 상태 시"],
              ["sm: md: lg: xl:", "반응형"],
            ].map(([pfx, desc]) => (
              <div key={pfx} className="flex gap-2 items-center bg-gray-900 rounded px-3 py-2">
                <span className="font-mono text-indigo-300 text-xs shrink-0">{pfx}</span>
                <span className="text-gray-500 text-xs">{desc}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono space-y-1">
            <p className="text-gray-500 mb-1">{"// group 사용 예시 — 부모 호버 시 자식 스타일 변경"}</p>
            <p>
              <span className="text-cyan-300">{"<div"}</span>
              <span className="text-green-300">{` className=`}</span>
              <span className="text-yellow-300">&quot;group flex gap-2 p-4 rounded-lg hover:bg-gray-800&quot;</span>
              <span className="text-cyan-300">{">"}</span>
            </p>
            <p className="pl-4">
              <span className="text-cyan-300">{"<span"}</span>
              <span className="text-green-300">{` className=`}</span>
              <span className="text-yellow-300">&quot;text-gray-500 group-hover:text-white&quot;</span>
              <span className="text-cyan-300">{">"}</span>
            </p>
          </div>
        </Card>

        {/* ── 8. 임의값 ──────────────────────────────────────────── */}
        <Card title="🔧 임의값 — Tailwind에 없는 값 쓰기" accent="rose">
          <p className="text-gray-400 text-xs mb-4">
            스케일에 없는 값은 <span className="text-white font-mono">[값]</span> 대괄호로 직접 지정.
          </p>
          <div className="space-y-2">
            {[
              ["w-[320px]", "width: 320px"],
              ["h-[calc(100vh-64px)]", "calc() 그대로 사용 가능"],
              ["top-[88px]", "top: 88px"],
              ["text-[13px]", "font-size: 13px"],
              ["text-[#ff6b6b]", "color: #ff6b6b"],
              ["bg-[#1a1a2e]", "background-color: #1a1a2e"],
              ["bg-[url('/hero.png')]", "background-image: url(...)"],
              ["grid-cols-[1fr_2fr_1fr]", "grid-template-columns: 1fr 2fr 1fr  (공백은 _ 로)"],
              ["delay-[400ms]", "transition-delay: 400ms"],
            ].map(([cls, desc]) => (
              <div key={cls} className="flex gap-4 items-center border-b border-gray-900 py-1">
                <code className="text-yellow-300 font-mono text-xs w-56 shrink-0">{cls}</code>
                <span className="text-gray-400 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <footer className="text-center text-xs text-gray-700 mt-8">
          AlgoCanvas — TailwindCSS v4 Cheat Sheet
        </footer>
      </div>
    </main>
  );
}

/* ─── Card ──────────────────────────────────────────────────── */
type Accent = "cyan" | "violet" | "green" | "pink" | "orange" | "teal" | "indigo" | "rose";

const accentBorder: Record<Accent, string> = {
  cyan: "border-cyan-500/30",
  violet: "border-violet-500/30",
  green: "border-green-500/30",
  pink: "border-pink-500/30",
  orange: "border-orange-500/30",
  teal: "border-teal-500/30",
  indigo: "border-indigo-500/30",
  rose: "border-rose-500/30",
};

const accentTitle: Record<Accent, string> = {
  cyan: "text-cyan-400",
  violet: "text-violet-400",
  green: "text-green-400",
  pink: "text-pink-400",
  orange: "text-orange-400",
  teal: "text-teal-400",
  indigo: "text-indigo-400",
  rose: "text-rose-400",
};

function Card({
  title,
  children,
  accent = "cyan",
}: {
  title: string;
  children: React.ReactNode;
  accent?: Accent;
}) {
  return (
    <section className={`mb-6 bg-gray-900 rounded-2xl p-6 border ${accentBorder[accent]}`}>
      <h2 className={`text-base font-bold ${accentTitle[accent]} mb-4`}>{title}</h2>
      {children}
    </section>
  );
}

/* ─── Tailwind 기본 팔레트 HEX ──────────────────────────────── */
function tailwindColor(color: string, shade: number): string {
  const palette: Record<string, Record<number, string>> = {
    red:    { 50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a" },
    orange: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407" },
    yellow: { 50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006" },
    green:  { 50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16" },
    teal:   { 50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e" },
    cyan:   { 50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344" },
    blue:   { 50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554" },
    indigo: { 50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b" },
    purple: { 50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764" },
    pink:   { 50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724" },
  };
  return palette[color]?.[shade] ?? "#888";
}
