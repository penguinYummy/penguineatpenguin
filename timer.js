// HTML 요소 선택 (타이머 관련만)
const timerDisplay = document.getElementById('elapsed-time');
const timerStatus = document.getElementById('timer-status');

// 타이머 관련 변수
let timerInterval = null;
let secondsElapsed = 0;


function formatTime(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function updateTimerDisplay() {
    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);
}

/**
 * 타이머 시작: 1초마다 카운터를 증가시킴
 */
function startTimer() {
    if (timerInterval !== null) return; // 이미 실행 중이면 중복 실행 방지

    timerInterval = setInterval(updateTimerDisplay, 1000);
    timerStatus.innerHTML = '현재 상태: <span style="color: green; font-weight: bold;">활성</span>';
}

/**
 * 타이머 정지 (app.js에서 호출할 수 있도록 window에 연결)
 */
window.stopTimer = function() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerStatus.innerHTML = '현재 상태: <span style="color: red; font-weight: bold;">비활성</span>';
}


/**
 * 페이지 가시성이 변경될 때 호출되는 핸들러 (app.js에서 호출할 수 있도록 window에 연결)
 */
window.handleVisibilityChange = function() {
    // 🚨 타이머 화면이 보일 때만 실행
    const timerScreen = document.getElementById('timer-screen');
    if (timerScreen.classList.contains('hidden')) {
        window.stopTimer(); //念のため停止
        return; 
    }

    if (document.visibilityState === 'visible') {
        startTimer();
    } else {
        window.stopTimer();
    }
}
