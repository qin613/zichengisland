registerNode({
    id: 'li_1',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '你通过关系，获得了入宫的机会。\n\n皇宫之中，金碧辉煌，却也处处透着森严。\n\n你来到御花园，远远地看到一个明黄色的身影。\n\n李自清正独自坐在凉亭中，看着池中锦鲤，神情落寞。',
    choices: [
        { text: '远远观望', next: 'li_2', effect: { affection: { li: 2 } } },
        { text: '上前请安', next: 'li_2', effect: { affection: { li: 3 } } },
        { text: '假装路过', next: 'li_2', effect: { affection: { li: 1 } } }
    ],
    characters: { center: LI_IMG }
});

registerNode({
    id: 'li_2',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '李自清',
    text: '李自清听到脚步声，转过头来。\n\n看到是你，他的眼中闪过一丝惊喜，随即又恢复了平静。\n\n「姜嫣？你怎么在这里？」\n\n「回皇上，臣女入宫办事，恰好经过此处。」\n\n李自清沉默了片刻，「你...愿意陪我说说话吗？」',
    choices: [
        { text: '欣然同意', next: 'li_3', effect: { affection: { li: 4 } } },
        { text: '婉言谢绝', next: 'li_3', effect: { affection: { li: 1 } } },
        { text: '询问他的烦恼', next: 'li_3', effect: { affection: { li: 3 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_3',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '李自清',
    text: '你坐在李自清身边，听他诉说心事。\n\n「姜嫣，你知道吗？」李自清的声音带着一丝苦涩，「我虽然是皇帝，却什么都做不了。」\n\n「朝中大事，全由摄政王做主。我就像一个傀儡，一个摆设。」\n\n他转过头，目光认真地看着你，「但你不一样。你看我的眼神，没有恐惧，没有谄媚，只有...平等。」',
    choices: [
        { text: '安慰他', next: 'li_4', effect: { affection: { li: 3 } } },
        { text: '鼓励他', next: 'li_4', effect: { affection: { li: 4 } } },
        { text: '告诉他真相', next: 'li_4', effect: { affection: { li: 2 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_4',
    scene: '皇宫 · 书房',
    background: BG_PALACE,
    character: '旁白',
    text: '从那以后，你经常入宫陪伴李自清。\n\n你教他读书写字，陪他下棋聊天，成为了他最信任的人。\n\n这天，李自清偷偷告诉你一个秘密。\n\n「姜嫣，我不想再做傀儡了。」他的眼中闪过一丝坚定，「我想真正掌握皇权。」',
    choices: [
        { text: '支持他的决定', next: 'li_5', effect: { affection: { li: 5 } } },
        { text: '劝他等待时机', next: 'li_5', effect: { affection: { li: 3 } } },
        { text: '帮他制定计划', next: 'li_5', effect: { affection: { li: 5 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_5',
    scene: '皇宫 · 书房',
    background: BG_PALACE,
    character: '李自清',
    text: '在你的帮助下，李自清开始暗中培养自己的势力。\n\n他利用课余时间学习治国之道，结交朝中正直的大臣，一步步积蓄力量。\n\n「嫣儿，」李自清握住你的手，目光温柔，「谢谢你。如果没有你，我可能一辈子都只是一个傀儡。」\n\n「你是我生命中最重要的人。」',
    choices: [
        { text: '鼓励他继续努力', next: 'li_6', effect: { affection: { li: 3 } } },
        { text: '告诉他你会一直陪着他', next: 'li_6', effect: { affection: { li: 5 } } },
        { text: '提醒他小心行事', next: 'li_6', effect: { affection: { li: 3 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_6',
    scene: '皇宫 · 朝堂',
    background: BG_PALACE,
    character: '旁白',
    text: '时机终于成熟。\n\n李自清在朝堂上突然发难，联合朝中大臣，一举夺回了皇权。\n\n萧若河看着眼前的少年皇帝，眼中闪过一丝惊讶，随即露出了欣慰的笑容。\n\n「皇上...长大了。」\n\n李自清站在金銮殿上，目光坚定，「从今天起，朕要做一个真正的皇帝！」',
    choices: [
        { text: '为他高兴', next: 'li_7', effect: { affection: { li: 3 } } },
        { text: '提醒他任重道远', next: 'li_7', effect: { affection: { li: 4 } } },
        { text: '站在他身边', next: 'li_7', effect: { affection: { li: 5 } } }
    ],
    characters: { center: LI_IMG, right: XIAO_IMG }
});

registerNode({
    id: 'li_7',
    scene: '皇宫 · 寝宫',
    background: BG_PALACE,
    character: '李自清',
    text: '深夜，李自清来到你的住处。\n\n「嫣儿，」他的声音带着一丝紧张，「朕...有件事想告诉你。」\n\n「皇上请说。」\n\n李自清深吸一口气，「朕想立你为后。」\n\n他握住你的手，目光认真，「你是朕的知己，是朕的爱人，是朕生命中最重要的人。朕不能没有你。」',
    choices: [
        { text: '答应他', next: 'li_check_ending', effect: { affection: { li: 5 } } },
        { text: '感动落泪', next: 'li_check_ending', effect: { affection: { li: 4 } } },
        { text: '告诉他你也爱他', next: 'li_check_ending', effect: { affection: { li: 5 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_check_ending',
    scene: '皇宫',
    background: BG_PALACE,
    character: '旁白',
    text: '你和李自清的故事即将迎来结局...',
    choices: [
        { text: '查看结局', next: 'li_ending_decision' }
    ],
    characters: {}
});

registerNode({
    id: 'li_ending_decision',
    scene: '皇宫',
    background: BG_PALACE,
    character: '旁白',
    text: '',
    choices: [],
    characters: {},
    onLoad: function() {
        const aff = getAffection('li');
        if (aff >= 80) {
            renderNode('li_ending_he');
        } else if (aff >= 60) {
            renderNode('li_ending_normal');
        } else if (aff >= 40) {
            renderNode('li_ending_be');
        } else {
            renderNode('li_ending_single');
        }
    }
});

registerNode({
    id: 'li_ending_he',
    scene: '皇宫 · 后花园',
    background: BG_PALACE,
    character: '旁白',
    text: '李自清终于成为了一代明君。\n\n他励精图治，整顿朝纲，让大炎王朝走向了繁荣昌盛。\n\n而你，成为了他最爱的皇后，陪伴他度过每一个日日夜夜。\n\n「嫣儿，」李自清从身后拥住你，「有你在身边，朕才觉得这江山有了意义。」\n\n你靠在他肩上，感受着他的温暖，心中充满了幸福。',
    isEnding: true,
    ending: {
        title: '盛世帝王',
        text: '李自清在你的辅佐下，一步步夺回皇权，成为一代明君。他站在金銮殿上，目光穿越重重宫墙，只为寻找那个曾经给他温暖的身影。「嫣儿，江山为聘，许你一世荣华。」'
    },
    characters: { center: LI_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_ending_normal',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '你成为了皇后，虽身处深宫，却也得到了帝王的宠爱。\n\n李自清会在繁忙的政务之余，陪你看一场烟花，为你写一首诗。\n\n宫中的日子虽然平淡，却也充满了温情。\n\n你知道，他是真心喜欢你的。',
    isEnding: true,
    ending: {
        title: '宫闱深深',
        text: '你成为了皇后，虽身处深宫，却也得到了帝王的宠爱。李自清会在繁忙的政务之余，陪你看一场烟花。宫中的日子虽然平淡，却也充满了温情。'
    },
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_ending_be',
    scene: '皇宫 · 冷宫',
    background: BG_PALACE,
    character: '旁白',
    text: '朝堂之上，你被诬陷为祸国妖妃。\n\n李自清在皇权与你之间选择了前者。\n\n你被打入冷宫，最终饮下毒酒，含笑赴死。\n\n「陛下，若有来生，别再相遇了。」\n\n你的眼中没有怨恨，只有释然。',
    isEnding: true,
    ending: {
        title: '红颜祸水',
        text: '朝堂之上，你被诬陷为祸国妖妃。李自清在皇权与你之间选择了前者，你饮下毒酒，含笑赴死。「陛下，若有来生，别再相遇了。」'
    },
    characters: { center: PROTAGONIST_IMG }
});

registerNode({
    id: 'li_ending_single',
    scene: '民间 · 小镇',
    background: BG_STREET,
    character: '旁白',
    text: '你最终选择了离开皇宫，回到民间。\n\n在一个宁静的小镇上，你开了一家私塾，教导孩子们读书写字。\n\n偶尔，你会在市集上听到关于皇帝的消息，但那已经与你无关了。\n\n你选择了自由，也选择了孤独。',
    isEnding: true,
    ending: {
        title: '归隐民间',
        text: '你最终选择了离开皇宫，回到民间。在一个宁静的小镇上，你开了一家私塾，教导孩子们读书写字。你选择了自由，也选择了孤独。'
    },
    characters: { center: PROTAGONIST_IMG }
});