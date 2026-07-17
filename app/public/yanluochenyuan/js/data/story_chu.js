registerNode({
    id: 'chu_1',
    scene: '京城 · 城门',
    background: BG_STREET,
    character: '旁白',
    text: '楚昭云率使团抵达京城的消息传遍了大街小巷。\n\n你站在城门口，看着远处尘土飞扬，一支精锐的军队缓缓驶来。\n\n为首的少年将军身穿黑红战甲，面容俊美，气势凌厉，正是楚昭云。\n\n他的目光扫过人群，最终落在了你身上，微微一愣。',
    choices: [
        { text: '与他对视', next: 'chu_2', effect: { affection: { chu: 4 } } },
        { text: '低下头', next: 'chu_2', effect: { affection: { chu: 1 } } },
        { text: '转身离开', next: 'chu_2', effect: { affection: { chu: 2 } } }
    ],
    characters: { center: CHU_IMG }
});

registerNode({
    id: 'chu_2',
    scene: '客栈 · 房间',
    background: BG_STREET,
    character: '旁白',
    text: '当晚，你收到了一封密信，邀请你前往城外十里亭。\n\n你犹豫了一下，最终还是决定赴约。\n\n十里亭中，楚昭云正独自饮酒。\n\n看到你，他微微一笑，「姜姑娘，果然来了。」',
    choices: [
        { text: '询问他的目的', next: 'chu_3', effect: { affection: { chu: 3 } } },
        { text: '直接坐下', next: 'chu_3', effect: { affection: { chu: 4 } } },
        { text: '保持警惕', next: 'chu_3', effect: { affection: { chu: 2 } } }
    ],
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_3',
    scene: '城外 · 十里亭',
    background: BG_STREET,
    character: '楚昭云',
    text: '「姜姑娘，」楚昭云放下酒杯，目光认真地看着你，「我听说过你的事情。」\n\n「一个被欺凌的庶女，突然变得如此聪慧冷静。你...到底是什么人？」\n\n你沉默了片刻，「将军为何对我如此感兴趣？」\n\n「因为你很有趣。」楚昭云嘴角勾起一抹邪魅的笑容，「而且...我有种预感，我们之间会发生一些有趣的事情。」',
    choices: [
        { text: '坦诚相告', next: 'chu_4', effect: { affection: { chu: 5 } } },
        { text: '保持神秘', next: 'chu_4', effect: { affection: { chu: 3 } } },
        { text: '反问他的目的', next: 'chu_4', effect: { affection: { chu: 3 } } }
    ],
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_4',
    scene: '城外 · 十里亭',
    background: BG_STREET,
    character: '楚昭云',
    text: '楚昭云听完你的话，沉默了良久。\n\n最终，他哈哈大笑，「有意思！太有意思了！」\n\n「姜嫣，你是我见过最特别的女子。」他站起身来，走到你身边，「我喜欢你。」\n\n「不管你是谁，不管我们是敌是友，我都喜欢你。」',
    choices: [
        { text: '拒绝他', next: 'chu_5', effect: { affection: { chu: 1 } } },
        { text: '接受他', next: 'chu_5', effect: { affection: { chu: 5 } } },
        { text: '告诉他我们是敌人', next: 'chu_5', effect: { affection: { chu: 3 } } }
    ],
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_5',
    scene: '边关 · 战场',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '战火燃起。\n\n楚昭云率领敌军进攻大炎，两国开战。\n\n你站在城墙上，看着远处的战场，心中百感交集。\n\n「姜嫣，」楚昭云的声音从城外传来，「你真的要与我为敌吗？」',
    choices: [
        { text: '劝他退兵', next: 'chu_6', effect: { affection: { chu: 4 } } },
        { text: '与他对战', next: 'chu_6', effect: { affection: { chu: 1 } } },
        { text: '出城见他', next: 'chu_6', effect: { affection: { chu: 5 } } }
    ],
    characters: { center: CHU_IMG }
});

