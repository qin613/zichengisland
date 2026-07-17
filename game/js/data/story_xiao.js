registerNode({
    id: 'xiao_1',
    scene: '摄政王府',
    background: BG_REGENT,
    character: '旁白',
    text: '摄政王府，气势恢宏，却又带着一丝清冷孤寂。\n\n你递上拜帖，门口的侍卫打量了你一番，最终还是进去通报了。\n\n片刻后，侍卫出来，「王爷请姑娘进去。」\n\n你踏入王府，穿过重重院落，最终来到了书房门前。\n\n书房内，萧若河正坐在案前批阅奏折，听到脚步声，头也不抬，「你来了。」',
    choices: [
        { text: '直接说明来意', next: 'xiao_2', effect: { affection: { xiao: 2 } } },
        { text: '先观察书房环境', next: 'xiao_2', effect: { affection: { xiao: 3 } } },
        { text: '等待他先开口', next: 'xiao_2', effect: { affection: { xiao: 2 } } }
    ],
    characters: { right: XIAO_IMG }
});

registerNode({
    id: 'xiao_2',
    scene: '摄政王府 · 书房',
    background: BG_REGENT,
    character: '萧若河',
    text: '萧若河终于抬起头，目光深邃地看着你。\n\n「姜嫣...」他轻轻念着你的名字，「你和我想象中的不太一样。」\n\n「哦？王爷想象中我是什么样子？」你反问。\n\n「懦弱、胆小、任人欺凌。」萧若河直言不讳，「但那天在赏花宴上，我看到的是一个冷静、聪慧、不卑不亢的女子。」',
    choices: [
        { text: '承认自己的改变', next: 'xiao_3', effect: { affection: { xiao: 3 } } },
        { text: '保持神秘', next: 'xiao_3', effect: { affection: { xiao: 2 } } },
        { text: '反问他为什么关注你', next: 'xiao_3', effect: { affection: { xiao: 3 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_3',
    scene: '摄政王府 · 书房',
    background: BG_REGENT,
    character: '萧若河',
    text: '萧若河放下手中的笔，站起身来，缓步走到你面前。\n\n他很高，身形挺拔，玄色锦袍衬得他更加清冷俊逸。\n\n「因为你很有趣。」他的声音低沉，「这世上敢直视我的人不多，你是其中一个。」\n\n他的目光落在你身上，带着一丝探究，「告诉我，姜嫣，你到底是谁？」',
    choices: [
        { text: '坦诚相告（暗示穿越）', next: 'xiao_4', effect: { affection: { xiao: 5 } } },
        { text: '用谎言掩饰', next: 'xiao_4', effect: { affection: { xiao: 1 } } },
        { text: '反问他的身份和目的', next: 'xiao_4', effect: { affection: { xiao: 3 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_4',
    scene: '摄政王府 · 书房',
    background: BG_REGENT,
    character: '旁白',
    text: '萧若河听完你的话，沉默了良久。\n\n最终，他露出了一个极淡的笑容，「不管你是谁，我喜欢。」\n\n你微微一怔，没想到他会说出这样的话。\n\n「从今天起，你就是我的人。」萧若河的语气不容置疑，「在这京城，没有人敢动我的人。」',
    choices: [
        { text: '接受他的庇护', next: 'xiao_5', effect: { affection: { xiao: 4 } } },
        { text: '婉言谢绝', next: 'xiao_5', effect: { affection: { xiao: 2 } } },
        { text: '提出条件', next: 'xiao_5', effect: { affection: { xiao: 3 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_5',
    scene: '摄政王府 · 花园',
    background: BG_REGENT,
    character: '旁白',
    text: '日子一天天过去，你和萧若河的关系越来越近。\n\n他虽然依旧清冷寡言，但对你却格外温柔。会为你煮茶，会陪你看星星，会在你遇到危险时第一时间出现。\n\n这天，你们在王府花园散步，萧若河突然停下脚步，转身看向你。\n\n「嫣儿，」他第一次这样叫你，「我有件事要告诉你。」',
    choices: [
        { text: '认真倾听', next: 'xiao_6', effect: { affection: { xiao: 3 } } },
        { text: '感觉到他的郑重', next: 'xiao_6', effect: { affection: { xiao: 4 } } },
        { text: '握住他的手', next: 'xiao_6', effect: { affection: { xiao: 5 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_6',
    scene: '摄政王府 · 花园',
    background: BG_REGENT,
    character: '萧若河',
    text: '「我要扶皇帝亲政。」萧若河的语气平静，却带着坚定，「朝中老臣把持朝政，皇帝年幼，我必须尽快帮他站稳脚跟。」\n\n「这很危险。」你皱眉。\n\n「我知道。」萧若河握住你的手，他的手掌宽大温暖，「但有你在，我无所畏惧。」\n\n「无论发生什么，我都会保护你。」他的眼中闪过一丝柔情，「这是我对你的承诺。」',
    choices: [
        { text: '支持他的决定', next: 'xiao_7', effect: { affection: { xiao: 4 } } },
        { text: '帮他出谋划策', next: 'xiao_7', effect: { affection: { xiao: 5 } } },
        { text: '担心他的安全', next: 'xiao_7', effect: { affection: { xiao: 3 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_7',
    scene: '皇宫 · 朝堂',
    background: BG_PALACE,
    character: '旁白',
    text: '在你的帮助下，萧若河一步步扫清了朝中障碍。\n\n他以雷霆手段除掉了几个把持朝政的老臣，扶持李自清亲政。\n\n朝堂之上，萧若河站在李自清身边，一身玄色锦袍，气势逼人。\n\n「摄政王功不可没！」群臣跪拜。\n\n李自清看向萧若河，目光复杂，「皇叔，朕...」',
    choices: [
        { text: '站在萧若河身边', next: 'xiao_8', effect: { affection: { xiao: 3 } } },
        { text: '观察局势', next: 'xiao_8', effect: { affection: { xiao: 2 } } },
        { text: '为萧若河说话', next: 'xiao_8', effect: { affection: { xiao: 4 } } }
    ],
    characters: { right: XIAO_IMG, center: LI_IMG }
});

registerNode({
    id: 'xiao_8',
    scene: '摄政王府',
    background: BG_REGENT,
    character: '萧若河',
    text: '一切尘埃落定后，萧若河带你来到了王府的最高处。\n\n远处是京城的万家灯火，近处是王府的静谧庭院。\n\n「嫣儿，」萧若河从背后拥住你，「从今天起，我不再是摄政王，只是你的夫君。」\n\n「江山已经稳固，我可以安心陪你了。」他的声音温柔，「这一世，我只要你。」',
    choices: [
        { text: '转身拥抱他', next: 'xiao_check_ending', effect: { affection: { xiao: 5 } } },
        { text: '感动落泪', next: 'xiao_check_ending', effect: { affection: { xiao: 4 } } },
        { text: '许诺一生', next: 'xiao_check_ending', effect: { affection: { xiao: 5 } } }
    ],
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_check_ending',
    scene: '摄政王府',
    background: BG_REGENT,
    character: '旁白',
    text: '你和萧若河的故事即将迎来结局...',
    choices: [
        { text: '查看结局', next: 'xiao_ending_decision' }
    ],
    characters: {}
});

registerNode({
    id: 'xiao_ending_decision',
    scene: '摄政王府',
    background: BG_REGENT,
    character: '旁白',
    text: '',
    choices: [],
    characters: {},
    onLoad: function() {
        const aff = getAffection('xiao');
        if (aff >= 80) {
            renderNode('xiao_ending_he');
        } else if (aff >= 60) {
            renderNode('xiao_ending_normal');
        } else if (aff >= 40) {
            renderNode('xiao_ending_be');
        } else {
            renderNode('xiao_ending_single');
        }
    }
});

registerNode({
    id: 'xiao_ending_he',
    scene: '摄政王府 · 桃花林',
    background: BG_REGENT,
    character: '旁白',
    text: '萧若河最终功成身退，携你归隐山林。\n\n他为你种下了十里桃花，每到春天，漫山遍野都是粉色的花海。\n\n「嫣儿，你看，这都是为你种的。」萧若河站在桃花树下，目光温柔地看着你。\n\n你走到他身边，握住他的手，「若河，此生有你，足矣。」\n\n清风拂过，花瓣飘落，你们相拥在花海之中，许下了一生一世的诺言。',
    isEnding: true,
    ending: {
        title: '权倾天下',
        text: '萧若河最终以雷霆手段扫清朝野障碍，扶持新君登基后，携你归隐山林。世人皆传摄政王功成身退，却不知那深山中，有他为你种下的十里桃花。他清冷的眼眸中，唯有对你才会绽放温柔——「此生，唯你一人。」'
    },
    characters: { center: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_ending_normal',
    scene: '摄政王府',
    background: BG_REGENT,
    character: '旁白',
    text: '你成为了摄政王妃，虽无轰轰烈烈的情爱，却也相敬如宾。\n\n萧若河待你始终温和有礼，偶尔在夜深人静时，会为你煮一壶热茶。\n\n这或许不是最炽热的爱情，却是最安稳的归宿。\n\n你坐在窗前，看着窗外的月光，心中平静而满足。',
    isEnding: true,
    ending: {
        title: '相敬如宾',
        text: '你成为了摄政王妃，虽无轰轰烈烈的情爱，却也相敬如宾。萧若河待你始终温和有礼，偶尔在夜深人静时，会为你煮一壶热茶。这或许不是最炽热的爱情，却是最安稳的归宿。'
    },
    characters: { right: XIAO_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xiao_ending_be',
    scene: '京城 · 城门',
    background: BG_STREET,
    character: '旁白',
    text: '朝堂之争愈演愈烈，萧若河为保你周全，将你送出京城。\n\n你站在城门口，望着他决绝离去的背影，知道此生再难相见。\n\n「若河...」你轻声呼唤，泪水滑落。\n\n有些爱，注定只能深埋心底。',
    isEnding: true,
    ending: {
        title: '咫尺天涯',
        text: '朝堂之争愈演愈烈，萧若河为保你周全，将你送出京城。你站在城门口，望着他决绝离去的背影，知道此生再难相见。有些爱，注定只能深埋心底。'
    },
    characters: { right: XIAO_IMG }
});

registerNode({
    id: 'xiao_ending_single',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '你最终选择了回到姜府，继续过着平静的生活。\n\n萧若河偶尔会派人送来礼物，但你们再也没有见过面。\n\n你知道，你们之间隔着太多的东西，身份、地位、责任...\n\n或许，这就是最好的结局。',
    isEnding: true,
    ending: {
        title: '独善其身',
        text: '你最终选择了回到姜府，继续过着平静的生活。萧若河偶尔会派人送来礼物，但你们再也没有见过面。你知道，你们之间隔着太多的东西。或许，这就是最好的结局。'
    },
    characters: { center: PROTAGONIST_IMG }
});