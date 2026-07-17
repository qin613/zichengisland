const PROTAGONIST_IMG = '2/女主.png';
const XIAO_IMG = '2/男主1.png';
const XIE_IMG = '2/男主2.png';
const LI_IMG = '2/男主3.png';
const CHU_IMG = '2/男主4.png';

const BG_JIANGFU = 'picture/微信图片_20260717003516_694_80.jpg';
const BG_PALACE = 'picture/微信图片_20260717003517_695_80.jpg';
const BG_REGENT = 'picture/微信图片_20260717003518_696_80.jpg';
const BG_XIE = 'picture/微信图片_20260717003519_697_80.jpg';
const BG_BATTLEFIELD = 'picture/微信图片_20260717003519_698_80.jpg';
const BG_STREET = 'picture/微信图片_20260717003520_699_80.jpg';

registerNode({
    id: 'prologue_1',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '痛。\n\n刺骨的寒意和撕裂般的头痛同时袭来，让你猛地睁开了眼睛。\n\n映入眼帘的不是熟悉的特工训练室，而是古色古香的床幔，绣着淡雅的兰花图案。空气中弥漫着淡淡的药味和陈旧木味。\n\n「这是...哪里？」',
    choices: [
        { text: '挣扎着坐起来', next: 'prologue_2' },
        { text: '仔细观察周围', next: 'prologue_2' },
        { text: '闭上眼睛，尝试理清思绪', next: 'prologue_2' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_2',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '就在这时，一股陌生的记忆如同潮水般涌入你的脑海——\n\n这里是大炎王朝，你是姜府的庶女，名唤姜嫣。生母早逝，父亲冷漠，正房嫡母苛待，同父嫡姐姜柔更是全城第一美人，备受宠爱。\n\n而原主，就在刚才，被嫡姐推下池塘，溺水身亡。\n\n「穿越...」你低声呢喃，作为21世纪顶级特工，你很快冷静下来。\n\n既来之，则安之。',
    choices: [
        { text: '接受现实，开始规划', next: 'prologue_3' },
        { text: '对原主的遭遇感到同情', next: 'prologue_3' },
        { text: '思考如何改变命运', next: 'prologue_3' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_3',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '房门被推开，一个穿着粗布衣裳的丫鬟端着药碗走了进来。\n\n「小姐，您醒了！太好了！」丫鬟喜极而泣，「奴婢这就去告诉夫人...」\n\n「等等。」你开口，声音虚弱却带着不容置疑的冷静。\n\n丫鬟愣住了，似乎从未听过你这样说话。',
    choices: [
        { text: '询问当前情况', next: 'prologue_4' },
        { text: '让她先不要声张', next: 'prologue_4' },
        { text: '观察丫鬟的反应', next: 'prologue_4' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_4',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '从丫鬟春桃口中，你得知了更多信息。\n\n原主从小性格懦弱，在府中备受欺凌。三天前，嫡姐姜柔故意挑衅，将她推下池塘。若不是春桃及时发现，恐怕早已魂归黄泉。\n\n「小姐，您这次落水...夫人说是您自己不小心...」春桃小声说道，眼眶泛红。\n\n你冷笑一声。自己不小心？这拙劣的谎言，也只有那个冷漠的父亲会相信。',
    choices: [
        { text: '安抚春桃，表明立场', next: 'prologue_5' },
        { text: '追问更多细节', next: 'prologue_5' },
        { text: '沉默思考对策', next: 'prologue_5' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_5',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '就在这时，门外传来一阵脚步声。\n\n一个衣着华丽的妇人走了进来，身后跟着几个仆人。她正是姜府的女主人，你的嫡母——柳氏。\n\n「哟，庶女醒了？」柳氏语气刻薄，上下打量着你，「既然醒了，就赶紧起来干活。别以为装病就能偷懒。」',
    choices: [
        { text: '隐忍不发，观察对方', next: 'prologue_6a', effect: { flags: { first_conflict: 'endure' }, stats: { wisdom: 2, malice: 1 } } },
        { text: '冷静反驳，不卑不亢', next: 'prologue_6b', effect: { flags: { first_conflict: 'fight' }, stats: { wisdom: 1, reputation: 2 } } },
        { text: '示弱装病，拖延时间', next: 'prologue_6c', effect: { flags: { first_conflict: 'weak' }, stats: { wisdom: 3, malice: 1 } } }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_6a',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '你沉默着，目光平静地看着柳氏。\n\n柳氏被你看得有些不自在，「怎么不说话？哑巴了？」\n\n「母亲，女儿刚醒，身体还很虚弱。」你声音平淡，没有丝毫怯意，「若是母亲执意要我现在干活，万一再出什么意外，父亲那边...」\n\n柳氏脸色一变，显然没想到你会说出这样的话。\n\n「哼！算你识相！」柳氏甩袖而去。',
    choices: [
        { text: '松了一口气', next: 'prologue_7' },
        { text: '分析局势', next: 'prologue_7' },
        { text: '安慰春桃', next: 'prologue_7' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_6b',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '「母亲这话就不对了。」你缓缓坐起身，目光锐利如刀，「女儿刚从鬼门关走了一遭，母亲不关心也罢，何必如此苛责？」\n\n「你！」柳氏没想到你竟敢反驳，气得浑身发抖，「反了天了！一个庶女也敢这样跟我说话！」\n\n「庶女也是父亲的女儿。」你语气平静，却字字有力，「母亲若执意为难，女儿不介意去父亲面前评评理。」\n\n柳氏脸色铁青，最终冷哼一声，带着仆人离开了。',
    choices: [
        { text: '眼神冰冷，暗藏杀机', next: 'prologue_7' },
        { text: '思考下一步计划', next: 'prologue_7' },
        { text: '安抚受惊的春桃', next: 'prologue_7' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_6c',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '你轻轻咳嗽几声，脸色苍白地靠在床头。\n\n「母亲...女儿...女儿实在难受...」你声音虚弱，眼中含泪，「求母亲...让女儿...再休息几日...」\n\n柳氏皱了皱眉，打量着你苍白的脸色，最终不耐烦地挥挥手，「罢了罢了，死不了就好。别装模作样！」\n\n说完，她便带着仆人离开了。\n\n春桃松了一口气，「小姐，您真聪明！」',
    choices: [
        { text: '微微一笑', next: 'prologue_7' },
        { text: '分析柳氏的态度', next: 'prologue_7' },
        { text: '思考长远对策', next: 'prologue_7' }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_7',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '柳氏离开后，春桃端来了药。\n\n「小姐，这药...」春桃犹豫着，「夫人让厨房熬的，会不会...」\n\n你接过药碗，闻了闻，嘴角勾起一抹冷笑。\n\n这药里，确实加了料。\n\n作为顶级特工，你对各种药物都有所了解。这药里加了少量的慢性毒药，长期服用，会让人日渐虚弱，最终悄无声息地死去。',
    choices: [
        { text: '当面揭穿，倒掉药碗', next: 'prologue_8', effect: { flags: { poison_choice: 'confront' }, stats: { strength: 2, reputation: 1, malice: 2 } } },
        { text: '假装喝下，暗中处理', next: 'prologue_8', effect: { flags: { poison_choice: 'hide' }, stats: { wisdom: 2, perception: 1, malice: 1 } } },
        { text: '留作证据，等待时机', next: 'prologue_8', effect: { flags: { poison_choice: 'evidence' }, stats: { wisdom: 3, perception: 2 } } }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_8',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '你做出了选择。无论是当面揭穿、暗中处理还是留作证据，你都展现出了与原主截然不同的冷静和智慧。\n\n春桃看着你的眼神，充满了敬佩和信赖。\n\n「小姐...您好像变了一个人...」春桃小声说道。\n\n你微微一笑，「人总是会变的。从今天起，我不再是那个任人欺凌的姜嫣。」\n\n窗外，阳光透过云层，洒下一缕金光。\n\n你的命运，从这一刻起，彻底改变。',
    choices: [
        { text: '开始修炼恢复身体', next: 'prologue_9', stats: { strength: 3, perception: 1 } },
        { text: '让春桃打探消息', next: 'prologue_9', stats: { wisdom: 2, reputation: 1 } },
        { text: '思考如何接近权力中心', next: 'prologue_9', stats: { wisdom: 3, malice: 1 } }
    ],
    characters: { right: PROTAGONIST_IMG }
});

registerNode({
    id: 'prologue_9',
    scene: '姜府 · 偏僻院落',
    background: BG_JIANGFU,
    character: '旁白',
    text: '几天后，你已经完全适应了这个身份。\n\n这天，春桃带来了一个消息——三日后，宫中将举办赏花宴，姜府也收到了请柬。\n\n「小姐，夫人说让大小姐去参加，您...」春桃欲言又止。\n\n赏花宴。这可是接触权贵的绝佳机会。\n\n你眼中闪过一丝精光。这或许就是你改变命运的第一步。',
    choices: [
        { text: '想办法参加赏花宴', next: 'main_1', stats: { reputation: 2, beauty: 1 } },
        { text: '先了解更多关于赏花宴的信息', next: 'main_1', stats: { wisdom: 2, perception: 2 } },
        { text: '制定详细计划', next: 'main_1', stats: { wisdom: 3, malice: 1 } }
    ],
    characters: { right: PROTAGONIST_IMG }
});