registerNode({
    id: 'main_1',
    scene: '姜府 · 大厅',
    background: BG_JIANGFU,
    character: '旁白',
    text: '三日后，赏花宴当日。\n\n柳氏带着姜柔准备出发，却被你拦在了门口。\n\n「母亲，女儿也想去赏花宴。」你语气平静，目光坚定。\n\n柳氏愣住了，随即冷笑，「你？一个庶女，也配去参加赏花宴？」\n\n姜柔也在一旁嘲讽，「妹妹，你还是乖乖待在家里吧，别出去丢人现眼。」',
    choices: [
        { text: '以理据争，坚持参加', next: 'main_2', effect: { affection: { xiao: 2 } } },
        { text: '找父亲帮忙', next: 'main_2', effect: { affection: { xie: 2 } } },
        { text: '用计说服柳氏', next: 'main_2', effect: { affection: { li: 2 } } }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_2',
    scene: '姜府 · 大厅',
    background: BG_JIANGFU,
    character: '旁白',
    text: '无论你用何种方式，最终柳氏都不得不同意你一同前往。\n\n毕竟，姜府的面子还是要顾的。若是传出去姜府连个庶女都容不下，未免太过难看。\n\n你换上了一身素净的衣裙，虽然不及姜柔的华丽，却自有一番清雅气质。\n\n春桃帮你整理着裙摆，眼中满是期待，「小姐，您一定会惊艳全场的！」',
    choices: [
        { text: '微微一笑，信心十足', next: 'main_3' },
        { text: '提醒春桃低调行事', next: 'main_3' },
        { text: '思考宴会可能遇到的人', next: 'main_3' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_3',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '皇宫御花园内，百花齐放，美不胜收。\n\n达官显贵们谈笑风生，衣香鬓影，好不热闹。\n\n你跟在柳氏和姜柔身后，不动声色地观察着四周。\n\n忽然，一阵骚动传来。人群自动分开一条道路，一个身穿玄色锦袍的男子缓缓走来。\n\n他面容俊美，气质清冷，周身散发着一股不怒自威的气息。\n\n「是摄政王萧若河！」',
    choices: [
        { text: '远远观察，不引人注目', next: 'main_4', effect: { affection: { xiao: 3 } } },
        { text: '主动上前打招呼', next: 'main_4', effect: { affection: { xiao: 5 } } },
        { text: '装作没看见，继续赏花', next: 'main_4', effect: { affection: { xiao: 1 } } }
    ],
    characters: { right: XIAO_IMG, center: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_4',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '萧若河',
    text: '萧若河的目光似乎不经意地扫过人群，最终落在了你身上。\n\n那目光深邃如寒潭，仿佛能看透人心。\n\n「你是...姜府的？」他开口，声音低沉悦耳，却带着一丝不易察觉的审视。\n\n柳氏连忙上前，「回摄政王，这是臣妇的庶女，姜嫣。」\n\n「姜嫣...」萧若河轻轻念着你的名字，目光再次落在你身上，似乎带着一丝探究。',
    choices: [
        { text: '行礼问好，不卑不亢', next: 'main_5', effect: { affection: { xiao: 5 } } },
        { text: '沉默不语，保持神秘', next: 'main_5', effect: { affection: { xiao: 3 } } },
        { text: '主动介绍自己', next: 'main_5', effect: { affection: { xiao: 2 } } }
    ],
    characters: { right: XIAO_IMG, center: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_5',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '就在这时，一个温润如玉的声音传来。\n\n「若河兄，好久不见。」\n\n一个身穿青白色锦袍的男子缓步走来，手持折扇，面容俊雅，气质超凡。\n\n「是谢家公子，谢玉衡！」\n\n谢玉衡的目光在你身上停留了一瞬，随即微微一笑，「这位姑娘是？」',
    choices: [
        { text: '自我介绍', next: 'main_6', effect: { affection: { xie: 5 } } },
        { text: '由柳氏介绍', next: 'main_6', effect: { affection: { xie: 3 } } },
        { text: '点头示意', next: 'main_6', effect: { affection: { xie: 4 } } }
    ],
    characters: { left: XIE_IMG, right: XIAO_IMG, center: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_6',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '谢玉衡',
    text: '「姜姑娘，幸会。」谢玉衡微微颔首，目光温和，「方才见姜姑娘气度不凡，不知可否有幸请姑娘共赏牡丹？」\n\n柳氏和姜柔的脸色都变了。谢玉衡乃是京城第一才子，多少名门闺秀想要亲近都不得其门而入，如今竟然主动邀请你？\n\n姜柔更是嫉妒得快要发疯。',
    choices: [
        { text: '欣然同意', next: 'main_7', effect: { affection: { xie: 5 } } },
        { text: '婉言谢绝', next: 'main_7', effect: { affection: { xie: 2 } } },
        { text: '询问萧若河的意见', next: 'main_7', effect: { affection: { xiao: 3, xie: 2 } } }
    ],
    characters: { left: XIE_IMG, right: XIAO_IMG, center: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_7',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '就在这时，一阵清脆的铃声响起。\n\n「皇上驾到！」\n\n众人纷纷行礼。一个身穿明黄色龙袍的少年缓步走来，看起来不过十五六岁的年纪，面容俊秀，眼神中却带着一丝与年龄不符的深沉。\n\n他就是大炎王朝的少年皇帝，李自清。\n\n李自清的目光在人群中扫过，最终落在了你身上，微微一愣。',
    choices: [
        { text: '规规矩矩行礼', next: 'main_8', effect: { affection: { li: 3 } } },
        { text: '偷偷观察皇帝', next: 'main_8', effect: { affection: { li: 5 } } },
        { text: '保持镇定，不动声色', next: 'main_8', effect: { affection: { li: 4 } } }
    ],
    characters: { center: LI_IMG }
});

registerNode({
    id: 'main_8',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '李自清',
    text: '「抬起头来。」李自清的声音稚嫩却带着帝王的威严。\n\n你缓缓抬起头，目光平静地与他对视。\n\n李自清的眼神闪烁了一下，似乎有些慌乱，随即恢复平静，「你是哪家的姑娘？」\n\n「回皇上，臣女姜嫣，姜府庶女。」',
    choices: [
        { text: '保持恭敬', next: 'main_9', effect: { affection: { li: 3 } } },
        { text: '目光坚定，不卑不亢', next: 'main_9', effect: { affection: { li: 5 } } },
        { text: '微微低下头', next: 'main_9', effect: { affection: { li: 2 } } }
    ],
    characters: { center: LI_IMG, right: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_9',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '赏花宴继续进行。\n\n你已经成功引起了三位男主的注意。萧若河的深沉探究，谢玉衡的温润关注，李自清的异样目光...\n\n就在这时，一个消息传来——敌国将军楚昭云率使团前来，不日将抵达京城。\n\n「楚昭云？那个传说中桀骜不驯的少年将军？」\n\n「听说他年仅二十，却已经横扫沙场，战无不胜！」\n\n众人议论纷纷，你心中也产生了一丝好奇。',
    choices: [
        { text: '关注楚昭云的消息', next: 'main_10', effect: { affection: { chu: 3 } } },
        { text: '继续与谢玉衡交谈', next: 'main_10', effect: { affection: { xie: 3 } } },
        { text: '找机会接近萧若河', next: 'main_10', effect: { affection: { xiao: 3 } } }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'main_10',
    scene: '皇宫 · 御花园',
    background: BG_PALACE,
    character: '旁白',
    text: '赏花宴结束后，你回到姜府。\n\n柳氏的态度明显好了一些，毕竟你今日在宫中表现不俗，为姜府争了面子。\n\n姜柔则对你更加敌视，眼中的恨意几乎要溢出来。\n\n你并不在意这些，心中已经开始规划下一步。\n\n四位男主，四条不同的命运线。你的选择，将决定你的未来。',
    choices: [
        { text: '前往摄政王府', next: 'xiao_1' },
        { text: '前往谢家府邸', next: 'xie_1' },
        { text: '寻找机会入宫', next: 'li_1' },
        { text: '等待楚昭云到来', next: 'chu_1' }
    ],
    characters: { right: PROTAGONIST_IMG }
});