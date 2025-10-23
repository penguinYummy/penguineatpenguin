
 const firebaseConfig = {
    apiKey: "AIzaSyB_nt4nzPfp-trlT8QHNFPFpd-oKqfyWGo",
    authDomain: "penguineatpenguin.firebaseapp.com",
    projectId: "penguineatpenguin",
    storageBucket: "penguineatpenguin.firebasestorage.app",
    messagingSenderId: "757747390049",
    appId: "1:757747390049:web:72bcdc12d5eb3bc1b97c20",
    measurementId: "G-XCT650Z39X"
  };

// Firebase 초기화 (index.html에서 로드된 firebase 객체를 사용)
firebase.initializeApp(firebaseConfig);

// Firebase 참조
const messagesRef = firebase.database().ref('messages');
const activeNicknamesRef = firebase.database().ref('activeUserNicknames');
const chatStatusRef = firebase.database().ref('chatStatus'); 

// HTML 요소 선택
const nicknameScreen = document.getElementById('nickname-screen');
const chatApp = document.getElementById('chat-app');
const nicknameInputForm = document.getElementById('nickname-input-form');
const nicknameInput = document.getElementById('nickname-input');
const currentNicknameDisplay = document.getElementById('current-nickname');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');
const clearBtn = document.getElementById('clear-messages-btn');

let userNickname = '';

/**
 * 닉네임을 Firebase에 등록하고 채팅방에 입장시키는 핵심 함수
 */
function registerNickname(nickname) {
    
    activeNicknamesRef.once('value', (snapshot) => {
        const usedNicknames = snapshot.val();
        let isDuplicate = false;

        if (usedNicknames) {
            for (let id in usedNicknames) {
                // 닉네임만 비교
                if (usedNicknames[id] === nickname) {
                    isDuplicate = true;
                    break;
                }
            }
        }

        if (isDuplicate) {
            // 중복된 경우
            alert(`"${nickname}" 닉네임은 이미 사용 중입니다. 다른 닉네임을 입력해 주세요.`);
            nicknameInput.value = '';
            nicknameInput.focus();
            localStorage.removeItem('chatNickname');
        } else {
            // 등록 성공
            userNickname = nickname;
            currentNicknameDisplay.textContent = userNickname;
            
            localStorage.setItem('chatNickname', nickname); 

            // Firebase에 현재 사용자가 닉네임을 사용 중임을 등록
            const userRef = activeNicknamesRef.push(nickname); 
            
            userRef.onDisconnect().remove(); 
            
            // 화면 전환 및 입장
            nicknameScreen.style.display = 'none';
            chatApp.style.display = 'block';
            messageInput.focus();
        }
    });
}


/* ---------- 닉네임 로드 및 자동 입장 로직 ---------- */
const savedNickname = localStorage.getItem('chatNickname');

if (savedNickname) {
    nicknameInput.value = savedNickname; 
    // 자동 로그인을 바로 시도합니다.
    registerNickname(savedNickname);

}

/* ---------- 닉네임 입력/저장 로직 ---------- */
nicknameInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = nicknameInput.value.trim();
    
    if (nickname) {
        registerNickname(nickname);
    }
});

/* ---------- 메시지 전송 로직 ---------- */
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    
    if (messageText && userNickname) {
        messagesRef.push({
            nickname: userNickname,
            text: messageText,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

/* ---------- 실시간 메시지 수신 및 표시 로직 ---------- */
messagesRef.on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    
    const messageElement = document.createElement('p');
    
    messageElement.innerHTML = `<span class="message-nickname">${messageData.nickname}:</span> ${messageData.text}`;
    
    messagesContainer.appendChild(messageElement);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

/* ---------- 메시지 전체 삭제 기능 (실시간 전파 로직 유지) ---------- */
clearBtn.addEventListener('click', () => {
    const isConfirmed = confirm("경고! 채팅방의 모든 메시지를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    
    if (isConfirmed) {
        messagesRef.set(null)
            .then(() => {
                return chatStatusRef.set({ lastCleared: Date.now() }); 
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

/* ---------- 채팅방 상태 변경 감지 리스너 (실시간 초기화 유지) ---------- */
chatStatusRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
        messagesContainer.innerHTML = '';
    }
});
