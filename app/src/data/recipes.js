/**
 * 内置中文家常菜食谱数据
 * 精选 36 道经典中式家常菜，覆盖各大分类
 * 零网络依赖，支持中文搜索
 *
 * 字段说明：
 * - id: 唯一标识（cn- 前缀表示中文食谱）
 * - name: 菜名
 * - category: 分类
 * - area: 菜系
 * - difficulty: 难度（简单/中等/较难）
 * - time: 烹饪时长（分钟）
 * - emoji: 代表 emoji（替代图片）
 * - color: 卡片配色
 * - desc: 简介
 * - ingredients: 食材清单 [{ name, amount }]
 * - steps: 烹饪步骤（字符串数组）
 * - tips: 烹饪小贴士
 */
export const CN_CATEGORIES = [
  '家常菜', '川菜', '粤菜', '汤羹', '凉菜', '主食', '素食', '甜品'
]

export const CN_RECIPES = [
  {
    id: 'cn-001',
    name: '番茄炒蛋',
    category: '家常菜',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🍅',
    color: '#ff6b6b',
    desc: '最经典的中式家常菜，酸甜可口，下饭神器',
    ingredients: [
      { name: '番茄', amount: '2 个' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '葱', amount: '1 根' },
      { name: '盐', amount: '适量' },
      { name: '糖', amount: '1 小勺' },
      { name: '食用油', amount: '2 汤匙' }
    ],
    steps: [
      '番茄洗净切块，鸡蛋打散加少许盐搅匀，葱切葱花',
      '热锅凉油，倒入蛋液，待边缘凝固后用铲子划散，盛出备用',
      '锅中留底油，下葱花爆香，放入番茄块翻炒',
      '炒至番茄出汁软烂，加糖和盐调味',
      '倒回鸡蛋翻炒均匀，撒上葱花即可出锅'
    ],
    tips: '鸡蛋要大火快炒保持嫩滑；番茄可提前用开水烫一下去皮口感更好'
  },
  {
    id: 'cn-002',
    name: '红烧肉',
    category: '家常菜',
    area: '家常',
    difficulty: '中等',
    time: 60,
    emoji: '🥩',
    color: '#a0522d',
    desc: '肥而不腻、入口即化的经典红烧肉',
    ingredients: [
      { name: '五花肉', amount: '500 克' },
      { name: '冰糖', amount: '30 克' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '料酒', amount: '2 汤匙' },
      { name: '姜', amount: '4 片' },
      { name: '葱', amount: '2 根' },
      { name: '八角', amount: '2 个' }
    ],
    steps: [
      '五花肉切成 3 厘米见方的块，冷水下锅焯水去血沫，捞出洗净',
      '锅中放少许油，下冰糖小火慢慢熬成琥珀色糖色',
      '放入肉块翻炒上色，加入姜、葱、八角',
      '加料酒、生抽、老抽翻炒均匀',
      '加入没过肉的开水，大火烧开后转小火炖 40 分钟',
      '最后大火收汁至浓稠即可'
    ],
    tips: '炒糖色要用小火，颜色变琥珀色立刻下肉，避免炒糊发苦'
  },
  {
    id: 'cn-003',
    name: '宫保鸡丁',
    category: '川菜',
    area: '川菜',
    difficulty: '中等',
    time: 25,
    emoji: '🌶️',
    color: '#e74c3c',
    desc: '麻辣鲜香、花生酥脆的经典川菜',
    ingredients: [
      { name: '鸡胸肉', amount: '300 克' },
      { name: '花生米', amount: '80 克' },
      { name: '干辣椒', amount: '10 个' },
      { name: '花椒', amount: '1 小把' },
      { name: '葱', amount: '2 根' },
      { name: '蒜', amount: '3 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '1 汤匙' },
      { name: '糖', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 汤匙' }
    ],
    steps: [
      '鸡肉切丁，加少许盐、料酒、淀粉腌制 10 分钟',
      '调碗汁：生抽、醋、糖、淀粉、少许水搅匀备用',
      '花生米用小火炒香或油炸至酥脆，盛出',
      '热锅凉油，下花椒、干辣椒小火煸出香味',
      '下鸡丁大火滑炒至变色，加蒜末、葱段翻炒',
      '倒入碗汁快速翻炒均匀，最后撒入花生米拌匀出锅'
    ],
    tips: '花生米最后放才能保持酥脆；碗汁要事先调好，下锅后快速翻炒'
  },
  {
    id: 'cn-004',
    name: '麻婆豆腐',
    category: '川菜',
    area: '川菜',
    difficulty: '简单',
    time: 20,
    emoji: '🥘',
    color: '#c0392b',
    desc: '麻、辣、烫、香、酥、嫩、鲜的经典川菜',
    ingredients: [
      { name: '嫩豆腐', amount: '1 块（约 400 克）' },
      { name: '牛肉末', amount: '100 克' },
      { name: '豆瓣酱', amount: '1.5 汤匙' },
      { name: '花椒', amount: '1 小把' },
      { name: '蒜苗', amount: '2 根' },
      { name: '姜', amount: '2 片' },
      { name: '蒜', amount: '2 瓣' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 汤匙' }
    ],
    steps: [
      '豆腐切成 2 厘米见方的块，放入加了盐的开水中焯烫 1 分钟，沥干',
      '花椒干锅小火焙香，碾成花椒粉备用',
      '热锅凉油，下牛肉末炒散至变色，加姜末、蒜末',
      '加豆瓣酱炒出红油，加一碗开水',
      '放入豆腐，加生抽，小火煮 3 分钟入味',
      '用水淀粉勾芡，撒蒜苗段，最后撒花椒粉即可'
    ],
    tips: '豆腐焯水可去豆腥味且不易碎；勾芡分两次，让豆腐裹满酱汁'
  },
  {
    id: 'cn-005',
    name: '鱼香肉丝',
    category: '川菜',
    area: '川菜',
    difficulty: '中等',
    time: 25,
    emoji: '🍖',
    color: '#d35400',
    desc: '酸甜微辣、没有鱼却有鱼香的经典川菜',
    ingredients: [
      { name: '猪里脊', amount: '250 克' },
      { name: '木耳', amount: '50 克' },
      { name: '胡萝卜', amount: '1 根' },
      { name: '青椒', amount: '1 个' },
      { name: '泡椒', amount: '4 个' },
      { name: '姜', amount: '3 片' },
      { name: '蒜', amount: '3 瓣' },
      { name: '葱', amount: '2 根' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '2 汤匙' },
      { name: '糖', amount: '1.5 汤匙' },
      { name: '淀粉', amount: '1 汤匙' }
    ],
    steps: [
      '猪肉切丝，加盐、料酒、淀粉抓匀腌制',
      '木耳泡发、胡萝卜、青椒切丝，姜蒜切末，泡椒剁碎',
      '调鱼香汁：生抽、醋、糖、淀粉、2 汤匙水搅匀',
      '热锅凉油，下肉丝滑散至变色盛出',
      '锅中留油，下泡椒、姜蒜末炒出红油',
      '下胡萝卜、木耳、青椒丝翻炒断生',
      '倒回肉丝，淋入鱼香汁大火快炒均匀即可'
    ],
    tips: '鱼香汁的灵魂是糖醋比例（约 1:1.3），泡椒要剁碎才出味'
  },
  {
    id: 'cn-006',
    name: '回锅肉',
    category: '川菜',
    area: '川菜',
    difficulty: '中等',
    time: 30,
    emoji: '🥬',
    color: '#e67e22',
    desc: '肥而不腻、香辣下饭的四川名菜',
    ingredients: [
      { name: '五花肉', amount: '400 克' },
      { name: '青蒜', amount: '150 克' },
      { name: '豆瓣酱', amount: '2 汤匙' },
      { name: '甜面酱', amount: '1 汤匙' },
      { name: '姜', amount: '3 片' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '生抽', amount: '1 汤匙' }
    ],
    steps: [
      '五花肉整块冷水下锅，加姜片、料酒煮至八成熟，捞出晾凉',
      '晾凉的肉切成薄片，青蒜切段',
      '锅烧热不放油，下肉片中小火煸炒出油至微微卷曲（灯盏窝）',
      '将肉拨到一边，下豆瓣酱、甜面酱炒出红油',
      '与肉片翻炒均匀上色',
      '下青蒜段大火快炒至断生，加生抽调味即可'
    ],
    tips: '肉片要煸至出油卷曲才香；豆瓣酱要炒出红油颜色才红亮'
  },
  {
    id: 'cn-007',
    name: '清蒸鲈鱼',
    category: '粤菜',
    area: '粤菜',
    difficulty: '简单',
    time: 20,
    emoji: '🐟',
    color: '#3498db',
    desc: '原汁原味、鲜嫩无比的粤式清蒸鱼',
    ingredients: [
      { name: '鲈鱼', amount: '1 条（约 500 克）' },
      { name: '葱', amount: '3 根' },
      { name: '姜', amount: '1 块' },
      { name: '蒸鱼豉油', amount: '3 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '食用油', amount: '2 汤匙' }
    ],
    steps: [
      '鲈鱼处理干净，鱼身两面划几刀，抹上料酒和少许盐',
      '姜切片，一部分塞入鱼腹，一部分铺盘底',
      '盘中放筷子架起鱼身（利于蒸汽流通），放上姜片',
      '水开后上锅大火蒸 8-10 分钟',
      '取出倒掉蒸出的腥水，去掉姜片，换上新葱姜丝',
      '淋上蒸鱼豉油，浇上烧至冒烟的热油激发出香味'
    ],
    tips: '一定要水开后再上锅；蒸好后倒掉腥水是去腥关键；热油要浇在葱姜丝上'
  },
  {
    id: 'cn-008',
    name: '白切鸡',
    category: '粤菜',
    area: '粤菜',
    difficulty: '中等',
    time: 40,
    emoji: '🍗',
    color: '#f39c12',
    desc: '皮黄肉白、原汁原味的广式名菜',
    ingredients: [
      { name: '三黄鸡', amount: '1 只（约 1.2 公斤）' },
      { name: '姜', amount: '1 块' },
      { name: '葱', amount: '3 根' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '整鸡洗净，锅中加足量水，放入姜片、葱段、料酒烧开',
      '将鸡放入水中，提起再放入，重复三次（三提三放）让鸡皮收紧',
      '水微开状态（虾眼水）浸泡 30 分钟，期间不要大火煮',
      '用筷子戳鸡腿最厚处，无血水流出即熟',
      '立即放入冰水中浸泡至完全冷却（皮脆肉嫩的关键）',
      '沥干斩块装盘，配姜葱蘸料食用'
    ],
    tips: '关键是用"虾眼水"（似开非开）浸泡而非大火煮；冰水激冷让鸡皮爽脆'
  },
  {
    id: 'cn-009',
    name: '蛋炒饭',
    category: '主食',
    area: '家常',
    difficulty: '简单',
    time: 10,
    emoji: '🍚',
    color: '#f1c40f',
    desc: '粒粒分明、金黄诱人的国民炒饭',
    ingredients: [
      { name: '隔夜米饭', amount: '2 碗' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '葱', amount: '2 根' },
      { name: '盐', amount: '适量' },
      { name: '生抽', amount: '少许' },
      { name: '食用油', amount: '3 汤匙' }
    ],
    steps: [
      '隔夜米饭用手抓散（隔夜饭水分少，炒出来才粒粒分明）',
      '鸡蛋打散，葱切葱花（葱白葱绿分开）',
      '热锅宽油，下蛋液炒至刚刚凝固，用铲子打碎盛出',
      '锅中留油，下葱白爆香，倒入米饭大火翻炒',
      '用铲子压散结块，炒至米饭粒粒分明、微微跳动',
      '倒回鸡蛋，加盐和少许生抽，撒葱绿翻炒均匀出锅'
    ],
    tips: '一定要用隔夜饭；大火快炒、用铲子压散米饭才能粒粒分明'
  },
  {
    id: 'cn-010',
    name: '西红柿鸡蛋面',
    category: '主食',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🍜',
    color: '#e74c3c',
    desc: '酸甜开胃、暖胃舒心的国民汤面',
    ingredients: [
      { name: '挂面', amount: '200 克' },
      { name: '番茄', amount: '2 个' },
      { name: '鸡蛋', amount: '2 个' },
      { name: '葱', amount: '1 根' },
      { name: '盐', amount: '适量' },
      { name: '糖', amount: '1 小勺' },
      { name: '生抽', amount: '1 汤匙' }
    ],
    steps: [
      '番茄切块，鸡蛋打散，葱切葱花',
      '热锅凉油炒鸡蛋，划散盛出',
      '锅中放油，下葱花爆香，放番茄块炒出汁',
      '加水烧开，加盐、糖、生抽调味',
      '下挂面煮至熟透（中间可点一次凉水）',
      '倒入鸡蛋，撒葱花即可'
    ],
    tips: '番茄要炒出汁才有浓郁汤底；面不要煮太软，略有嚼劲更好吃'
  },
  {
    id: 'cn-011',
    name: '紫菜蛋花汤',
    category: '汤羹',
    area: '家常',
    difficulty: '简单',
    time: 10,
    emoji: '🍲',
    color: '#16a085',
    desc: '清淡鲜美、三分钟搞定的快手汤',
    ingredients: [
      { name: '紫菜', amount: '一小把' },
      { name: '鸡蛋', amount: '2 个' },
      { name: '葱', amount: '1 根' },
      { name: '盐', amount: '适量' },
      { name: '香油', amount: '几滴' },
      { name: '生抽', amount: '少许' }
    ],
    steps: [
      '紫菜撕碎用清水泡发洗净，鸡蛋打散',
      '锅中加水烧开，放入紫菜',
      '再次烧开后，沿锅边缓缓倒入蛋液（形成蛋花）',
      '蛋花浮起后加盐、少许生抽调味',
      '关火，淋几滴香油，撒葱花即可'
    ],
    tips: '倒蛋液要沿锅边缓缓倒，且倒入后不要立刻搅动，蛋花才漂亮'
  },
  {
    id: 'cn-012',
    name: '玉米排骨汤',
    category: '汤羹',
    area: '家常',
    difficulty: '简单',
    time: 90,
    emoji: '🌽',
    color: '#f39c12',
    desc: '清甜鲜美、营养丰富的家常靓汤',
    ingredients: [
      { name: '排骨', amount: '500 克' },
      { name: '甜玉米', amount: '2 根' },
      { name: '胡萝卜', amount: '1 根' },
      { name: '姜', amount: '4 片' },
      { name: '葱', amount: '2 根' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '排骨冷水下锅，加姜片、料酒焯水去血沫，捞出洗净',
      '玉米切小段，胡萝卜滚刀切块',
      '砂锅加足量清水，放入排骨、姜片、葱段',
      '大火烧开后转小火炖 40 分钟',
      '加入玉米和胡萝卜，继续炖 30 分钟',
      '加盐调味，撒葱花即可'
    ],
    tips: '一次加足水，中途不加水汤才浓；小火慢炖汤才清甜；盐最后放肉才嫩'
  },
  {
    id: 'cn-013',
    name: '凉拌黄瓜',
    category: '凉菜',
    area: '家常',
    difficulty: '简单',
    time: 10,
    emoji: '🥒',
    color: '#27ae60',
    desc: '爽脆开胃、夏天必备的凉菜',
    ingredients: [
      { name: '黄瓜', amount: '2 根' },
      { name: '蒜', amount: '4 瓣' },
      { name: '干辣椒', amount: '3 个' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '2 汤匙' },
      { name: '糖', amount: '1 小勺' },
      { name: '香油', amount: '1 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '黄瓜洗净，用刀拍裂，切成小段',
      '加盐拌匀腌制 10 分钟，倒掉出的水分',
      '蒜切末，干辣椒切小段',
      '将蒜末、辣椒段放在黄瓜上',
      '烧热油浇在蒜末辣椒上激发香味',
      '加生抽、醋、糖、香油拌匀即可'
    ],
    tips: '黄瓜要拍不要切，截面不规则更入味；腌制出水后倒掉水才爽脆'
  },
  {
    id: 'cn-014',
    name: '皮蛋豆腐',
    category: '凉菜',
    area: '家常',
    difficulty: '简单',
    time: 5,
    emoji: '🥚',
    color: '#7f8c8d',
    desc: '五分钟搞定、清爽嫩滑的经典凉菜',
    ingredients: [
      { name: '内酯豆腐', amount: '1 盒' },
      { name: '皮蛋', amount: '2 个' },
      { name: '葱', amount: '1 根' },
      { name: '蒜', amount: '2 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '1 汤匙' },
      { name: '香油', amount: '1 汤匙' }
    ],
    steps: [
      '内酯豆腐脱模，切成小块装盘',
      '皮蛋去壳切丁，铺在豆腐上',
      '葱切葱花，蒜切末',
      '将生抽、醋、香油、蒜末调成汁',
      '汁浇在皮蛋豆腐上，撒葱花即可'
    ],
    tips: '内酯豆腐先用淡盐水泡一下更嫩；皮蛋煮 3 分钟再切不易散'
  },
  {
    id: 'cn-015',
    name: '可乐鸡翅',
    category: '家常菜',
    area: '家常',
    difficulty: '简单',
    time: 30,
    emoji: '🍗',
    color: '#8d6e63',
    desc: '甜香入味、老少皆宜的人气菜',
    ingredients: [
      { name: '鸡翅', amount: '10 个' },
      { name: '可乐', amount: '1 罐（330ml）' },
      { name: '姜', amount: '4 片' },
      { name: '葱', amount: '2 根' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '料酒', amount: '1 汤匙' }
    ],
    steps: [
      '鸡翅两面划两刀方便入味，冷水下锅加料酒焯水',
      '捞出洗净，用厨房纸吸干水分',
      '热锅少油，下鸡翅煎至两面金黄',
      '加姜片、葱段，倒入生抽、老抽翻炒上色',
      '倒入可乐（没过鸡翅），大火烧开',
      '转中火煮 15 分钟，大火收汁至浓稠裹满鸡翅即可'
    ],
    tips: '用普通可乐不要用无糖的；收汁时要不停翻动防糊，汁变浓稠立刻关火'
  },
  {
    id: 'cn-016',
    name: '糖醋排骨',
    category: '家常菜',
    area: '家常',
    difficulty: '中等',
    time: 50,
    emoji: '🍖',
    color: '#d35400',
    desc: '酸甜适口、色泽红亮的家常美味',
    ingredients: [
      { name: '小排', amount: '500 克' },
      { name: '料酒', amount: '2 汤匙' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '3 汤匙' },
      { name: '糖', amount: '3 汤匙' },
      { name: '姜', amount: '4 片' },
      { name: '葱', amount: '2 根' },
      { name: '白芝麻', amount: '少许' }
    ],
    steps: [
      '排骨冷水下锅加料酒、姜片焯水去血沫，捞出洗净',
      '热锅凉油，下排骨煎至两面微黄',
      '加姜片、葱段，倒入料酒、生抽翻炒',
      '加水没过排骨，大火烧开转小火炖 30 分钟',
      '调糖醋汁：醋、糖、2 汤匙水搅匀',
      '排骨炖软后倒入糖醋汁，大火收汁至浓稠',
      '撒白芝麻即可'
    ],
    tips: '糖醋比例约 1:1 是经典口味；收汁要勤翻动，汁裹满排骨才好吃'
  },
  {
    id: 'cn-017',
    name: '青椒土豆丝',
    category: '素食',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🥔',
    color: '#2ecc71',
    desc: '爽脆可口、5 元搞定的下饭素菜',
    ingredients: [
      { name: '土豆', amount: '2 个' },
      { name: '青椒', amount: '2 个' },
      { name: '蒜', amount: '3 瓣' },
      { name: '干辣椒', amount: '3 个' },
      { name: '盐', amount: '适量' },
      { name: '醋', amount: '1 汤匙' }
    ],
    steps: [
      '土豆去皮切细丝，泡入清水中洗去淀粉，沥干',
      '青椒去籽切丝，蒜切末',
      '热锅凉油，下干辣椒、蒜末爆香',
      '下土豆丝大火快炒 1 分钟',
      '加青椒丝继续翻炒，沿锅边淋醋',
      '加盐调味，炒至土豆丝断生（保持脆爽）即可'
    ],
    tips: '土豆丝要泡水洗去淀粉才爽脆不粘连；全程大火快炒；淋醋增加脆度和风味'
  },
  {
    id: 'cn-018',
    name: '地三鲜',
    category: '素食',
    area: '东北菜',
    difficulty: '中等',
    time: 25,
    emoji: '🍆',
    color: '#9b59b6',
    desc: '东北名菜，茄子土豆青椒的完美组合',
    ingredients: [
      { name: '茄子', amount: '1 个' },
      { name: '土豆', amount: '1 个' },
      { name: '青椒', amount: '2 个' },
      { name: '蒜', amount: '4 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '糖', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 汤匙' }
    ],
    steps: [
      '茄子、土豆切滚刀块，青椒掰成块，蒜切末',
      '调汁：生抽、糖、淀粉、半碗水搅匀',
      '锅中多放油，烧至七成热，下土豆块炸至金黄捞出',
      '下茄子块炸至软透表皮微皱捞出',
      '青椒过油 10 秒捞出',
      '锅留底油下蒜末爆香，倒入调好的汁烧开',
      '下炸好的土豆、茄子、青椒翻炒均匀裹汁即可'
    ],
    tips: '茄子可先用盐腌制挤水，减少吸油；最后裹汁要快，保持蔬菜口感'
  },
  {
    id: 'cn-019',
    name: '麻酱凉面',
    category: '主食',
    area: '北方',
    difficulty: '简单',
    time: 15,
    emoji: '🍝',
    color: '#d4a574',
    desc: '麻酱浓郁、清爽解暑的夏日面食',
    ingredients: [
      { name: '面条', amount: '200 克' },
      { name: '芝麻酱', amount: '3 汤匙' },
      { name: '黄瓜', amount: '1 根' },
      { name: '蒜', amount: '3 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '2 汤匙' },
      { name: '香油', amount: '1 汤匙' }
    ],
    steps: [
      '面条煮熟，捞出过凉开水，沥干拌少许香油防粘',
      '芝麻酱分次加凉开水澥开（顺一个方向搅），调成稀糊状',
      '蒜切末，黄瓜切丝',
      '将澥好的麻酱加生抽、醋、蒜末调成酱汁',
      '面条装盘，铺黄瓜丝，浇上麻酱汁拌匀即可'
    ],
    tips: '芝麻酱要一点点加水澥开才不会有疙瘩；面条过凉水才爽滑'
  },
  {
    id: 'cn-020',
    name: '扬州炒饭',
    category: '主食',
    area: '淮扬菜',
    difficulty: '中等',
    time: 25,
    emoji: '🍚',
    color: '#e67e22',
    desc: '配料丰富、色彩缤纷的经典炒饭',
    ingredients: [
      { name: '隔夜米饭', amount: '2 碗' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '虾仁', amount: '80 克' },
      { name: '火腿', amount: '50 克' },
      { name: '青豆', amount: '50 克' },
      { name: '胡萝卜', amount: '半根' },
      { name: '玉米粒', amount: '50 克' },
      { name: '葱', amount: '2 根' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '虾仁去虾线，火腿、胡萝卜切小丁，葱切葱花',
      '青豆、玉米、胡萝卜丁焯水断生',
      '鸡蛋打散，虾仁用料酒腌制',
      '热锅凉油炒鸡蛋划散盛出，再炒虾仁变色盛出',
      '锅中放油，下火腿丁、蔬菜丁翻炒',
      '倒入米饭大火翻炒至粒粒分明',
      '加鸡蛋、虾仁、盐翻炒均匀，撒葱花出锅'
    ],
    tips: '配料要切得大小均匀；米饭要炒到粒粒分明在锅里跳动'
  },
  {
    id: 'cn-021',
    name: '酸辣土豆丝',
    category: '家常菜',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🌶️',
    color: '#e74c3c',
    desc: '酸辣开胃、国民下饭菜',
    ingredients: [
      { name: '土豆', amount: '2 个' },
      { name: '干辣椒', amount: '5 个' },
      { name: '花椒', amount: '少许' },
      { name: '蒜', amount: '3 瓣' },
      { name: '醋', amount: '2 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '土豆切细丝，泡水洗去淀粉沥干',
      '蒜切末，干辣椒切段',
      '热锅凉油，下花椒小火煸香后捞出',
      '下干辣椒段、蒜末爆香',
      '下土豆丝大火快炒，沿锅边淋醋',
      '加盐调味，炒至断生保持脆爽即可'
    ],
    tips: '和青椒土豆丝类似，重点是泡水去淀粉、大火快炒、淋醋增脆'
  },
  {
    id: 'cn-022',
    name: '水煮肉片',
    category: '川菜',
    area: '川菜',
    difficulty: '中等',
    time: 30,
    emoji: '🌶️',
    color: '#c0392b',
    desc: '麻辣鲜香、肉片嫩滑的川菜代表',
    ingredients: [
      { name: '猪里脊', amount: '300 克' },
      { name: '豆芽', amount: '200 克' },
      { name: '生菜', amount: '1 颗' },
      { name: '豆瓣酱', amount: '2 汤匙' },
      { name: '干辣椒', amount: '15 个' },
      { name: '花椒', amount: '2 汤匙' },
      { name: '蒜', amount: '5 瓣' },
      { name: '蛋清', amount: '1 个' },
      { name: '淀粉', amount: '2 汤匙' }
    ],
    steps: [
      '猪肉切薄片，加盐、蛋清、淀粉、料酒抓匀腌制 15 分钟',
      '豆芽、生菜洗净，干辣椒剪段去籽',
      '锅烧油下蔬菜加盐炒断生，铺在大碗底',
      '锅加油下豆瓣酱、蒜末炒出红油，加水烧开',
      '将肉片一片片下入锅中，煮至变色即捞出铺在蔬菜上',
      '倒入汤汁，撒上干辣椒段、花椒粉',
      '烧热油至冒烟，浇在辣椒花椒上即可'
    ],
    tips: '肉片要提前腌制才嫩滑；下锅后不要搅动以免脱浆；最后泼热油是灵魂'
  },
  {
    id: 'cn-023',
    name: '干煸四季豆',
    category: '川菜',
    area: '川菜',
    difficulty: '中等',
    time: 20,
    emoji: '🫛',
    color: '#27ae60',
    desc: '干香入味、口感独特的川菜',
    ingredients: [
      { name: '四季豆', amount: '400 克' },
      { name: '肉末', amount: '100 克' },
      { name: '干辣椒', amount: '8 个' },
      { name: '花椒', amount: '1 小把' },
      { name: '蒜', amount: '4 瓣' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '四季豆掐头去尾撕去老筋，掰成段，擦干水分',
      '锅中多放油，下四季豆炸至表皮起皱捞出',
      '锅留底油，下肉末炒散至出油',
      '下干辣椒、花椒、蒜末煸香',
      '倒回四季豆，加生抽、盐翻炒均匀',
      '炒至四季豆完全入味即可'
    ],
    tips: '四季豆一定要炸透或煸透至完全熟，未熟的四季豆有毒素；表皮起皱才好吃'
  },
  {
    id: 'cn-024',
    name: '木须肉',
    category: '家常菜',
    area: '北方',
    difficulty: '中等',
    time: 25,
    emoji: '🥚',
    color: '#e67e22',
    desc: '荤素搭配、营养均衡的京味家常菜',
    ingredients: [
      { name: '猪里脊', amount: '200 克' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '黄瓜', amount: '1 根' },
      { name: '木耳', amount: '30 克' },
      { name: '黄花菜', amount: '20 克' },
      { name: '葱', amount: '2 根' },
      { name: '姜', amount: '2 片' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '料酒', amount: '1 汤匙' }
    ],
    steps: [
      '猪肉切片，加盐、料酒、淀粉腌制；木耳、黄花菜泡发',
      '鸡蛋打散，黄瓜切片，葱切段',
      '热锅凉油炒鸡蛋划散盛出',
      '锅中放油，下肉片滑炒至变色盛出',
      '锅留油下葱段、姜片爆香，下木耳、黄花菜翻炒',
      '下黄瓜片翻炒，倒回肉片和鸡蛋',
      '加生抽、盐翻炒均匀即可'
    ],
    tips: '鸡蛋和肉片要分开炒，各自保持嫩滑；最后合炒要快，避免出水'
  },
  {
    id: 'cn-025',
    name: '小葱拌豆腐',
    category: '凉菜',
    area: '家常',
    difficulty: '简单',
    time: 5,
    emoji: '🌿',
    color: '#2ecc71',
    desc: '一清二白、清淡爽口的快手凉菜',
    ingredients: [
      { name: '嫩豆腐', amount: '1 块' },
      { name: '小葱', amount: '1 把' },
      { name: '盐', amount: '适量' },
      { name: '香油', amount: '1 汤匙' },
      { name: '生抽', amount: '少许' }
    ],
    steps: [
      '豆腐切小块，放入淡盐水中浸泡 5 分钟',
      '小葱切葱花',
      '豆腐沥干装盘，撒上葱花',
      '加盐、生抽、香油拌匀即可'
    ],
    tips: '一清（葱）二白（豆腐）寓意清白；豆腐用盐水泡过不易碎且更入味'
  },
  {
    id: 'cn-026',
    name: '银耳莲子羹',
    category: '甜品',
    area: '甜品',
    difficulty: '简单',
    time: 90,
    emoji: '🍯',
    color: '#f1c40f',
    desc: '滋阴润肺、胶质满满的养生甜汤',
    ingredients: [
      { name: '银耳', amount: '半朵' },
      { name: '莲子', amount: '30 克' },
      { name: '红枣', amount: '8 颗' },
      { name: '枸杞', amount: '1 小把' },
      { name: '冰糖', amount: '40 克' }
    ],
    steps: [
      '银耳提前泡发 2 小时，去蒂撕成小朵',
      '莲子去芯泡发，红枣洗净',
      '砂锅加水，放入银耳大火烧开',
      '转小火炖 40 分钟至银耳出胶',
      '加莲子、红枣继续炖 30 分钟',
      '加冰糖、枸杞煮 5 分钟即可'
    ],
    tips: '银耳要撕得碎才容易出胶；全程小火慢炖；一次加足水'
  },
  {
    id: 'cn-027',
    name: '冰糖雪梨',
    category: '甜品',
    area: '甜品',
    difficulty: '简单',
    time: 40,
    emoji: '🍐',
    color: '#bdc3c7',
    desc: '润肺止咳、清甜滋润的秋冬饮品',
    ingredients: [
      { name: '雪梨', amount: '2 个' },
      { name: '冰糖', amount: '30 克' },
      { name: '枸杞', amount: '1 小把' },
      { name: '红枣', amount: '4 颗' }
    ],
    steps: [
      '雪梨洗净去皮去核，切块',
      '锅中加水，放入雪梨块',
      '大火烧开后转小火煮 20 分钟',
      '加冰糖、红枣继续煮 10 分钟',
      '最后撒枸杞煮 2 分钟即可'
    ],
    tips: '雪梨要选汁多肉嫩的品种；不要去皮煮也行，带皮更有润肺效果'
  },
  {
    id: 'cn-028',
    name: '葱油拌面',
    category: '主食',
    area: '上海菜',
    difficulty: '简单',
    time: 20,
    emoji: '🍜',
    color: '#a0522d',
    desc: '葱香浓郁、简单极致的上海味道',
    ingredients: [
      { name: '细面条', amount: '200 克' },
      { name: '小葱', amount: '1 大把' },
      { name: '生抽', amount: '3 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '糖', amount: '2 汤匙' },
      { name: '食用油', amount: '4 汤匙' }
    ],
    steps: [
      '小葱洗净擦干，葱白和葱绿分开切段',
      '锅中放油，冷油下葱白，小火慢炸',
      '葱白微黄后下葱绿，继续小火炸至焦黄酥脆',
      '捞出葱油渣，在油中加生抽、老抽、糖烧开成酱汁',
      '面条煮熟捞出，过一下凉水沥干',
      '浇上葱油酱汁，撒些炸好的葱段拌匀即可'
    ],
    tips: '炸葱油全程小火，炸到焦黄才香；酱汁中糖的量决定风味，不要太少'
  },
  {
    id: 'cn-029',
    name: '干锅花菜',
    category: '家常菜',
    area: '湘菜',
    difficulty: '中等',
    time: 20,
    emoji: '🥦',
    color: '#1abc9c',
    desc: '干香微辣、下饭神菜',
    ingredients: [
      { name: '花菜', amount: '1 颗' },
      { name: '五花肉', amount: '100 克' },
      { name: '干辣椒', amount: '6 个' },
      { name: '蒜', amount: '4 瓣' },
      { name: '豆瓣酱', amount: '1 汤匙' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '花菜掰成小朵，淡盐水浸泡 10 分钟洗净沥干',
      '五花肉切薄片，蒜切片，干辣椒切段',
      '锅中放少许油，下花菜煸炒至微焦盛出',
      '锅中下五花肉片煸炒出油',
      '下蒜片、干辣椒、豆瓣酱炒香',
      '倒回花菜，加生抽、盐翻炒均匀即可'
    ],
    tips: '花菜先用油煸或炸一下表面微焦才好吃；不用加水，干香是灵魂'
  },
  {
    id: 'cn-030',
    name: '香菇青菜',
    category: '素食',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🍄',
    color: '#16a085',
    desc: '清淡鲜美、营养均衡的素菜',
    ingredients: [
      { name: '香菇', amount: '200 克' },
      { name: '小油菜', amount: '300 克' },
      { name: '蒜', amount: '3 瓣' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 茶匙' }
    ],
    steps: [
      '香菇洗净切块，小油菜洗净对半切，蒜切末',
      '调汁：生抽、蚝油、淀粉、3 汤匙水搅匀',
      '锅中烧水加盐和油，焯熟小油菜，整齐码盘',
      '热锅凉油下蒜末爆香，下香菇翻炒',
      '香菇炒软出香后倒入调好的汁',
      '烧至汤汁浓稠，浇在码好的油菜上即可'
    ],
    tips: '小油菜焯水加油盐保持翠绿；香菇要炒透出香才鲜美'
  },
  {
    id: 'cn-031',
    name: '西红柿牛腩',
    category: '汤羹',
    area: '家常',
    difficulty: '中等',
    time: 120,
    emoji: '🍅',
    color: '#e74c3c',
    desc: '酸甜浓郁、软烂入味的炖菜',
    ingredients: [
      { name: '牛腩', amount: '500 克' },
      { name: '番茄', amount: '4 个' },
      { name: '洋葱', amount: '1 个' },
      { name: '姜', amount: '1 块' },
      { name: '葱', amount: '2 根' },
      { name: '八角', amount: '2 个' },
      { name: '番茄酱', amount: '2 汤匙' },
      { name: '盐', amount: '适量' }
    ],
    steps: [
      '牛腩切块冷水下锅焯水去血沫，捞出洗净',
      '番茄去皮切块，洋葱切块，姜切片',
      '热锅凉油，下姜片、八角、洋葱爆香',
      '下牛腩翻炒，加番茄块炒出汁',
      '加番茄酱、足量开水，大火烧开转小火炖 90 分钟',
      '炖至牛腩软烂，加盐调味，撒葱花即可'
    ],
    tips: '牛腩要小火慢炖至少 1.5 小时才软烂；番茄要炒出汁汤才浓郁'
  },
  {
    id: 'cn-032',
    name: '蒜蓉粉丝蒸虾',
    category: '粤菜',
    area: '粤菜',
    difficulty: '中等',
    time: 25,
    emoji: '🦐',
    color: '#e67e22',
    desc: '蒜香浓郁、鲜嫩弹牙的宴客菜',
    ingredients: [
      { name: '鲜虾', amount: '10 只' },
      { name: '粉丝', amount: '1 把' },
      { name: '蒜', amount: '2 整头' },
      { name: '葱', amount: '2 根' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '食用油', amount: '3 汤匙' }
    ],
    steps: [
      '粉丝温水泡软铺盘底',
      '虾去虾线，从背部剖开不要切断，用刀背拍平',
      '虾摆在粉丝上，加料酒腌制',
      '蒜切成蒜蓉，一半炸至金黄，一半生蒜蓉混合成金银蒜',
      '将蒜蓉铺在每只虾上',
      '水开后上锅大火蒸 6 分钟',
      '淋生抽，浇热油，撒葱花即可'
    ],
    tips: '金银蒜（一半炸一半生）是灵魂；虾不要蒸太久，6 分钟刚好鲜嫩'
  },
  {
    id: 'cn-033',
    name: '蛋饺',
    category: '家常菜',
    area: '江浙菜',
    difficulty: '较难',
    time: 40,
    emoji: '🥟',
    color: '#f39c12',
    desc: '金黄诱人、年味十足的传统菜',
    ingredients: [
      { name: '鸡蛋', amount: '6 个' },
      { name: '猪肉末', amount: '300 克' },
      { name: '荸荠', amount: '4 个' },
      { name: '葱', amount: '2 根' },
      { name: '姜', amount: '2 片' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '盐', amount: '适量' },
      { name: '食用油', amount: '少许' }
    ],
    steps: [
      '肉末加葱姜末、剁碎的荸荠、生抽、盐搅打上劲成馅',
      '鸡蛋打散过筛，加少许盐',
      '大汤勺在炉火上加热，刷一层薄油',
      '倒入一勺蛋液转动，摊成薄蛋皮',
      '趁蛋皮未全凝，放一勺肉馅在一边',
      '用筷子将另一边蛋皮翻盖过来，压紧封口',
      '做好的蛋饺上锅蒸 15 分钟即可'
    ],
    tips: '汤勺要控制好温度，不能太烫也不能太凉；蛋皮半凝时翻盖才粘得牢'
  },
  {
    id: 'cn-034',
    name: '凉拌木耳',
    category: '凉菜',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🍄',
    color: '#34495e',
    desc: '爽脆开胃、低卡健康的凉拌菜',
    ingredients: [
      { name: '干木耳', amount: '30 克' },
      { name: '洋葱', amount: '半个' },
      { name: '香菜', amount: '2 根' },
      { name: '蒜', amount: '4 瓣' },
      { name: '干辣椒', amount: '4 个' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '醋', amount: '2 汤匙' },
      { name: '糖', amount: '1 小勺' }
    ],
    steps: [
      '木耳提前泡发，洗净撕成小朵',
      '烧开水焯木耳 2 分钟，捞出过凉水沥干',
      '洋葱切丝，香菜切段，蒜切末，干辣椒切段',
      '将蒜末、辣椒段放在木耳上',
      '烧热油浇在蒜末辣椒上激香',
      '加洋葱丝、香菜、生抽、醋、糖拌匀即可'
    ],
    tips: '木耳焯水后过凉水才爽脆；泡发时间不要超过 8 小时（防变质）'
  },
  {
    id: 'cn-035',
    name: '红烧豆腐',
    category: '素食',
    area: '家常',
    difficulty: '简单',
    time: 20,
    emoji: '🧈',
    color: '#d35400',
    desc: '酱香浓郁、外焦里嫩的下饭素菜',
    ingredients: [
      { name: '老豆腐', amount: '1 块（约 400 克）' },
      { name: '青红椒', amount: '各 1 个' },
      { name: '蒜', amount: '3 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '糖', amount: '1 小勺' },
      { name: '淀粉', amount: '1 汤匙' }
    ],
    steps: [
      '老豆腐切厚片，青红椒切块，蒜切末',
      '调汁：生抽、老抽、蚝油、糖、淀粉、半碗水搅匀',
      '锅中放油，下豆腐煎至两面金黄盛出',
      '锅留油下蒜末、青红椒爆香',
      '倒回豆腐，倒入调好的汁',
      '中火烧至汤汁浓稠裹满豆腐即可'
    ],
    tips: '用老豆腐才能煎出外焦里嫩；煎豆腐不要频繁翻动，定型后再翻'
  },
  {
    id: 'cn-036',
    name: '葱花鸡蛋饼',
    category: '主食',
    area: '家常',
    difficulty: '简单',
    time: 15,
    emoji: '🥞',
    color: '#f1c40f',
    desc: '松软香喷、5 分钟搞定的早餐饼',
    ingredients: [
      { name: '面粉', amount: '100 克' },
      { name: '鸡蛋', amount: '2 个' },
      { name: '葱', amount: '2 根' },
      { name: '盐', amount: '适量' },
      { name: '清水', amount: '150 毫升' },
      { name: '食用油', amount: '少许' }
    ],
    steps: [
      '葱切葱花',
      '面粉中打入鸡蛋，慢慢加水搅拌成无颗粒稀面糊',
      '加盐、葱花搅匀',
      '平底锅刷薄油，倒入一勺面糊转动摊成薄饼',
      '小火煎至底面凝固微黄，翻面',
      '两面金黄即可出锅'
    ],
    tips: '面糊要稀一些（类似酸奶浓稠度）才好摊开；全程小火防糊'
  }
]
