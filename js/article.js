(function () {
  'use strict';

  // Apply dark mode before render to avoid flash
  (function () {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();

  var ARTICLES = [
    { file: 'hokkaido-touring.html',      title: 'SR400北海道ひとり旅｜エサヌカ線で泣きそうになったツーリング記録',                           category: 'bike',       tag: '北海道ツーリング', img: '../images/hokkaido/エサヌカ線.jpg',                                                                                      date: '2019-07-15' },
    { file: 'taiwan.html',                title: '台湾旅行記｜基隆の夕暮れと十分のランタン上げが想像以上によかった',                   category: 'other',      tag: '台湾',             img: '../images/taiwan/z50_0939_dxo.jpg',                                                                                      date: '2025-09-01' },
    { file: 'costa-rica-intro.html',       title: 'コスタリカとはどんな国？｜自然・治安・暮らしを元在住者が紹介【コスタリカ滞在記①】',                               category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-map.jpg',                                                                                           date: '2018-01-30' },
    { file: 'costa-rica-irazu.html',       title: 'イラス火山の行き方と見どころ｜火口湖が見えなかった日【コスタリカ滞在記②】',                         category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-irazu/irazu-crater-view.jpg',                                                                       date: '2013-11-07' },
    { file: 'costa-rica-christmas.html',   title: 'コスタリカのクリスマスと年越し｜タマル・爆竹・光の祭典【コスタリカ滞在記③】',                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_bd4831b3aa4f4502a43029245d5fddc4~mv2_d_2800_2800_s_4_2.jpg',                  date: '2018-02-02' },
    { file: 'costa-rica-color-run.html',   title: 'コスタリカ日本人学校とThe Color Run｜サンホセで見た子どもたちと祭り【コスタリカ滞在記④】',                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_6a5dbafe9b2a402589c1c87b64e296ba~mv2.png',                                    date: '2019-02-12' },
    { file: 'costa-rica-semana-santa.html', title: 'マヌエル・アントニオ国立公園へ｜セマナ・サンタのコスタリカ旅行【コスタリカ滞在記⑤】',               category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica/manuel-antonio-animals.avif',                                                                       date: '2019-02-05' },
    { file: 'costa-rica-food.html',        title: 'コスタリカ・中米料理まとめ｜ガジョピント、セビーチェ、ライス＆ビーンズ【コスタリカ滞在記⑥】',                                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_ba55d298fd444594b32692749af90ed2~mv2.png',                                    date: '2019-02-12' },
    { file: 'costa-rica-work.html',        title: 'コスタリカで理学療法士として働いた話｜簡易装具で歩けるようになった患者【コスタリカ滞在記⑦】', category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_3ddc83f695764babb8d3abf036ffa77e~mv2.jpg',                                    date: '2018-08-09' },
    { file: 'costa-rica-cano-negro.html',  title: 'カニョネグロとモンテベルデ旅行記｜野生動物を探す年末年始【コスタリカ滞在記⑧】',     category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-cano-negro/monteverde-motmot.jpg',                                                                   date: '2014-12-25' },
    { file: 'costa-rica-aribada.html',     title: 'アリバダを見にオスティオナルへ｜ヒメウミガメ集団産卵に間に合わなかった話【コスタリカ滞在記⑨】',                 category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-aribada/aribada-beach.jpg',                                                                         date: '2015-09-01' },
    { file: 'nicaragua-ometepe-1.html',   title: 'コスタリカからニカラグアへ国境越え｜TICA BUSでオメテペ島へ【ニカラグア旅行記①】',  category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_019bd4603cf949559dd74edbb0af66f0~mv2.jpg',                                    date: '2016-11-06' },
    { file: 'nicaragua-ometepe-2.html',   title: 'オメテペ島観光を1日で巡る｜オホ・デ・アグアと火山島の見どころ【ニカラグア旅行記②】',   category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_ef3f551a51dd4c5aa071e586251d053c~mv2.jpg',                                    date: '2016-11-08' },
    { file: 'nicaragua-granada.html',     title: 'グラナダ観光と革製品探し｜ニカラグアの植民地都市を歩く【ニカラグア旅行記③】',         category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_fb403e7af29a471c8b1254216f87e047~mv2_d_2048_1366_s_2.jpg',                  date: '2016-11-16' },
    { file: 'nicaragua-managua.html',     title: 'マナグア観光と友人との再会｜ニカラグアの首都で過ごした一日【ニカラグア旅行記④】',       category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_f1a030e4b47244219104f6bf529c572b~mv2.jpg',                                    date: '2018-06-13' },
    { file: 'nicaragua-leon.html',        title: 'レオン観光｜革命の記憶とルベン・ダリオの街を歩く【ニカラグア旅行記⑤】',               category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_8875da9d3c0a4cf5a82475a6fc11b57a~mv2.jpg',                                    date: '2018-06-17' },
    { file: 'nicaragua-flor-de-cana.html', title: 'フロール・デ・カーニャ工場見学｜ニカラグアのラム酒を味わう【ニカラグア旅行記⑥】',     category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_2abdad5c98df48c09ea644159fd8cd96~mv2_d_4608_3072_s_4_2.jpg',                  date: '2016-09-07' },
    { file: 'el-salvador-ruins.html',     title: 'ホヤ・デ・セレンとタスマル遺跡へ｜エルサルバドルの世界遺産とマヤ遺跡【エルサルバドル旅行記①】',                     category: 'other',      tag: 'エルサルバドル',   img: '../images/el-salvador-ruins/ruins-1.jpg',                                                                                date: '2014-08-31' },
    { file: 'el-salvador-volcan.html',    title: 'サンタ・アナ火山登山｜警察エスコート付きで火口湖を見に行った話【エルサルバドル旅行記②】',           category: 'other',      tag: 'エルサルバドル',   img: '../images/el-salvador-volcan/volcan-1.jpg',                                                                              date: '2014-09-02' },
    { file: 'mexico-zocalo.html',         title: 'メキシコシティ歴史地区観光｜ソカロ・テンプロマヨール・大聖堂を歩く【メキシコ旅行記①】',                             category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/zocalo-catedral.jpg',                                                                                   date: '2026-02-22' },
    { file: 'mexico-guadalupe.html',      title: 'グアダルーペ大聖堂の見どころ｜テペヤックの丘と奇跡のマント【メキシコ旅行記②】',                                     category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/guadalupe-aerial.jpg',                                                                                  date: '2026-02-21' },
    { file: 'mexico-walk.html',           title: 'メキシコシティ街歩き｜革命記念塔・朝食・ストリートアートを巡る【メキシコ旅行記③】',                                     category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/revolucion-monument.jpg',                                                                               date: '2026-02-21' },
    { file: 'mexico-walmart.html',        title: 'メキシコ土産はウォルマートが穴場｜サルサ・コーヒー・チョコレート購入記【メキシコ旅行記④】',                           category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/walmart-salsa.jpg',                                                                                     date: '2026-02-22' },
    { file: 'touring-camp-gear.html',     title: 'バイクソロキャンプ道具まとめ｜テント・シュラフ・マット選び【キャンプ道具編①】',                       category: 'camp',       tag: 'キャンプ・ギア',   img: 'https://static.wixstatic.com/media/949ec9_afd223212bc6483f830f93812da66369~mv2_d_3024_4032_s_4_2.jpg',                  date: '2017-11-12' },
    { file: 'camp-mori-makiba.html',      title: '森のまきばオートキャンプ場レビュー｜冬のソロキャンプと料金・雰囲気',                               category: 'camp',       tag: 'キャンプ',         img: 'https://static.wixstatic.com/media/949ec9_be02da1f1cce47dfa15fb7184f2e8dd6~mv2_d_4032_3024_s_4_2.jpg',                  date: '2018-12-15' },
    { file: 'atsukan.html',               title: '家で熱燗を楽しむ日本酒レビュー｜萬寿鏡F60と八海山雪室貯蔵三年',                                       category: 'other',      tag: '酒・グルメ',       img: 'https://static.wixstatic.com/media/949ec9_69fcb4358adc4328a919ec0cfc491f98~mv2_d_2987_3938_s_4_2.jpg',                  date: '2017-01-10' },
    { file: 'power-beam.html',            title: 'SR400の振動対策にパワービームを装着｜長距離ツーリングでの変化をレビュー',                                       category: 'bike',       tag: 'バイク・ギア',     img: 'https://static.wixstatic.com/media/949ec9_c07a3465b14f4301835b4585c13ca9b3~mv2_d_4032_3024_s_4_2.jpg',                  date: '2018-09-19' },
    { file: 'spanish-dictionary.html',    title: 'スペイン語辞書おすすめ比較｜紙辞書・電子辞書・アプリを中米経験者が選ぶ',                           category: 'other',      tag: 'スペイン語',       img: 'https://static.wixstatic.com/media/949ec9_316ae78b6611491fad1cb3d780461968~mv2.jpg',                                    date: '2016-10-12' },
    { file: 'bandai-azuma.html',          title: '磐梯吾妻スカイラインツーリング｜火山地帯を走る福島の絶景ルート',                               category: 'bike',       tag: 'ツーリング',       img: '../images/bandai/IMG_3857.jpg',                                                                                          date: '2018-10-01' },
    { file: 'five-color-lake.html',       title: '五色沼観光｜福島・裏磐梯でエメラルドグリーンの湖沼群を歩く',                                         category: 'bike',       tag: '旅',               img: '../images/five-color-lake/IMG_8015.jpg',                                                                                 date: '2018-10-02' },
    { file: 'hokkaido-car.html',          title: '北海道ソロドライブ｜神威岬・黄金岬・函館夜景を巡る一人旅',                                     category: 'bike',       tag: '北海道',           img: '../images/hokkaido-car/神威岬.jpg',                                                                                      date: '2025-11-01' },
    { file: 'touring-chiba-xsr900.html',  title: 'XSR900千葉ソロツーリング｜笠森観音と房総の山道を走る',                               category: 'bike',       tag: 'ツーリング',       img: '../images/touring-chiba2/IMG_2388.jpg',                                                                                  date: '2026-04-01' },
    { file: 'chile-1.html',               title: 'サンティアゴ市内観光｜チリ最高裁・美術館・歴史地区を歩く【チリ旅行記①】',                                 category: 'other',      tag: 'チリ',             img: '../images/chile/20251012_143804099_iOS.jpg',                                                                              date: '2025-10-12' },
    { file: 'chile-2.html',               title: 'ロス・ドミニコス工芸市場へ｜サンティアゴで民芸品と白い教会を巡る【チリ旅行記②】',                                   category: 'other',      tag: 'チリ',             img: '../images/chile/20251014_205137977_iOS.jpg',                                                                              date: '2025-10-14' },
    { file: 'chile-3.html',               title: 'サンティアゴ最終日｜パルタ・レイナとクリスマス前の街歩き【チリ旅行記③】',                                   category: 'other',      tag: 'チリ',             img: '../images/chile/20251016_170946020_iOS.jpg',                                                                              date: '2025-10-16' },
    { file: 'belize-1.html',              title: 'ベリーズシティ到着｜夜明けのカリブ海とアジア系スーパー散策【ベリーズ旅行記①】',                 category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251018_213429265_iOS.jpg',                                                                             date: '2025-10-18' },
    { file: 'belize-2.html',              title: 'キーカーカー島とグレート・ブルーホール遊覧飛行｜ベリーズのカリブ海を空から見る【ベリーズ旅行記②】',             category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251019_213939041_iOS.jpg',                                                                             date: '2025-10-19' },
    { file: 'belize-3.html',              title: 'ベリーズシティ街歩き｜スウィング・ブリッジと最終日の過ごし方【ベリーズ旅行記③】',                       category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251020_144751630_iOS.jpg',                                                                             date: '2025-10-20' },
    { file: 'zao-ginzan.html',            title: '蔵王と銀山温泉1泊2日｜御釜・大露天風呂・大正ロマンの夜景',                                     category: 'other',      tag: '東北',             img: '../images/zao-ginzan/20250628_133653099_iOS.jpg',                                                                         date: '2025-06-28' },
    { file: 'himawari-tsunan.html',       title: '新潟夏旅2日間｜津南ひまわり畑と長岡花火大会を巡る',                           category: 'other',      tag: '新潟',             img: '../images/himawari/20250802_011958175_iOS_1.jpg',                                                                         date: '2025-08-02' },
    { file: 'hokkaido-xsr900-day1.html',  title: '大洗からさんふらわあで苫小牧へ｜XSR900北海道ツーリング記録①',                         category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250819_070951847_iOS.jpg',                                                                    date: '2025-08-19' },
    { file: 'hokkaido-xsr900-day2.html',  title: 'ウポポイと帯広の豚丼を巡る上陸初日｜XSR900北海道ツーリング記録②',                          category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250820_054937983_iOS.jpg',                                                                    date: '2025-08-20' },
    { file: 'hokkaido-xsr900-day3.html',  title: '厚岸蒸留所と根室の海鮮を楽しむ東北海道ルート｜XSR900北海道ツーリング記録③',                                category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250821_010411011_iOS.jpg',                                                                    date: '2025-08-21' },
    { file: 'hokkaido-xsr900-day4.html',  title: '納沙布岬から知床五湖へ走る道東ツーリング｜XSR900北海道ツーリング記録④',                                    category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250821_072833977_iOS.jpg',                                                                    date: '2025-08-21' },
    { file: 'hokkaido-xsr900-day5.html',  title: '神の子池・網走監獄・美幌峠を巡る｜XSR900北海道ツーリング記録⑤',                            category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250823_022248708_iOS.jpg',                                                                    date: '2025-08-23' },
    { file: 'hokkaido-xsr900-day6.html',  title: '枝幸で財布を落としてAirTagに救われた話｜XSR900北海道ツーリング記録⑥',                                category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250824_040949567_iOS.jpg',                                                                    date: '2025-08-24' },
    { file: 'hokkaido-xsr900-day7.html',  title: 'オロロンラインを稚内から旭川へ走る｜XSR900北海道ツーリング記録⑦',                               category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250825_110201838_iOS.jpg',                                                                    date: '2025-08-25' },
    { file: 'hokkaido-xsr900-day8.html',  title: '美瑛の青い池・白ひげの滝から苫小牧へ｜XSR900北海道ツーリング記録⑧',                        category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250826_002032526_iOS.jpg',                                                                    date: '2025-08-26' },
    { file: 'panama-1.html',              title: 'パナマ・ビエホ観光｜500年前の廃墟とスペイン植民地時代の歴史【パナマ旅行記①】',                         category: 'other',      tag: 'パナマ',           img: '../images/panama/pv-1.jpg',                                                                                               date: '2025-01-10' },
    { file: 'panama.html',                title: 'カスコ・ビエホとマリスコス市場を歩く｜世界遺産の旧市街と魚市場【パナマ旅行記②】',           category: 'other',      tag: 'パナマ',           img: '../images/panama/panama-1.jpg',                                                                                          date: '2025-01-11' },
    { file: 'panama-3.html',              title: 'ミラフローレス閘門見学｜パナマ運河で巨大船が通る瞬間を見た【パナマ旅行記③】',             category: 'other',      tag: 'パナマ',           img: '../images/panama/canal-1.jpg',                                                                                           date: '2025-01-12' },
    { file: 'costa-rica-2025.html',       title: 'コスタリカ10年ぶり再訪｜変わったサンホセと変わらないピルセンの味',             category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-2025/cr-5.jpg',                                                                                     date: '2025-01-15' },
    { file: 'noto-touring.html',          title: '能登半島ツーリング記録｜総持寺祖院と金箔刺身の宿ごはん',                               category: 'bike',       tag: 'ツーリング',       img: '../images/noto/noto-1.jpg',                                                                                              date: '2022-08-01' },
    { file: 'irako.html',                 title: '伊良湖岬ひとり旅｜年末の海辺と強風の愛知散歩',                                                   category: 'bike',       tag: 'ツーリング',       img: '../images/irako/lighthouse.jpg',                                                                                         date: '2023-12-31' },
    { file: 'chiba-chibanians.html',      title: 'チバニアン観光と千葉ツーリング｜地層見学・猪遭遇・バイクトラブル',                 category: 'bike',       tag: 'ツーリング',       img: '../images/chiba-chibanians/chiba-cliff.jpg',                                                                             date: '2024-05-01' },
    { file: 'toro-daishi.html',           title: '燈籠坂大師の切通しトンネルへ｜千葉の写真映えスポットをXSR900で再訪',                     category: 'bike',       tag: 'ツーリング',       img: '../images/toro-daishi/toro-1.jpg',                                                                                       date: '2024-03-01' },
    { file: 'izu-touring.html',           title: '伊豆半島1泊2日ツーリング｜芦ノ湖スカイラインと西伊豆ルート',                               category: 'bike',       tag: 'ツーリング',       img: '../images/izu-touring/sea.jpg',                                                                                          date: '2023-06-16' },
    { file: 'motorcycle-show-2026.html',  title: '東京モーターサイクルショー2026感想｜気になったバイクとサイドバッグ',                         category: 'bike',       tag: 'バイク',           img: '../images/motorcycle-show/cbr400r.jpg',                                                                                  date: '2026-03-28' }
  ];

  window.ARTICLES = ARTICLES;

  document.addEventListener('DOMContentLoaded', function () {
    injectScrollLine();
    injectBackToTop();
    injectDarkModeToggle();
    injectMobileNav();
    injectLightbox();
    injectLazyLoading();
    injectTOC();
    injectShareButtons();
    injectSeriesNav();
    injectRelated();
    injectMapLinks();
    injectCopyCredit();
    injectSearch();
  });

  // ── Mobile Nav ─────────────────────────────────────────────────
  function injectMobileNav() {
    var headerInner = document.querySelector('.header-inner');
    var header = document.querySelector('header');
    if (!headerInner || !header) return;

    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'メニュー');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    headerInner.appendChild(btn);

    var base = location.pathname.indexOf('/articles/') !== -1 ? '../' : '';
    var panel = document.createElement('div');
    panel.className = 'mobile-nav';
    panel.innerHTML =
      '<a href="' + base + 'index.html">ホーム</a>' +
      '<a href="' + base + 'index.html#articles">記事一覧</a>' +
      '<a href="' + base + 'profile/">プロフィール</a>';
    header.insertAdjacentElement('afterend', panel);

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        panel.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Search ─────────────────────────────────────────────────────
  function injectSearch() {
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    var btn = document.createElement('button');
    btn.className = 'search-trigger';
    btn.setAttribute('aria-label', '検索');
    btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    headerInner.appendChild(btn);

    var overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML =
      '<button class="search-close">&#215;</button>' +
      '<div class="search-input-wrap">' +
        '<input type="text" class="search-input" placeholder="記事を検索...（タイトル・カテゴリ）" autocomplete="off" spellcheck="false"/>' +
      '</div>' +
      '<div class="search-results"></div>' +
      '<p class="search-hint">Esc で閉じる &nbsp;/&nbsp; ⌘K で開く</p>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.search-input');
    var results = overlay.querySelector('.search-results');

    function openSearch() { overlay.classList.add('active'); setTimeout(function() { input.focus(); }, 50); }
    function closeSearch() { overlay.classList.remove('active'); input.value = ''; results.innerHTML = ''; }

    btn.addEventListener('click', openSearch);
    overlay.querySelector('.search-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    });

    input.addEventListener('input', function() {
      var q = this.value.trim();
      if (!q) { results.innerHTML = ''; return; }
      var ql = q.toLowerCase();
      var all = window.ARTICLES || [];
      var matches = all.filter(function(a) {
        return a.title.toLowerCase().indexOf(ql) !== -1 || a.tag.toLowerCase().indexOf(ql) !== -1;
      });
      if (!matches.length) {
        results.innerHTML = '<p class="search-empty">「' + q + '」に一致する記事が見つかりませんでした</p>';
        return;
      }
      var isArticlePage = location.pathname.indexOf('/articles/') !== -1;
      var base = isArticlePage ? '../' : '';
      results.innerHTML = matches.slice(0, 10).map(function(a) {
        var imgSrc = a.img.indexOf('http') === 0 ? a.img : (isArticlePage ? a.img : a.img.replace('../', ''));
        return '<a class="search-result-item" href="' + base + 'articles/' + a.file + '">' +
          '<div class="search-result-img" style="background-image:url(\'' + imgSrc + '\')"></div>' +
          '<div><div class="search-result-tag">' + a.tag + '</div>' +
          '<div class="search-result-title">' + a.title + '</div></div>' +
          '</a>';
      }).join('');
    });
  }

  // ── Scroll Line ────────────────────────────────────────────────
  function injectScrollLine() {
    if (document.querySelector('.scroll-line')) return;
    var line = document.createElement('div');
    line.className = 'scroll-line';
    document.body.prepend(line);
    window.addEventListener('scroll', function () {
      var max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) line.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });
  }

  // ── Back to Top ────────────────────────────────────────────────
  function injectBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'ページ先頭に戻る');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Dark Mode Toggle ───────────────────────────────────────────
  function injectDarkModeToggle() {
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    var btn = document.createElement('button');
    btn.className = 'dark-toggle';
    btn.setAttribute('aria-label', 'ダークモード切替');
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '🌙';

    btn.addEventListener('click', function () {
      var nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (nowDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        btn.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        btn.textContent = '☀';
      }
    });

    headerInner.appendChild(btn);
  }

  // ── Lazy Loading ───────────────────────────────────────────────
  function injectLazyLoading() {
    document.querySelectorAll('img').forEach(function (img) {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  }

  // ── Lightbox ───────────────────────────────────────────────────
  function injectLightbox() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', '閉じる');
    closeBtn.textContent = '×';

    var lbImg = document.createElement('img');
    lbImg.className = 'lightbox-img';
    lbImg.alt = '';

    overlay.appendChild(closeBtn);
    overlay.appendChild(lbImg);
    document.body.appendChild(overlay);

    document.querySelectorAll('.article-body figure img').forEach(function (el) {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function () {
        lbImg.src = el.src;
        lbImg.alt = el.alt;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  // ── Table of Contents ──────────────────────────────────────────
  function injectTOC() {
    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;
    var headings = articleBody.querySelectorAll('h2');
    if (headings.length < 3) return;

    headings.forEach(function (h, i) { if (!h.id) h.id = 'section-' + (i + 1); });

    var toc = document.createElement('div');
    toc.className = 'article-toc';

    var label = document.createElement('div');
    label.className = 'article-toc-label';
    label.textContent = 'この記事の内容';

    var ol = document.createElement('ol');
    var tocLinks = [];
    headings.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var headerH = (document.querySelector('header') || {}).offsetHeight || 64;
        var top = h.getBoundingClientRect().top + window.pageYOffset - headerH - 24;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.pushState(null, '', '#' + h.id);
      });
      tocLinks.push(a);
      li.appendChild(a);
      ol.appendChild(li);
    });

    toc.appendChild(label);
    toc.appendChild(ol);

    var backLink = articleBody.querySelector('.back-link');
    if (backLink) {
      backLink.parentNode.insertBefore(toc, backLink.nextSibling);
    } else {
      articleBody.insertBefore(toc, articleBody.firstChild);
    }

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('toc-active'); });
        var active = ol.querySelector('a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('toc-active');
      });
    }, { rootMargin: '-10% 0px -75% 0px' });

    headings.forEach(function (h) { observer.observe(h); });
  }

  // ── Share Buttons ──────────────────────────────────────────────
  function injectShareButtons() {
    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    var title = document.title.replace(' | Camino Libre', '');
    var url = location.href;

    var wrap = document.createElement('div');
    wrap.className = 'share-buttons';

    var label = document.createElement('span');
    label.className = 'share-label';
    label.textContent = 'シェアする';

    var xLink = document.createElement('a');
    xLink.className = 'share-btn share-btn-x';
    xLink.href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
    xLink.target = '_blank';
    xLink.rel = 'noopener noreferrer';
    xLink.textContent = '𝕏 でシェア';

    var lineLink = document.createElement('a');
    lineLink.className = 'share-btn share-btn-line';
    lineLink.href = 'https://line.me/R/msg/text/?' + encodeURIComponent(title + '\n' + url);
    lineLink.target = '_blank';
    lineLink.rel = 'noopener noreferrer';
    lineLink.textContent = 'LINE でシェア';

    var copyBtn = document.createElement('button');
    copyBtn.className = 'share-btn share-btn-copy';
    copyBtn.textContent = 'URLコピー';
    copyBtn.addEventListener('click', function () {
      function done(t) { copyBtn.textContent = t; setTimeout(function () { copyBtn.textContent = 'URLコピー'; }, 2000); }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { done('✓ コピー済'); }).catch(function () { done('❌ 失敗'); });
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = url; ta.style.cssText = 'position:fixed;opacity:0;';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta); done('✓ コピー済');
        } catch (e) { done('❌ 失敗'); }
      }
    });

    wrap.appendChild(label);
    wrap.appendChild(xLink);
    wrap.appendChild(lineLink);
    wrap.appendChild(copyBtn);

    var tagsEl = articleBody.querySelector('.article-tags');
    if (tagsEl) {
      articleBody.insertBefore(wrap, tagsEl);
    } else {
      articleBody.appendChild(wrap);
    }
  }

  // ── Series Navigation ──────────────────────────────────────────
  var SERIES = [
    { name: 'コスタリカ滞在記', catKey: 'costa-rica', articles: [
      { file: 'costa-rica-intro.html',        title: 'コスタリカとはどんな国？｜自然・治安・暮らしを元在住者が紹介【コスタリカ滞在記①】' },
      { file: 'costa-rica-irazu.html',        title: 'イラス火山の行き方と見どころ｜火口湖が見えなかった日【コスタリカ滞在記②】' },
      { file: 'costa-rica-christmas.html',    title: 'コスタリカのクリスマスと年越し｜タマル・爆竹・光の祭典【コスタリカ滞在記③】' },
      { file: 'costa-rica-color-run.html',    title: 'コスタリカ日本人学校とThe Color Run｜サンホセで見た子どもたちと祭り【コスタリカ滞在記④】' },
      { file: 'costa-rica-semana-santa.html', title: 'マヌエル・アントニオ国立公園へ｜セマナ・サンタのコスタリカ旅行【コスタリカ滞在記⑤】' },
      { file: 'costa-rica-food.html',         title: 'コスタリカ・中米料理まとめ｜ガジョピント、セビーチェ、ライス＆ビーンズ【コスタリカ滞在記⑥】' },
      { file: 'costa-rica-work.html',         title: 'コスタリカで理学療法士として働いた話｜簡易装具で歩けるようになった患者【コスタリカ滞在記⑦】' },
      { file: 'costa-rica-cano-negro.html',   title: 'カニョネグロとモンテベルデ旅行記｜野生動物を探す年末年始【コスタリカ滞在記⑧】' },
      { file: 'costa-rica-aribada.html',      title: 'アリバダを見にオスティオナルへ｜ヒメウミガメ集団産卵に間に合わなかった話【コスタリカ滞在記⑨】' }
    ]},
    { name: 'ニカラグア旅行記', catKey: 'nicaragua', articles: [
      { file: 'nicaragua-ometepe-1.html',    title: 'コスタリカからニカラグアへ国境越え｜TICA BUSでオメテペ島へ【ニカラグア旅行記①】' },
      { file: 'nicaragua-ometepe-2.html',    title: 'オメテペ島観光を1日で巡る｜オホ・デ・アグアと火山島の見どころ【ニカラグア旅行記②】' },
      { file: 'nicaragua-granada.html',      title: 'グラナダ観光と革製品探し｜ニカラグアの植民地都市を歩く【ニカラグア旅行記③】' },
      { file: 'nicaragua-managua.html',      title: 'マナグア観光と友人との再会｜ニカラグアの首都で過ごした一日【ニカラグア旅行記④】' },
      { file: 'nicaragua-leon.html',         title: 'レオン観光｜革命の記憶とルベン・ダリオの街を歩く【ニカラグア旅行記⑤】' },
      { file: 'nicaragua-flor-de-cana.html', title: 'フロール・デ・カーニャ工場見学｜ニカラグアのラム酒を味わう【ニカラグア旅行記⑥】' }
    ]},
    { name: 'メキシコ旅行記', catKey: 'mexico', articles: [
      { file: 'mexico-zocalo.html',    title: 'メキシコシティ歴史地区観光｜ソカロ・テンプロマヨール・大聖堂を歩く【メキシコ旅行記①】' },
      { file: 'mexico-guadalupe.html', title: 'グアダルーペ大聖堂の見どころ｜テペヤックの丘と奇跡のマント【メキシコ旅行記②】' },
      { file: 'mexico-walk.html',      title: 'メキシコシティ街歩き｜革命記念塔・朝食・ストリートアートを巡る【メキシコ旅行記③】' },
      { file: 'mexico-walmart.html',   title: 'メキシコ土産はウォルマートが穴場｜サルサ・コーヒー・チョコレート購入記【メキシコ旅行記④】' }
    ]},
    { name: 'XSR900北海道ツーリング記録', catKey: 'hokkaido', articles: [
      { file: 'hokkaido-xsr900-day1.html', title: '大洗からさんふらわあで苫小牧へ｜XSR900北海道ツーリング記録①' },
      { file: 'hokkaido-xsr900-day2.html', title: 'ウポポイと帯広の豚丼を巡る上陸初日｜XSR900北海道ツーリング記録②' },
      { file: 'hokkaido-xsr900-day3.html', title: '厚岸蒸留所と根室の海鮮を楽しむ東北海道ルート｜XSR900北海道ツーリング記録③' },
      { file: 'hokkaido-xsr900-day4.html', title: '納沙布岬から知床五湖へ走る道東ツーリング｜XSR900北海道ツーリング記録④' },
      { file: 'hokkaido-xsr900-day5.html', title: '神の子池・網走監獄・美幌峠を巡る｜XSR900北海道ツーリング記録⑤' },
      { file: 'hokkaido-xsr900-day6.html', title: '枝幸で財布を落としてAirTagに救われた話｜XSR900北海道ツーリング記録⑥' },
      { file: 'hokkaido-xsr900-day7.html', title: 'オロロンラインを稚内から旭川へ走る｜XSR900北海道ツーリング記録⑦' },
      { file: 'hokkaido-xsr900-day8.html', title: '美瑛の青い池・白ひげの滝から苫小牧へ｜XSR900北海道ツーリング記録⑧' }
    ]},
    { name: 'チリ旅行記', catKey: 'chile', articles: [
      { file: 'chile-1.html', title: 'サンティアゴ市内観光｜チリ最高裁・美術館・歴史地区を歩く【チリ旅行記①】' },
      { file: 'chile-2.html', title: 'ロス・ドミニコス工芸市場へ｜サンティアゴで民芸品と白い教会を巡る【チリ旅行記②】' },
      { file: 'chile-3.html', title: 'サンティアゴ最終日｜パルタ・レイナとクリスマス前の街歩き【チリ旅行記③】' }
    ]},
    { name: 'ベリーズ旅行記', catKey: 'belize', articles: [
      { file: 'belize-1.html', title: 'ベリーズシティ到着｜夜明けのカリブ海とアジア系スーパー散策【ベリーズ旅行記①】' },
      { file: 'belize-2.html', title: 'キーカーカー島とグレート・ブルーホール遊覧飛行｜ベリーズのカリブ海を空から見る【ベリーズ旅行記②】' },
      { file: 'belize-3.html', title: 'ベリーズシティ街歩き｜スウィング・ブリッジと最終日の過ごし方【ベリーズ旅行記③】' }
    ]},
    { name: 'エルサルバドル旅行記', catKey: 'el-salvador', articles: [
      { file: 'el-salvador-ruins.html',  title: 'ホヤ・デ・セレンとタスマル遺跡へ｜エルサルバドルの世界遺産とマヤ遺跡【エルサルバドル旅行記①】' },
      { file: 'el-salvador-volcan.html', title: 'サンタ・アナ火山登山｜警察エスコート付きで火口湖を見に行った話【エルサルバドル旅行記②】' }
    ]},
    { name: 'パナマ旅行記', catKey: 'panama', articles: [
      { file: 'panama-1.html', title: 'パナマ・ビエホ観光｜500年前の廃墟とスペイン植民地時代の歴史【パナマ旅行記①】' },
      { file: 'panama.html',   title: 'カスコ・ビエホとマリスコス市場を歩く｜世界遺産の旧市街と魚市場【パナマ旅行記②】' },
      { file: 'panama-3.html', title: 'ミラフローレス閘門見学｜パナマ運河で巨大船が通る瞬間を見た【パナマ旅行記③】' }
    ]}
  ];

  window.SERIES = SERIES;

  function injectSeriesNav() {
    var current = location.pathname.split('/').pop();
    if (current && !current.endsWith('.html')) current += '.html';
    var prev = null, next = null, seriesName = null, seriesCat = null;

    for (var g = 0; g < SERIES.length; g++) {
      var group = SERIES[g].articles;
      var idx = -1;
      for (var i = 0; i < group.length; i++) {
        if (group[i].file === current) { idx = i; break; }
      }
      if (idx === -1) continue;
      prev = idx > 0 ? group[idx - 1] : null;
      next = idx < group.length - 1 ? group[idx + 1] : null;
      seriesName = SERIES[g].name;
      seriesCat = SERIES[g].catKey;
      break;
    }

    if (!prev && !next) return;

    var nav = document.createElement('div');
    nav.className = 'article-series-nav';

    if (prev) {
      var prevLink = document.createElement('a');
      prevLink.className = 'series-nav-btn series-nav-prev';
      prevLink.href = prev.file;
      prevLink.innerHTML = '<span class="series-nav-label">← 前の記事</span><span class="series-nav-title">' + prev.title + '</span>';
      nav.appendChild(prevLink);
    } else {
      nav.appendChild(document.createElement('span'));
    }

    if (next) {
      var nextLink = document.createElement('a');
      nextLink.className = 'series-nav-btn series-nav-next';
      nextLink.href = next.file;
      nextLink.innerHTML = '<span class="series-nav-label">次の記事 →</span><span class="series-nav-title">' + next.title + '</span>';
      nav.appendChild(nextLink);
    }

    if (seriesName && seriesCat) {
      var listLink = document.createElement('a');
      listLink.className = 'series-nav-list';
      listLink.href = '../index.html?cat=' + seriesCat + '#articles';
      listLink.textContent = seriesName + ' 一覧を見る';
      nav.appendChild(listLink);
    }

    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;
    var related = articleBody.querySelector('.related-section');
    var footer = articleBody.querySelector('footer');
    if (related) {
      articleBody.insertBefore(nav, related);
    } else if (footer) {
      articleBody.insertBefore(nav, footer);
    } else {
      articleBody.appendChild(nav);
    }
  }

  // ── Related Articles ───────────────────────────────────────────
  function injectRelated() {
    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    var current = location.pathname.split('/').pop();
    if (current && !current.endsWith('.html')) current += '.html';
    var currentArticle = null;
    for (var i = 0; i < ARTICLES.length; i++) {
      if (ARTICLES[i].file === current) { currentArticle = ARTICLES[i]; break; }
    }
    if (!currentArticle) return;

    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }

    var sameCat = shuffle(ARTICLES.filter(function (a) {
      return a.file !== current && a.category === currentArticle.category;
    }));
    var others = shuffle(ARTICLES.filter(function (a) {
      return a.file !== current && a.category !== currentArticle.category;
    }));

    var picks = sameCat.slice(0, 3);
    if (picks.length < 3) picks = picks.concat(others.slice(0, 3 - picks.length));
    if (picks.length === 0) return;

    var section = document.createElement('div');
    section.className = 'related-section';

    var label = document.createElement('div');
    label.className = 'related-label';
    label.textContent = 'こちらもどうぞ';

    var grid = document.createElement('div');
    grid.className = 'related-grid';

    picks.forEach(function (a) {
      var card = document.createElement('a');
      card.className = 'related-card';
      card.href = a.file;

      var img = document.createElement('div');
      img.className = 'related-img';
      img.style.backgroundImage = 'url("' + a.img + '")';

      var tag = document.createElement('div');
      tag.className = 'related-tag';
      tag.textContent = a.tag;

      var title = document.createElement('div');
      title.className = 'related-title';
      title.textContent = a.title;

      card.appendChild(img);
      card.appendChild(tag);
      card.appendChild(title);
      grid.appendChild(card);
    });

    section.appendChild(label);
    section.appendChild(grid);
    var footer = articleBody.querySelector('footer');
    if (footer) {
      articleBody.insertBefore(section, footer);
    } else {
      articleBody.appendChild(section);
    }
  }

  // ── Map Links ──────────────────────────────────────────────────
  function injectMapLinks() {
    document.querySelectorAll('[data-map]').forEach(function (el) {
      var place = el.getAttribute('data-map');
      var link = document.createElement('a');
      link.className = 'map-link';
      link.href = 'https://www.google.com/maps/search/' + encodeURIComponent(place);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', place + 'の地図を開く');
      while (el.firstChild) link.appendChild(el.firstChild);
      el.appendChild(link);
    });
  }

  // ── Copy Credit ────────────────────────────────────────────────
  function injectCopyCredit() {
    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '引用元URLを付加しました';
    document.body.appendChild(toast);

    function showToast() {
      toast.classList.add('visible');
      setTimeout(function () { toast.classList.remove('visible'); }, 2500);
    }

    document.addEventListener('copy', function (e) {
      var selection = window.getSelection();
      if (!selection || selection.toString().length < 20) return;
      var node = selection.anchorNode;
      while (node) {
        if (node === articleBody) break;
        node = node.parentNode;
      }
      if (!node) return;
      try {
        e.clipboardData.setData('text/plain', selection.toString() + '\n\n引用元: ' + document.title + '\n' + location.href);
        e.preventDefault();
        showToast();
      } catch (err) { /* silent */ }
    });
  }

  function fitHeroTitle() {
    var el = document.querySelector('.article-hero-title');
    if (!el) return;
    el.style.fontSize = '';
    var fs = parseFloat(getComputedStyle(el).fontSize);
    var lh = fs * 1.3;
    while (el.offsetHeight > Math.ceil(lh * 3) + 2 && fs > 14) {
      fs -= 1;
      el.style.fontSize = fs + 'px';
      lh = fs * 1.3;
    }
  }
  function runFitAfterLayout() {
    requestAnimationFrame(function () { requestAnimationFrame(fitHeroTitle); });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runFitAfterLayout);
  } else {
    window.addEventListener('load', runFitAfterLayout);
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitHeroTitle, 150);
  });

})();
