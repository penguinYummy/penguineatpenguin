// HTML 요소 선택 (모든 화면 요소 포함)
const mainScreen = document.getElementById('main-screen');
const chatScreen = document.getElementById('chat-screen');
const timerScreen = document.getElementById('timer-screen');

const goToChatBtn = document.getElementById('go-to-chat-btn');
const goToTimerBtn = document.getElementById('go-to-timer-btn');
const backToMainBtns = document.querySelectorAll('.back-to-main-btn'); // 메인으로 돌아가기 버튼들


/* -------------------- A. 화면 전환 로직 (핵심) -------------------- */

/**
 * 특정 화면만 보이도록 전환하는 함수
 * @param {HTMLElement} screenToShow - 보여줄 화면 요소
 */
function showScreen(screenToShow) {
    // 모든 화면 요소를 배열로 만듭니다.
    const screens = [mainScreen, chatScreen, timerScreen]; 
    
    // 1. 모든 화면 숨김/보임 처리
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.remove('hidden');
        } else {
            screen.classList.add('hidden');
        }
    });

    // 2. 화면에 따른 기능 실행/정지
    if (screenToShow === timerScreen) {
        // 타이머 화면 진입 시: 타이머 시작 (timer.js의 전역 함수 호출)
        if (window.handleVisibilityChange) window.handleVisibilityChange();
    } else {
        // 타이머 화면 이탈 시: 타이머 정지 (timer.js의 전역 함수 호출)
        if (window.stopTimer) window.stopTimer();
    }

    if (screenToShow === chatScreen) {
        // 채팅 화면 진입 시: 자동 로그인/닉네임 처리 시작 (chat.js의 전역 함수 호출)
        if (window.handleChatInitialization) window.handleChatInitialization();
    } else {
        // 채팅 화면 이탈 시: Firebase 연결 해제 (chat.js의 전역 함수 호출)
        if (window.handleChatDisconnection) window.handleChatDisconnection();
    }
}

// 1. 메인 버튼 이벤트 리스너
goToChatBtn.addEventListener('click', () => showScreen(chatScreen));
goToTimerBtn.addEventListener('click', () => showScreen(timerScreen));

// 2. 돌아가기 버튼 이벤트 리스너
backToMainBtns.forEach(btn => {
    btn.addEventListener('click', () => showScreen(mainScreen));
});

// 페이지 가시성 이벤트 리스너 등록
// 탭이 전환되거나 최소화될 때마다 타이머를 제어합니다.
document.addEventListener('visibilitychange', () => {
    // 타이머 화면일 때만 타이머 로직(timer.js)이 작동하도록 연결
    if (window.handleVisibilityChange) window.handleVisibilityChange();
});
