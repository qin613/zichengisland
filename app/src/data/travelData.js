/**
 * 旅游模块静态数据
 * 行李清单模板 + 通用旅行小贴士
 */

/** 默认行李清单模板（用户可勾选/自定义） */
export const PACKING_TEMPLATE = [
  {
    category: '证件类',
    icon: '📋',
    items: ['身份证/护照', '机票/车票', '酒店预订单', '学生证/优惠证', '少量现金']
  },
  {
    category: '衣物',
    icon: '👕',
    items: ['换洗衣物', '内衣袜子', '外套/防风衣', '睡衣', '舒适鞋履']
  },
  {
    category: '洗漱用品',
    icon: '🧴',
    items: ['牙刷牙膏', '洗面奶', '沐浴露', '护肤品', '毛巾']
  },
  {
    category: '电子产品',
    icon: '🔌',
    items: ['手机充电器', '充电宝', '数据线', '耳机', '转换插头']
  },
  {
    category: '药品',
    icon: '💊',
    items: ['感冒药', '肠胃药', '创可贴', '晕车药', '个人常用药']
  },
  {
    category: '其他',
    icon: '🎒',
    items: ['雨伞', '水杯', '零食', '旅行指南', '环保袋']
  }
]

/** 通用旅行小贴士（详情页展示） */
export const TRAVEL_TIPS = [
  { icon: '💰', title: '提前换汇', desc: '出发前在国内银行换汇汇率更优，机场兑换最不划算' },
  { icon: '📱', title: '离线地图', desc: '提前下载目的地的离线地图，避免迷路也省流量' },
  { icon: '📷', title: '备份证件', desc: '重要证件拍照存云盘，纸质件与原件分开存放' },
  { icon: '🔒', title: '分散财物', desc: '现金和银行卡不要放同一个地方，分散降低风险' },
  { icon: '🚰', title: '饮水安全', desc: '不确定水质的国家建议买瓶装水，避免肠胃不适' },
  { icon: '🕐', title: '错峰出行', desc: '景点尽量早上去，避开旅行团高峰，拍照也更好看' }
]

/** 预算计算器的默认类别 */
export const BUDGET_CATEGORIES = [
  { key: 'transport', label: '交通', icon: '🚗', daily: 100, desc: '机票、火车票、市内交通' },
  { key: 'hotel', label: '住宿', icon: '🏨', daily: 300, desc: '酒店、民宿' },
  { key: 'food', label: '餐饮', icon: '🍜', daily: 150, desc: '一日三餐、零食' },
  { key: 'tickets', label: '门票', icon: '🎫', daily: 80, desc: '景点门票、演出' },
  { key: 'shopping', label: '购物', icon: '🛍️', daily: 100, desc: '纪念品、特产' },
  { key: 'other', label: '其他', icon: '💡', daily: 50, desc: '备用金' }
]
