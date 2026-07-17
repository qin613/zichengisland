let gameState = {
    playerName: '姜嫣',
    currentNodeId: 'prologue_1',
    affection: { xiao: 0, xie: 0, li: 0, chu: 0 },
    stats: { wisdom: 50, strength: 30, reputation: 10, perception: 40, beauty: 60, malice: 10 },
    flags: {}
};

const storyNodes = {};

function registerNode(node) {
    storyNodes[node.id] = node;
}

function getNode(nodeId) {
    return storyNodes[nodeId];
}

function startGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    gameState.playerName = nameInput || '姜嫣';
    gameState.currentNodeId = 'prologue_1';
    gameState.affection = { xiao: 0, xie: 0, li: 0, chu: 0 };
    gameState.flags = {};
    showGameScreen();
    renderNode('prologue_1');
    if (!isMusicPlaying) {
        toggleMusic();
    }
}

function showGameScreen() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
}

function showStartScreen() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    checkAutoSave();
}

function restartGame() {
    closeModal();
    gameState = {
        playerName: '姜嫣',
        currentNodeId: 'prologue_1',
        affection: { xiao: 0, xie: 0, li: 0, chu: 0 },
        flags: {}
    };
    localStorage.removeItem('yanluochenyuan_save_auto');
    showStartScreen();
}

function returnToHome() {
    closeModal();
    autoSave();
    showStartScreen();
}

function renderNode(nodeId) {
    const node = getNode(nodeId);
    if (!node) {
        showAffectionTip('剧情节点不存在');
        return;
    }

    gameState.currentNodeId = nodeId;
    autoSave();

    if (node.onLoad) {
        node.onLoad();
        return;
    }

    document.getElementById('scene-title').textContent = node.scene || '';
    
    const background = node.background || 'linear-gradient(180deg, #2c3e50 0%, #1a1a2e 50%, #0d0d1a 100%)';
    const bgEl = document.getElementById('background');
    bgEl.style.background = '';
    bgEl.style.backgroundImage = '';
    bgEl.style.backgroundSize = '';
    bgEl.style.backgroundPosition = '';
    bgEl.style.backgroundRepeat = '';
    if (background.startsWith('linear-gradient') || background.startsWith('radial-gradient')) {
        bgEl.style.background = background;
    } else {
        const timestamp = new Date().getTime();
        bgEl.style.backgroundImage = `url(${background}?t=${timestamp})`;
        bgEl.style.backgroundSize = 'cover';
        bgEl.style.backgroundPosition = 'center';
        bgEl.style.backgroundRepeat = 'no-repeat';
    }

    renderCharacters(node.characters);

    const nameEl = document.getElementById('dialog-name');
    const textEl = document.getElementById('dialog-text');
    const choicesEl = document.getElementById('dialog-choices');

    if (node.character) {
        nameEl.textContent = node.character;
        nameEl.style.display = 'inline-block';
    } else {
        nameEl.style.display = 'none';
    }

    textEl.textContent = replacePlayerName(node.text);
    choicesEl.innerHTML = '';

    if (node.choices && node.choices.length > 0) {
        node.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = replacePlayerName(choice.text);
            btn.style.animationDelay = index * 0.1 + 's';
            btn.onclick = () => handleChoice(choice);
            choicesEl.appendChild(btn);
        });
    }

    if (node.isEnding) {
        setTimeout(() => showEnding(node), 2000);
    }

    updateAffectionDisplay();
}

function replacePlayerName(text) {
    return text.replace(/\[玩家\]/g, gameState.playerName);
}

