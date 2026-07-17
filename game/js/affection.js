function updateAffection(char, amount) {
    if (!gameState.affection[char]) {
        gameState.affection[char] = 0;
    }
    gameState.affection[char] = Math.max(0, Math.min(100, gameState.affection[char] + amount));
    
    const names = {
        xiao: '萧若河',
        xie: '谢玉衡',
        li: '李自清',
        chu: '楚昭云'
    };
    
    const charName = names[char] || char;
    const changeText = amount > 0 ? `+${amount}` : amount;
    showAffectionTip(`${charName} 好感度 ${changeText}`);
    updateAffectionDisplay();
}

function updateAffectionDisplay() {
    const chars = ['xiao', 'xie', 'li', 'chu'];
    chars.forEach(char => {
        const value = gameState.affection[char] || 0;
        const bar = document.getElementById('bar-' + char);
        const val = document.getElementById('val-' + char);
        if (bar) bar.style.width = value + '%';
        if (val) val.textContent = value;
    });
}

function getAffection(char) {
    return gameState.affection[char] || 0;
}

function checkEnding() {
    const affections = gameState.affection;
    const maxChar = Object.keys(affections).reduce((a, b) => affections[a] > affections[b] ? a : b);
    const maxVal = affections[maxChar];
    
    if (maxVal >= 80) {
        return getEnding(maxChar, 'he');
    } else if (maxVal >= 60) {
        return getEnding(maxChar, 'normal');
    } else if (maxVal >= 40) {
        return getEnding(maxChar, 'be');
    }
    return getEnding(null, 'single');
}

function getEnding(char, type) {
    const endings = {
        xiao: {
            he: {
                title: '权倾天下',
                text: '萧若河最终以雷霆手段扫清朝野障碍，扶持新君登基后，携你归隐山林。世人皆传摄政王功成身退，却不知那深山中，有他为你种下的十里桃花。他清冷的眼眸中，唯有对你才会绽放温柔——「此生，唯你一人。」'
            },
            normal: {
                title: '相敬如宾',
                text: '你成为了摄政王妃，虽无轰轰烈烈的情爱，却也相敬如宾。萧若河待你始终温和有礼，偶尔在夜深人静时，会为你煮一壶热茶。这或许不是最炽热的爱情，却是最安稳的归宿。'
            },
            be: {
                title: '咫尺天涯',
                text: '朝堂之争愈演愈烈，萧若河为保你周全，将你送出京城。你站在城门口，望着他决绝离去的背影，知道此生再难相见。有些爱，注定只能深埋心底。'
            }
        },
        xie: {
            he: {
                title: '山水之间',
                text: '谢玉衡放下家族重担，与你携手游历天下。他为你抚琴，你为他研墨，江南烟雨、塞北风沙，都成为你们爱情的见证。「玉衡此生，唯愿与卿共赏山水。」'
            },
            normal: {
                title: '名门淑媛',
                text: '你成为了谢家主母，谢玉衡对你温柔体贴，虽不及轰轰烈烈，却也是细水长流。他常说，平淡才是真。'
            },
            be: {
                title: '情深不寿',
                text: '谢玉衡为保护你卷入朝堂纷争，最终身陨。你守着他留下的折扇，度过余生。「玉衡，若有来生，愿我们只是寻常人家。」'
            }
        },
        li: {
            he: {
                title: '盛世帝王',
                text: '李自清在你的辅佐下，一步步夺回皇权，成为一代明君。他站在金銮殿上，目光穿越重重宫墙，只为寻找那个曾经给他温暖的身影。「嫣儿，江山为聘，许你一世荣华。」'
            },
            normal: {
                title: '宫闱深深',
                text: '你成为了皇后，虽身处深宫，却也得到了帝王的宠爱。李自清会在繁忙的政务之余，陪你看一场烟花。'
            },
            be: {
                title: '红颜祸水',
                text: '朝堂之上，你被诬陷为祸国妖妃。李自清在皇权与你之间选择了前者，你饮下毒酒，含笑赴死。「陛下，若有来生，别再相遇了。」'
            }
        },
        chu: {
            he: {
                title: '烽火情缘',
                text: '楚昭云率部归降，两国罢兵言和。他放下手中长剑，只为与你相守。「从今往后，我不再是将军，只是你的夫君。」'
            },
            normal: {
                title: '相望江湖',
                text: '战争结束，你们各自回归故土。虽不能相守，却也时常遥遥相望。有些人，注定只能成为彼此心中最深的牵挂。'
            },
            be: {
                title: '阴阳两隔',
                text: '战场上，楚昭云为护你挡下致命一击。他躺在你怀中，最后一次温柔地看着你。「嫣儿，能遇见你，此生无憾。」'
            }
        },
        single: {
            title: '独步天下',
            text: '你没有选择任何一人，凭借现代智慧在这个时代闯出了一片天地。你成为了名震天下的女商人，富可敌国，却始终孑然一身。或许在某个深夜，你会想起那些曾经相遇的人，但你知道，自由才是你最珍贵的东西。'
        }
    };
    
    if (char) {
        return endings[char][type] || endings[char].normal;
    }
    return endings.single;
}