const SAVE_KEY_PREFIX = 'yanluochenyuan_save_';
const MAX_SAVE_SLOTS = 6;

function saveGame(slot) {
    const saveData = {
        version: '1.2',
        playerName: gameState.playerName,
        currentNodeId: gameState.currentNodeId,
        affection: gameState.affection,
        stats: gameState.stats,
        flags: gameState.flags,
        timestamp: Date.now(),
        saveName: '存档 ' + slot
    };
    localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(saveData));
    showAffectionTip('存档成功！');
    updateSaveSlots();
}

function loadGame(slot) {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!saveData) {
        showAffectionTip('此存档位为空');
        return;
    }
    try {
        const data = JSON.parse(saveData);
        gameState.playerName = data.playerName;
        gameState.currentNodeId = data.currentNodeId;
        gameState.affection = data.affection || { xiao: 0, xie: 0, li: 0, chu: 0 };
        gameState.stats = data.stats || { wisdom: 50, strength: 30, reputation: 10, perception: 40, beauty: 60, malice: 10 };
        gameState.flags = data.flags || {};
        closeModal();
        showGameScreen();
        renderNode(gameState.currentNodeId);
        showAffectionTip('读档成功！');
    } catch (e) {
        showAffectionTip('存档损坏');
    }
}

function deleteSave(slot) {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!saveData) {
        showAffectionTip('此存档位为空');
        return;
    }
    if (confirm('确定要删除此存档吗？')) {
        localStorage.removeItem(SAVE_KEY_PREFIX + slot);
        updateSaveSlots();
        showAffectionTip('存档已删除');
    }
}

function renameSave(slot) {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!saveData) {
        showAffectionTip('此存档位为空');
        return;
    }
    try {
        const data = JSON.parse(saveData);
        const newName = prompt('请输入存档名称：', data.saveName || '存档 ' + slot);
        if (newName !== null && newName.trim() !== '') {
            data.saveName = newName.trim();
            localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
            updateSaveSlots();
            showAffectionTip('重命名成功');
        }
    } catch (e) {
        showAffectionTip('存档损坏');
    }
}

function hasSave(slot) {
    return localStorage.getItem(SAVE_KEY_PREFIX + slot) !== null;
}

function handleSaveSlot(slot) {
    if (hasSave(slot)) {
        loadGame(slot);
    } else {
        saveGame(slot);
    }
}

function updateSaveSlots() {
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
        const nameEl = document.getElementById('save-name-' + i);
        const timeEl = document.getElementById('save-time-' + i);
        const slotEl = document.querySelector('.save-slot:nth-child(' + i + ')');
        
        if (!nameEl || !timeEl) continue;
        
        const saveData = localStorage.getItem(SAVE_KEY_PREFIX + i);
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                nameEl.textContent = data.saveName || '存档 ' + i;
                nameEl.classList.add('has-save');
                
                const date = new Date(data.timestamp);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                timeEl.textContent = `${year}-${month}-${day} ${hour}:${minute}`;
                timeEl.style.display = 'block';
                
                if (slotEl) {
                    slotEl.classList.add('filled');
                }
            } catch (e) {
                nameEl.textContent = '存档损坏';
                timeEl.style.display = 'none';
            }
        } else {
            nameEl.textContent = '点击存档';
            nameEl.classList.remove('has-save');
            timeEl.style.display = 'none';
            
            if (slotEl) {
                slotEl.classList.remove('filled');
            }
        }
    }
}

function checkAutoSave() {
    const autoSave = localStorage.getItem(SAVE_KEY_PREFIX + 'auto');
    if (autoSave) {
        document.getElementById('btn-continue').style.display = 'block';
    }
}

function autoSave() {
    const saveData = {
        version: '1.2',
        playerName: gameState.playerName,
        currentNodeId: gameState.currentNodeId,
        affection: gameState.affection,
        stats: gameState.stats,
        flags: gameState.flags,
        timestamp: Date.now(),
        saveName: '自动存档'
    };
    localStorage.setItem(SAVE_KEY_PREFIX + 'auto', JSON.stringify(saveData));
}

function continueGame() {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + 'auto');
    if (!saveData) return;
    try {
        const data = JSON.parse(saveData);
        gameState.playerName = data.playerName;
        gameState.currentNodeId = data.currentNodeId;
        gameState.affection = data.affection || { xiao: 0, xie: 0, li: 0, chu: 0 };
        gameState.stats = data.stats || { wisdom: 50, strength: 30, reputation: 10, perception: 40, beauty: 60, malice: 10 };
        gameState.flags = data.flags || {};
        showGameScreen();
        renderNode(gameState.currentNodeId);
        if (typeof isMusicPlaying !== 'undefined' && !isMusicPlaying) {
            toggleMusic();
        }
    } catch (e) {
        showAffectionTip('存档损坏');
    }
}