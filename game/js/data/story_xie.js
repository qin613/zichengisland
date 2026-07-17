registerNode({
    id: 'xie_1',
    scene: '谢家府邸',
    background: BG_XIE,
    character: '旁白',
    text: '谢家府邸，雅致清幽，处处透着书香门第的韵味。\n\n你来到门口，递上拜帖。谢家的管家很有礼貌地接待了你。\n\n「姜姑娘，公子正在书房看书，请随我来。」\n\n穿过花园，你来到了一间雅致的书房。\n\n谢玉衡正坐在窗前，手持书卷，阳光洒在他身上，宛如画中仙人。',
    choices: [
        { text: '轻声敲门', next: 'xie_2', effect: { affection: { xie: 3 } } },
        { text: '在门口等待', next: 'xie_2', effect: { affection: { xie: 2 } } },
        { text: '直接走入', next: 'xie_2', effect: { affection: { xie: 1 } } }
    ],
    characters: { left: XIE_IMG }
});

registerNode({
    id: 'xie_2',
    scene: '谢家府邸 · 书房',
    background: BG_XIE,
    character: '谢玉衡',
    text: '谢玉衡抬起头，看到你，眼中闪过一丝惊喜。\n\n「姜姑娘？」他放下书卷，站起身来，「什么风把你吹来了？」\n\n「听闻谢家公子学识渊博，特来请教。」你微笑。\n\n谢玉衡微微一笑，「姑娘客气了。请坐，我给姑娘煮杯茶。」',
    choices: [
        { text: '坐下等待', next: 'xie_3', effect: { affection: { xie: 2 } } },
        { text: '帮忙煮茶', next: 'xie_3', effect: { affection: { xie: 4 } } },
        { text: '欣赏书房的字画', next: 'xie_3', effect: { affection: { xie: 3 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_3',
    scene: '谢家府邸 · 书房',
    background: BG_XIE,
    character: '谢玉衡',
    text: '茶香袅袅，谢玉衡为你倒了一杯茶。\n\n「姑娘尝尝，这是今年的新茶。」\n\n你端起茶杯，轻抿一口，「好茶。公子对茶道也有研究？」\n\n「略知一二。」谢玉衡温和地笑，「比起茶道，我更欣赏姑娘的气度。」\n\n「那日在赏花宴上，姑娘面对摄政王和皇上，从容自若，实在难得。」',
    choices: [
        { text: '谦虚回应', next: 'xie_4', effect: { affection: { xie: 3 } } },
        { text: '直言自己的想法', next: 'xie_4', effect: { affection: { xie: 4 } } },
        { text: '询问他的看法', next: 'xie_4', effect: { affection: { xie: 3 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_4',
    scene: '谢家府邸 · 花园',
    background: BG_XIE,
    character: '谢玉衡',
    text: '谢玉衡带你来到后花园，园中种满了兰花和翠竹，清幽雅致。\n\n「姜姑娘，」谢玉衡停下脚步，目光认真地看着你，「我有一个问题想问你。」\n\n「公子请说。」\n\n「你...为什么会改变？」谢玉衡的眼中带着一丝探究，「我听说，以前的姜嫣和现在判若两人。」',
    choices: [
        { text: '坦诚相告', next: 'xie_5', effect: { affection: { xie: 5 } } },
        { text: '委婉回避', next: 'xie_5', effect: { affection: { xie: 2 } } },
        { text: '反问他的感受', next: 'xie_5', effect: { affection: { xie: 4 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_5',
    scene: '谢家府邸 · 花园',
    background: BG_XIE,
    character: '谢玉衡',
    text: '谢玉衡听完你的话，沉默了片刻。\n\n最终，他微微一笑，「无论你是谁，我都喜欢。」\n\n「从我第一眼看到你，我就知道，你不是一个普通的女子。」\n\n他走到你身边，轻轻握住你的手，「嫣儿，让我守护你，好吗？」',
    choices: [
        { text: '接受他的感情', next: 'xie_6', effect: { affection: { xie: 5 } } },
        { text: '考虑一下', next: 'xie_6', effect: { affection: { xie: 3 } } },
        { text: '询问他的真心', next: 'xie_6', effect: { affection: { xie: 4 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_6',
    scene: '谢家府邸 · 书房',
    background: BG_XIE,
    character: '旁白',
    text: '日子一天天过去，你和谢玉衡的感情越来越深。\n\n他会为你抚琴，你会为他研墨，两人常常一起看书品茶，度过一段段美好的时光。\n\n这天，谢玉衡收到一封家书，脸色变得凝重。\n\n「怎么了？」你关切地问。',
    choices: [
        { text: '关心他的状况', next: 'xie_7', effect: { affection: { xie: 3 } } },
        { text: '帮他分析', next: 'xie_7', effect: { affection: { xie: 4 } } },
        { text: '默默陪伴', next: 'xie_7', effect: { affection: { xie: 2 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_7',
    scene: '谢家府邸 · 书房',
    background: BG_XIE,
    character: '谢玉衡',
    text: '「朝中有人想拉拢谢家。」谢玉衡皱眉，「父亲让我回去商议对策。」\n\n「你不想卷入朝堂纷争？」你问。\n\n「我只想和你过平静的日子。」谢玉衡握住你的手，目光坚定，「但如果有人想伤害你，我绝不会坐视不管。」',
    choices: [
        { text: '支持他的决定', next: 'xie_8', effect: { affection: { xie: 4 } } },
        { text: '帮他想办法', next: 'xie_8', effect: { affection: { xie: 5 } } },
        { text: '劝他远离纷争', next: 'xie_8', effect: { affection: { xie: 3 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_8',
    scene: '谢家府邸 · 花园',
    background: BG_XIE,
    character: '谢玉衡',
    text: '在你的帮助下，谢玉衡成功化解了家族危机，让谢家远离了朝堂纷争。\n\n这天，他带你来到了一片竹林。\n\n「嫣儿，」谢玉衡从袖中取出一支玉簪，「这支簪子是我母亲留下的，现在，我想送给你。」\n\n「你愿意...嫁给我吗？」',
    choices: [
        { text: '欣然答应', next: 'xie_check_ending', effect: { affection: { xie: 5 } } },
        { text: '感动落泪', next: 'xie_check_ending', effect: { affection: { xie: 4 } } },
        { text: '为他戴上簪子', next: 'xie_check_ending', effect: { affection: { xie: 5 } } }
    ],
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_check_ending',
    scene: '谢家府邸',
    background: BG_XIE,
    character: '旁白',
    text: '你和谢玉衡的故事即将迎来结局...',
    choices: [
        { text: '查看结局', next: 'xie_ending_decision' }
    ],
    characters: {}
});

registerNode({
    id: 'xie_ending_decision',
    scene: '谢家府邸',
    background: BG_XIE,
    character: '旁白',
    text: '',
    choices: [],
    characters: {},
    onLoad: function() {
        const aff = getAffection('xie');
        if (aff >= 80) {
            renderNode('xie_ending_he');
        } else if (aff >= 60) {
            renderNode('xie_ending_normal');
        } else if (aff >= 40) {
            renderNode('xie_ending_be');
        } else {
            renderNode('xie_ending_single');
        }
    }
});

registerNode({
    id: 'xie_ending_he',
    scene: '江南 · 山水之间',
    background: BG_XIE,
    character: '旁白',
    text: '谢玉衡放下家族重担，与你携手游历天下。\n\n你们去过江南水乡，看过塞北风光，走过无数名山大川。\n\n在一处风景秀丽的山谷中，你们建了一座小屋，过着世外桃源般的生活。\n\n「嫣儿，你看，这里的风景多美。」谢玉衡为你煮茶，笑容温润。\n\n「有你在的地方，都是最美的风景。」你靠在他身边，心中充满了幸福。',
    isEnding: true,
    ending: {
        title: '山水之间',
        text: '谢玉衡放下家族重担，与你携手游历天下。他为你抚琴，你为他研墨，江南烟雨、塞北风沙，都成为你们爱情的见证。「玉衡此生，唯愿与卿共赏山水。」'
    },
    characters: { center: XIE_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_ending_normal',
    scene: '谢家府邸',
    background: BG_XIE,
    character: '旁白',
    text: '你成为了谢家主母，谢玉衡对你温柔体贴，虽不及轰轰烈烈，却也是细水长流。\n\n他常说，平淡才是真。你们每天一起看书、品茶、赏花，日子过得平静而幸福。\n\n偶尔，他会为你弹奏一曲，你则为他研磨写字，岁月静好。',
    isEnding: true,
    ending: {
        title: '名门淑媛',
        text: '你成为了谢家主母，谢玉衡对你温柔体贴，虽不及轰轰烈烈，却也是细水长流。他常说，平淡才是真。你们每天一起看书、品茶、赏花，日子过得平静而幸福。'
    },
    characters: { left: XIE_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_ending_be',
    scene: '谢家府邸 · 灵堂',
    background: BG_XIE,
    character: '旁白',
    text: '谢玉衡为保护你卷入朝堂纷争，最终身陨。\n\n你守着他留下的折扇，度过余生。\n\n「玉衡，若有来生，愿我们只是寻常人家。」\n\n你轻轻抚摸着折扇上的竹纹，泪水无声滑落。',
    isEnding: true,
    ending: {
        title: '情深不寿',
        text: '谢玉衡为保护你卷入朝堂纷争，最终身陨。你守着他留下的折扇，度过余生。「玉衡，若有来生，愿我们只是寻常人家。」'
    },
    characters: { center: PROTAGONIST_IMG }
});

registerNode({
    id: 'xie_ending_single',
    scene: '江南 · 西湖',
    background: BG_XIE,
    character: '旁白',
    text: '你最终选择了离开京城，独自前往江南。\n\n西湖边，你开了一家小小的茶馆，过着平静的生活。\n\n偶尔，你会想起谢玉衡温润的笑容，但那已经是很久以前的事了。\n\n或许，有些缘分注定只能错过。',
    isEnding: true,
    ending: {
        title: '独自飘零',
        text: '你最终选择了离开京城，独自前往江南。西湖边，你开了一家小小的茶馆，过着平静的生活。偶尔，你会想起谢玉衡温润的笑容，但那已经是很久以前的事了。'
    },
    characters: { center: PROTAGONIST_IMG }
});