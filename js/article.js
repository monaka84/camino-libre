(function () {
  'use strict';

  // Apply dark mode before render to avoid flash
  (function () {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();

  var ARTICLES = [
    { file: 'hokkaido-touring.html',      title: 'SR400で北海道ひとり旅——エサヌカ線で泣きそうになった話',                           category: 'bike',       tag: '北海道ツーリング', img: '../images/hokkaido/エサヌカ線.jpg',                                                                                      date: '2019-07-15' },
    { file: 'taiwan.html',                title: '台湾旅行記——基隆の夕暮れと、十份で天に灯籠を放った夜',                             category: 'other',      tag: '台湾',             img: '../images/taiwan/z50_0939_dxo.jpg',                                                                                      date: '2025-09-01' },
    { file: 'costa-rica-intro.html',       title: 'コスタリカに住んでた時の話① コスタリカってどんな国？',                               category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-map.jpg',                                                                                           date: '2018-01-30' },
    { file: 'costa-rica-irazu.html',       title: 'コスタリカに住んでた時の話② イラス火山——火口湖がなかった',                         category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-irazu/irazu-crater-view.jpg',                                                                       date: '2013-11-07' },
    { file: 'costa-rica-christmas.html',   title: 'コスタリカに住んでた時の話③ クリスマスと新年の過ごし方',                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_bd4831b3aa4f4502a43029245d5fddc4~mv2_d_2800_2800_s_4_2.jpg',                  date: '2018-02-02' },
    { file: 'costa-rica-color-run.html',   title: 'コスタリカに住んでた時の話④ 日本人学校とThe Color Run',                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_6a5dbafe9b2a402589c1c87b64e296ba~mv2.png',                                    date: '2019-02-12' },
    { file: 'costa-rica-semana-santa.html', title: 'コスタリカに住んでた時の話⑤ Semana Santa とマニエル・アントニオ',               category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica/manuel-antonio-animals.avif',                                                                       date: '2019-02-05' },
    { file: 'costa-rica-food.html',        title: 'コスタリカに住んでた時の話⑥ 中米料理',                                           category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_ba55d298fd444594b32692749af90ed2~mv2.png',                                    date: '2019-02-12' },
    { file: 'costa-rica-work.html',        title: 'コスタリカに住んでた時の話⑦ コスタリカでの仕事——簡易装具で歩けるようになった患者の話', category: 'costa-rica', tag: 'コスタリカ',       img: 'https://static.wixstatic.com/media/949ec9_3ddc83f695764babb8d3abf036ffa77e~mv2.jpg',                                    date: '2018-08-09' },
    { file: 'costa-rica-cano-negro.html',  title: 'コスタリカに住んでた時の話⑧ カニョネグロとモンテベルデ——年末年始の動物づくし',     category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-cano-negro/monteverde-motmot.jpg',                                                                   date: '2014-12-25' },
    { file: 'costa-rica-aribada.html',     title: 'コスタリカに住んでた時の話⑨ アリバダを見に行ったら、終わっていた',                 category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-aribada/aribada-beach.jpg',                                                                         date: '2015-09-01' },
    { file: 'nicaragua-ometepe-1.html',   title: 'ニカラグアに行った時の話① 国境を越えて、オメテペ島へ',                           category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_019bd4603cf949559dd74edbb0af66f0~mv2.jpg',                                    date: '2016-11-06' },
    { file: 'nicaragua-ometepe-2.html',   title: 'ニカラグアに行った時の話② オメテペ島を一日で巡る',                               category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_ef3f551a51dd4c5aa071e586251d053c~mv2.jpg',                                    date: '2016-11-08' },
    { file: 'nicaragua-granada.html',     title: 'ニカラグアに行った時の話③ グラナダ——植民地の街と革製品の宝庫',                   category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_fb403e7af29a471c8b1254216f87e047~mv2_d_2048_1366_s_2.jpg',                  date: '2016-11-16' },
    { file: 'nicaragua-managua.html',     title: 'ニカラグアに行った時の話④ マナグアと友人との再会',                               category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_f1a030e4b47244219104f6bf529c572b~mv2.jpg',                                    date: '2018-06-13' },
    { file: 'nicaragua-leon.html',        title: 'ニカラグアに行った時の話⑤ 革命の街レオン',                                       category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_8875da9d3c0a4cf5a82475a6fc11b57a~mv2.jpg',                                    date: '2018-06-17' },
    { file: 'nicaragua-flor-de-cana.html', title: 'ニカラグアに行った時の話⑥ Flor de Caña 工場見学記',                            category: 'nicaragua',  tag: 'ニカラグア',       img: 'https://static.wixstatic.com/media/949ec9_2abdad5c98df48c09ea644159fd8cd96~mv2_d_4608_3072_s_4_2.jpg',                  date: '2016-09-07' },
    { file: 'el-salvador-ruins.html',     title: 'エルサルバドルに行った時の話① ホヤ・デ・セレンとタスマル',                     category: 'other',      tag: 'エルサルバドル',   img: '../images/el-salvador-ruins/ruins-1.jpg',                                                                                date: '2014-08-31' },
    { file: 'el-salvador-volcan.html',    title: 'エルサルバドルに行った時の話② 警察官エスコートつきでサンタ・アナ火山へ',           category: 'other',      tag: 'エルサルバドル',   img: '../images/el-salvador-volcan/volcan-1.jpg',                                                                              date: '2014-09-02' },
    { file: 'mexico-zocalo.html',         title: 'メキシコに行った時の話① ソカロとテンプロ・マヨール',                             category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/zocalo-catedral.jpg',                                                                                   date: '2026-02-22' },
    { file: 'mexico-guadalupe.html',      title: 'メキシコに行った時の話② グアダルーペ大聖堂',                                     category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/guadalupe-aerial.jpg',                                                                                  date: '2026-02-21' },
    { file: 'mexico-walk.html',           title: 'メキシコに行った時の話③ 革命記念塔と街歩き',                                     category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/revolucion-monument.jpg',                                                                               date: '2026-02-21' },
    { file: 'mexico-walmart.html',        title: 'メキシコに行った時の話④ ウォールマートはお土産の穴場',                           category: 'mexico',     tag: 'メキシコ',         img: '../images/mexico/walmart-salsa.jpg',                                                                                     date: '2026-02-22' },
    { file: 'touring-camp-gear.html',     title: 'ソロツーリング キャンプ道具編① テント・シュラフ・マット',                       category: 'camp',       tag: 'キャンプ・ギア',   img: 'https://static.wixstatic.com/media/949ec9_afd223212bc6483f830f93812da66369~mv2_d_3024_4032_s_4_2.jpg',                  date: '2017-11-12' },
    { file: 'camp-mori-makiba.html',      title: '森のまきばオートキャンプ場 — 師走のソロキャンプ',                               category: 'camp',       tag: 'キャンプ',         img: 'https://static.wixstatic.com/media/949ec9_be02da1f1cce47dfa15fb7184f2e8dd6~mv2_d_4032_3024_s_4_2.jpg',                  date: '2018-12-15' },
    { file: 'atsukan.html',               title: '家でも熱燗が飲みたい！日本酒2本レビュー',                                       category: 'other',      tag: '酒・グルメ',       img: 'https://static.wixstatic.com/media/949ec9_69fcb4358adc4328a919ec0cfc491f98~mv2_d_2987_3938_s_4_2.jpg',                  date: '2017-01-10' },
    { file: 'power-beam.html',            title: 'パワービームを購入した！SR400の振動対策',                                       category: 'bike',       tag: 'バイク・ギア',     img: 'https://static.wixstatic.com/media/949ec9_c07a3465b14f4301835b4585c13ca9b3~mv2_d_4032_3024_s_4_2.jpg',                  date: '2018-09-19' },
    { file: 'spanish-dictionary.html',    title: 'スペイン語のオススメ辞書——紙・電子・アプリを比較する',                           category: 'other',      tag: 'スペイン語',       img: 'https://static.wixstatic.com/media/949ec9_316ae78b6611491fad1cb3d780461968~mv2.jpg',                                    date: '2016-10-12' },
    { file: 'bandai-azuma.html',          title: '磐梯吾妻スカイライン——火山地帯を走る絶景ルート',                               category: 'bike',       tag: 'ツーリング',       img: '../images/bandai/IMG_3857.jpg',                                                                                          date: '2018-10-01' },
    { file: 'five-color-lake.html',       title: '五色沼——福島・裏磐梯の神秘的な湖沼群',                                         category: 'bike',       tag: '旅',               img: '../images/five-color-lake/IMG_8015.jpg',                                                                                 date: '2018-10-02' },
    { file: 'hokkaido-car.html',          title: '北海道ソロドライブ——神威岬・黄金岬・函館',                                     category: 'bike',       tag: '北海道',           img: '../images/hokkaido-car/神威岬.jpg',                                                                                      date: '2025-11-01' },
    { file: 'touring-chiba-xsr900.html',  title: '千葉県ソロツーリング XSR900——笠森観音を訪ねて',                               category: 'bike',       tag: 'ツーリング',       img: '../images/touring-chiba2/IMG_2388.jpg',                                                                                  date: '2026-04-01' },
    { file: 'chile-1.html',               title: 'チリに行った時の話① サンティアゴ市内散策、最高裁と美術館',                                 category: 'other',      tag: 'チリ',             img: '../images/chile/20251012_143804099_iOS.jpg',                                                                              date: '2025-10-12' },
    { file: 'chile-2.html',               title: 'チリに行った時の話② ロス・ドミニコス工芸市場と白い教会',                                   category: 'other',      tag: 'チリ',             img: '../images/chile/20251014_205137977_iOS.jpg',                                                                              date: '2025-10-14' },
    { file: 'chile-3.html',               title: 'チリに行った時の話③ パルタ・レイナとサンティアゴ最終日',                                   category: 'other',      tag: 'チリ',             img: '../images/chile/20251016_170946020_iOS.jpg',                                                                              date: '2025-10-16' },
    { file: 'belize-1.html',              title: 'ベリーズに行った時の話① ベリーズシティ到着、夜明けの海とアジア系スーパー',                 category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251018_213429265_iOS.jpg',                                                                             date: '2025-10-18' },
    { file: 'belize-2.html',              title: 'ベリーズに行った時の話② キーカーカー島とグレート・ブルーホール遊覧飛行',             category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251019_213939041_iOS.jpg',                                                                             date: '2025-10-19' },
    { file: 'belize-3.html',              title: 'ベリーズに行った時の話③ スウィング・ブリッジとベリーズシティ最終日',                       category: 'other',      tag: 'ベリーズ',         img: '../images/belize/20251020_144751630_iOS.jpg',                                                                             date: '2025-10-20' },
    { file: 'zao-ginzan.html',            title: '蔵王と銀山温泉 — 御釜の緑と温泉街の夜景',                                     category: 'other',      tag: '東北',             img: '../images/zao-ginzan/20250628_133653099_iOS.jpg',                                                                         date: '2025-06-28' },
    { file: 'himawari-tsunan.html',       title: '津南ひまわり広場 — 新潟の山あいに広がる黄色の絨毯',                           category: 'other',      tag: '新潟',             img: '../images/himawari/20250802_011958175_iOS_1.jpg',                                                                         date: '2025-08-02' },
    { file: 'hokkaido-xsr900-day1.html',  title: 'XSR900で北海道へ① — 大洗からさんふらわあで苫小牧へ',                         category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250819_070951847_iOS.jpg',                                                                    date: '2025-08-19' },
    { file: 'hokkaido-xsr900-day2.html',  title: 'XSR900で北海道へ② — アイヌ文化博物館と帯広の豚丼',                          category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250820_054937983_iOS.jpg',                                                                    date: '2025-08-20' },
    { file: 'hokkaido-xsr900-day3.html',  title: 'XSR900で北海道へ③ — 厚岸蒸留所と根室の海鮮',                                category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250821_010411011_iOS.jpg',                                                                    date: '2025-08-21' },
    { file: 'hokkaido-xsr900-day4.html',  title: 'XSR900で北海道へ④ — 納沙布岬と知床五湖',                                    category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250821_072833977_iOS.jpg',                                                                    date: '2025-08-21' },
    { file: 'hokkaido-xsr900-day5.html',  title: 'XSR900で北海道へ⑤ — 神の子池・網走監獄・美幌峠',                            category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250823_022248708_iOS.jpg',                                                                    date: '2025-08-23' },
    { file: 'hokkaido-xsr900-day6.html',  title: 'XSR900で北海道へ⑥ — 枝幸で財布を落とした話',                                category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250824_040949567_iOS.jpg',                                                                    date: '2025-08-24' },
    { file: 'hokkaido-xsr900-day7.html',  title: 'XSR900で北海道へ⑦ — オロロンラインをひた走る',                               category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250825_110201838_iOS.jpg',                                                                    date: '2025-08-25' },
    { file: 'hokkaido-xsr900-day8.html',  title: 'XSR900で北海道へ⑧ — 青い池と白ひげの滝、そして帰路',                        category: 'bike',       tag: '北海道',           img: '../images/hokkaido-xsr900/20250826_002032526_iOS.jpg',                                                                    date: '2025-08-26' },
    { file: 'panama-1.html',              title: 'パナマに行った時の話① — パナマ・ビエホ、500年前の廃墟',                         category: 'other',      tag: 'パナマ',           img: '../images/panama/pv-1.jpg',                                                                                               date: '2025-01-10' },
    { file: 'panama.html',                title: 'パナマに行った時の話② — カスコビエホを歩いて、マリスコス市場で魚を見た',           category: 'other',      tag: 'パナマ',           img: '../images/panama/panama-1.jpg',                                                                                          date: '2025-01-11' },
    { file: 'panama-3.html',              title: 'パナマに行った時の話③ — ミラフローレス閘門、船が通る瞬間に立ち会った',             category: 'other',      tag: 'パナマ',           img: '../images/panama/canal-1.jpg',                                                                                           date: '2025-01-12' },
    { file: 'costa-rica-2025.html',       title: 'コスタリカ10年ぶり再訪 — 街は変わっていた、ピルセンは変わらなかった',             category: 'costa-rica', tag: 'コスタリカ',       img: '../images/costa-rica-2025/cr-5.jpg',                                                                                     date: '2025-01-15' },
    { file: 'noto-touring.html',          title: '能登半島ツーリング — 金箔がかかった刺身を食べた',                               category: 'bike',       tag: 'ツーリング',       img: '../images/noto/noto-1.jpg',                                                                                              date: '2022-08-01' },
    { file: 'nagano-touring.html',        title: '毛無峠・ビーナスライン・上田城 — 夏の群馬・長野ツーリング',                       category: 'bike',       tag: 'ツーリング',       img: '',                                                                                                                       date: '2023-07-01' },
    { file: 'irako.html',                 title: '伊良湖岬、年末のひとり歩き',                                                   category: 'bike',       tag: 'ツーリング',       img: '../images/irako/lighthouse.jpg',                                                                                         date: '2023-12-31' },
    { file: 'chiba-chibanians.html',      title: 'チバニアンに行った話 — 猪に遭遇して、バイクにもトラブルが起きた',                 category: 'bike',       tag: 'ツーリング',       img: '../images/chiba-chibanians/chiba-cliff.jpg',                                                                             date: '2024-05-01' },
    { file: 'toro-daishi.html',           title: '燈籠坂大師の切通しトンネル — バイクが変わって3年ぶりに来た',                     category: 'bike',       tag: 'ツーリング',       img: '../images/toro-daishi/toro-1.jpg',                                                                                       date: '2024-03-01' },
    { file: 'izu-touring.html',           title: '伊豆半島1泊2日 — 芦ノ湖スカイラインが最高だった',                               category: 'bike',       tag: 'ツーリング',       img: '../images/izu-touring/sea.jpg',                                                                                          date: '2023-06-16' },
    { file: 'motorcycle-show-2026.html',  title: '東京モーターサイクルショー2026 — 気になったバイクたち',                         category: 'bike',       tag: 'バイク',           img: '../images/motorcycle-show/cbr400r.jpg',                                                                                  date: '2026-03-28' }
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
      '<a href="' + base + 'index.html#about">プロフィール</a>';
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
      navigator.clipboard.writeText(url).then(function () {
        copyBtn.textContent = '✓ コピー済';
        setTimeout(function () { copyBtn.textContent = 'URLコピー'; }, 2000);
      }).catch(function () {
        copyBtn.textContent = '❌ 失敗';
        setTimeout(function () { copyBtn.textContent = 'URLコピー'; }, 2000);
      });
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
    [
      { file: 'costa-rica-intro.html',        title: '① コスタリカってどんな国？' },
      { file: 'costa-rica-irazu.html',        title: '② イラスー火山と語学研修の日々' },
      { file: 'costa-rica-christmas.html',    title: '③ クリスマスと新年の過ごし方' },
      { file: 'costa-rica-color-run.html',    title: '④ 日本人学校とThe Color Run' },
      { file: 'costa-rica-semana-santa.html', title: '⑤ Semana Santa とマニエル・アントニオ' },
      { file: 'costa-rica-food.html',         title: '⑥ 中米料理' },
      { file: 'costa-rica-work.html',         title: '⑦ コスタリカでの仕事' },
      { file: 'costa-rica-cano-negro.html',   title: '⑧ カニョ・ネグロ野生生物保護区' },
      { file: 'costa-rica-aribada.html',      title: '⑨ アリバダ——ウミガメの大産卵' }
    ],
    [
      { file: 'nicaragua-ometepe-1.html',    title: '① 国境を越えて、オメテペ島へ' },
      { file: 'nicaragua-ometepe-2.html',    title: '② オメテペ島を一日で巡る' },
      { file: 'nicaragua-granada.html',      title: '③ グラナダ——植民地の街と革製品の宝庫' },
      { file: 'nicaragua-managua.html',      title: '④ マサヤと首都マナグア' },
      { file: 'nicaragua-leon.html',         title: '⑤ 革命の街、レオンへ' },
      { file: 'nicaragua-flor-de-cana.html', title: '⑥ Flor de Caña 工場見学記' }
    ],
    [
      { file: 'mexico-zocalo.html',    title: '① ソカロとテンプロ・マヨール' },
      { file: 'mexico-guadalupe.html', title: '② グアダルーペ大聖堂' },
      { file: 'mexico-walk.html',      title: '③ 革命記念塔と街歩き' },
      { file: 'mexico-walmart.html',   title: '④ ウォールマートはお土産の穴場' }
    ],
    [
      { file: 'hokkaido-xsr900-day1.html', title: '① 大洗からさんふらわあで苫小牧へ' },
      { file: 'hokkaido-xsr900-day2.html', title: '② アイヌ文化博物館と帯広の豚丼' },
      { file: 'hokkaido-xsr900-day3.html', title: '③ 厚岸蒸留所と根室の海鮮' },
      { file: 'hokkaido-xsr900-day4.html', title: '④ 納沙布岬と知床五湖' },
      { file: 'hokkaido-xsr900-day5.html', title: '⑤ 神の子池・網走監獄・美幌峠' },
      { file: 'hokkaido-xsr900-day6.html', title: '⑥ 枝幸で財布を落とした話' },
      { file: 'hokkaido-xsr900-day7.html', title: '⑦ オロロンラインをひた走る' },
      { file: 'hokkaido-xsr900-day8.html', title: '⑧ 青い池と白ひげの滝、そして帰路' }
    ],
    [
      { file: 'chile-1.html', title: '① サンティアゴ市内散策、最高裁と美術館' },
      { file: 'chile-2.html', title: '② ロス・ドミニコス工芸市場と白い教会' },
      { file: 'chile-3.html', title: '③ パルタ・レイナとサンティアゴ最終日' }
    ],
    [
      { file: 'belize-1.html', title: '① ベリーズシティ到着、夜明けの海とアジア系スーパー' },
      { file: 'belize-2.html', title: '② キーカーカー島とグレート・ブルーホール遊覧飛行' },
      { file: 'belize-3.html', title: '③ スウィング・ブリッジとベリーズシティ最終日' }
    ],
    [
      { file: 'el-salvador-ruins.html',  title: '① ホヤ・デ・セレンとタスマル' },
      { file: 'el-salvador-volcan.html', title: '② 警察官エスコートつきでサンタ・アナ火山へ' }
    ],
    [
      { file: 'panama-1.html', title: '① パナマ・ビエホ、500年前の廃墟' },
      { file: 'panama.html',   title: '② カスコビエホを歩いて、マリスコス市場で魚を見た' },
      { file: 'panama-3.html', title: '③ ミラフローレス閘門、船が通る瞬間に立ち会った' }
    ]
  ];

  function injectSeriesNav() {
    var current = location.pathname.split('/').pop();
    if (current && !current.endsWith('.html')) current += '.html';
    var prev = null, next = null;

    for (var g = 0; g < SERIES.length; g++) {
      var group = SERIES[g];
      var idx = -1;
      for (var i = 0; i < group.length; i++) {
        if (group[i].file === current) { idx = i; break; }
      }
      if (idx === -1) continue;
      prev = idx > 0 ? group[idx - 1] : null;
      next = idx < group.length - 1 ? group[idx + 1] : null;
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

})();
