import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "focus-sounds-science");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        조용한 도서관보다 적당한 카페 소음에서 더 집중이 잘 된 경험, 누구나 있을 것입니다.
        과학적으로도 일정한 배경 소음이 집중력·창의력 향상에 도움이 된다는 연구 결과가 있습니다.
        이 글에서는 화이트노이즈·자연 사운드의 원리와 효과적인 활용법을 정리합니다.
      </p>

      <h2 style={s.h2}>왜 완전한 침묵이 안 좋을까?</h2>
      <p style={s.p}>
        완전한 침묵 속에서는 작은 소리(시계 초침, 옆방 발자국)도 크게 들려 오히려 집중을
        방해합니다. 또한 사람의 청각은 "기준 소음"이 있을 때 안정적으로 동작합니다.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>일관된 배경 소음(constant ambient noise)</strong>은 갑작스러운
        소리(전화벨, 옆 사람 대화)를 마스킹해 집중을 유지시킵니다.
      </p>

      <h2 style={s.h2}>색깔이 있는 노이즈</h2>
      <p style={s.p}>
        노이즈는 주파수 분포에 따라 색으로 분류됩니다. 사람마다 선호도가 다르므로 직접
        들어보고 본인에게 맞는 것을 찾으세요.
      </p>

      <h3 style={s.h3}>화이트 노이즈 (White Noise)</h3>
      <p style={s.p}>
        모든 주파수가 동일한 에너지. <strong style={s.strong}>"치~~"</strong> 소리.
        TV 화면 노이즈, 라디오 잡음과 비슷.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>장점: 모든 주파수의 소리를 효과적으로 차단</li>
        <li style={s.li}>단점: 고주파가 강해 길게 들으면 피곤할 수 있음</li>
        <li style={s.li}>추천: 단기 집중, 소음 차단</li>
      </ul>

      <h3 style={s.h3}>핑크 노이즈 (Pink Noise)</h3>
      <p style={s.p}>
        주파수가 높아질수록 에너지 감소. <strong style={s.strong}>"슈~~"</strong> 소리.
        자연의 소리(바람, 파도)에 가까움.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>장점: 화이트보다 부드러워 장시간 들어도 피곤하지 않음</li>
        <li style={s.li}>장점: 수면 질 개선에 도움 (NIH 연구)</li>
        <li style={s.li}>추천: 수면, 깊은 휴식</li>
      </ul>

      <h3 style={s.h3}>브라운 노이즈 (Brown / Red Noise)</h3>
      <p style={s.p}>
        저주파가 강조됨. <strong style={s.strong}>"우~~"</strong> 같은 깊은 울림.
        폭포, 천둥과 비슷.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>장점: 매우 부드럽고 안정적</li>
        <li style={s.li}>장점: 이명(tinnitus) 완화에 도움된다는 보고</li>
        <li style={s.li}>추천: 명상, 집중, 이명 환자</li>
      </ul>

      <h2 style={s.h2}>자연 사운드의 효과</h2>

      <h3 style={s.h3}>빗소리 (Rain)</h3>
      <p style={s.p}>
        가장 인기 있는 집중 사운드. 일정한 리듬이 알파파(8~13Hz)를 유도해 깊은 집중 상태에
        이르게 합니다.
      </p>

      <h3 style={s.h3}>파도소리 (Ocean Waves)</h3>
      <p style={s.p}>
        7~14초 주기의 자연스러운 리듬이 사람의 호흡과 비슷해 안정감을 줍니다. 명상과
        수면에 효과적.
      </p>

      <h3 style={s.h3}>모닥불 (Crackling Fire)</h3>
      <p style={s.p}>
        2009년 일본 연구에 따르면 모닥불 소리는 혈압을 낮추는 효과가 있습니다.
        편안함과 따뜻한 분위기 연출에 좋음.
      </p>

      <h3 style={s.h3}>카페 소음 (Coffee Shop)</h3>
      <p style={s.p}>
        2012년 시카고대학 연구: <strong style={s.strong}>약 70데시벨의 적당한 배경 소음</strong>이
        창의력을 향상시킨다는 결과. 완전 침묵(50dB)이나 시끄러운 소음(85dB)보다 효과적.
      </p>

      <h3 style={s.h3}>천둥소리 (Thunder)</h3>
      <p style={s.p}>
        저주파의 진동이 안정감을 주며, 빗소리와 함께 들으면 효과 배가. 수면 유도에 인기.
      </p>

      <h2 style={s.h2}>과학적 연구 결과</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>2017년 PNAS:</strong> 핑크 노이즈가 노년층의 수면 중 기억 강화 향상</li>
        <li style={s.li}><strong style={s.strong}>2012년 Journal of Consumer Research:</strong> 70dB 환경에서 창의력 최고</li>
        <li style={s.li}><strong style={s.strong}>2017년 Scientific Reports:</strong> 자연 소리가 부교감 신경 활성화 → 스트레스 감소</li>
        <li style={s.li}><strong style={s.strong}>2020년 PLoS ONE:</strong> 화이트 노이즈가 ADHD 아동의 집중력 향상에 도움</li>
      </ul>

      <h2 style={s.h2}>상황별 추천 조합</h2>

      <h3 style={s.h3}>🎯 깊은 집중이 필요한 작업</h3>
      <p style={s.p}>빗소리 (강도 50%) + 모닥불 (강도 30%) + 카페 소음 (강도 20%)</p>

      <h3 style={s.h3}>💤 수면 유도</h3>
      <p style={s.p}>파도소리 (강도 40%) + 천둥 (강도 20%, 가끔)</p>

      <h3 style={s.h3}>🧘 명상·휴식</h3>
      <p style={s.p}>브라운 노이즈 (강도 60%) + 새소리 (강도 20%)</p>

      <h3 style={s.h3}>📚 공부·독서</h3>
      <p style={s.p}>카페 소음 (강도 50%) + 핑크 노이즈 (강도 30%)</p>

      <h3 style={s.h3}>🎨 창의적인 작업</h3>
      <p style={s.p}>카페 소음 (강도 70%, 약 70dB 수준) — 시카고대학 연구 기반</p>

      <h2 style={s.h2}>주의사항</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>볼륨 주의:</strong> 70dB 이상에서 장시간 듣지 말기 (청력 손상)</li>
        <li style={s.li}><strong style={s.strong}>이어폰보다 스피커:</strong> 자연스러운 공간감으로 듣기</li>
        <li style={s.li}><strong style={s.strong}>너무 의존하지 말기:</strong> 사운드 없으면 집중 못 하는 의존성 주의</li>
        <li style={s.li}><strong style={s.strong}>가사 있는 음악은 피하기:</strong> 언어 처리 영역이 작업과 충돌</li>
      </ul>

      <h2 style={s.h2}>포모도로와 결합하면 효과 ↑</h2>
      <p style={s.p}>
        25분 집중 + 5분 휴식의 <strong style={s.strong}>포모도로 기법</strong>과 함께 사용하면
        효과가 배가됩니다. 집중 시간에는 사운드를 켜고, 휴식 시간에는 끄는 식으로
        뇌가 "지금 집중 모드"라는 신호를 인식하게 합니다.
      </p>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        FunAppBox의 <strong style={s.strong}>집중 사운드</strong> 도구는 10가지 자연 사운드를
        Web Audio API로 실시간 합성합니다. 각 사운드의 볼륨을 개별 조절해 본인만의 믹스를
        만들고, 포모도로 또는 수면 타이머와 함께 활용해보세요. 외부 다운로드 없이 무한 재생됩니다.
      </p>
    </BlogArticle>
  );
}
