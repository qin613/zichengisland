async function generateAIStory(playerInput, currentNode) {
    const prompt = `
你现在扮演一个古风穿越乙女游戏的剧情生成助手。

【游戏设定】
游戏名称：《嫣落尘渊》
女主名字：${gameState.playerName}
女主身份：21世纪特工穿越成古代不受宠庶女，性格冷静、清醒、聪慧、隐忍、杀伐果断

【当前属性】
智谋：${gameState.stats.wisdom}，武力：${gameState.stats.strength}，声望：${gameState.stats.reputation}，悟性：${gameState.stats.perception}，美貌：${gameState.stats.beauty}，恶念：${gameState.stats.malice}

【当前剧情】
场景：${currentNode.scene || '未知'}
角色：${currentNode.character || '旁白'}
上一段剧情：${currentNode.text || ''}
玩家回应：${playerInput}

【四位男主设定】
1. 萧若河 - 摄政王：清冷禁欲、深沉腹黑、手握大权、寡言克制、极度护短、对外杀伐无情、对女主独留温柔
2. 谢玉衡 - 谢家公子：温润如玉、风雅通透、温柔体贴、看似谦和实则心思缜密、默默守护型白月光
3. 李自清 - 少年皇帝：外表乖巧柔弱、内心隐忍多疑、极度缺爱、渴望真心、对女主极度依赖
4. 楚昭云 - 敌国将军：桀骜张扬、野性凌厉、亦正亦邪、敌我对立、宿命拉扯、相爱相杀

【属性说明】
- wisdom（智谋）：智力、谋略、计策能力
- strength（武力）：武功、体力、战斗能力
- reputation（声望）：名声、威望、社会地位
- perception（悟性）：领悟力、学习能力、洞察力
- beauty（美貌）：容貌、气质、魅力
- malice（恶念）：心机、手段、狠辣程度

【要求】
1. 根据玩家回应续写一段剧情，保持古风文风
2. 输出格式必须是JSON格式，包含以下字段：
   - text: 剧情文本（100-200字）
   - character: 说话的角色名（如：旁白、萧若河、谢玉衡等）
   - choices: 3个选项数组，每个选项包含text和next（下一个节点ID）
   - affection: 对象，包含各男主好感度变化（如：{xiao: 5, xie: 0, li: -3, chu: 0}）
   - stats: 对象，包含各属性变化（如：{wisdom: 3, strength: 0, reputation: 2, perception: 0, beauty: 0, malice: -1}）
3. 选项要合理，符合角色性格
4. 好感度和属性变化要符合剧情逻辑，每次变化幅度-5到+5之间

【示例输出】
{
    "text": "萧若河深邃的眼眸微微一动，他从未见过如此镇定的女子...",
    "character": "萧若河",
    "choices": [
        {"text": "保持沉默", "next": "main_2"},
        {"text": "主动道谢", "next": "main_3"},
        {"text": "试探他的目的", "next": "main_4"}
    ],
    "affection": {"xiao": 3, "xie": 0, "li": 0, "chu": 0},
    "stats": {"wisdom": 2, "strength": 0, "reputation": 0, "perception": 0, "beauty": 0, "malice": 0}
}
    `.trim();

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-80026f920379483ea5c833d8967cb84a'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (e) {
            return generateFallbackStory(playerInput, currentNode);
        }
    } catch (e) {
        return generateFallbackStory(playerInput, currentNode);
    }
}

