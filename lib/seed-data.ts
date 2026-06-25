import type { Category, Dish, Family } from "@/types/domain";

const now = "2026-06-25T00:00:00.000Z";

export const defaultFamily: Family = {
  id: "family-home",
  slug: "home",
  name: "家庭餐桌",
  created_at: now,
  updated_at: now,
};

const categoryRows = [
  ["cat-breakfast", "早餐", "🥐"],
  ["cat-cold", "凉菜", "🥒"],
  ["cat-main", "主菜", "🥩"],
  ["cat-rice-noodle", "盖饭/面", "🍜"],
  ["cat-soup", "汤", "🍲"],
] as const;

export const seedCategories: Category[] = categoryRows.map(([id, name, icon], index) => ({
  id,
  family_id: defaultFamily.id,
  name,
  icon,
  sort_order: index + 1,
  is_active: true,
  created_at: now,
  updated_at: now,
}));

const dishRows: Array<[string, string, string, string]> = [
  ["dish-baizhou", "cat-breakfast", "白粥", "🥣"],
  ["dish-huntun", "cat-breakfast", "馄炖", "🥟"],
  ["dish-yangchunmian", "cat-breakfast", "阳春面", "🍜"],
  ["dish-jiaozi", "cat-breakfast", "饺子", "🥟"],
  ["dish-niurou-fensi-tang", "cat-breakfast", "牛肉粉丝汤", "🍲"],
  ["dish-jiandan-xiangchang", "cat-breakfast", "煎蛋+香肠", "🍳"],
  ["dish-yanmai-shuiguo-wan", "cat-breakfast", "燕麦水果碗", "🥣"],
  ["dish-jidan-chaobocai-koumo", "cat-breakfast", "鸡蛋炒菠菜口蘑", "🥬"],
  ["dish-huadan-sunzi-jungu-qiabata", "cat-breakfast", "滑蛋笋子菌菇恰巴塔", "🥪"],
  ["dish-niuyouguo-shasha-suanmianbao", "cat-breakfast", "牛油果莎莎酱配酸种面包", "🥑"],
  ["dish-huotuizhima-beiguo", "cat-breakfast", "火腿芝麻菜油浸番茄贝果", "🥯"],

  ["dish-pingguocu-wawacai", "cat-cold", "苹果醋干辣椒拌娃娃菜", "🥬"],
  ["dish-liangban-qinggua", "cat-cold", "凉拌青瓜", "🥒"],
  ["dish-baitang-xihongshi", "cat-cold", "白糖西红柿", "🍅"],

  ["dish-xihongshi-niunan", "cat-main", "西红柿炖牛腩", "🥩"],
  ["dish-qingdun-niuleitiao", "cat-main", "清炖萝卜牛肋条", "🥩"],
  ["dish-xiaochao-huangniurou", "cat-main", "小炒黄牛肉", "🥩"],
  ["dish-fanqie-baixiangguo-niurou", "cat-main", "番茄百香果牛肉", "🥩"],
  ["dish-mandun-niuxiaopai", "cat-main", "慢炖牛小排佐土豆红薯泥", "🥩"],
  ["dish-jian-niupai", "cat-main", "煎牛排", "🥩"],
  ["dish-qingdun-yangpai", "cat-main", "清炖萝卜羊排", "🍖"],
  ["dish-suancai-yangrou", "cat-main", "酸菜羊肉", "🍖"],
  ["dish-hongshao-paigu", "cat-main", "红烧排骨", "🍖"],
  ["dish-yutou-zhengpaigu", "cat-main", "芋头蒸排骨", "🍖"],
  ["dish-chizhi-paigu", "cat-main", "豉汁排骨", "🍖"],
  ["dish-lapaigu-tudou-haidai", "cat-main", "腊排骨炖土豆海带", "🍖"],
  ["dish-sanbei-ji", "cat-main", "三杯鸡", "🍗"],
  ["dish-huangmen-ji", "cat-main", "黄焖鸡", "🍗"],
  ["dish-jiangsuanzheng-jitui", "cat-main", "姜蒜蒸鸡腿", "🍗"],
  ["dish-qingzheng-yu", "cat-main", "清蒸鱼", "🐟"],
  ["dish-suancai-yu", "cat-main", "酸菜鱼", "🐟"],
  ["dish-geli-zhengdan", "cat-main", "蛤蜊蒸蛋", "🥚"],
  ["dish-lajiu-hualuo", "cat-main", "辣酒煮花螺", "🐚"],
  ["dish-zheng-pangxie", "cat-main", "蒸螃蟹", "🦀"],
  ["dish-wuhuarou-labaicai", "cat-main", "五花肉炒辣白菜", "🥓"],
  ["dish-fanqie-chaodan", "cat-main", "番茄炒蛋", "🍅"],
  ["dish-lachang-suantai", "cat-main", "腊肠炒蒜苔", "🌶️"],
  ["dish-ganlajiao-jimaocai", "cat-main", "干辣椒炝炒鸡毛菜/小白菜", "🥬"],
  ["dish-shuizhu-qingcai", "cat-main", "水煮青菜", "🥬"],
  ["dish-suanla-tudou", "cat-main", "酸辣土豆片/土豆丝", "🥔"],

  ["dish-dapao-fan", "cat-rice-noodle", "打抛饭", "🍛"],
  ["dish-jiangcong-jituifan", "cat-rice-noodle", "姜葱鸡腿饭", "🍛"],
  ["dish-niuroumian", "cat-rice-noodle", "牛肉面（炖牛肋条）", "🍜"],
  ["dish-luroufan", "cat-rice-noodle", "卤肉饭", "🍛"],
  ["dish-congshao-niushefan", "cat-rice-noodle", "葱烧牛舌饭", "🍛"],

  ["dish-jiegua-yaozhu-dagutang", "cat-soup", "节瓜瑶柱大骨汤", "🍲"],
  ["dish-fanqie-shuzai-tang", "cat-soup", "番茄薯仔汤（罗宋汤）", "🍲"],
  ["dish-hulatang", "cat-soup", "胡辣汤", "🍲"],
  ["dish-niuwan-wandoumiao-tang", "cat-soup", "牛丸豌豆苗汤", "🍲"],
  ["dish-dajiangtang", "cat-soup", "大酱汤", "🍲"],
  ["dish-paocai-wuhuarou-tang", "cat-soup", "泡菜五花肉汤", "🍲"],
];

export const seedDishes: Dish[] = dishRows.map(([id, categoryId, name, emoji], index) => ({
  id,
  family_id: defaultFamily.id,
  category_id: categoryId,
  name,
  description: null,
  image_url: `emoji:${emoji}`,
  sort_order: index + 1,
  is_active: true,
  is_recommended: index % 7 === 0,
  created_at: now,
  updated_at: now,
}));
