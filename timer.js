/**
 * timer.js: 타이머 기능 로직
 */

const Timer = (function() {
    let timerInterval = null;
    let startTime = 0;
    let elapsedTime = 0;
    let isRunning = false;
    
    // DOM 요소
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timerTitleElement = document.getElementById('timer-title');

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10); 

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }

    function updateTimer() {
        const now = Date.now();
        elapsedTime = now - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }

    function start() {
        if (!isRunning) {
            isRunning = true;
            startTime = Date.now() - elapsedTime; 
            // config.js에서 설정된 주기 사용
            timerInterval = setInterval(updateTimer, APP_CONFIG.TIMER_UPDATE_INTERVAL_MS); 
            
            startBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
        }
    }

    function stop() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            
            startBtn.classList.remove('hidden');
            stopBtn.classList.add('hidden');
        }
    }

    function reset() {
        stop();
        elapsedTime = 0;
        timerDisplay.textContent = formatTime(elapsedTime);
    }

    // 초기화: config.js 설정 적용
    if (timerTitleElement) {
        timerTitleElement.textContent = APP_CONFIG.TIMER_TITLE;
    }
    
    // 외부에 노출할 함수 반환
    return {
        start: start,
        stop: stop,
        reset: reset
    };
})();

// HTML의 onclick에서 접근할 수 있도록 전역에 노출
window.Timer = Timer;
