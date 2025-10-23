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

// Firebase 참조를 전역 객체(window)에 연결하여 다른 스크립트에서 접근 가능하게 합니다.
window.messagesRef = firebase.database().ref('messages');
window.activeNicknamesRef = firebase.database().ref('activeUserNicknames');
window.chatStatusRef = firebase.database().ref('chatStatus');
