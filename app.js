// --- 後端配置 ---
const BACKEND_URL = "https://ineludibly-unfibred-brenna.ngrok-free.dev";

// --- 1. 互動效果：了解更多 & 頭像滑動 ---
const learnMoreBtn = document.getElementById('learn-more-btn');
const moreIntro = document.getElementById('more-intro');
const avatarContainer = document.getElementById('avatar-container');

learnMoreBtn.onclick = () => {
    if (moreIntro.style.display === 'none' || moreIntro.style.display === '') {
        moreIntro.style.display = 'block';
        avatarContainer.classList.add('avatar-slide-right');
        learnMoreBtn.innerText = '收起內容 ←';
    } else {
        moreIntro.style.display = 'none';
        avatarContainer.classList.remove('avatar-slide-right');
        learnMoreBtn.innerText = '了解更多 →';
    }
};

// --- 2. AI 聊天室邏輯 ---
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatWindow = document.getElementById('chat-window');

async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    chatInput.value = '';
    const loadingDiv = appendMessage('ai', 'Joan AI 正在思考...');

    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        loadingDiv.innerText = data.reply || data.response || "我收到了，但不知道該怎麼回答。";
    } catch (error) {
        loadingDiv.innerText = "抱歉，我現在連不上後端伺服器。";
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.innerText = text;
    msgDiv.style = `padding: 10px 15px; border-radius: 15px; max-width: 80%; word-break: break-word; ${role === 'user' ? 'align-self: flex-end; background: #00ffa3; color: #1a1a1a;' : 'align-self: flex-start; background: #2d2d2d; color: white;'}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msgDiv;
}

sendBtn.onclick = handleSendMessage;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleSendMessage(); };

// --- 3. 化學小遊戲 (保留原始邏輯) ---
const questions = [
    { q: "HCl 的正確名稱是？", a: ["硫酸", "鹽酸", "硝酸", "氫氧化鈉"], c: 1 },
    { q: "KMnO4 是哪種物質？", a: ["高錳酸鉀", "氯化鉀", "硫酸錳", "碳酸鉀"], c: 0 },
    { q: "代表「金」的符號是？", a: ["Ag", "Au", "Fe", "Cu"], c: 1 },
    { q: "稀釋濃硫酸時應？", a: ["水倒入酸", "酸緩緩入水", "同時倒入", "看心情"], c: 1 },
    { q: "酒精起火時？", a: ["嘴吹", "潑水", "濕布覆蓋", "快跑"], c: 2 },
    { q: "加熱試管時，管口應？", a: ["朝向自己", "朝向同學", "朝向無人處", "向上"], c: 2 },
    { q: "聞氣味時應？", a: ["湊近深吸", "手撥搧聞", "喝一口", "戴口罩聞"], c: 1 },
    { q: "實驗結束後，手部應？", a: ["不用洗", "用衣服擦", "用肥皂洗淨", "用實驗袍擦"], c: 2 },
    { q: "pH 值等於 7 代表？", a: ["強酸", "強鹼", "中性", "揮發性"], c: 2 },
    { q: "燒杯可以直接在火上加熱嗎？", a: ["可以", "需墊石棉心網", "絕對不行", "隨便"], c: 1 }
];

let current = 0; let score = 0;
const gameBtn = document.getElementById('game-btn');
const modal = document.getElementById('game-modal');
const qText = document.getElementById('q-text');
const optCon = document.getElementById('opt-container');
const scoreText = document.getElementById('score-display');

gameBtn.onclick = () => { modal.style.display = 'flex'; resetGame(); };

function resetGame() {
    current = 0; score = 0;
    document.getElementById('close-btn').style.display = 'none';
    showQ();
}

function showQ() {
    const data = questions[current];
    scoreText.innerText = `得分：${score} / 100`;
    qText.innerText = `${current + 1}. ${data.q}`;
    optCon.innerHTML = '';
    data.a.forEach((txt, i) => {
        const b = document.createElement('button');
        b.innerText = txt;
        b.style = "display:block; width:100%; margin:10px 0; padding:12px; border-radius:10px; border:1px solid #444; background:#333; color:white; cursor:pointer;";
        b.onclick = () => {
            if(i === data.c) {
                score += 10; current++;
                if(current < questions.length) showQ(); else finish();
            } else { alert("答錯了！請重新挑戰一次。"); resetGame(); }
        };
        optCon.appendChild(b);
    });
}

function finish() {
    scoreText.innerText = `得分：100 / 100`;
    qText.innerHTML = "🎉 滿分！你是化工小天才！";
    optCon.innerHTML = "";
    document.getElementById('close-btn').style.display = 'inline-block';
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#00ffa3', '#ffffff'] });
}

document.getElementById('close-btn').onclick = () => modal.style.display = 'none';

// --- 4. 星星跟隨效果 (新增) ---
document.addEventListener('mousemove', (e) => {
    // 為了效能，我們限制產生星星的機率
    if (Math.random() > 0.1) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.innerHTML = '★'; // 你也可以換成 '✨'
        
        // 設定產生的位置在滑動座標
        star.style.left = e.pageX + 'px';
        star.style.top = e.pageY + 'px';
        
        // 隨機設定一點點水平位移，讓它散開一點
        const randomX = (Math.random() - 0.5) * 20;
        star.style.marginLeft = randomX + 'px';

        document.body.appendChild(star);

        // 1秒後自動移除，避免網頁變慢
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
});