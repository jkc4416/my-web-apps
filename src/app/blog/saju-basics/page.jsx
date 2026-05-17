import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "saju-basics");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        사주팔자(四柱八字)는 사람이 태어난 <strong style={s.strong}>년·월·일·시 네 기둥(사주)</strong>을
        각각 <strong style={s.strong}>천간(天干)과 지지(地支)</strong>로 표현해 총 여덟 글자(팔자)로
        나타내는 동양 명리학의 기본 단위입니다. 이 글에서는 사주명리학의 기본 구성 요소인
        천간 10개·지지 12개·60갑자와 일주 해석법까지 입문자가 한 번에 이해할 수 있도록
        정리합니다.
      </p>

      <h2 style={s.h2}>천간(天干) — 하늘의 10가지 기운</h2>
      <p style={s.p}>
        천간은 <strong style={s.strong}>갑(甲)·을(乙)·병(丙)·정(丁)·무(戊)·기(己)·경(庚)·신(辛)·임(壬)·계(癸)</strong>의
        10개입니다. 각각 오행(목·화·토·금·수)과 음양에 배속되어 있습니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>갑(甲)·을(乙)</strong> — 목(木). 갑은 양목(큰 나무), 을은 음목(풀·꽃).</li>
        <li style={s.li}><strong style={s.strong}>병(丙)·정(丁)</strong> — 화(火). 병은 양화(태양), 정은 음화(촛불).</li>
        <li style={s.li}><strong style={s.strong}>무(戊)·기(己)</strong> — 토(土). 무는 양토(산), 기는 음토(밭).</li>
        <li style={s.li}><strong style={s.strong}>경(庚)·신(辛)</strong> — 금(金). 경은 양금(쇠), 신은 음금(보석).</li>
        <li style={s.li}><strong style={s.strong}>임(壬)·계(癸)</strong> — 수(水). 임은 양수(바다), 계는 음수(이슬).</li>
      </ul>

      <h2 style={s.h2}>지지(地支) — 땅의 12가지 기운</h2>
      <p style={s.p}>
        지지는 12개로, 우리에게는 <strong style={s.strong}>12지신(띠)</strong>으로 익숙합니다.
        자(쥐)·축(소)·인(호랑이)·묘(토끼)·진(용)·사(뱀)·오(말)·미(양)·신(원숭이)·유(닭)·술(개)·해(돼지).
        각 지지도 오행과 음양에 배속됩니다.
      </p>
      <p style={s.p}>
        지지는 시간·계절·방위와도 연결됩니다. 예를 들어 자시(子時)는 23:30~01:30, 인시(寅時)는
        03:30~05:30입니다. 사주를 볼 때 정확한 출생 시간이 중요한 이유입니다.
      </p>

      <h2 style={s.h2}>60갑자(六十甲子)</h2>
      <p style={s.p}>
        천간 10개와 지지 12개를 양양·음음끼리만 조합하면 총 60가지가 나옵니다. 이를{" "}
        <strong style={s.strong}>60갑자</strong>라 하며, 갑자(甲子)부터 계해(癸亥)까지 순환합니다.
        예를 들어 <strong style={s.strong}>갑자년·갑자월·갑자일·갑자시</strong>라면 사주 팔자가
        모두 갑자로 같은 매우 드문 사주입니다.
      </p>
      <p style={s.p}>
        한국인 나이로 <strong style={s.strong}>60세 환갑(還甲)</strong>은 자신이 태어난 해의 천간지지가
        다시 돌아오는 해를 뜻합니다.
      </p>

      <h2 style={s.h2}>사주 4기둥의 의미</h2>
      <h3 style={s.h3}>년주(年柱)</h3>
      <p style={s.p}>조상·뿌리·청소년기 운을 봅니다. 큰 환경적 배경.</p>

      <h3 style={s.h3}>월주(月柱)</h3>
      <p style={s.p}>부모·가정·청년기 운, 직업적 성향을 봅니다. 격국(格局)의 핵심.</p>

      <h3 style={s.h3}>일주(日柱)</h3>
      <p style={s.p}>
        <strong style={s.strong}>본인 자체와 배우자, 중년기 운</strong>을 봅니다.
        일주의 천간을 <strong style={s.strong}>일간(日干)</strong>이라 하며 자기 자신의 핵심 기운.
      </p>

      <h3 style={s.h3}>시주(時柱)</h3>
      <p style={s.p}>자녀·노년기 운, 말년 운세를 봅니다.</p>

      <h2 style={s.h2}>일간(日干)으로 보는 나의 본성</h2>
      <p style={s.p}>
        사주를 처음 공부할 때 가장 먼저 보는 것이 <strong style={s.strong}>일간</strong>입니다.
        일간은 본인 자신의 본질을 나타냅니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>갑목 일간</strong> — 곧고 강직, 리더십, 자존심 강함</li>
        <li style={s.li}><strong style={s.strong}>을목 일간</strong> — 부드럽고 유연, 사교적, 끈기</li>
        <li style={s.li}><strong style={s.strong}>병화 일간</strong> — 밝고 적극적, 카리스마, 과시욕</li>
        <li style={s.li}><strong style={s.strong}>정화 일간</strong> — 섬세하고 따뜻, 예술적, 내성적</li>
        <li style={s.li}><strong style={s.strong}>무토 일간</strong> — 듬직하고 신뢰, 보수적, 고집</li>
        <li style={s.li}><strong style={s.strong}>기토 일간</strong> — 포용력, 봉사정신, 우유부단</li>
        <li style={s.li}><strong style={s.strong}>경금 일간</strong> — 결단력, 의리, 강함 vs 냉정</li>
        <li style={s.li}><strong style={s.strong}>신금 일간</strong> — 섬세하고 예민, 미적 감각, 까칠함</li>
        <li style={s.li}><strong style={s.strong}>임수 일간</strong> — 지혜롭고 자유, 변화 추구</li>
        <li style={s.li}><strong style={s.strong}>계수 일간</strong> — 영민하고 직관적, 감정 풍부</li>
      </ul>

      <h2 style={s.h2}>오행의 상생상극</h2>
      <p style={s.p}>
        오행은 서로 돕는 <strong style={s.strong}>상생(相生)</strong>과 서로 누르는{" "}
        <strong style={s.strong}>상극(相剋)</strong> 관계를 가집니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>상생:</strong> 목생화 → 화생토 → 토생금 → 금생수 → 수생목</li>
        <li style={s.li}><strong style={s.strong}>상극:</strong> 목극토, 토극수, 수극화, 화극금, 금극목</li>
      </ul>
      <p style={s.p}>
        사주에 부족한 오행을 보강하면 균형이 잡힌다고 봅니다. 예를 들어 화가 부족한 사람은
        붉은색 옷, 햇볕 쬐기, 남쪽 방향을 활용하면 좋다고 합니다.
      </p>

      <h2 style={s.h2}>대운(大運)과 세운(歲運)</h2>
      <p style={s.p}>
        타고난 사주가 평생 변하지 않는 반면, 10년 단위로 바뀌는 운을{" "}
        <strong style={s.strong}>대운</strong>, 매년 바뀌는 운을 <strong style={s.strong}>세운</strong>,
        매월·매일 바뀌는 운을 <strong style={s.strong}>월운·일운</strong>이라 합니다.
        본인 사주(원국)와 흘러오는 대운·세운의 조합으로 그 시기의 운을 판단합니다.
      </p>

      <h2 style={s.h2}>사주를 어떻게 활용할까?</h2>
      <p style={s.p}>
        사주는 <strong style={s.strong}>정해진 운명을 알려주는 것이 아니라</strong> 본인의 기질·강약점을
        이해하고 인생의 흐름을 참고하는 도구로 활용하는 것이 좋습니다. 사주에서 약한 부분을
        보완하고 강한 부분을 활용하는 식으로 활용하세요.
      </p>
      <blockquote style={s.blockquote}>
        "사주는 지도이지 명령이 아니다. 같은 사주라도 어떻게 살아가느냐에 따라 결과가 달라진다."
      </blockquote>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        본인의 사주가 궁금하다면 FunAppBox의{" "}
        <strong style={s.strong}>오늘의 운세(사주)</strong> 도구로 가볍게 확인해보세요.
        생년월일과 태어난 시간을 입력하면 자신의 사주 4기둥과 함께 오늘의 5가지 운세
        (총운·애정·금전·직장·건강)를 확인할 수 있습니다.
      </p>
    </BlogArticle>
  );
}
