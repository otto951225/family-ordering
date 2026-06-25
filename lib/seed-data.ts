import type { Category, Dish, Family } from "@/types/domain";

const now = "2026-06-24T00:00:00.000Z";
export const defaultFamily: Family = {
  id: "family-home",
  slug: "home",
  name: "家庭餐桌",
  created_at: now,
  updated_at: now,
};

const categoryRows = [
  ["cat-meat", "荤菜", "🥩"],
  ["cat-veg", "素菜", "🥬"],
  ["cat-soup", "汤", "🥣"],
  ["cat-cold", "凉菜", "🥒"],
  ["cat-staple", "主食", "🍚"],
  ["cat-breakfast", "早餐", "🥛"],
  ["cat-drink", "饮品", "🍹"],
  ["cat-fruit", "水果", "🍉"],
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

const dishRows: Array<[string, string, string, string, string]> = [
  ["dish-hongshaorou", "cat-meat", "红烧肉", "软糯咸香，适合配米饭", "🍖"],
  ["dish-shuizhuniurou", "cat-meat", "水煮牛肉", "麻辣鲜香", "🥩"],
  ["dish-yangpai", "cat-meat", "黄焖羊排", "浓香暖胃", "🍖"],
  ["dish-paigu", "cat-meat", "糖醋排骨", "酸甜开胃", "🍖"],
  ["dish-jiding", "cat-meat", "宫保鸡丁", "微辣下饭", "🍗"],
  ["dish-jichi", "cat-meat", "可乐鸡翅", "孩子也爱吃", "🍗"],
  ["dish-shishu", "cat-veg", "清炒时蔬", "清爽少油", "🥬"],
  ["dish-disanxian", "cat-veg", "地三鲜", "家常素菜", "🍆"],
  ["dish-baocai", "cat-veg", "手撕包菜", "脆嫩下饭", "🥬"],
  ["dish-xilanhua", "cat-veg", "蒜蓉西兰花", "清香爽口", "🥦"],
  ["dish-doufu", "cat-veg", "麻婆豆腐", "香辣嫩滑", "🌶️"],
  ["dish-tudousi", "cat-veg", "酸辣土豆丝", "酸辣爽脆", "🥔"],
  ["dish-fanqietang", "cat-soup", "西红柿鸡蛋汤", "酸甜暖汤", "🍅"],
  ["dish-yumitang", "cat-soup", "排骨玉米汤", "清甜营养", "🌽"],
  ["dish-zicaitang", "cat-soup", "紫菜蛋花汤", "快手清汤", "🥣"],
  ["dish-dongguatang", "cat-soup", "冬瓜丸子汤", "清淡鲜美", "🥣"],
  ["dish-jungutang", "cat-soup", "菌菇汤", "鲜味浓郁", "🍄"],
  ["dish-huanggua", "cat-cold", "凉拌黄瓜", "清脆解腻", "🥒"],
  ["dish-koushuiji", "cat-cold", "口水鸡", "麻辣鲜香", "🍗"],
  ["dish-muer", "cat-cold", "凉拌木耳", "爽口小菜", "🍄"],
  ["dish-pidandoufu", "cat-cold", "皮蛋豆腐", "嫩滑开胃", "🥚"],
  ["dish-mifan", "cat-staple", "米饭", "每日主食", "🍚"],
  ["dish-mantou", "cat-staple", "馒头", "松软管饱", "🥟"],
  ["dish-miantiao", "cat-staple", "面条", "热乎顺口", "🍜"],
  ["dish-chaofan", "cat-staple", "炒饭", "粒粒分明", "🍛"],
  ["dish-jiaozi", "cat-staple", "饺子", "团圆味道", "🥟"],
  ["dish-doujiang", "cat-breakfast", "豆浆", "早餐经典", "🥛"],
  ["dish-youtiao", "cat-breakfast", "油条", "酥脆热乎", "🥖"],
  ["dish-baozi", "cat-breakfast", "包子", "方便饱腹", "🥟"],
  ["dish-jidan", "cat-breakfast", "鸡蛋", "营养简单", "🥚"],
  ["dish-zhou", "cat-breakfast", "小米粥", "暖胃清淡", "🥣"],
  ["dish-sanmingzhi", "cat-breakfast", "三明治", "轻便早餐", "🥪"],
  ["dish-niunai", "cat-drink", "牛奶", "温热香醇", "🥛"],
  ["dish-guozhi", "cat-drink", "果汁", "酸甜清爽", "🧃"],
  ["dish-ningmengshui", "cat-drink", "柠檬水", "清新解腻", "🍋"],
  ["dish-xigua", "cat-fruit", "西瓜", "清甜多汁", "🍉"],
  ["dish-pingguo", "cat-fruit", "苹果", "脆甜日常", "🍎"],
  ["dish-chengzi", "cat-fruit", "橙子", "酸甜补水", "🍊"],
  ["dish-putao", "cat-fruit", "葡萄", "一口一个", "🍇"],
];

export const seedDishes: Dish[] = dishRows.map(([id, categoryId, name, description, emoji], index) => ({
  id,
  family_id: defaultFamily.id,
  category_id: categoryId,
  name,
  description,
  image_url: `emoji:${emoji}`,
  sort_order: index + 1,
  is_active: true,
  is_recommended: index % 5 === 0,
  created_at: now,
  updated_at: now,
}));
