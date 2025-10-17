import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap, RadialBarChart, RadialBar, FunnelChart, Funnel, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, ZAxis, ErrorBar, LabelList
} from 'recharts';

// --- Inline SVG icons ---
const Icon = ({ children, className, ...props }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>;
const LayoutDashboard = (props) => <Icon {...props}><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></Icon>;
const BarChart3 = (props) => <Icon {...props}><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></Icon>;
const PieChartIcon = (props) => <Icon {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></Icon>;
const GitMerge = (props) => <Icon {...props}><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></Icon>;
const Map = (props) => <Icon {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" x2="9" y1="3" y2="18"></line><line x1="15" x2="15" y1="6" y2="21"></line></Icon>;
const Shapes = (props) => <Icon {...props}><path d="M8.3 10a.7.7 0 0 1-1.6 0l-6-5a.7.7 0 0 1 0-1.2l6-5a.7.7 0 0 1 1.6 0l6 5a.7.7 0 0 1 0 1.2Z"></path><path d="M17.7 14a.7.7 0 0 1 1.6 0l6 5a.7.7 0 0 1 0 1.2l-6 5a.7.7 0 0 1-1.6 0l-6-5a.7.7 0 0 1 0-1.2Z"></path><path d="M7.7 21a.7.7 0 0 1-1.4 0l-6-6a.7.7 0 0 1 0-1.4l6-6a.7.7 0 0 1 1.4 0l6 6a.7.7 0 0 1 0 1.4Z"></path></Icon>;
const ChevronDown = (props) => <Icon {...props}><path d="m6 9 6 6 6-6"></path></Icon>;
const ChevronRight = (props) => <Icon {...props}><path d="m9 18 6-6-6-6"></path></Icon>;
const CheckCircle = (props) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></Icon>;
const Search = (props) => <Icon {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></Icon>;
const Home = (props) => <Icon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></Icon>;

// --- I18N data ---
const i18nData = {
  ko: {
    homeTitle: "인터랙티브 차트 포트폴리오",
    homeDesc: "다양한 유형의 차트를 탐색하고 각 차트의 사용 사례와 장점을 알아보세요. Gemini API를 활용한 AI 데이터 분석 기능을 통해 차트에서 즉각적인 인사이트를 얻을 수 있습니다.",
    homeButton: "차트 탐색하기",
    chartsTitle: "차트 목록",
    home: "홈",
    portfolioTitle: "차트 포트폴리오", advantagesTitle: "주요 장점", selectChartPrompt: "사이드바에서 차트를 선택해주세요.", chartPreviewNotAvailable: "예시 차트를 준비 중입니다.",
    generateAnalysis: "✨ AI 분석 생성", analysisTitle: "✨ AI 데이터 분석", loadingAnalysis: "AI 분석을 생성 중입니다...",
    quantitative: "양적 데이터", qualitative: "질적 데이터", relationship: "관계/흐름", spatial: "공간/지리", others: "기타",
    searchPlaceholder: "차트 검색...",
    line: { name: '선 그래프 (Line Chart)', desc: '시간에 따른 데이터 변화 추세를 보여주는 데 적합합니다.', adv: ['시간의 흐름에 따른 데이터 변화 추세를 명확하게 시각화', '여러 데이터 시리즈를 비교하여 패턴이나 관계 파악 용이', '데이터의 최고점, 최저점, 변동성을 직관적으로 확인'] },
    bar: { name: '막대 그래프 (Bar Chart)', desc: '항목별 데이터 크기를 비교할 때 사용됩니다.', adv: ['카테고리별 데이터 값을 직관적으로 비교', '데이터의 순위나 크기를 쉽게 파악 가능', '값의 차이를 명확하게 보여줌'] },
    area: { name: '영역 차트 (Area Chart)', desc: '선 그래프에 아래 영역이 채워진 형태로, 누적 값과 변화량을 함께 보여줍니다.', adv: ['시간에 따른 누적 데이터의 변화를 효과적으로 표현', '전체와 부분을 동시에 파악하기 용이', '데이터의 양적 변화를 시각적으로 강조'] },
    composed: { name: '혼합 그래프 (Composed Chart)', desc: '여러 종류의 그래프(선, 막대 등)를 함께 표현하여 다양한 관점을 제공합니다.', adv: ['다양한 유형의 데이터를 하나의 차트에서 비교 분석', '데이터 간의 관계를 종합적으로 파악', '복합적인 데이터 스토리를 전달하는 데 효과적'] },
    scatter: { name: '산점도 (Scatter Plot)', desc: '두 변수 간의 상관 관계를 파악하는 데 유용합니다.', adv: ['두 변수 간의 상관관계(양, 음, 없음)를 시각적으로 확인', '데이터 클러스터나 이상치를 발견하기 쉬움', '데이터의 분포 패턴을 파악하는 데 유용'] },
    histogram: { name: '히스토그램 (Histogram)', desc: '데이터의 분포를 막대 형태로 보여줍니다. (막대 그래프와 유사)', adv: ['데이터의 전체적인 분포 형태(정규분포, 치우침 등)를 파악', '특정 구간에 데이터가 얼마나 집중되어 있는지 확인', '데이터의 중심 경향성과 산포도를 시각화'] },
    bubble: { name: '버블 차트 (Bubble Chart)', desc: '산점도에 데이터 크기를 버블 크기로 표현하여 3차원 비교가 가능합니다.', adv: ['세 가지 변수(X, Y, 크기)를 동시에 비교 가능', '데이터의 상대적 중요성이나 규모를 직관적으로 표현', '시각적으로 흥미롭고 이해하기 쉬움'] },
    candlestick: { name: '캔들스틱 차트 (Candlestick)', desc: '주로 주식 데이터에서 시가, 고가, 저가, 종가를 표현합니다.', adv: ['주가와 같은 금융 데이터의 변동성을 한눈에 파악', '가격의 상승/하락 추세와 패턴 분석에 용이', '시가, 종가, 고가, 저가 정보를 압축적으로 전달'] },
    waterfall: { name: '폭포 차트 (Waterfall Chart)', desc: '누적 값의 변화 과정을 단계별로 보여줍니다.', adv: ['초기 값에서 최종 값까지의 변화 과정을 명확히 추적', '각 항목이 전체에 긍정적/부정적 영향을 미치는지 시각화', '재무 분석이나 재고 변화 추적에 효과적'] },
    bullet: { name: '불릿 그래프 (Bullet Graph)', desc: '목표 대비 실적을 시각적으로 명확하게 비교합니다.', adv: ['목표 대비 성과를 직관적으로 파악', '좁은 공간에서 많은 정보를 효과적으로 전달', '성과 수준(좋음, 보통, 나쁨)을 함께 표시 가능'] },
    heatmap: { name: '히트맵 (Heatmap)', desc: '데이터 값의 크기를 색상으로 표현하여 패턴을 쉽게 파악할 수 있습니다.', adv: ['대량의 데이터에서 패턴이나 집중 영역을 빠르게 식별', '색상의 농도로 데이터의 높고 낮음을 직관적으로 표현', '복잡한 데이터 행렬을 시각적으로 단순화'] },
    stream: { name: '스트림 그래프 (Streamgraph)', desc: '여러 그룹의 데이터가 시간에 따라 어떻게 변하는지 흐름으로 보여줍니다.', adv: ['시간에 따른 여러 데이터 범주의 변화와 흐름을 유기적으로 표현', '전체적인 트렌드의 변동을 아름답게 시각화', '각 범주가 전체에서 차지하는 비중 변화를 파악'] },
    box: { name: '박스 플롯 (Box Plot)', desc: '데이터의 분포, 중앙값, 이상치를 한 번에 보여주는 통계 차트입니다.', adv: ['데이터의 5가지 요약 수치(최소, 1사분위, 중앙, 3사분위, 최대)를 한눈에', '데이터의 대칭성, 분산, 이상치 존재 여부 파악 용이', '여러 데이터 그룹의 분포를 쉽게 비교'] },
    violin: { name: '바이올린 플롯 (Violin Plot)', desc: '박스 플롯과 데이터 분포의 밀도를 함께 보여줍니다.', adv: ['박스 플롯의 장점에 더해 데이터 분포의 밀도까지 표현', '데이터가 집중된 부분을 더 명확하게 확인 가능', '데이터 분포의 미묘한 차이를 비교하는 데 유용'] },
    range: { name: '범위 차트 (Range Chart)', desc: '데이터의 최소값과 최대값 범위를 시간에 따라 보여줍니다.', adv: ['시간에 따른 데이터의 변동 범위(최소-최대)를 명확히 표현', '온도, 주가 등 변동성 있는 데이터 시각화에 적합', '데이터의 안정성이나 변동성을 쉽게 파악'] },
    error: { name: '오차 막대 차트 (Error Bars)', desc: '측정값의 불확실성이나 오차 범위를 표시합니다.', adv: ['데이터의 신뢰도나 불확실성 범위를 시각적으로 표현', '통계적 유의성을 판단하는 데 도움', '측정값의 정밀도를 보여줌'] },
    pie: { name: '파이 차트 (Pie Chart)', desc: '전체에 대한 각 부분의 비율을 보여주는 데 효과적입니다.', adv: ['전체에 대한 각 항목의 비율을 직관적으로 이해', '구성 요소의 비중을 쉽게 비교', '시각적으로 단순하고 이해하기 쉬움'] },
    donut: { name: '도넛 차트 (Donut Chart)', desc: '파이 차트의 중앙이 비어있는 형태로, 여러 시리즈를 중첩하거나 중앙에 정보를 추가할 수 있습니다.', adv: ['파이 차트의 장점을 가지면서 중앙 공간 활용 가능', '중앙에 총합이나 핵심 지표를 표시하여 정보 전달력 높임', '계층적 데이터를 표현하기에 더 유연함'] },
    treemap: { name: '트리맵 (Treemap)', desc: '계층 구조 데이터를 사각형의 크기와 색상으로 표현합니다.', adv: ['계층 구조 데이터의 비중을 한눈에 파악', '제한된 공간에 많은 데이터를 효율적으로 표현', '데이터의 크기를 면적으로 비교하여 직관적'] },
    sunburst: { name: '선버스트 차트 (Sunburst)', desc: '트리맵처럼 계층 구조를 보여주지만, 원형으로 표현하여 깊이를 강조합니다.', adv: ['계층 구조의 깊이와 각 요소의 관계를 명확하게 표현', '전체와 부분의 관계를 직관적으로 이해', '시각적으로 아름답고 인터랙티브한 탐색에 용이'] },
    funnel: { name: '퍼널 차트 (Funnel Chart)', desc: '단계별로 데이터가 줄어드는 과정을 깔때기 모양으로 시각화합니다.', adv: ['사용자 여정 등 단계별 전환율과 이탈률을 쉽게 파악', '프로세스의 병목 현상을 식별하는 데 유용', '각 단계의 효율성을 시각적으로 평가'] },
    wordcloud: { name: '워드 클라우드 (Word Cloud)', desc: '텍스트 데이터의 빈도를 단어의 크기로 표현하여 핵심 키워드를 파악하기 좋습니다.', adv: ['텍스트 데이터의 핵심 키워드와 중요도를 빠르게 파악', '시각적으로 흥미를 유발하며 메시지 전달력이 강함', '비정형 텍스트 데이터의 요약 및 탐색에 유용'] },
    pictogram: { name: '픽토그램 (Pictogram)', desc: '아이콘이나 그림을 사용해 데이터의 양을 표현합니다.', adv: ['아이콘을 사용하여 데이터를 더 쉽고 재미있게 전달', '숫자에 익숙하지 않은 사람들도 쉽게 이해', '주제와 관련된 아이콘으로 데이터의 의미를 강화'] },
    waffle: { name: '와플 차트 (Waffle Chart)', desc: '작은 사각형들로 전체에 대한 비율을 명확하게 보여줍니다.', adv: ['전체 100%에 대한 비율을 정확하고 직관적으로 표현', '파이 차트보다 비율을 더 정밀하게 비교 가능', '진행률이나 목표 달성률을 보여주기 좋음'] },
    marimekko: { name: '마리메코 차트 (Marimekko)', desc: '두 가지 변수를 기준으로 전체에 대한 비율을 사각형으로 표현합니다.', adv: ['두 개의 변수를 기준으로 시장 점유율 등을 복합적으로 분석', '전체 시장과 각 세그먼트의 관계를 동시에 파악', '복잡한 범주형 데이터를 시각적으로 요약'] },
    nightingale: { name: '나이팅게일 로즈 차트 (Nightingale)', desc: '원형 막대 그래프로, 주기적인 데이터 패턴을 보여주기 좋습니다.', adv: ['주기적인 데이터(예: 월별)를 비교하는 데 효과적', '데이터의 변동과 패턴을 시각적으로 강조', '역사적 의미가 있으며 시각적으로 독특함'] },
    sankey: { name: '생키 다이어그램 (Sankey)', desc: '여러 노드 사이의 흐름이나 양을 표현하여 시스템의 흐름을 분석하는 데 사용됩니다.', adv: ['시스템 내 에너지, 비용, 사용자 등의 흐름을 명확하게 시각화', '흐름의 양을 너비로 표현하여 직관적', '프로세스의 여러 단계 간 전환을 추적하는 데 유용'] },
    chord: { name: '코드 다이어그램 (Chord)', desc: '여러 개체 간의 상호 관계와 흐름을 원형으로 시각화합니다.', adv: ['복잡한 데이터 세트 내 항목 간의 상호 관계를 효과적으로 표현', '데이터 흐름의 양과 방향을 한눈에 파악', '네트워크 내의 주요 연결 관계를 식별'] },
    network: { name: '네트워크 다이어그램 (Network)', desc: '노드(개체)와 엣지(관계)를 이용해 복잡한 관계망을 표현합니다.', adv: ['개체 간의 복잡한 관계와 네트워크 구조를 시각화', '중심이 되는 노드나 클러스터를 쉽게 식별', '소셜 네트워크, 통신망 등 다양한 분야에 활용'] },
    gantt: { name: '간트 차트 (Gantt Chart)', desc: '프로젝트의 일정과 작업 진행 상황을 시간 축에 따라 막대로 표시합니다.', adv: ['프로젝트의 전체 일정과 작업 순서를 한눈에 파악', '작업별 시작일, 종료일, 기간을 명확하게 관리', '작업 간의 의존 관계와 진행 상황을 쉽게 추적'] },
    timeline: { name: '타임라인 (Timeline)', desc: '시간 순서에 따라 발생한 이벤트를 시각적으로 나열합니다.', adv: ['역사적 사건, 프로젝트 마일스톤 등 시간 순서가 중요한 정보를 효과적으로 전달', '이벤트의 선후 관계를 명확하게 이해', '복잡한 과정을 연대순으로 단순화'] },
    parallel: { name: '평행 좌표 플롯 (Parallel Coordinates)', desc: '다차원 데이터를 여러 개의 평행한 축에 표시하여 비교합니다.', adv: ['여러 변수를 동시에 비교하여 데이터의 패턴과 관계를 발견', '다차원 데이터 세트의 클러스터링이나 이상치 탐지에 유용', '변수 간의 상호작용을 시각적으로 탐색'] },
    flowchart: { name: '순서도 (Flowchart)', desc: '프로세스나 작업의 흐름을 도형과 화살표로 나타냅니다.', adv: ['복잡한 프로세스나 알고리즘을 단계별로 명확하게 표현', '작업의 논리적 흐름을 쉽게 이해하고 공유', '문제 해결 및 의사 결정 과정을 시각화'] },
    mindmap: { name: '마인드맵 (Mind Map)', desc: '중심 주제를 기준으로 아이디어나 개념을 방사형으로 연결하여 표현합니다.', adv: ['아이디어를 자유롭게 발산하고 체계적으로 정리', '핵심 개념과 하위 개념 간의 관계를 시각적으로 파악', '창의적 사고와 브레인스토밍에 효과적'] },
    choropleth: { name: '코로플레스 맵 (Choropleth Map)', desc: '지도 위의 각 지역을 데이터 값에 따라 다른 색상이나 음영으로 채워 표현합니다.', adv: ['지역별 데이터 분포와 패턴을 지리적 맥락에서 파악', '색상 단계로 데이터의 밀도나 비율을 직관적으로 비교', '선거 결과, 인구 밀도 등 지역 통계 시각화에 널리 사용'] },
    bubblemap: { name: '버블 맵 (Bubble Map)', desc: '지도 위에 데이터 값의 크기를 버블 크기로 표시합니다.', adv: ['지리적 위치와 데이터의 양을 동시에 표현', '지역별 데이터의 상대적 크기를 직관적으로 비교', '코로플레스 맵의 단점(지역 크기 왜곡)을 보완'] },
    connectionmap: { name: '연결 맵 (Connection Map)', desc: '지도 위의 두 지점 사이의 연결 관계나 이동 경로를 선으로 나타냅니다.', adv: ['지리적 위치 간의 연결, 경로, 상호작용을 시각화', '항공 노선, 이주 경로, 데이터 전송 경로 등을 표현', '네트워크의 허브와 스포크 구조를 파악'] },
    flowmap: { name: '플로우 맵 (Flow Map)', desc: '연결 맵과 유사하지만, 선의 굵기나 색상로 이동량이나 규모를 함께 표현합니다.', adv: ['연결 관계뿐만 아니라 흐름의 양이나 규모까지 표현', '무역량, 인구 이동 등 유량 데이터 시각화에 효과적', '흐름의 방향과 크기를 직관적으로 이해'] },
    calendarmap: { name: '달력 히트맵 (Calendar Heatmap)', desc: '달력 위에 날짜별 데이터 값의 크기를 색상으로 표현합니다.', adv: ['시간에 따른 데이터 패턴을 요일, 주, 월 단위로 쉽게 파악', '장기간의 활동 데이터(예: Github 커밋)를 압축적으로 시각화', '주기적인 패턴이나 특정일의 이상 현상을 발견'] },
    radar: { name: '레이더 차트 (Radar Chart)', desc: '여러 항목의 균형을 한눈에 비교하고 평가할 때 유용합니다.', adv: ['다양한 평가 항목의 균형과 전반적인 성향을 한눈에 파악', '여러 대상의 강점과 약점을 비교하는 데 용이', '데이터의 전체적인 형태를 통해 이상적인 값과 비교'] },
    radialbar: { name: '방사형 막대 차트 (Radial Bar)', desc: '원형으로 배열된 막대 그래프로, 주기성을 갖는 데이터를 표현하기 좋습니다.', adv: ['데이터를 원형으로 배치하여 시각적인 흥미를 유발', '주기성을 가진 데이터를 표현하는 데 적합', '목표 대비 진행률 등을 표현하기 좋음'] },
    pareto: { name: '파레토 차트 (Pareto Chart)', desc: '막대 그래프와 선 그래프를 조합하여 문제의 주요 원인을 찾는 데 사용됩니다. (80/20 법칙)', adv: ['문제의 핵심 원인(소수)과 기타 원인(다수)을 명확히 구분', '한정된 자원을 어디에 집중해야 할지 결정하는 데 도움', '품질 관리, 비즈니스 분석 등에서 문제 해결 우선순위 결정에 유용'] },
    dumbbell: { name: '덤벨 플롯 (Dumbbell Plot)', desc: '두 시점 또는 두 그룹 간의 데이터 변화나 차이를 비교하는 데 효과적입니다.', adv: ['두 그룹 또는 두 시점 간의 차이를 명확하게 비교', '데이터의 변화 방향과 크기를 직관적으로 표현', '순위 변화나 격차 변화를 시각화하는 데 유용'] },
    lollipop: { name: '롤리팝 차트 (Lollipop Chart)', desc: '막대 그래프보다 시각적으로 덜 혼잡하게 데이터를 표현할 수 있습니다.', adv: ['막대 그래프보다 시각적으로 깔끔하고 세련된 인상을 줌', '데이터 포인트에 집중하게 하여 값을 더 명확하게 전달', '많은 항목을 비교할 때 시각적 혼잡을 줄여줌'] },
    gauge: { name: '게이지 차트 (Gauge Chart)', desc: '계기판 형태로 현재 값의 수준이나 상태를 직관적으로 보여줍니다.', adv: ['핵심 성과 지표(KPI)를 즉각적이고 직관적으로 전달', '목표 대비 현재 상태를 명확하게 시각화', '대시보드에서 핵심 정보를 강조하는 데 효과적'] },
  },
  en: {
    homeTitle: "Interactive Chart Portfolio",
    homeDesc: "Explore a diverse collection of chart types, understand their use cases, and learn about their key advantages. Leverage the power of the Gemini API for AI-driven data analysis to gain instant insights from the charts.",
    homeButton: "Explore Charts",
    chartsTitle: "Charts",
    home: "Home",
    portfolioTitle: "Chart Portfolio", advantagesTitle: "Key Advantages", selectChartPrompt: "Please select a chart from the sidebar.", chartPreviewNotAvailable: "Chart example is in preparation.",
    generateAnalysis: "✨ Generate AI Analysis", analysisTitle: "✨ AI Data Analysis", loadingAnalysis: "Generating AI analysis...",
    quantitative: "Quantitative", qualitative: "Qualitative", relationship: "Relationship/Flow", spatial: "Spatial/Geographical", others: "Others",
    searchPlaceholder: "Search charts...",
    line: { name: 'Line Chart', desc: 'Suitable for showing data trends over time.', adv: ['Clearly visualises data trends over time', 'Easy to compare patterns and relationships between multiple data series', 'Intuitively identifies peaks, troughs, and volatility'] },
    bar: { name: 'Bar Chart', desc: 'Used to compare the size of data for each item.', adv: ['Intuitively compares data values by category', 'Easily identifies rankings or sizes of data', 'Clearly shows the difference between values'] },
    area: { name: 'Area Chart', desc: 'A line chart with the area below the line filled, showing cumulative values and changes.', adv: ['Effectively represents the change in cumulative data over time', 'Useful for understanding the whole and its parts simultaneously', 'Visually emphasises the volume of change'] },
    composed: { name: 'Composed Chart', desc: 'Provides different perspectives by combining multiple chart types (e.g., line, bar).', adv: ['Compare and analyse various data types in a single chart', 'Comprehensively grasp relationships between data', 'Effective for telling complex data stories'] },
    scatter: { name: 'Scatter Plot', desc: 'Useful for understanding the correlation between two variables.', adv: ['Visually identifies the correlation (positive, negative, none) between two variables', 'Easy to spot data clusters or outliers', 'Useful for understanding data distribution patterns'] },
    histogram: { name: 'Histogram', desc: 'Shows the distribution of data in bar form (similar to a bar chart).', adv: ['Identifies the overall shape of the data distribution (e.g., normal, skewed)', 'Checks how much data is concentrated in specific intervals', 'Visualises the central tendency and dispersion of data'] },
    bubble: { name: 'Bubble Chart', desc: 'Allows for three-dimensional comparison by representing data size as bubble size on a scatter plot.', adv: ['Simultaneously compares three variables (X, Y, and size)', 'Intuitively expresses the relative importance or scale of data', 'Visually engaging and easy to understand'] },
    candlestick: { name: 'Candlestick Chart', desc: 'Mainly used in stock data to represent open, high, low, and close prices.', adv: ['Provides an at-a-glance view of price volatility in financial data', 'Useful for analysing price trends and patterns (e.g., bullish/bearish)', 'Conveys open, high, low, and close information compactly'] },
    waterfall: { name: 'Waterfall Chart', desc: 'Shows the process of cumulative change step by step.', adv: ['Clearly tracks the changes from an initial value to a final value', 'Visualises whether each item contributes positively or negatively to the total', 'Effective for financial analysis or tracking inventory changes'] },
    bullet: { name: 'Bullet Graph', desc: 'Clearly and visually compares performance against a target.', adv: ['Intuitively grasps performance against a target', 'Effectively conveys a lot of information in a small space', 'Can display performance levels (e.g., good, average, poor) together'] },
    heatmap: { name: 'Heatmap', desc: 'Makes it easy to identify patterns by representing the magnitude of data values with colour.', adv: ['Quickly identifies patterns or areas of concentration in large datasets', 'Intuitively represents high and low values through colour intensity', 'Visually simplifies complex data matrices'] },
    stream: { name: 'Streamgraph', desc: 'Shows how multiple groups of data change over time as a flow.', adv: ['Organically represents the changes and flow of multiple data categories over time', 'Beautifully visualises the fluctuation of overall trends', 'Identifies the changing proportion of each category within the whole'] },
    box: { name: 'Box Plot', desc: 'A statistical chart that shows data distribution, median, and outliers at once.', adv: ['Displays five-number summary (min, Q1, median, Q3, max) at a glance', 'Easy to grasp data symmetry, dispersion, and presence of outliers', 'Convenient for comparing the distributions of multiple data groups'] },
    violin: { name: 'Violin Plot', desc: 'Shows both the box plot and the probability density of the data.', adv: ['Combines the advantages of a box plot with a density plot', 'More clearly shows where the data is concentrated', 'Useful for comparing subtle differences in data distributions'] },
    range: { name: 'Range Chart', desc: 'Shows the range of minimum and maximum values of data over time.', adv: ['Clearly represents the fluctuation range (min-max) of data over time', 'Suitable for visualising volatile data like temperature or stock prices', 'Easily identifies the stability or volatility of data'] },
    error: { name: 'Error Bars', desc: 'Displays the uncertainty or error range of a measurement.', adv: ['Visually represents the confidence or uncertainty range of data', 'Helps in judging statistical significance', 'Shows the precision of the measurements'] },
    pie: { name: 'Pie Chart', desc: 'Effective for showing the proportion of each part to the whole.', adv: ['Intuitively understands the proportion of each item to the whole', 'Easily compares the weight of constituent components', 'Visually simple and easy to understand'] },
    donut: { name: 'Donut Chart', desc: 'A pie chart with a blank centre, allowing for stacking multiple series or adding information.', adv: ['Has the advantages of a pie chart while utilising the central space', 'Enhances information delivery by displaying totals or key metrics in the centre', 'More flexible for representing hierarchical data'] },
    treemap: { name: 'Treemap', desc: 'Represents hierarchical data using the size and colour of rectangles.', adv: ['Identifies the proportion of hierarchical data at a glance', 'Efficiently displays a large amount of data in a limited space', 'Intuitively compares data sizes by area'] },
    sunburst: { name: 'Sunburst Chart', desc: 'Like a treemap, it shows hierarchical data, but in a circular form to emphasise depth.', adv: ['Clearly represents the depth of the hierarchy and relationships between elements', 'Intuitively understands the relationship between the whole and its parts', 'Visually appealing and suitable for interactive exploration'] },
    funnel: { name: 'Funnel Chart', desc: 'Visualises the process of data decreasing at each stage in a funnel shape.', adv: ['Easily identifies conversion and drop-off rates at each stage of a user journey', 'Useful for identifying bottlenecks in a process', 'Visually evaluates the efficiency of each stage'] },
    wordcloud: { name: 'Word Cloud', desc: 'Great for identifying key keywords by representing text data frequency as word size.', adv: ['Quickly grasps the key keywords and their importance in text data', 'Visually engaging and has a strong message delivery power', 'Useful for summarising and exploring unstructured text data'] },
    pictogram: { name: 'Pictogram', desc: 'Represents the amount of data using icons or pictures.', adv: ['Makes data easier and more fun to understand by using icons', 'Easily understood even by people not familiar with numbers', 'Reinforces the meaning of the data with relevant icons'] },
    waffle: { name: 'Waffle Chart', desc: 'Clearly shows the proportion to the whole using small squares.', adv: ['Accurately and intuitively represents proportions out of 100%', 'Allows for more precise comparison of proportions than a pie chart', 'Good for showing progress or goal achievement rates'] },
    marimekko: { name: 'Marimekko Chart', desc: 'Represents proportions to the whole as rectangles based on two variables.', adv: ['Analyses market share and other metrics complexly based on two variables', 'Simultaneously grasps the relationship between the total market and each segment', 'Visually summarises complex categorical data'] },
    nightingale: { name: 'Nightingale Rose Chart', desc: 'A circular bar chart, good for showing periodic data patterns.', adv: ['Effective for comparing periodic data (e.g., monthly)', 'Visually emphasises variations and patterns in data', 'Historically significant and visually unique'] },
    sankey: { name: 'Sankey Diagram', desc: 'Used to analyse system flows by representing the flow or quantity between multiple nodes.', adv: ['Clearly visualises flows of energy, cost, users, etc., within a system', 'Intuitive, as the width of the flow represents its quantity', 'Useful for tracking conversions between multiple stages of a process'] },
    chord: { name: 'Chord Diagram', desc: 'Visualises the inter-relationships and flows between multiple entities in a circular layout.', adv: ['Effectively represents inter-relationships among items in a complex dataset', 'Provides an at-a-glance view of the volume and direction of data flow', 'Identifies key connections within a network'] },
    network: { name: 'Network Diagram', desc: 'Represents complex relationship networks using nodes (entities) and edges (relationships).', adv: ['Visualises complex relationships and network structures between entities', 'Easily identifies central nodes or clusters', 'Used in various fields like social networks and communication systems'] },
    gantt: { name: 'Gantt Chart', desc: 'Displays the project schedule and task progress with bars along a timeline.', adv: ['Provides an at-a-glance view of the entire project schedule and task sequence', 'Clearly manages the start date, end date, and duration of each task', 'Easily tracks dependencies and progress between tasks'] },
    timeline: { name: 'Timeline', desc: 'Visually lists events that occurred in chronological order.', adv: ['Effectively communicates time-sensitive information like historical events or project milestones', 'Clearly understands the before-and-after relationships of events', 'Simplifies complex processes into chronological order'] },
    parallel: { name: 'Parallel Coordinates Plot', desc: 'Compares multidimensional data by displaying it on multiple parallel axes.', adv: ['Discovers patterns and relationships in data by comparing multiple variables simultaneously', 'Useful for clustering or outlier detection in multidimensional datasets', 'Visually explores interactions between variables'] },
    flowchart: { name: 'Flowchart', desc: 'Represents the flow of a process or task with shapes and arrows.', adv: ['Clearly represents complex processes or algorithms step-by-step', 'Easily understands and shares the logical flow of tasks', 'Visualises problem-solving and decision-making processes'] },
    mindmap: { name: 'Mind Map', desc: 'Represents ideas or concepts by connecting them radially from a central theme.', adv: ['Freely generates and systematically organises ideas', 'Visually grasps the relationship between core concepts and sub-concepts', 'Effective for creative thinking and brainstorming'] },
    choropleth: { name: 'Choropleth Map', desc: 'Represents data by filling each region on a map with different colours or shades according to its value.', adv: ['Identifies regional data distributions and patterns in a geographical context', 'Intuitively compares data density or ratios using colour scales', 'Widely used for visualising regional statistics like election results or population density'] },
    bubblemap: { name: 'Bubble Map', desc: 'Displays the magnitude of data values as bubble sizes on a map.', adv: ['Simultaneously represents geographical location and data quantity', 'Intuitively compares the relative size of data by region', 'Complements the shortcomings of choropleth maps (area size distortion)'] },
    connectionmap: { name: 'Connection Map', desc: 'Shows the connection relationships or travel paths between two points on a map with lines.', adv: ['Visualises connections, paths, and interactions between geographical locations', 'Represents flight routes, migration paths, data transmission routes, etc.', 'Identifies hub-and-spoke structures in a network'] },
    flowmap: { name: 'Flow Map', desc: 'Similar to a connection map, but also represents the volume or scale of movement with the thickness or colour of the lines.', adv: ['Represents not only the connection but also the volume or scale of the flow', 'Effective for visualising flow data such as trade volume or population migration', 'Intuitively understands the direction and magnitude of flows'] },
    calendarmap: { name: 'Calendar Heatmap', desc: 'Represents the magnitude of daily data values with colours on a calendar.', adv: ['Easily identifies data patterns by day of the week, week, or month', 'Compactly visualises long-term activity data (e.g., Github commits)', 'Discovers periodic patterns or anomalies on specific dates'] },
    radar: { name: 'Radar Chart', desc: 'Useful for comparing and evaluating the balance of multiple items at a glance.', adv: ['Provides an at-a-glance view of the balance and overall tendency of various evaluation items', 'Useful for comparing the strengths and weaknesses of multiple subjects', 'Compares the overall shape of the data against an ideal value'] },
    radialbar: { name: 'Radial Bar Chart', desc: 'A bar graph arranged in a circle, good for representing data with periodicity.', adv: ['Creates visual interest by arranging data in a circle', 'Suitable for representing data with periodicity', 'Good for showing progress towards a goal'] },
    pareto: { name: 'Pareto Chart', desc: 'A combination of a bar chart and a line chart, used to find the main causes of a problem (80/20 rule).', adv: ['Clearly distinguishes between the vital few causes and the trivial many', 'Helps decide where to focus limited resources', 'Useful in quality control and business analysis for prioritising problem-solving'] },
    dumbbell: { name: 'Dumbbell Plot', desc: 'Effective for comparing the change or difference in data between two points in time or two groups.', adv: ['Clearly compares the difference between two groups or two time points', 'Intuitively represents the direction and magnitude of change', 'Useful for visualising changes in ranking or gaps'] },
    lollipop: { name: 'Lollipop Chart', desc: 'Can represent data in a less cluttered way than a bar chart.', adv: ['Gives a cleaner and more sophisticated impression than a bar chart', 'Focuses on the data points, conveying values more clearly', 'Reduces visual clutter when comparing many items'] },
    gauge: { name: 'Gauge Chart', desc: 'Intuitively shows the current level or state of a value in a dashboard-like form.', adv: ['Instantly and intuitively conveys Key Performance Indicators (KPIs)', 'Clearly visualises the current status against a target', 'Effective for highlighting key information on a dashboard'] },
  }
};
const chartsList = {
  quantitative: { icon: BarChart3, nameKey: "quantitative", charts: ['line', 'bar', 'area', 'composed', 'scatter', 'histogram', 'bubble', 'candlestick', 'waterfall', 'bullet', 'heatmap', 'stream', 'box', 'violin', 'range', 'error'] },
  qualitative: { icon: PieChartIcon, nameKey: "qualitative", charts: ['pie', 'donut', 'treemap', 'sunburst', 'funnel', 'wordcloud', 'pictogram', 'waffle', 'marimekko', 'nightingale'] },
  relationship: { icon: GitMerge, nameKey: "relationship", charts: ['sankey', 'chord', 'network', 'gantt', 'timeline', 'parallel', 'flowchart', 'mindmap'] },
  spatial: { icon: Map, nameKey: "spatial", charts: ['choropleth', 'bubblemap', 'connectionmap', 'flowmap', 'calendarmap'] },
  others: { icon: Shapes, nameKey: "others", charts: ['radar', 'radialbar', 'pareto', 'dumbbell', 'lollipop', 'gauge'] }
};

// --- Sample data ---
const sampleData = [ { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 }, { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 }, { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 }, { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 }, { name: 'May', uv: 1890, pv: 4800, amt: 2181 }, { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 }, { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 } ];
const sampleDataWithError = sampleData.map(d => ({...d, uvError: Math.random() * 400, pvError: Math.random() * 300 }));
const scatterData = [ { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 }, { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 }, { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 } ];
const pieData = [ { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 }, { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 } ];
const radarData = [ { subject: 'Math', A: 120, B: 110, fullMark: 150 }, { subject: 'Chinese', A: 98, B: 130, fullMark: 150 }, { subject: 'English', A: 86, B: 130, fullMark: 150 }, { subject: 'Science', A: 99, B: 100, fullMark: 150 }, { subject: 'History', A: 85, B: 90, fullMark: 150 }, { subject: 'PE', A: 65, B: 85, fullMark: 150 } ];
const treemapData = [ { name: 'Electronics', size: 4000, children: [ { name: 'TV', size: 2000 }, { name: 'Fridge', size: 1200 }, { name: 'Washer', size: 800 } ] }, { name: 'Furniture', size: 3000, children: [ { name: 'Sofa', size: 1500 }, { name: 'Bed', size: 1000 }, { name: 'Desk', size: 500 } ] }, { name: 'Food', size: 5000, children: [ { name: 'Fruit', size: 2500 }, { name: 'Vegetable', size: 1500 }, { name: 'Meat', size: 1000 } ] } ];
const funnelData = [ { value: 100, name: 'Visit', fill: '#8884d8' }, { value: 80, name: 'Inquiry', fill: '#83a6ed' }, { value: 50, name: 'Contact', fill: '#8dd1e1' }, { value: 40, name: 'Demo', fill: '#82ca9d' }, { value: 26, name: 'Contract', fill: '#a4de6c' } ];
const paretoData = [ { name: 'Defect A', value: 80, cumulative: 44.4 }, { name: 'Defect B', value: 45, cumulative: 69.4 }, { name: 'Defect C', value: 25, cumulative: 83.3 }, { name: 'Defect D', value: 15, cumulative: 91.7 }, { name: 'Defect E', value: 10, cumulative: 97.2 }, { name: 'Defect F', value: 5, cumulative: 100 } ];
const ganttData = [ { task: 'Planning', start: 0, end: 5, colour: '#8884d8' }, { task: 'Design', start: 3, end: 8, colour: '#82ca9d' }, { task: 'Develop', start: 6, end: 12, colour: '#ffc658' }, { task: 'Test', start: 10, end: 15, colour: '#FF8042' }, { task: 'Deploy', start: 14, end: 16, colour: '#00C49F' } ];
ganttData.forEach(d => d.duration = d.end - d.start);
const candlestickData = [ { time: '1', data: [20, 30, 10, 25] }, { time: '2', data: [25, 40, 22, 38] }, { time: '3', data: [38, 42, 35, 40] }, { time: '4', data: [40, 45, 30, 33] }, { time: '5', data: [33, 38, 28, 35] }];
const bulletData = [ { name: 'Revenue', value: 270, target: 250, ranges: [150, 225, 300] }];
const heatmapData = Array.from({ length: 5 }, (_, i) => Array.from({ length: 10 }, (_, j) => ({ x: `Topic ${j+1}`, y: `Day ${i+1}`, value: Math.floor(Math.random() * 100) }))).flat();
const boxPlotData = [ { name: 'Group A', min: 10, q1: 20, median: 25, q3: 40, max: 50, outliers: [5, 55] } ];
const sunburstData = [{ name: 'A', value: 100, children: [{ name: 'A1', value: 40 }, { name: 'A2', value: 60 }] }, { name: 'B', value: 80, children: [{ name: 'B1', value: 30 }, { name: 'B2', value: 50, children: [{name: 'B2a', value: 20}, {name: 'B2b', value: 30}] }] }];
const dumbbellData = [ { name: 'Category A', v1: 25, v2: 50 }, { name: 'Category B', v1: 60, v2: 30 }, { name: 'Category C', v1: 40, v2: 70 }];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4567'];

const getChartData = (chartId) => {
    switch(chartId) {
        case 'line': case 'bar': case 'area': case 'composed': case 'histogram': case 'stream': case 'range': case 'nightingale': return sampleData;
        case 'error': return sampleDataWithError;
        case 'scatter': case 'bubble': return scatterData;
        case 'pie': case 'donut': return pieData;
        case 'radar': case 'radialbar': case 'parallel': return radarData;
        case 'treemap': return treemapData;
        case 'funnel': return funnelData;
        case 'pareto': return paretoData;
        case 'gantt': return ganttData;
        case 'candlestick': return candlestickData;
        case 'bullet': return bulletData;
        case 'heatmap': return heatmapData;
        case 'box': case 'violin': return boxPlotData;
        case 'sunburst': return sunburstData;
        case 'dumbbell': return dumbbellData;
        case 'lollipop': return sampleData.slice(0, 5);
        default: return [];
    }
}

// --- Mockup/placeholder chart components ---
const SvgPlaceholder = ({ children }) => <div className="flex items-center justify-center w-full h-full"><svg viewBox="0 0 400 300" width="100%" height="100%">{children}</svg></div>;

const WordCloudMockup = () => <div className="flex items-center justify-center w-full h-full text-gray-700 dark:text-gray-300 select-none"><div className="text-center leading-none"><span style={{fontSize: '4.5rem', opacity: 1, fontWeight: 700}}>Data</span> <span style={{fontSize: '2rem', opacity: 0.7, marginLeft: '1rem'}}>Visualisation</span> <span style={{fontSize: '3rem', opacity: 0.9, marginRight: '1rem'}}>Chart</span> <span style={{fontSize: '1.5rem', opacity: 0.6}}>Insight</span> <span style={{fontSize: '2.8rem', opacity: 0.85}}>Analytics</span> <span style={{fontSize: '1.8rem', opacity: 0.65}}>Trends</span></div></div>;
const PictogramMockup = () => <div className="grid grid-cols-10 gap-2 p-4">{[...Array(35)].map((_, i) => <svg key={i} viewBox="0 0 24 24" className="w-8 h-8 fill-current text-blue-500"><path d="M12 2.1a1 1 0 011 1V5.05a7 7 0 11-2 0V3.1a1 1 0 011-1zM12 17a5 5 0 100-10 5 5 0 000 10z"/></svg>)}</div>;
const WaffleMockup = () => <div className="grid grid-cols-10 gap-1 w-64 h-64">{[...Array(100)].map((_, i) => <div key={i} className={`w-6 h-6 rounded-sm ${i < 45 ? 'bg-blue-500' : (i < 75 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600')}`}></div>)}</div>;
const MarimekkoMockup = () => <div className="flex w-full h-64"><div className="flex flex-col h-full bg-blue-200" style={{width: '60%'}}><div className="bg-blue-500" style={{height:'70%'}}></div><div className="bg-blue-300" style={{height:'30%'}}></div></div><div className="flex flex-col h-full bg-green-200" style={{width: '40%'}}><div className="bg-green-500" style={{height:'40%'}}></div><div className="bg-green-300" style={{height:'60%'}}></div></div></div>;
const SankeyMockup = () => <SvgPlaceholder><rect x="20" y="50" width="30" height="80" rx="4" fill="#8884d8"/><rect x="350" y="20" width="30" height="100" rx="4" fill="#82ca9d"/><rect x="350" y="180" width="30" height="60" rx="4" fill="#ffc658"/><path d="M 50 90 C 200 90, 150 60, 350 60" stroke="#8884d8" strokeOpacity="0.5" strokeWidth="40" fill="none" /><path d="M 50 90 C 200 90, 150 210, 350 210" stroke="#8884d8" strokeOpacity="0.5" strokeWidth="40" fill="none" /></SvgPlaceholder>;
const ChordMockup = () => <SvgPlaceholder><g transform="translate(200,150)"><circle r="120" fill="none" stroke="#ccc" /><path d="M -119.4 10.47 A 120 120 0 0 1 118.2 18.7" stroke="#8884d8" strokeWidth="20" fill="none" strokeOpacity="0.7"/><path d="M 5.02 -119.9 A 120 120 0 0 1 103.9 -60" stroke="#82ca9d" strokeWidth="20" fill="none" strokeOpacity="0.7"/><path d="M 103.9 -60 C 50 -30, 50 80, -95.1 75.6" stroke="#ffc658" strokeWidth="15" fill="none" strokeOpacity="0.7"/></g></SvgPlaceholder>;
const NetworkMockup = () => <SvgPlaceholder><line x1="80" y1="150" x2="200" y2="80" stroke="#ccc"/><line x1="80" y1="150" x2="200" y2="220" stroke="#ccc"/><line x1="200" y1="80" x2="320" y2="150" stroke="#ccc"/><line x1="200" y1="220" x2="320" y2="150" stroke="#ccc"/><circle cx="80" cy="150" r="20" fill="#8884d8"/><circle cx="200" cy="80" r="15" fill="#82ca9d"/><circle cx="200" cy="220" r="15" fill="#82ca9d"/><circle cx="320" cy="150" r="25" fill="#ffc658"/></SvgPlaceholder>;
const TimelineMockup = () => <SvgPlaceholder><line x1="20" y1="150" x2="380" y2="150" stroke="#666" strokeWidth="2" /><circle cx="50" cy="150" r="5" fill="#8884d8"/><text x="50" y="135" textAnchor="middle" fill="#666" className="text-xs">Event 1</text><circle cx="150" cy="150" r="5" fill="#82ca9d"/><text x="150" y="175" textAnchor="middle" fill="#666" className="text-xs">Event 2</text><circle cx="280" cy="150" r="5" fill="#ffc658"/><text x="280" y="135" textAnchor="middle" fill="#666" className="text-xs">Event 3</text></SvgPlaceholder>;
const ChoroplethMapMockup = () => <SvgPlaceholder><path d="M10 150 L80 20 L180 50 L200 140 L150 250 Z" fill="#b3e5fc" stroke="#4dd0e1" /><path d="M180 50 L280 30 L390 120 L350 200 L200 140 Z" fill="#4dd0e1" stroke="#4dd0e1" /><path d="M150 250 L200 140 L350 200 L300 280 Z" fill="#00acc1" stroke="#4dd0e1" /></SvgPlaceholder>;

// --- Chart renderer component ---
const ChartRenderer = ({ type, lang }) => {
    const chartComponent = useMemo(() => {

        switch (type) {
            case 'line': return <LineChart data={sampleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="pv" stroke="#8884d8" /><Line type="monotone" dataKey="uv" stroke="#82ca9d" /></LineChart>;
            case 'bar': return <BarChart data={sampleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="pv" fill="#8884d8" /><Bar dataKey="uv" fill="#82ca9d" /></BarChart>;
            case 'area': return <AreaChart data={sampleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" /><Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" /></AreaChart>;
            case 'pie': return <PieChart><Tooltip /><Legend /><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>;
            case 'donut': return <PieChart><Tooltip /><Legend /><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>;
            case 'scatter': return <ScatterChart><CartesianGrid /><XAxis type="number" dataKey="x" name="x" /><YAxis type="number" dataKey="y" name="y" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Legend /><Scatter name="A school" data={scatterData} fill="#8884d8" /></ScatterChart>;
            case 'radar': return <RadarChart cx="50%" cy="50%" outerRadius={120} data={radarData}><PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis /><Tooltip /><Legend /><Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} /><Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} /></RadarChart>;
            case 'treemap': return <Treemap width={400} height={200} data={treemapData} dataKey="size" ratio={4 / 3} stroke="#fff" fill="#8884d8" isAnimationActive={false}><Tooltip/></Treemap>;
            case 'composed': return <ComposedChart data={sampleData}><CartesianGrid stroke="#f5f5f5" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="uv" barSize={20} fill="#413ea0" /><Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" /><Line type="monotone" dataKey="pv" stroke="#ff7300" /></ComposedChart>;
            case 'radialbar': return <RadialBarChart innerRadius="10%" outerRadius="80%" data={radarData.slice(0, 4)} startAngle={180} endAngle={0}><RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='A' /><Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" /></RadialBarChart>;
            case 'funnel': return <FunnelChart width={730} height={250}><Tooltip /><Funnel dataKey="value" data={funnelData} isAnimationActive>{funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Funnel></FunnelChart>;
            case 'histogram': return <BarChart data={sampleData} barGap={0}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="uv" fill="#82ca9d" /></BarChart>;
            case 'bubble': return <ScatterChart><CartesianGrid /><XAxis type="number" dataKey="x" name="x" /><YAxis type="number" dataKey="y" name="y" /><ZAxis type="number" dataKey="z" range={[100, 1000]} name="size" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Legend /><Scatter name="A school" data={scatterData} fill="#8884d8" /></ScatterChart>;
            case 'stream': return <AreaChart data={sampleData} stackOffset="silhouette"><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" /><Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" /></AreaChart>;
            case 'range': {
                const rangeData = sampleData.map(d => ({ name: d.name, range: [d.pv, d.uv] }));
                return <ComposedChart data={rangeData}><CartesianGrid /><XAxis dataKey="name" /><YAxis domain={[0, 10000]} /><Tooltip /><Area dataKey="range" fill="#8884d8" stroke="#8884d8" /></ComposedChart>;
            }
            case 'pareto': return <ComposedChart data={paretoData}><CartesianGrid stroke="#f5f5f5" /><XAxis dataKey="name" /><YAxis /><YAxis yAxisId="right" orientation="right" unit="%" /><Tooltip /><Legend /><Bar dataKey="value" barSize={20} fill="#413ea0" /><Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#ff7300" /></ComposedChart>;
            case 'gantt': return <BarChart layout="vertical" data={ganttData} margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="task" width={80} /><Tooltip /><Bar dataKey="duration" stackId="a">{ganttData.map((entry) => <Cell key={entry.task} fill={entry.colour} />)}</Bar><Bar dataKey="start" stackId="a" fill="transparent" /></BarChart>;
            case 'gauge': return <RadialBarChart cx="50%" cy="70%" innerRadius="60%" outerRadius="100%" data={[{ name: 'KPI', value: 75, fill: '#8884d8' }]} startAngle={180} endAngle={0}><PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /><RadialBar background dataKey='value' angleAxisId={0} /><text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="font-bold text-4xl dark:fill-white">{`75%`}</text></RadialBarChart>;
            case 'nightingale': return <RadialBarChart innerRadius={0} data={sampleData.slice(0, 5)} cx="50%" cy="50%"><PolarAngleAxis type="category" dataKey="name" /><Tooltip /><RadialBar dataKey="uv">{sampleData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</RadialBar></RadialBarChart>;
           
            case 'candlestick': return <ComposedChart data={candlestickData}><CartesianGrid /><XAxis dataKey="time" /><YAxis domain={['dataMin - 5', 'dataMax + 5']} /><Tooltip /><Bar dataKey="data" barSize={1} >{candlestickData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.data[3] > entry.data[0] ? 'transparent' : 'transparent'} />))}<ErrorBar dataKey="data" width={4} strokeWidth={2} stroke="black" direction="y" /></Bar><Bar dataKey="data" barSize={10} >{candlestickData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.data[3] > entry.data[0] ? 'green' : 'red'} />))}</Bar></ComposedChart>;
            case 'bullet': return <BarChart layout="vertical" data={bulletData} margin={{left: 25}}><CartesianGrid /><XAxis type="number" domain={[0, 300]} /><YAxis type="category" dataKey="name" hide /><Bar dataKey="ranges[2]" stackId="a" fill="#f0f0f0" barSize={20} /><Bar dataKey="ranges[1]" stackId="a" fill="#e0e0e0" barSize={20}/><Bar dataKey="ranges[0]" stackId="a" fill="#d0d0d0" barSize={20}/><Bar dataKey="value" stackId="b" fill="#333" barSize={8} /><Line dataKey="target" stroke="red" strokeWidth={3} isAnimationActive={false} dot={false} /></BarChart>;
            case 'heatmap': return <ScatterChart><XAxis dataKey="x" type="category" /><YAxis dataKey="y" type="category" /><ZAxis dataKey="value" range={[0, 100]} /><Tooltip /><Scatter data={heatmapData} shape="square" fill="#8884d8" /></ScatterChart>;
            case 'box': return <ComposedChart data={boxPlotData} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" /><CartesianGrid /><Bar dataKey="q1" stackId="a" fill="transparent" /><Bar dataKey={d => d.q3 - d.q1} stackId="a" fill="#8884d8"><LabelList dataKey="median" position="inside" /></Bar><Scatter dataKey="min" fill="black" shape="line" /><Scatter dataKey="max" fill="black" shape="line" /></ComposedChart>;
            case 'violin': return <p className="text-center text-gray-500">Violin Plot is too complex for a live Recharts demo.</p>;
            case 'error': return <BarChart data={sampleDataWithError}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="uv" fill="#82ca9d"><ErrorBar dataKey="uvError" stroke="red" /></Bar></BarChart>;
            case 'sunburst': return <PieChart><Pie data={sunburstData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" /><Pie data={sunburstData.map(e => e.children).flat()} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label /></PieChart>;
            case 'dumbbell': return <ComposedChart layout="vertical" data={dumbbellData} margin={{left: 30}}><CartesianGrid /><YAxis type="category" dataKey="name" /><XAxis type="number" /><Tooltip /><Line dataKey="v1" stroke="transparent" activeDot={false} /><Line dataKey="v2" stroke="transparent" activeDot={false} /><Scatter dataKey="v1" fill="#8884d8" /><Scatter dataKey="v2" fill="#82ca9d" /></ComposedChart>;
            case 'lollipop': return <BarChart data={getChartData('lollipop')} margin={{left: 20}}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="uv" shape={<circle cx={0} cy={0} r={5} fill="#8884d8" />} /></BarChart>;
           
            case 'wordcloud': return <WordCloudMockup />;
            case 'pictogram': return <PictogramMockup />;
            case 'waffle': return <WaffleMockup />;
            case 'marimekko': return <MarimekkoMockup />;
            case 'sankey': return <SankeyMockup />;
            case 'chord': return <ChordMockup />;
            case 'network': return <NetworkMockup />;
            case 'timeline': return <TimelineMockup />;
            case 'parallel': return <LineChart data={radarData}><CartesianGrid /><XAxis dataKey="subject" type="category" allowDuplicatedCategory={false} /><YAxis type="number" /><Tooltip /><Legend /><Line dataKey="A" stroke="#8884d8" /><Line dataKey="B" stroke="#82ca9d" /></LineChart>;
            case 'flowchart': return <SankeyMockup />;
            case 'mindmap': return <NetworkMockup />;
            case 'choropleth': return <ChoroplethMapMockup />;
            case 'bubblemap': return <ChoroplethMapMockup />;
            case 'connectionmap': return <ChoroplethMapMockup />;
            case 'flowmap': return <ChoroplethMapMockup />;
            case 'calendarmap': return <HeatmapMockup/>;
            default: return <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg"><span className="text-gray-500">{i18nData[lang].chartPreviewNotAvailable}</span></div>;
        }
    }, [type, lang]);

    return <ResponsiveContainer width="100%" height={400}>{chartComponent}</ResponsiveContainer>;
};

const Header = ({ page, setPage, language, setLanguage }) => {
    return (
        <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <LayoutDashboard className="h-7 w-7 text-indigo-500" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:inline">Chart Portfolio</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                         <nav className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium">
                            <button onClick={() => setPage('home')} className={`px-3 py-2 rounded-md transition-colors ${page === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                                {i18nData[language].home}
                            </button>
                             <button onClick={() => setPage('charts')} className={`px-3 py-2 rounded-md transition-colors ${page === 'charts' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                                {i18nData[language].chartsTitle}
                            </button>
                        </nav>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                            <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}>EN</button>
                            <button onClick={() => setLanguage('ko')} className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${language === 'ko' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}>KO</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Sidebar = ({ onSelectChart, activeChart, lang }) => {
  const [openCategories, setOpenCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (categoryKey) => setOpenCategories(prev => ({ ...prev, [categoryKey]: !prev[categoryKey] }));
 
  const filteredChartsList = useMemo(() => {
    if (!searchTerm) {
      return chartsList;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};

    for (const categoryKey in chartsList) {
      const category = chartsList[categoryKey];
      const matchingCharts = category.charts.filter(chartId => {
        const chartInfo = i18nData[lang][chartId];
        if (!chartInfo) return false;
       
        const name = chartInfo.name || '';
        const desc = chartInfo.desc || '';
        const categoryName = i18nData[lang][category.nameKey] || '';
       
        return name.toLowerCase().includes(lowercasedFilter) ||
               desc.toLowerCase().includes(lowercasedFilter) ||
               categoryName.toLowerCase().includes(lowercasedFilter) ||
               chartId.toLowerCase().includes(lowercasedFilter);
      });

      if (matchingCharts.length > 0) {
        filtered[categoryKey] = { ...category, charts: matchingCharts };
      }
    }
    return filtered;
  }, [searchTerm, lang]);
 
  useEffect(() => {
    if (searchTerm) {
        const allCategoryKeys = Object.keys(filteredChartsList);
        const newOpenState = {};
        allCategoryKeys.forEach(key => { newOpenState[key] = true; });
        setOpenCategories(newOpenState);
    } else {
        setOpenCategories({});
    }
  }, [searchTerm, filteredChartsList]);


  return (
    <aside className="w-80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg flex flex-col p-4 border-r border-gray-200 dark:border-gray-800">
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder={i18nData[lang].searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
        </div>
      <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
        <ul>
          {Object.entries(filteredChartsList).map(([key, category]) => (
            <li key={key} className="mb-2">
              <button onClick={() => toggleCategory(key)} className="w-full flex items-center justify-between py-2 text-md font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <div className="flex items-center gap-3"><category.icon className="w-5 h-5 ml-2" /><span>{i18nData[lang][category.nameKey]}</span></div>
                <ChevronRight className={`w-5 h-5 mr-2 transition-transform ${openCategories[key] ? 'rotate-90' : ''}`} />
              </button>
              {openCategories[key] && (
                <ul className="mt-1 pl-6 border-l-2 border-indigo-200 dark:border-indigo-800 ml-2">
                  {category.charts.map(chartId => (
                    <li key={chartId}>
                      <a href="#" onClick={(e) => { e.preventDefault(); onSelectChart(chartId); }} className={`block py-1.5 px-3 rounded-md text-sm transition-colors ${activeChart === chartId ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        {i18nData[lang][chartId] ? i18nData[lang][chartId].name : chartId}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const HomePage = ({ setPage, language }) => (
    <main className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-2xl">
            <LayoutDashboard className="mx-auto h-16 w-16 text-indigo-500" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {i18nData[language].homeTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                {i18nData[language].homeDesc}
            </p>
            <div className="mt-10">
                <button
                    onClick={() => setPage('charts')}
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {i18nData[language].homeButton}
                </button>
            </div>
        </div>
    </main>
);

const ChartsPage = ({ language }) => {
  const [selectedChartId, setSelectedChartId] = useState('line');
  const [analysis, setAnalysis] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
 
  const selectedChart = i18nData[language][selectedChartId];

  useEffect(() => {
      setAnalysis('');
  }, [selectedChartId]);

  const handleGenerateAnalysis = async () => {
      setIsGenerating(true);
      setAnalysis('');
      const chartData = getChartData(selectedChartId);
      const prompt = `As an expert data analyst, analyse the following data for a "${selectedChart.name}". Explain what the chart shows, identify key trends, patterns, or outliers. Provide a concise, insightful summary in ${language === 'ko' ? 'Korean' : 'English'} within 2-3 sentences. Data: ${JSON.stringify(chartData)}`;

      try {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        setAnalysis(generatedText || 'Failed to generate analysis. Please try again.');
      } catch (error) {
          console.error("Error generating analysis:", error);
          setAnalysis('An error occurred while generating the analysis.');
      } finally {
          setIsGenerating(false);
      }
  };
 
  if (!selectedChart) {
      return (
           <main className="flex-1 p-8 overflow-y-auto">
              <div className="text-red-500">Error: Chart data for '{selectedChartId}' not found.</div>
           </main>
      );
  }

  return (
      <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar onSelectChart={setSelectedChartId} activeChart={selectedChartId} lang={language} />
          <main className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-5xl mx-auto">
                  <header className="mb-8">
                      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{selectedChart.name}</h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400">{selectedChart.desc}</p>
                  </header>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mb-8">
                      <ChartRenderer type={selectedChartId} lang={language} />
                  </div>
                  <div className="mb-8">
                      <button onClick={handleGenerateAnalysis} disabled={isGenerating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                          {i18nData[language].generateAnalysis}
                      </button>
                  </div>
                  {(isGenerating || analysis) && (
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{i18nData[language].analysisTitle}</h3>
                          {isGenerating ? (
                              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                  <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>{i18nData[language].loadingAnalysis}</span>
                              </div>
                          ) : (
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysis}</p>
                          )}
                      </div>
                  )}
                  <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8">{i18nData[language].advantagesTitle}</h3>
                      <ul className="space-y-3">
                          {selectedChart.adv.map((advantage, index) => (
                              <li key={index} className="flex items-start gap-3">
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{advantage}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </main>
      </div>
  );
}

const FullPageLoader = ({ language }) => (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">{language === 'ko' ? '애플리케이션 초기화 중...' : 'Initialising Application...'}</span>
        </div>
    </div>
);

function App() {
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState('en');
 
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Header page={page} setPage={setPage} language={language} setLanguage={setLanguage} />
      {page === 'home' && <HomePage setPage={setPage} language={language} />}
      {page === 'charts' && <ChartsPage language={language} />}
    </div>
  );
}

export default App;