registerNode({
    id: 'chu_6',
    scene: '边关 · 战场',
    background: BG_BATTLEFIELD,
    character: '楚昭云',
    text: '你骑马来到战场中央，与楚昭云面对面。\n\n「楚昭云，」你看着他，「你为什么要发动战争？」\n\n「因为我想见到你。」楚昭云的目光深情，「只有这样，你才会正视我。」\n\n「你太傻了。」你叹了口气，「战争会让无数人失去生命。」\n\n「那你跟我走。」楚昭云伸出手，「只要你跟我走，我就退兵。」',
    choices: [
        { text: '跟他走', next: 'chu_7', effect: { affection: { chu: 5 } } },
        { text: '劝他放弃', next: 'chu_7', effect: { affection: { chu: 4 } } },
        { text: '拒绝他', next: 'chu_7', effect: { affection: { chu: 2 } } }
    ],
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_7',
    scene: '边关 · 营地',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '在你的劝说下，楚昭云最终同意退兵。\n\n两国达成和平协议，结束了这场战争。\n\n楚昭云跪在你面前，目光坚定，「嫣儿，我愿意为你放下手中的剑。」\n\n「从今往后，我不再是将军，不再是敌人，只是你的夫君。」',
    choices: [
        { text: '扶起他', next: 'chu_check_ending', effect: { affection: { chu: 5 } } },
        { text: '答应他', next: 'chu_check_ending', effect: { affection: { chu: 5 } } },
        { text: '告诉他你也爱他', next: 'chu_check_ending', effect: { affection: { chu: 5 } } }
    ],
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_check_ending',
    scene: '边关',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '你和楚昭云的故事即将迎来结局...',
    choices: [
        { text: '查看结局', next: 'chu_ending_decision' }
    ],
    characters: {}
});

registerNode({
    id: 'chu_ending_decision',
    scene: '边关',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '',
    choices: [],
    characters: {},
    onLoad: function() {
        const aff = getAffection('chu');
        if (aff >= 80) {
            renderNode('chu_ending_he');
        } else if (aff >= 60) {
            renderNode('chu_ending_normal');
        } else if (aff >= 40) {
            renderNode('chu_ending_be');
        } else {
            renderNode('chu_ending_single');
        }
    }
});

registerNode({
    id: 'chu_ending_he',
    scene: '草原 · 星空下',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '楚昭云最终率部归降，两国罢兵言和。\n\n他放下手中的长剑，与你携手来到了草原。\n\n星空下，你们躺在草地上，看着满天繁星。\n\n「嫣儿，」楚昭云握住你的手，「你知道吗？从第一眼看到你，我就知道，你是我命中注定的人。」\n\n「不管是敌人还是爱人，我都不会放开你的手。」\n\n你靠在他身边，感受着草原的清风，心中充满了幸福。',
    isEnding: true,
    ending: {
        title: '烽火情缘',
        text: '楚昭云率部归降，两国罢兵言和。他放下手中长剑，只为与你相守。「从今往后，我不再是将军，只是你的夫君。」'
    },
    characters: { center: CHU_IMG, left: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_ending_normal',
    scene: '边关 · 营地',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '战争结束，你们各自回归故土。\n\n虽不能相守，却也时常遥遥相望。\n\n每年春天，楚昭云都会派人送来塞外的野花。\n\n你知道，他心里一直有你。\n\n有些人，注定只能成为彼此心中最深的牵挂。',
    isEnding: true,
    ending: {
        title: '相望江湖',
        text: '战争结束，你们各自回归故土。虽不能相守，却也时常遥遥相望。每年春天，楚昭云都会派人送来塞外的野花。有些人，注定只能成为彼此心中最深的牵挂。'
    },
    characters: { center: CHU_IMG }
});

registerNode({
    id: 'chu_ending_be',
    scene: '战场 · 血泊中',
    background: BG_BATTLEFIELD,
    character: '旁白',
    text: '战场上，楚昭云为护你挡下致命一击。\n\n他躺在你怀中，最后一次温柔地看着你。\n\n「嫣儿，能遇见你，此生无憾。」\n\n鲜血染红了他的战甲，也染红了你的衣襟。\n\n你抱着他冰冷的身体，泪水无声滑落。',
    isEnding: true,
    ending: {
        title: '阴阳两隔',
        text: '战场上，楚昭云为护你挡下致命一击。他躺在你怀中，最后一次温柔地看着你。「嫣儿，能遇见你，此生无憾。」鲜血染红了他的战甲，也染红了你的衣襟。'
    },
    characters: { center: CHU_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'chu_ending_single',
    scene: '京城 · 繁华街道',
    background: BG_STREET,
    character: '旁白',
    text: '战争结束后，你选择了留在京城。\n\n你成为了一名出色的商人，在京城闯出了一片天地。\n\n偶尔，你会在市集上看到与楚昭云相似的身影，但那都不是他。\n\n你知道，有些缘分注定只能随风而逝。',
    isEnding: true,
    ending: {
        title: '繁华落尽',
        text: '战争结束后，你选择了留在京城。你成为了一名出色的商人，在京城闯出了一片天地。偶尔，你会在市集上看到与楚昭云相似的身影，但那都不是他。'
    },
    characters: { center: PROTAGONIST_IMG }
});