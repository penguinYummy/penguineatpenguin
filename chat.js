// 전역 변수 (app.js나 다른 파일에서 사용될 수 있으므로 window에 연결)
window.userNickname = '';
window.currentUserRef = null;

// HTML 요소 선택 (채팅 관련만)
const nicknameArea = document.getElementById('nickname-area');
const chatAppDiv = document.getElementById('chat-app');
const nicknameInputForm = document.getElementById('nickname-input-form');
const nicknameInput = document.getElementById('nickname-input');
const currentNicknameDisplay = document.getElementById('current-nickname');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');
const clearBtn = document.getElementById('clear-messages-btn');


/**
 * 닉네임을 Firebase에 등록하고 채팅방에 입장시키는 핵심 함수
 */
function registerNickname(nickname) {
    
    window.activeNicknamesRef.once('value', (snapshot) => {
        const usedNicknames = snapshot.val();
        let isDuplicate = false;

        if (usedNicknames) {
            for (let id in usedNicknames) {
                if (usedNicknames[id] === nickname) {
                    isDuplicate = true;
                    break;
                }
            }
        }

        if (isDuplicate) {
            alert(`"${nickname}" 닉네임은 이미 사용 중입니다. 다른 닉네임을 입력해 주세요.`);
            nicknameInput.value = '';
            nicknameInput.focus();
            localStorage.removeItem('chatNickname');
        } else {
            // 등록 성공
            window.userNickname = nickname;
            currentNicknameDisplay.textContent = window.userNickname;
            localStorage.setItem('chatNickname', nickname); 

            // 기존 참조 제거 및 새 참조 등록
            if (window.currentUserRef) {
                window.currentUserRef.remove();
            }
            window.currentUserRef = window.activeNicknamesRef.push(nickname); 
            window.currentUserRef.onDisconnect().remove(); 
            
            // 화면 전환
            nicknameArea.classList.add('hidden');
            chatAppDiv.classList.remove('hidden');
            messageInput.focus();
        }
    });
}

/**
 * 채팅 화면 진입 시 초기화 및 자동 로그인 처리
 */
window.handleChatInitialization = () => {
    const savedNickname = localStorage.getItem('chatNickname');

    // 닉네임이 저장되어 있고 아직 로그인되지 않았다면 자동 로그인 시도
    if (savedNickname && !window.userNickname) {
        registerNickname(savedNickname);
    }
    // 닉네임이 저장되지 않았다면 닉네임 입력 화면 유지
    if (!savedNickname) {
        nicknameArea.classList.remove('hidden');
        chatAppDiv.classList.add('hidden');
    }
};

/**
 * 채팅 화면 이탈 시 Firebase 연결 해제
 */
window.handleChatDisconnection = () => {
    if (window.currentUserRef) {
        window.currentUserRef.remove(); // 접속 상태 제거
        window.currentUserRef = null;
        window.userNickname = '';
    }
};


/* ---------- 이벤트 리스너 등록 ---------- */
nicknameInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = nicknameInput.value.trim();
    if (nickname) {
        registerNickname(nickname);
    }
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    
    if (messageText && window.userNickname) {
        window.messagesRef.push({
            nickname: window.userNickname,
            text: messageText,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

clearBtn.addEventListener('click', () => {
    const isConfirmed = confirm("경고! 채팅방의 모든 메시지를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    
    if (isConfirmed) {
        window.messagesRef.set(null)
            .then(() => {
                return window.chatStatusRef.set({ lastCleared: Date.now() }); 
            })
            .then(() => {
                alert("모든 채팅 메시지가 삭제되었습니다.");
                messagesContainer.innerHTML = '';
            })
            .catch((error) => {
                console.error("데이터 삭제 실패:", error);
                alert("메시지 삭제에 실패했습니다.");
            });
    }
});


/* ---------- 실시간 Firebase 데이터 수신 리스너 (초기화 및 메시지) ---------- */

// 메시지 수신 및 표시 로직
window.messagesRef.on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<span class="message-nickname">${messageData.nickname}:</span> ${messageData.text}`;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// 채팅방 상태 변경 감지 리스너 (실시간 초기화)
window.chatStatusRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
        messagesContainer.innerHTML = '';
    }
});