function renderCharacters(characters) {
    const leftEl = document.getElementById('char-left');
    const centerEl = document.getElementById('char-center');
    const rightEl = document.getElementById('char-right');

    leftEl.classList.remove('show');
    centerEl.classList.remove('show');
    rightEl.classList.remove('show');
    leftEl.src = '';
    centerEl.src = '';
    rightEl.src = '';

    if (!characters) return;

    console.log('渲染立绘:', characters);

    if (characters.left) {
        leftEl.src = characters.left;
        leftEl.classList.add('show');
        console.log('左立绘:', characters.left);
    }
    if (characters.center) {
        centerEl.src = characters.center;
        centerEl.classList.add('show');
        console.log('中立绘:', characters.center);
    }
    if (characters.right) {
        rightEl.src = characters.right;
        rightEl.classList.add('show');
        console.log('右立绘:', characters.right);
    }
}

function handleChoice(choice) {
    if (choice.effect) {
        applyEffect(choice.effect);
    }

    if (choice.next) {
        renderNode(choice.next);
    }
}

function applyEffect(effect) {
    if (effect.affection) {
        Object.keys(effect.affection).forEach(char => {
            if (effect.affection[char] !== 0) {
                updateAffection(char, effect.affection[char]);
            }
        });
    }

    if (effect.stats) {
        Object.keys(effect.stats).forEach(stat => {
            if (gameState.stats[stat] !== undefined) {
                gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + effect.stats[stat]));
                showAffectionTip(`${getStatName(stat)} ${effect.stats[stat] > 0 ? '+' : ''}${effect.stats[stat]}`);
            }
        });
    }

    if (effect.flags) {
        Object.keys(effect.flags).forEach(flag => {
            gameState.flags[flag] = effect.flags[flag];
        });
    }
}

function getStatName(stat) {
    const names = {
        wisdom: '智谋',
        strength: '武力',
        reputation: '声望',
        perception: '悟性',
        beauty: '美貌',
        malice: '恶念'
    };
    return names[stat] || stat;
}

function updateStatsDisplay() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    let html = '';
    const stats = gameState.stats;
    Object.keys(stats).forEach(stat => {
        const name = getStatName(stat);
        const value = stats[stat];
        html += `<div class="stat-item">
            <span class="stat-name">${name}</span>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${value}%"></div>
            </div>
            <span class="stat-value">${value}</span>
        </div>`;
    });
    statsContainer.innerHTML = html;
}

function showAffectionTip(text) {
    const tip = document.getElementById('affection-tip');
    tip.textContent = text;
    tip.classList.add('show');
    setTimeout(() => {
        tip.classList.remove('show');
    }, 2000);
}

function showSaveLoad(fromHome) {
    updateSaveSlots();
    const modalTitle = document.querySelector('#save-load-modal h2');
    if (modalTitle) {
        modalTitle.textContent = fromHome ? '选择存档' : '存档管理';
    }
    document.getElementById('save-load-modal').classList.add('active');
}

function showAffection() {
    updateAffectionDisplay();
    document.getElementById('affection-modal').classList.add('active');
}

function showStats() {
    updateStatsDisplay();
    document.getElementById('stats-modal').classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showEnding(node) {
    const ending = node.ending || checkEnding();
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-text').textContent = ending.text;
    document.getElementById('ending-modal').classList.add('active');
}

function sendCustomInput() {
    handleCustomInput();
}

let isMusicPlaying = false;

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('btn-music');
    
    if (!music || !btn) return;
    
    if (isMusicPlaying) {
        music.pause();
        btn.textContent = '🔇';
        btn.classList.add('muted');
        showAffectionTip('背景音乐已关闭');
    } else {
        music.play().then(() => {
            btn.textContent = '🎵';
            btn.classList.remove('muted');
            showAffectionTip('背景音乐已开启');
        }).catch(e => {
            console.log('音乐播放失败:', e);
            showAffectionTip('音乐播放失败，请点击音乐按钮重试');
            isMusicPlaying = false;
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

function initMusic() {
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.7;
        music.addEventListener('error', function(e) {
            console.log('音频加载错误:', e);
            showAffectionTip('背景音乐加载失败');
        });
        music.addEventListener('loadeddata', function() {
            console.log('音频加载成功');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAutoSave();
    initMusic();
    
    document.getElementById('custom-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendCustomInput();
        }
    });
});