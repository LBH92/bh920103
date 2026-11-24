import "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { P as Shield, Wt as CircleCheck, bn as require_react, ft as Mail, gn as ArrowLeft, h as TriangleAlert, jt as FileText, rn as Building } from "./vendor-lucide-Dji_Ij8j.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var StaticPageView = ({ page, onNavigateHome, onNavigatePage }) => {
	const renderNavButtons = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2 pt-6 border-t border-slate-700/60 mt-8 text-xs font-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onNavigatePage("about"),
				className: `px-3 py-1.5 rounded-lg transition-colors ${page === "about" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
				children: "회사소개"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onNavigatePage("privacy"),
				className: `px-3 py-1.5 rounded-lg transition-colors ${page === "privacy" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
				children: "개인정보처리방침"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onNavigatePage("terms"),
				className: `px-3 py-1.5 rounded-lg transition-colors ${page === "terms" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
				children: "이용약관"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onNavigatePage("disclaimer"),
				className: `px-3 py-1.5 rounded-lg transition-colors ${page === "disclaimer" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
				children: "투자유의사항 및 면책고지"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onNavigatePage("contact"),
				className: `px-3 py-1.5 rounded-lg transition-colors ${page === "contact" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
				children: "고객지원 및 문의"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onNavigateHome,
					className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), "증시 메인으로 돌아가기"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-slate-400 font-mono",
					children: "Byeongdol Investment Policy"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-sm",
				children: [
					page === "about" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-slate-700/80 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-rose-500/10 text-rose-400 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-extrabold text-white",
								children: "회사 및 서비스 소개"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400 mt-1",
								children: "병돌 인베스트먼트(Byeongdol Investment)의 서비스 철학과 비전"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-slate-300 leading-relaxed text-sm md:text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "병돌 인베스트먼트(Byeongdol Investment)" }), "는 개인 투자자들의 정보 비대칭을 해소하고, 투명하고 신뢰할 수 있는 데이터 기반의 투자 분석 환경을 제공하기 위해 설립된 실시간 금융 기술 플랫폼입니다."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-rose-400" }), " 핵심 서비스 영역"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc list-inside space-y-2 pl-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "실시간 금융 데이터 파이프라인:" }), " 키움증권 오픈 API, KRX, 야후 파이낸스 글로벌 시세를 정밀하게 연동하여 1초 미만 단위의 실시간 시세 및 틱 호가창을 제공합니다."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "고도화된 차트 및 보조지표:" }), " 이동평균선(MA), 볼린저밴드, RSI, MACD 등 정밀 기술적 지표를 무지연 SVG/Canvas 기반으로 제공하여 전문 트레이더 수준의 차트 환경을 보장합니다."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "클린 투자 커뮤니티:" }), " 허위 과장 광고 및 불법 리딩방을 차단하고 건전한 투자 토론과 실시간 채팅을 나눌 수 있는 지능형 모니터링 생태계를 운영합니다."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "인사이트 & 시장 분석 리포트:" }), " 객관적인 거시경제 지표와 실시간 수급 동향을 정리한 정기 리포트를 통해 합리적인 의사결정을 돕습니다."] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-rose-400" }), " 운영 원칙"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "우리는 투자자들에게 특정 종목의 매수·매도를 강요하거나 확정 수익을 보장하는 불건전 마케팅을 철저히 배격합니다. 모든 데이터는 공식 증권 거래소 및 검증된 금융 데이터 프로바이더를 통해 수집되며, 투명한 출처 표기와 철저한 개인정보 보호를 최우선으로 합니다." })
							]
						})]
					}),
					page === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-slate-700/80 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-blue-500/10 text-blue-400 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-extrabold text-white",
								children: "개인정보처리방침"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400 mt-1",
								children: "시행일자: 2026년 1월 1일 (최종 개정: 2026년 11월 12일)"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-slate-300 leading-relaxed text-sm md:text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "병돌 인베스트먼트(이하 \"회사\")는 『개인정보 보호법』 및 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "1. 수집하는 개인정보 항목"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc list-inside space-y-1 pl-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "필수 수집 항목:" }), " 이메일 주소, 닉네임, 프로필 식별자 (Google 계정 연동 시 제공되는 기본 식별 정보)"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "자동 수집 항목:" }), " 접속 IP 주소, 쿠키(Cookie), 접속 일시, 서비스 이용 기록, 불량 이용 기록, 브라우저 및 기기 정보"] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "2. 개인정보의 수집 및 이용 목적"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc list-inside space-y-1 pl-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "회원제 서비스 이용에 따른 본인 식별 및 인증" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "모의투자 포트폴리오 관리, 관심종목 동기화, 알림 설정 제공" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "부정 이용 방지, 비인가 사용 방지 및 커뮤니티 악성 게시물 필터링" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Google AdSense 등 서비스 내 광고 게재 및 트래픽 통계 분석" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "3. 개인정보의 보유 및 이용 기간"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "회사는 이용자의 회원 탈퇴 시까지 개인정보를 보유하며, 탈퇴 요청 시 지체 없이 파기합니다. 단, 관계 법령에 따라 보존 의무가 있는 경우 해당 법정 기간 동안 안전하게 분리 보관합니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "4. 쿠키(Cookie) 및 제3자 광고 기술 안내"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "회사는 맞춤형 서비스 제공 및 트래픽 분석을 위해 쿠키를 사용합니다. 또한 Google을 포함한 제3자 벤더는 사용자가 본 사이트 또는 다른 웹사이트를 방문한 기록을 바탕으로 광고를 게재할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "5. 개인정보 보호책임자"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "책임자:" }), " 임병현 (대표 운영자)"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "담당 부서:" }), " 정보보호 및 서비스 운영팀"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "문의 이메일:" }), " byunghyunlim92@gmail.com"] })
									]
								})
							]
						})]
					}),
					page === "terms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-slate-700/80 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-emerald-500/10 text-emerald-400 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-extrabold text-white",
								children: "서비스 이용약관"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400 mt-1",
								children: "시행일자: 2026년 1월 1일"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-slate-300 leading-relaxed text-sm md:text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-4",
									children: "제1조 (목적)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "본 약관은 병돌 인베스트먼트(이하 \"회사\")가 제공하는 금융 정보 플랫폼, 커뮤니티 및 부가 서비스(이하 \"서비스\")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "제2조 (용어의 정의)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc list-inside space-y-1 pl-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\"이용자\"란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\"모의투자\"란 가상의 자산을 기반으로 주식 매매를 시뮬레이션하는 비영리 교육용 서비스를 말합니다." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\"게시물\"이란 회원이 서비스 내에 게시한 문자, 부호, 이미지 등의 모든 정보를 말합니다." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "제3조 (이용자의 의무 및 금지 행위)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "이용자는 다음 각 호의 행위를 하여서는 안 됩니다:" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc list-inside space-y-1 pl-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "타인의 명의나 계정 정보를 도용하는 행위" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "허위 매매 신호 유포, 주가 조작성 선동, 미등록 유사투자자문 및 유료 리딩방 홍보 행위" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "욕설, 비방, 음란물, 명예훼손 등 공공질서 및 미풍양속에 반하는 게시물 작성" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "회사의 서버나 네트워크에 부하를 유발하는 비인가 스크래핑 또는 해킹 시도" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "제4조 (서비스의 변경 및 중단)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "회사는 정기 점검, 통신 장애, 증권사 데이터 제공사의 시스템 점검 등 불가피한 사유가 발생할 경우 서비스의 전부 또는 일부를 일시적으로 중단할 수 있습니다." })
							]
						})]
					}),
					page === "disclaimer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-slate-700/80 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-amber-500/10 text-amber-400 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-extrabold text-white",
								children: "투자 유의사항 및 법적 면책 고지"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400 mt-1",
								children: "Disclaimer on Financial Data & Investments"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-slate-300 leading-relaxed text-sm md:text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "핵심 고지:" }), " 병돌 인베스트먼트에서 제공하는 모든 주식 시세, 지수, 분석 리포트, 커뮤니티 의견은 단순 정보 제공 및 학술·시뮬레이션 목적이며, 특정 종목의 매수·매도를 추천하거나 투자 수익을 보장하지 않습니다."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "1. 금융투자 자문 부존재"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "본 서비스는 자본시장과 금융투자업에 관한 법률상 '투자자문업' 또는 '투자일임업'에 해당하지 않습니다. 모든 기술적 지표, 차트 보조선, AI 분석 코멘트는 통계적 데이터 모델에 기초한 참고용 자료일 뿐입니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "2. 시세 데이터 지연 및 오차 가능성"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "회사는 신뢰할 수 있는 소스(키움증권, KRX, 야후 파이낸스)로부터 실시간 데이터를 수신하기 위해 최선을 다하고 있으나, 통신 장애, 거래소 데이터 지연, 네트워크 패킷 손실 등으로 인해 실제 체결가와 시세 표기상에 오차나 지연이 발생할 수 있습니다. 회사는 이러한 데이터의 완전성, 정확성, 적시성을 보증하지 않습니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white mt-6 pt-4 border-t border-slate-700/60",
									children: "3. 투자 책임의 귀속"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "모든 금융 상품 및 주식 거래는 원금 손실의 위험이 따릅니다. 본 서비스의 정보를 신뢰하여 행한 주식 매매 및 투자 결정에 따른 모든 결과와 손실은 전적으로 투자자 본인에게 귀속되며, 회사는 이에 대해 어떠한 법적 책임도 부담하지 않습니다." })
							]
						})]
					}),
					page === "contact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-slate-700/80 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-purple-500/10 text-purple-400 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-extrabold text-white",
								children: "고객 지원 및 제휴 문의"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400 mt-1",
								children: "Contact & Support Center"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-slate-300 leading-relaxed text-sm md:text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "서비스 이용 중 불편한 점이 있으시거나, 기능 개선 제안, 데이터 제휴 및 비즈니스 파트너십 문의는 아래 공식 창구를 통해 연락해 주시기 바랍니다." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-900/60 p-5 rounded-xl border border-slate-700/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-white text-base mb-2",
												children: "고객 지원 및 버그 제보"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-slate-400",
												children: "서비스 오류, 계정 문의, 불량 이용자 신고"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-mono text-rose-400 mt-3",
												children: "byunghyunlim92@gmail.com"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-500 mt-1",
												children: "응답 시간: 평일 09:00 ~ 18:00 (영업일 기준 24시간 이내 답변)"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-900/60 p-5 rounded-xl border border-slate-700/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-white text-base mb-2",
												children: "데이터 제휴 및 비즈니스 문의"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-slate-400",
												children: "금융 데이터 공급, 광고 및 콘텐츠 제휴"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-mono text-emerald-400 mt-3",
												children: "contact@stockinsight.com"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-500 mt-1",
												children: "파트너십 제안서 첨부 가능"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 p-5 bg-slate-900/40 rounded-xl border border-slate-800 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-white mb-2",
										children: "안내사항"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "list-disc list-inside space-y-1 text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "종목별 목표가 문의, 매수·매도 타이밍 문의 등 개별 종목에 대한 투자 자문 요청은 법률에 의해 답변이 불가합니다." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "모의투자 거래 내역 및 랭킹 정정 문의는 계정 이메일과 함께 문의해 주시기 바랍니다." })]
									})]
								})
							]
						})]
					}),
					renderNavButtons()
				]
			})]
		})
	});
};
//#endregion
export { StaticPageView };
