/**
 * config.js: 앱 전역 설정 파일
 */

const APP_CONFIG = {
    DEFAULT_USERNAME: '익명',
    TIMER_UPDATE_INTERVAL_MS: 10, // 타이머 업데이트 주기 (10ms)
    TIMER_TITLE: '고성능 스톱워치',
    SCREEN_IDS: {
        MAIN: 'main-menu',
        TIMER: 'timer-view',
        CHAT: 'chat-view'
    }
};

// HTML에서 접근할 수 있도록 전역 객체(window)에 추가
window.APP_CONFIG = APP_CONFIG;