function generateFallbackStory(playerInput, currentNode) {
    const character = currentNode.character || '旁白';
    
    const xiaoResponses = [
        {
            text: '萧若河深邃的眼眸微微一动，他从未见过如此镇定的女子。「有意思...」他淡淡开口，声音低沉如大提琴，「你比我想象中要有趣得多。」',
            character: '萧若河',
            choices: [
                { text: '淡然一笑', next: gameState.currentNodeId + '_fallback_1' },
                { text: '试探他的目的', next: gameState.currentNodeId + '_fallback_2' },
                { text: '保持沉默', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 3, xie: 0, li: 0, chu: 0 }
        },
        {
            text: '萧若河放下手中的笔，站起身来，缓步走到你面前。他很高，身影笼罩着你，却没有丝毫压迫感。「姜嫣，」他轻声念着你的名字，「你让我想起了一个故人。」',
            character: '萧若河',
            choices: [
                { text: '追问故人是谁', next: gameState.currentNodeId + '_fallback_1' },
                { text: '保持镇定', next: gameState.currentNodeId + '_fallback_2' },
                { text: '转移话题', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 2, xie: 0, li: 0, chu: 0 }
        },
        {
            text: '萧若河沉默良久，最终只是轻轻叹了口气。「你身上有一股很特别的气质。」他的目光落在你身上，带着一丝不易察觉的温柔，「让人忍不住想要靠近。」',
            character: '萧若河',
            choices: [
                { text: '微微一笑', next: gameState.currentNodeId + '_fallback_1' },
                { text: '反问他', next: gameState.currentNodeId + '_fallback_2' },
                { text: '保持神秘', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 4, xie: 0, li: 0, chu: 0 }
        }
    ];

    const xieResponses = [
        {
            text: '谢玉衡温和地笑了笑，眼中闪过一丝赞许。「姑娘所言极是，玉衡受教了。」他端起茶杯，轻轻抿了一口，「能与姑娘交谈，真是人生一大乐事。」',
            character: '谢玉衡',
            choices: [
                { text: '谦虚回应', next: gameState.currentNodeId + '_fallback_1' },
                { text: '继续探讨', next: gameState.currentNodeId + '_fallback_2' },
                { text: '欣赏园中景色', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 3, li: 0, chu: 0 }
        },
        {
            text: '谢玉衡放下书卷，目光温柔地看着你。「姑娘的见解独到，玉衡深感佩服。」他微微欠身，「不知姑娘是否愿意赏光，让玉衡为你抚琴一曲？」',
            character: '谢玉衡',
            choices: [
                { text: '欣然同意', next: gameState.currentNodeId + '_fallback_1' },
                { text: '婉言谢绝', next: gameState.currentNodeId + '_fallback_2' },
                { text: '为他研墨', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 4, li: 0, chu: 0 }
        },
        {
            text: '谢玉衡听完你的话，沉默了片刻，随即露出一个温润的笑容。「姑娘真是蕙质兰心。」他从袖中取出一支玉簪，「这是我母亲留下的，如今送给姑娘。」',
            character: '谢玉衡',
            choices: [
                { text: '接受玉簪', next: gameState.currentNodeId + '_fallback_1' },
                { text: '婉言推辞', next: gameState.currentNodeId + '_fallback_2' },
                { text: '询问缘由', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 5, li: 0, chu: 0 }
        }
    ];

    const liResponses = [
        {
            text: '李自清的眼中闪过一丝惊喜，随即又变得有些落寞。「你愿意陪朕说话...真好。」他低下头，声音带着一丝苦涩，「从来没有人愿意真正陪朕说话。」',
            character: '李自清',
            choices: [
                { text: '安慰他', next: gameState.currentNodeId + '_fallback_1' },
                { text: '握住他的手', next: gameState.currentNodeId + '_fallback_2' },
                { text: '鼓励他', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 4, chu: 0 }
        },
        {
            text: '李自清抬起头，目光认真地看着你。「姜嫣，你是唯一一个让朕觉得...平等的人。」他的声音带着一丝颤抖，「不要离开朕，好吗？」',
            character: '李自清',
            choices: [
                { text: '答应他', next: gameState.currentNodeId + '_fallback_1' },
                { text: '告诉他你会一直陪着他', next: gameState.currentNodeId + '_fallback_2' },
                { text: '保持沉默', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 5, chu: 0 }
        },
        {
            text: '李自清突然抓住你的手，他的手冰凉，却握得很紧。「朕...朕害怕。」他的声音带着一丝恐惧，「害怕失去你，害怕回到以前那种孤独的日子。」',
            character: '李自清',
            choices: [
                { text: '安抚他', next: gameState.currentNodeId + '_fallback_1' },
                { text: '告诉他你不会离开', next: gameState.currentNodeId + '_fallback_2' },
                { text: '帮他分析', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 4, chu: 0 }
        }
    ];

    const chuResponses = [
        {
            text: '楚昭云哈哈大笑，声音爽朗。「有意思！真是太有意思了！」他走到你面前，目光中带着一丝玩味，「姜嫣，你是我见过最有胆色的女子。」',
            character: '楚昭云',
            choices: [
                { text: '与他对视', next: gameState.currentNodeId + '_fallback_1' },
                { text: '保持警惕', next: gameState.currentNodeId + '_fallback_2' },
                { text: '反问他', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 0, chu: 4 }
        },
        {
            text: '楚昭云收起笑容，目光变得深邃起来。「姜嫣，你让我想起了草原上的孤狼。」他的声音低沉，「看似柔弱，实则坚韧。我喜欢你这样的女子。」',
            character: '楚昭云',
            choices: [
                { text: '接受他的赞美', next: gameState.currentNodeId + '_fallback_1' },
                { text: '拒绝他', next: gameState.currentNodeId + '_fallback_2' },
                { text: '告诉他我们是敌人', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 0, chu: 3 }
        },
        {
            text: '楚昭云突然伸手，轻轻捏住你的下巴，目光灼热地看着你。「女人，你成功引起了我的注意。」他的嘴角勾起一抹邪魅的笑容，「但我警告你，不要试图欺骗我。」',
            character: '楚昭云',
            choices: [
                { text: '挣脱他的手', next: gameState.currentNodeId + '_fallback_1' },
                { text: '直视他的眼睛', next: gameState.currentNodeId + '_fallback_2' },
                { text: '冷笑一声', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 0, xie: 0, li: 0, chu: 5 }
        }
    ];

    const generalResponses = [
        {
            text: `${character || '旁白'}似乎对你的话若有所思。「你倒是个有趣的女子。」他淡淡开口，目光中带着一丝探究。`,
            character: character || '旁白',
            choices: [
                { text: '淡然一笑', next: gameState.currentNodeId + '_fallback_1' },
                { text: '追问缘由', next: gameState.currentNodeId + '_fallback_2' },
                { text: '转移话题', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 2, xie: 2, li: 2, chu: 2 }
        },
        {
            text: '空气仿佛凝固了片刻。「有意思...」他低低地笑了一声，那笑声中带着几分不易察觉的玩味。',
            character: character || '旁白',
            choices: [
                { text: '保持镇定', next: gameState.currentNodeId + '_fallback_1' },
                { text: '主动打破沉默', next: gameState.currentNodeId + '_fallback_2' },
                { text: '观察对方反应', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 2, xie: 2, li: 2, chu: 2 }
        },
        {
            text: '你的话似乎触动了他内心深处的某个角落，他的眼神变得复杂起来。「你...和其他人不一样。」',
            character: character || '旁白',
            choices: [
                { text: '微微一笑', next: gameState.currentNodeId + '_fallback_1' },
                { text: '反问他', next: gameState.currentNodeId + '_fallback_2' },
                { text: '保持神秘', next: gameState.currentNodeId + '_fallback_3' }
            ],
            affection: { xiao: 2, xie: 2, li: 2, chu: 2 }
        }
    ];

    let responses;
    if (character.includes('萧若河')) {
        responses = xiaoResponses;
    } else if (character.includes('谢玉衡')) {
        responses = xieResponses;
    } else if (character.includes('李自清')) {
        responses = liResponses;
    } else if (character.includes('楚昭云')) {
        responses = chuResponses;
    } else {
        responses = generalResponses;
    }

    return responses[Math.floor(Math.random() * responses.length)];
}

async function handleCustomInput() {
    const input = document.getElementById('custom-input').value.trim();
    if (!input) return;

    const currentNode = getNode(gameState.currentNodeId);
    if (!currentNode) return;

    document.getElementById('custom-input').value = '';
    
    const aiResponse = await generateAIStory(input, currentNode);
    
    if (aiResponse.affection) {
        Object.keys(aiResponse.affection).forEach(char => {
            if (aiResponse.affection[char] !== 0) {
                updateAffection(char, aiResponse.affection[char]);
            }
        });
    }

    if (aiResponse.stats) {
        Object.keys(aiResponse.stats).forEach(stat => {
            if (gameState.stats[stat] !== undefined && aiResponse.stats[stat] !== 0) {
                gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + aiResponse.stats[stat]));
                showAffectionTip(`${getStatName(stat)} ${aiResponse.stats[stat] > 0 ? '+' : ''}${aiResponse.stats[stat]}`);
            }
        });
    }

    const tempNodeId = gameState.currentNodeId + '_ai_' + Date.now();
    const tempNode = {
        id: tempNodeId,
        scene: currentNode.scene,
        character: aiResponse.character,
        text: aiResponse.text,
        choices: aiResponse.choices || [
            { text: '继续对话', next: currentNode.id },
            { text: '换个话题', next: 'main_1' },
            { text: '离开此处', next: 'main_1' }
        ],
        background: currentNode.background,
        characters: currentNode.characters
    };

    storyNodes[tempNodeId] = tempNode;
    gameState.currentNodeId = tempNodeId;
    renderNode(tempNodeId);
    autoSave();
}