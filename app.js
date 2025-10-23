 const firebaseConfig = {
    apiKey: "AIzaSyB_nt4nzPfp-trlT8QHNFPFpd-oKqfyWGo",
    authDomain: "penguineatpenguin.firebaseapp.com",
    projectId: "penguineatpenguin",
    storageBucket: "penguineatpenguin.firebasestorage.app",
    messagingSenderId: "757747390049",
    appId: "1:757747390049:web:72bcdc12d5eb3bc1b97c20",
    measurementId: "G-XCT650Z39X"
  };

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase 참조를 전역적으로 접근 가능하도록 window 객체에 연결 (모듈화가 복잡해지는 것을 방지)
window.messagesRef = firebase.database().ref('messages');
window.activeNicknamesRef = firebase.database().ref('activeUserNicknames');
window.chatStatusRef = firebase.database().ref('chatStatus'); 


// HTML 요소 선택
const mainScreen = document.getElementById('main-screen');
const chatScreen = document.getElementById('chat-screen');
const timerScreen = document.getElementById('timer-screen');

const goToChatBtn = document.getElementById('go-to-chat-btn');
const goToTimerBtn = document.getElementById('go-to-timer-btn');
const backToMainBtns = document.querySelectorAll('.back-to-main-btn');

/* -------------------- 화면 전환 로직 -------------------- */

/**
 * 특정 화면만 보이도록 전환하는 함수
 * @param {HTMLElement} screenToShow - 보여줄 화면 요소
 */
function showScreen(screenToShow) {
    const screens = [mainScreen, chatScreen, timerScreen];
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.remove('hidden');
        } else {
            screen.classList.add('hidden');
        }
    });

    // 🚨 화면 전환 시 기능 제어
    if (screenToShow === timerScreen) {
        // 타이머 화면 진입 시: 타이머 시작 로직 호출
        window.handleVisibilityChange();
    } else {
        // 다른 화면 진입 시: 타이머 정지 로직 호출 (timer.js에 정의됨)
        if (window.stopTimer) window.stopTimer(); 
    }

    if (screenToShow === chatScreen) {
        // 채팅 화면 진입 시: 자동 로그인/닉네임 처리 로직 호출 (chat.js에 정의됨)
        if (window.handleChatInitialization) window.handleChatInitialization();
    } else {
        // 채팅 화면 이탈 시: Firebase 연결 해제 로직 호출 (chat.js에 정의됨)
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

// 초기 화면 설정
showScreen(mainScreen);

// 페이지 가시성 이벤트 리스너 등록 (timer.js의 로직이 전역적으로 필요하므로 여기에 유지)
// 🚨 이 이벤트는 전역적이며, timer.js가 정의된 후에만 호출되어야 함.
document.addEventListener('visibilitychange', () => {
    // 타이머 화면일 때만 실행
    if (!timerScreen.classList.contains('hidden')) {
        window.handleVisibilityChange();
    }
    // 채팅 화면일 때만 실행 (선택 사항: 채팅 연결/해제를 탭 가시성에 따라 제어하려면)
    // if (!chatScreen.classList.contains('hidden')) {
    //     window.handleChatVisibilityChange(); 
    // }
});
