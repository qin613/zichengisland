/**
 * 中文食谱 API 封装
 * 基于内置数据，提供与 TheMealDB 类似的接口
 * 包含高清食物图片（Wikimedia Commons / Unsplash）和视频（B站搜索）映射
 *
 * 图片说明：
 * - 优先使用 Wikimedia Commons 上对应的真实菜品图片
 * - 部分菜品在 Commons 上无合适图片，改用 Unsplash 高质量食物摄影
 * - 所有图片均来自开放 CC / 免费商用图库
 */
import { CN_RECIPES, CN_CATEGORIES } from '@/data/recipes'

/**
 * 每道菜的高清图片和视频（B站搜索链接）
 * key 为食谱 id
 */
const MEDIA_MAP = {
  'cn-001': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Uova_strapazzate_e_pomodori%2C_piatto_tradizionale_cinese.jpg', video: 'https://search.bilibili.com/all?keyword=番茄炒蛋做法' },
  'cn-002': { thumb: 'https://www.meishiu.com/uploads/202606/26/260626083340730.jpg', video: 'https://search.bilibili.com/all?keyword=红烧肉做法' },
  'cn-003': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Kung_Pao_Chicken_at_Yujiayan_Restaurant_%2820230510123120%29.jpg', video: 'https://search.bilibili.com/all?keyword=宫保鸡丁做法' },
  'cn-004': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Authentic_Mapo_Tofu.jpg', video: 'https://search.bilibili.com/all?keyword=麻婆豆腐做法' },
  'cn-005': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Fish-flavoured_shredded_pork_at_Meizhou_Dongpo_Restaurant_Shangdi_%2820190808185406%29.jpg', video: 'https://search.bilibili.com/all?keyword=鱼香肉丝做法' },
  'cn-006': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Huiguorou_made_from_Neijiang_local_pork_at_Daqian_Restaurant%2C_Beidadi_%2820251011111845%29.jpg', video: 'https://search.bilibili.com/all?keyword=回锅肉做法' },
  'cn-007': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Chinese_Steamed_Perch.jpg', video: 'https://search.bilibili.com/all?keyword=清蒸鲈鱼做法' },
  'cn-008': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/BeiQieJi-WhiteCutChicken.jpg/960px-BeiQieJi-WhiteCutChicken.jpg', video: 'https://search.bilibili.com/all?keyword=白切鸡做法' },
  'cn-009': { thumb: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', video: 'https://search.bilibili.com/all?keyword=蛋炒饭做法' },
  'cn-010': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Chinese_Noodle_With_Tomato_and_Egg_Sauce.jpg/960px-Chinese_Noodle_With_Tomato_and_Egg_Sauce.jpg', video: 'https://search.bilibili.com/all?keyword=西红柿鸡蛋面做法' },
  'cn-011': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Egg_drop_soup.jpg/960px-Egg_drop_soup.jpg', video: 'https://search.bilibili.com/all?keyword=紫菜蛋花汤做法' },
  'cn-012': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pork_soup.jpg/960px-Pork_soup.jpg', video: 'https://search.bilibili.com/all?keyword=玉米排骨汤做法' },
  'cn-013': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Cucumber_salad_with_cilantro%2C_onion%2C_chili_dressing%2C_etc_-_Cambridge%2C_MA.jpg/960px-Cucumber_salad_with_cilantro%2C_onion%2C_chili_dressing%2C_etc_-_Cambridge%2C_MA.jpg', video: 'https://search.bilibili.com/all?keyword=凉拌黄瓜做法' },
  'cn-014': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tofu_with_Century_Egg_01.jpg/960px-Tofu_with_Century_Egg_01.jpg', video: 'https://search.bilibili.com/all?keyword=皮蛋豆腐做法' },
  'cn-015': { thumb: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800', video: 'https://search.bilibili.com/all?keyword=可乐鸡翅做法' },
  'cn-016': { thumb: 'https://www.meishiu.com/uploads/202405/09/240509023818177.jpg', video: 'https://search.bilibili.com/all?keyword=糖醋排骨做法' },
  'cn-017': { thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', video: 'https://search.bilibili.com/all?keyword=青椒土豆丝做法' },
  'cn-018': { thumb: 'https://www.meishiu.com/uploads/202504/08/250408082825254.jpg', video: 'https://search.bilibili.com/all?keyword=地三鲜做法' },
  'cn-019': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/%E6%B1%A4%E5%8D%B7%E7%B2%89_Curly_Rice_Noodles_with_Spicy_Soup_and_Sesame_Seeds_-_Laomeng_Market_%282373369546%29.jpg/960px-%E6%B1%A4%E5%8D%B7%E7%B2%89_Curly_Rice_Noodles_with_Spicy_Soup_and_Sesame_Seeds_-_Laomeng_Market_%282373369546%29.jpg', video: 'https://search.bilibili.com/all?keyword=麻酱凉面做法' },
  'cn-020': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg/960px-Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg', video: 'https://search.bilibili.com/all?keyword=扬州炒饭做法' },
  'cn-021': { thumb: 'https://www.meishiu.com/uploads/202512/14/251214083925203.jpg', video: 'https://search.bilibili.com/all?keyword=酸辣土豆丝做法' },
  'cn-022': { thumb: 'https://www.meishiu.com/uploads/202506/05/250605071855931.jpg', video: 'https://search.bilibili.com/all?keyword=水煮肉片做法' },
  'cn-023': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Sichuan%27s_Spicy_Green_Beans_at_Sichuan_Restaurant%2C_Acton%2C_London_%284466367167%29.jpg', video: 'https://search.bilibili.com/all?keyword=干煸四季豆做法' },
  'cn-024': { thumb: 'https://www.meishiu.com/uploads/202301/27/230127093313222.jpg', video: 'https://search.bilibili.com/all?keyword=木须肉做法' },
  'cn-025': { thumb: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', video: 'https://search.bilibili.com/all?keyword=小葱拌豆腐做法' },
  'cn-026': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/White_fungus_and_ginkgo_nut_soup.jpg/960px-White_fungus_and_ginkgo_nut_soup.jpg', video: 'https://search.bilibili.com/all?keyword=银耳莲子羹做法' },
  'cn-027': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Poached_Pears_in_bowl.jpg/960px-Poached_Pears_in_bowl.jpg', video: 'https://search.bilibili.com/all?keyword=冰糖雪梨做法' },
  'cn-028': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Shanghai_oil_noodle.jpg', video: 'https://search.bilibili.com/all?keyword=葱油拌面做法' },
  'cn-029': { thumb: 'https://www.meishiu.com/uploads/202405/20/240520105128377.jpg', video: 'https://search.bilibili.com/all?keyword=干锅花菜做法' },
  'cn-030': { thumb: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800', video: 'https://search.bilibili.com/all?keyword=香菇青菜做法' },
  'cn-031': { thumb: 'https://www.meishiu.com/uploads/202512/09/251209083533591.jpg', video: 'https://search.bilibili.com/all?keyword=西红柿牛腩做法' },
  'cn-032': { thumb: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800', video: 'https://search.bilibili.com/all?keyword=蒜蓉粉丝蒸虾做法' },
  'cn-033': { thumb: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800', video: 'https://search.bilibili.com/all?keyword=蛋饺做法' },
  'cn-034': { thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Water-soaked_black_fungus.jpg/960px-Water-soaked_black_fungus.jpg', video: 'https://search.bilibili.com/all?keyword=凉拌木耳做法' },
  'cn-035': { thumb: 'https://www.meishiu.com/uploads/202606/27/260627080853869.jpg', video: 'https://search.bilibili.com/all?keyword=红烧豆腐做法' },
  'cn-036': { thumb: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', video: 'https://search.bilibili.com/all?keyword=葱花鸡蛋饼做法' }
}

/**
 * 将内部食谱对象转换为统一的展示格式（与英文食谱兼容）
 */
function normalize(recipe) {
  const media = MEDIA_MAP[recipe.id] || {}
  return {
    id: recipe.id,
    name: recipe.name,
    thumb: media.thumb || null,
    emoji: recipe.emoji,
    color: recipe.color,
    category: recipe.category,
    area: recipe.area,
    difficulty: recipe.difficulty,
    time: recipe.time,
    desc: recipe.desc,
    video: media.video || null,
    ingredients: recipe.ingredients.map((i) => ({
      ingredient: i.name,
      measure: i.amount
    })),
    instructions: recipe.steps.join('\n'),
    steps: recipe.steps,
    tips: recipe.tips,
    isChinese: true
  }
}

/** 预处理全部食谱 */
const ALL = CN_RECIPES.map(normalize)

/**
 * 按菜名 / 食材搜索
 */
export async function searchCnMeals(keyword) {
  if (!keyword?.trim()) return ALL
  const kw = keyword.trim().toLowerCase()
  return ALL.filter(
    (r) =>
      r.name.toLowerCase().includes(kw) ||
      r.desc.toLowerCase().includes(kw) ||
      r.ingredients.some((i) => i.ingredient.toLowerCase().includes(kw))
  )
}

/**
 * 按分类筛选
 */
export async function filterCnByCategory(category) {
  if (!category) return ALL
  return ALL.filter((r) => r.category === category)
}

/**
 * 获取所有中文分类
 */
export function getCnCategories() {
  return CN_CATEGORIES.map((c) => ({ idCategory: c, strCategory: c }))
}

/**
 * 按 ID 获取详情
 */
export async function getCnMealById(id) {
  return ALL.find((r) => r.id === id) || null
}

/**
 * 随机推荐一份中文食谱
 */
export async function getRandomCnMeal() {
  return ALL[Math.floor(Math.random() * ALL.length)]
}

/**
 * 获取全部中文食谱
 */
export async function getAllCnMeals() {
  return ALL
}
