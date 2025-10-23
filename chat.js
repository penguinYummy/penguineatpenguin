/**
 * chat.js: 채팅 기능 로직
 */

const Chat = (function() {
    // DOM 요소
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');

    /**
     * 입력된 메시지를 채팅 박스에 추가하고 UI를 갱신합니다.
     */
    function sendMessage() {
        const message = messageInput.value.trim();
        // config.js에서 설정된 기본 이름 사용
        let username = usernameInput.value.trim() || APP_CONFIG.DEFAULT_USERNAME;

        if (message === '') return;

        // 간단한 XSS 방지
        const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeUsername = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // 메시지 요소 생성
        const messageElement = document.createElement('div');
        messageElement.className = 'p-2 bg-gray-600 rounded-lg break-words';
        
        // 시간 표시
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        messageElement.innerHTML = `<span class="font-bold text-yellow-400">${safeUsername}</span> <span class="text-sm text-gray-400">(${timeString})</span>: <span>${safeMessage}</span>`;
        
        // 채팅 박스에 추가
        chatBox.appendChild(messageElement);
        
        // 스크롤을 맨 아래로 이동
        chatBox.scrollTop = chatBox.scrollHeight;

        // 입력창 초기화
        messageInput.value = '';
        messageInput.focus();
    }

    // 외부에 노출할 함수 반환
    return {
        sendMessage: sendMessage
    };
})();

// HTML의 onclick에서 접근할 수 있도록 전역에 노출
window.Chat = Chat;
