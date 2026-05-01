// One-shot script to fill the priority ZH gaps surfaced by the i18n audit.
// Target: settings (24) + subscription (11) + adaptive_practices (79) +
// practices (3) + common (1) + labels (6) + stats (6) + journal (3) = 133 keys.
//
// Translations follow the existing ZH-style we observed in the file:
// Simplified Chinese, 你 (informal you), short imperatives for guiding lines,
// reuse of established terminology (心率/呼吸/压力/能量/订阅/设置).

const fs = require('fs');
const path = require('path');

const TRANS = {
  // ─── settings.* (24) ──────────────────────────────────────────────────────
  'settings.customize_profile': '个性化您的档案',
  'settings.your_name': '您的名字（显示在排行榜上）',
  'settings.enter_name': '请输入您的名字',
  'settings.characters': '字符',
  'settings.name_required': '名字不能为空',
  'settings.name_too_long': '名字不能超过30个字符',
  'settings.save_error': '保存更改失败',
  'settings.name_updated': '名字更新成功！',
  'settings.saving': '保存中',
  'settings.name_info': '💡 您的名字将显示在玩家排行榜上。选择一个能代表您的名字',
  'settings.bluetooth_monitor': '蓝牙心率监测器',
  'settings.bluetooth_desc': '连接心率追踪器，在练习期间获得实时生物反馈',
  'settings.bpm': 'BPM',
  'settings.br_unit': '/分钟',
  'settings.stress_label': '压力',
  'settings.energy_label': '能量',
  'settings.device_connect': '连接',
  'settings.scan_stop': '停止',
  'settings.recovery_rate_desc': '压力后心率恢复正常的速度',
  'settings.hr_acceleration_desc': '心率上升的速度',
  'settings.connection_instructions': '连接说明：',
  'settings.instruction_1': '手机上：关闭标准追踪器应用。开启蓝牙',
  'settings.instruction_2': '追踪器上：设置 → 共享心率 → 启用',
  'settings.realtime_metrics': '实时指标。正在校准基线…',

  // ─── subscription.* (11) ──────────────────────────────────────────────────
  'subscription.try_free_14': '免费试用14天',
  'subscription.disclaimer_yearly': '14天完全免费，之后每月5.42美元，按年计费64.99美元/年。随时取消。',
  'subscription.disclaimer_monthly': '7天完全免费，之后每月14.99美元。随时取消。',
  'subscription.restore': '恢复购买',
  'subscription.restoring': '恢复中…',
  'subscription.processing': '处理中…',
  'subscription.loading': '加载中…',
  'subscription.error_no_product': '产品不可用',
  'subscription.error_purchase': '购买失败',
  'subscription.error_restore': '恢复失败',
  'subscription.error_no_purchases': '没有可恢复的购买',

  // ─── adaptive_practices.* (79) ────────────────────────────────────────────
  // inner_smile (11)
  'adaptive_practices.inner_smile.name': '内在微笑',
  'adaptive_practices.inner_smile.short_phrase': '用心微笑——不动面容，由内而生。',
  'adaptive_practices.inner_smile.guiding_1': '放松双肩，松弛下颌，让舌头自然安放。',
  'adaptive_practices.inner_smile.guiding_2': '感受胸中一处温暖之点，让它"微笑"。',
  'adaptive_practices.inner_smile.guiding_3': '让一波柔和的微笑流过你的面部、眼睛和喉咙。',
  'adaptive_practices.inner_smile.guiding_4': '将这微笑送往腹部、太阳神经丛和脊柱。',
  'adaptive_practices.inner_smile.guiding_5': '吸气时聚集温暖之感，呼气时与全身分享。',
  'adaptive_practices.inner_smile.guiding_6': '若真实的微笑浮现于脸上——不必抑制，只需让它柔化。',
  'adaptive_practices.inner_smile.guiding_7': '呼吸如同感谢身体的工作。',
  'adaptive_practices.inner_smile.guiding_8': '善待自己——这是喜悦的源泉。',
  'adaptive_practices.inner_smile.final_phrase': '当心微笑时，世界以温暖回应。',

  // amoeba_dance (11)
  'adaptive_practices.amoeba_dance.name': '阿米巴之舞',
  'adaptive_practices.amoeba_dance.short_phrase': '让喜悦在呼吸的波浪上轻微地推动身体。',
  'adaptive_practices.amoeba_dance.guiding_1': '保持中轴：头顶向上，尾骨向下，呼吸自如。',
  'adaptive_practices.amoeba_dance.guiding_2': '从几乎察觉不到的摇摆开始——5%的幅度。',
  'adaptive_practices.amoeba_dance.guiding_3': '吸气——微微上提，呼气——微微下沉。',
  'adaptive_practices.amoeba_dance.guiding_4': '探索三个方向：前后、左右、柔和的螺旋。',
  'adaptive_practices.amoeba_dance.guiding_5': '手掌和肩膀保持放松，面容温暖轻盈。',
  'adaptive_practices.amoeba_dance.guiding_6': '让动作从腹部中心生起，自然消逝。',
  'adaptive_practices.amoeba_dance.guiding_7': '若速度加快——回到"几乎静止"的状态。',
  'adaptive_practices.amoeba_dance.guiding_8': '觉察喜悦如何在身体中毫不费力地浮现——如同温柔的脉动。',
  'adaptive_practices.amoeba_dance.final_phrase': '喜悦是自我呼吸的运动。',

  // warm_sphere (10)
  'adaptive_practices.warm_sphere.name': '温暖之球',
  'adaptive_practices.warm_sphere.short_phrase': '在腹部创造一个温暖之球，以它滋养全身。',
  'adaptive_practices.warm_sphere.guiding_1': '将注意力放在肚脐/太阳神经丛区域。',
  'adaptive_practices.warm_sphere.guiding_2': '吸气时将温暖聚集在那里——如同捧在内在的双手中。',
  'adaptive_practices.warm_sphere.guiding_3': '呼气时让球体扩展：到下背部、胸部、骨盆、大腿。',
  'adaptive_practices.warm_sphere.guiding_4': '想象疲劳融化并流向双脚。',
  'adaptive_practices.warm_sphere.guiding_5': '缓慢呼吸，毫不费力；保持面容柔和，喉咙松弛。',
  'adaptive_practices.warm_sphere.guiding_6': '若思绪回来——再次找到温暖之球的边界。',
  'adaptive_practices.warm_sphere.guiding_7': '让它变得稳定坚实，如同身体内的夜灯。',
  'adaptive_practices.warm_sphere.final_phrase': '温暖之球从内在支撑你，力量温柔地回归。',

  // rest_breath (9)
  'adaptive_practices.rest_breath.name': '休息之息',
  'adaptive_practices.rest_breath.short_phrase': '缓慢的呼气带走疲劳。让身体沉入支撑。',
  'adaptive_practices.rest_breath.guiding_1': '躺下或坐着，让背部得到完全支撑。',
  'adaptive_practices.rest_breath.guiding_2': '用鼻子轻轻吸气，充满腹部。',
  'adaptive_practices.rest_breath.guiding_3': '通过微微张开的双唇缓慢呼气——是吸气时间的两倍。',
  'adaptive_practices.rest_breath.guiding_4': '每次呼气，让身体变得更重。',
  'adaptive_practices.rest_breath.guiding_5': '释放面部、肩膀、双手的紧张。',
  'adaptive_practices.rest_breath.guiding_6': '想象呼吸如温水般化解疲劳。',
  'adaptive_practices.rest_breath.guiding_7': '毫不费力地保持这缓慢的节奏。',
  'adaptive_practices.rest_breath.final_phrase': '休息不是软弱——而是身体的智慧。',

  // silence_point (10)
  'adaptive_practices.silence_point.name': '静止之点',
  'adaptive_practices.silence_point.short_phrase': '在内在找到一个静止之点，绕着它呼吸。',
  'adaptive_practices.silence_point.guiding_1': '闭上双眼。让呼吸变得几乎察觉不到。',
  'adaptive_practices.silence_point.guiding_2': '觉察一个静止之点——在腹部深处或胸部中央。',
  'adaptive_practices.silence_point.guiding_3': '不要用力触碰它；绕着它呼吸，如水绕石。',
  'adaptive_practices.silence_point.guiding_4': '吸气时注意力聚集于中轴；呼气时——化解多余之物。',
  'adaptive_practices.silence_point.guiding_5': '思绪如云飘过：觉察——然后放下。',
  'adaptive_practices.silence_point.guiding_6': '耳朵倾听寂静，皮肤倾听空气，心倾听自己。',
  'adaptive_practices.silence_point.guiding_7': '让"我"的边界变得柔软，如雾中之光。',
  'adaptive_practices.silence_point.guiding_8': '留在这点附近——它一无所求，本已宁静。',
  'adaptive_practices.silence_point.final_phrase': '在静止之点中，一切已然发生——剩下的只是存在。',

  // listen_space (10)
  'adaptive_practices.listen_space.name': '聆听空间',
  'adaptive_practices.listen_space.short_phrase': '不要聆听声音——聆听声音之间的空间。',
  'adaptive_practices.listen_space.guiding_1': '让呼吸自然；让听觉向360度敞开。',
  'adaptive_practices.listen_space.guiding_2': '觉察近处和远处的声音——不去命名它们。',
  'adaptive_practices.listen_space.guiding_3': '聆听每个声音由之诞生并归于其中的间隙。',
  'adaptive_practices.listen_space.guiding_4': '扩展注意力：身体 → 房间 → 街道 → 更远处。',
  'adaptive_practices.listen_space.guiding_5': '让每个声音穿过你而不执著。',
  'adaptive_practices.listen_space.guiding_6': '若判断浮现——"喜欢/不喜欢"——随呼气释放。',
  'adaptive_practices.listen_space.guiding_7': '觉察空间如何回应你的聆听——通过呼吸周围的寂静。',
  'adaptive_practices.listen_space.guiding_8': '对世界变得透明，世界也对你变得透明。',
  'adaptive_practices.listen_space.final_phrase': '当你聆听空间时，空间也开始聆听你。',

  // still_form (14)
  'adaptive_practices.still_form.name': '静止之形',
  'adaptive_practices.still_form.short_phrase': '在稳定的姿势中静止。呼吸自行流动。成为宁静之形。',
  'adaptive_practices.still_form.guiding_1': '舒适地坐着或站着；选择一个简单、稳定的姿势。',
  'adaptive_practices.still_form.guiding_2': '感受支撑：双脚/坐骨和骨盆的重量。',
  'adaptive_practices.still_form.guiding_3': '伸直脊柱；头顶轻柔向上，下巴自由。',
  'adaptive_practices.still_form.guiding_4': '放下肩膀，松弛下颌，舌头自由，目光柔和。',
  'adaptive_practices.still_form.guiding_5': '吸气——中轴延展；呼气——重量沉入大地。',
  'adaptive_practices.still_form.guiding_6': '让呼吸自然；不去控制，只是觉察。',
  'adaptive_practices.still_form.guiding_7': '觉察静止中的微小动态：脉搏、温暖的波浪、几乎听不见的吸气。',
  'adaptive_practices.still_form.guiding_8': '不要固定任何东西——让形式立着，生命在内安静地流动。',
  'adaptive_practices.still_form.guiding_9': '注意力保持在三点：下方的支撑、温暖的腹部、宁静的心。',
  'adaptive_practices.still_form.guiding_10': '若心思游离——回到重量和与大地接触的感觉。',
  'adaptive_practices.still_form.guiding_11': '让寂静从内在逐渐充满形体，如光充满水。',
  'adaptive_practices.still_form.guiding_12': '比想要的多停留一会——宁静从那里开始。',
  'adaptive_practices.still_form.final_phrase': '当形体静止时，寂静在其中诞生。',

  // ─── practices.* (3) ──────────────────────────────────────────────────────
  'practices.elemental': '元素',
  'practices.practice_time': '练习时间',
  'practices.bonus': '奖励',

  // ─── common.* (1) ─────────────────────────────────────────────────────────
  'common.other_or_not_sure': '其他 / 不确定',

  // ─── labels.* (6) ─────────────────────────────────────────────────────────
  'labels.hours_ago': '小时前',
  'labels.complete_all_practices': '完成所有回路练习',
  'labels.track_label': '追踪',
  'labels.of_label': '/',
  'labels.stress': '压力水平',
  'labels.energy': '能量水平',

  // ─── stats.* (6) ──────────────────────────────────────────────────────────
  'stats.achievements_section': '🏆 成就 ({{unlocked}}/{{total}})',
  'stats.rank_novice': '新手',
  'stats.rank_student': '学生',
  'stats.rank_practitioner': '修习者',
  'stats.rank_master': '大师',
  'stats.rank_guru': '导师',

  // ─── journal.* (3) ────────────────────────────────────────────────────────
  'journal.no_records': '暂无记录',
  'journal.duration': '时长',
  'journal.qnt': 'OND',
};

// Apply translations to zh/translation.json (nested set).
const zhPath = path.join(__dirname, '..', 'public', 'locales', 'zh', 'translation.json');
const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

function setKey(obj, key, value) {
  const parts = key.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

let added = 0;
for (const [key, value] of Object.entries(TRANS)) {
  setKey(zh, key, value);
  added++;
}

fs.writeFileSync(zhPath, JSON.stringify(zh, null, 2) + '\n');
console.log(`Added ${added} ZH translations to ${zhPath}`);
