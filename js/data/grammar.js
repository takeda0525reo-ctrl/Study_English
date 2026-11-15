/*
 * 文法データ
 * 単元 = { id, title, level, summary, points:[{h, d, ex:[[英文, 和訳], ...]}], qs:[...] }
 * 問題の形式
 *   4択:      { t:"c", q:"英文（空所は ( ) ）", c:[選択肢4つ], a:正解の番号(0始まり), ja:"和訳", ex:"解説" }
 *   並べ替え: { t:"o", ja:"和文", w:[正しい順に並べた語句], end:"."（省略時はピリオド）, ex:"解説" }
 */
window.GRAMMAR_DATA = [

/* ───────── 1. 文型 ───────── */
{
  id: "pattern", title: "文型", level: "基礎",
  summary: "英文の骨組みになる5つの型。動詞の後ろに何が来るかを見抜く力をつける。",
  points: [
    { h: "5文型の全体像",
      d: "英文は S（主語）・V（動詞）・O（目的語）・C（補語）の組み合わせで5つの型に分けられる。修飾語（副詞・前置詞句）は文型に数えない。",
      ex: [["Birds fly.", "SV：鳥は飛ぶ。"], ["She became a doctor.", "SVC：彼女は医者になった。"], ["I like music.", "SVO：私は音楽が好きだ。"], ["He gave me a pen.", "SVOO：彼は私にペンをくれた。"], ["We call him Ken.", "SVOC：私たちは彼をケンと呼ぶ。"]] },
    { h: "SVC：補語は形容詞（副詞は不可）",
      d: "S = C の関係。become / look / seem / feel / sound / smell / taste / remain / keep などの後ろには形容詞か名詞が来る。日本語が「〜く」「〜に」でも副詞にしない。",
      ex: [["This soup tastes good.", "このスープはおいしい。（× well）"], ["He looked happy.", "彼はうれしそうだった。（× happily）"]] },
    { h: "SVOO：to 型と for 型",
      d: "「人に物を」の語順。SVO に書き換えるとき、give / send / show / tell / teach / lend は to、buy / make / cook / find / get は for を使う。",
      ex: [["She sent me a letter. = She sent a letter to me.", "彼女は私に手紙を送った。"], ["He made me a cake. = He made a cake for me.", "彼は私にケーキを作ってくれた。"]] },
    { h: "SVOC と、自動詞・他動詞の区別",
      d: "SVOC は O = C の関係（make / keep / leave / find / call / name）。また discuss / marry / enter / reach / resemble / approach / attend は他動詞なので前置詞を付けない。",
      ex: [["The news made us sad.", "その知らせは私たちを悲しませた。"], ["We discussed the problem.", "私たちはその問題について話し合った。（× discussed about）"]] }
  ],
  qs: [
    { t: "c", q: "The milk smells ( ).", c: ["bad", "badly", "badness", "to bad"], a: 0, ja: "その牛乳は嫌なにおいがする。", ex: "smell は SVC をとる動詞。補語になるのは形容詞なので bad。副詞 badly は補語になれない。" },
    { t: "c", q: "My uncle bought a watch ( ) me.", c: ["to", "for", "of", "with"], a: 1, ja: "おじは私に腕時計を買ってくれた。", ex: "buy は for 型。buy A B = buy B for A。「相手のためにしてあげる」動詞（buy / make / cook / find）は for を使う。" },
    { t: "c", q: "We ( ) the matter for two hours.", c: ["discussed", "discussed about", "talked", "spoke"], a: 0, ja: "私たちはその件について2時間話し合った。", ex: "discuss は他動詞で、直後に目的語を置く。about は不要。talk / speak は自動詞なので about が必要。" },
    { t: "c", q: "The news made her ( ).", c: ["happy", "happily", "happiness", "to happy"], a: 0, ja: "その知らせは彼女を喜ばせた。", ex: "make O C（O を C にする）。her = happy の関係が成り立つので、補語には形容詞 happy を置く。" },
    { t: "c", q: "He ( ) his father in many ways.", c: ["resembles", "resembles to", "is resembling", "resembles with"], a: 0, ja: "彼は多くの点で父親に似ている。", ex: "resemble は他動詞で前置詞不要。また状態動詞なので進行形にもしない。" },
    { t: "c", q: "Please keep the door ( ).", c: ["open", "openly", "to open", "opens"], a: 0, ja: "ドアを開けたままにしておいてください。", ex: "keep O C（O を C の状態に保つ）。the door = open の関係なので形容詞 open。" },
    { t: "o", ja: "彼女は私にその町の写真を何枚か見せてくれた。", w: ["She", "showed", "me", "some pictures", "of", "the town"], ex: "show + 人 + 物 の SVOO。「人に」を先、「物を」を後に置く。" },
    { t: "o", ja: "私はその本がとても面白いとわかった。", w: ["I", "found", "the book", "very", "interesting"], ex: "find O C（O が C だとわかる）。the book = very interesting の関係。" }
  ]
},

/* ───────── 2. 時制 ───────── */
{
  id: "tense", title: "時制", level: "基礎",
  summary: "現在・過去・未来と進行形の使い分け。「時・条件の副詞節」は入試の定番。",
  points: [
    { h: "現在形と現在進行形",
      d: "現在形は習慣・事実・不変の真理を表す。現在進行形は「今まさにしている最中」の動作。know / like / want / belong / resemble などの状態動詞は進行形にしない。",
      ex: [["The earth goes around the sun.", "地球は太陽の周りを回っている。（不変の真理）"], ["She is studying in her room now.", "彼女は今、部屋で勉強している。"]] },
    { h: "過去形と過去進行形",
      d: "過去形は過去の出来事・状態、過去進行形は「過去のある時点でしている最中だった動作」。when 節（過去形）と組み合わせて使うことが多い。",
      ex: [["I was watching TV when he called me.", "彼が電話をくれたとき、私はテレビを見ていた。"]] },
    { h: "未来の表現",
      d: "will はその場で決めたこと・単純な予測、be going to は前から決めていた予定や、兆候に基づく予測に使う。",
      ex: [["I'll answer the phone.", "私が電話に出ます。（その場の決定）"], ["I'm going to visit Kyoto next week.", "来週京都を訪れる予定だ。（前からの予定）"]] },
    { h: "時・条件の副詞節では未来のことも現在形",
      d: "when / if / before / after / until / as soon as / by the time などが導く副詞節の中では、未来のことでも will を使わず現在形にする。ただし「〜かどうか」「いつ〜するか」という名詞節では will を使う。",
      ex: [["I'll tell him when he comes.", "彼が来たら伝えます。（副詞節）"], ["I don't know when he will come.", "彼がいつ来るかわからない。（名詞節）"]] }
  ],
  qs: [
    { t: "c", q: "I'll call you when I ( ) at the station.", c: ["arrive", "will arrive", "arrived", "am arriving"], a: 0, ja: "駅に着いたら電話します。", ex: "when が導く「時の副詞節」の中では、未来のことでも現在形を使う。" },
    { t: "c", q: "Water ( ) at 100 degrees Celsius.", c: ["boils", "is boiling", "boiled", "will boil"], a: 0, ja: "水は摂氏100度で沸騰する。", ex: "不変の真理・一般的事実は現在形で表す。" },
    { t: "c", q: "When I came home, my sister ( ) the piano.", c: ["plays", "was playing", "is playing", "has played"], a: 1, ja: "私が帰宅したとき、妹はピアノを弾いていた。", ex: "過去のある時点（帰宅したとき）に進行中だった動作は過去進行形。" },
    { t: "c", q: "This bag ( ) to my mother.", c: ["belongs", "is belonging", "is belonged", "belong"], a: 0, ja: "このかばんは母のものだ。", ex: "belong は状態動詞なので進行形にしない。自動詞なので受動態にもならない。主語が単数なので belongs。" },
    { t: "c", q: "I don't know if it ( ) tomorrow.", c: ["rains", "will rain", "rained", "has rained"], a: 1, ja: "明日雨が降るかどうかわからない。", ex: "この if 節は「〜かどうか」という名詞節（know の目的語）。名詞節では未来のことは will で表す。" },
    { t: "c", q: "Look at those dark clouds. It ( ) rain.", c: ["is going to", "will be", "is", "goes to"], a: 0, ja: "あの黒い雲を見て。雨が降りそうだ。", ex: "目の前の兆候（黒い雲）に基づく予測は be going to で表す。" },
    { t: "o", ja: "もし明日晴れたら、私たちは海に行くつもりだ。", w: ["If it", "is sunny", "tomorrow,", "we", "will go", "to", "the beach"], ex: "条件の副詞節（if 節）の中は現在形、主節は will。" },
    { t: "o", ja: "電話が鳴ったとき、私は風呂に入っていた。", w: ["I", "was", "taking", "a bath", "when", "the phone", "rang"], ex: "進行中だった動作は過去進行形（was taking）、そこに割り込んだ出来事は過去形（rang）。" }
  ]
},

/* ───────── 3. 完了形 ───────── */
{
  id: "perfect", title: "完了形", level: "基礎",
  summary: "have + 過去分詞。「ある時点までのつながり」を表す感覚をつかむ。",
  points: [
    { h: "現在完了（have + p.p.）",
      d: "過去の出来事が現在とつながっていることを表す。①完了・結果（just / already / yet）②経験（ever / never / once / before）③継続（for / since）。yesterday / 〜 ago / last year / when 〜 など、はっきり過去を示す語句とは一緒に使えない。",
      ex: [["I have just finished my homework.", "ちょうど宿題を終えたところだ。（完了）"], ["I have visited Nara twice.", "奈良を2回訪れたことがある。（経験）"], ["We have known each other for ten years.", "私たちは10年来の知り合いだ。（継続）"]] },
    { h: "現在完了進行形（have been doing）",
      d: "動作が過去から現在までずっと続いていることを表す。状態動詞（know / live など）の継続はふつう現在完了で表す。",
      ex: [["She has been reading for three hours.", "彼女は3時間ずっと読書をしている。"]] },
    { h: "過去完了（had + p.p.）",
      d: "過去のある時点を基準に、それまでの完了・経験・継続を表す。また、過去の出来事よりさらに前の出来事（大過去）も表す。",
      ex: [["The movie had started when we arrived.", "私たちが着いたとき、映画は始まっていた。"], ["I lost the watch my father had given me.", "父がくれた時計をなくした。（大過去）"]] },
    { h: "未来完了・have been to と have gone to",
      d: "will have + p.p. は未来のある時点までの完了などを表す。have been to は「行ったことがある」、have gone to は「行ってしまった（今ここにいない）」。",
      ex: [["I will have finished it by noon.", "正午までにはそれを終えているだろう。"], ["He has gone to Canada.", "彼はカナダへ行ってしまった。"]] }
  ],
  qs: [
    { t: "c", q: "I ( ) in Tokyo since 2015.", c: ["live", "lived", "have lived", "am living"], a: 2, ja: "私は2015年から東京に住んでいる。", ex: "since 〜（〜以来）があるので、過去から現在までの継続を表す現在完了。" },
    { t: "c", q: "She ( ) to Paris three years ago.", c: ["went", "has gone", "has been", "had gone"], a: 0, ja: "彼女は3年前にパリへ行った。", ex: "three years ago のようにはっきり過去を示す語句があるときは、現在完了ではなく過去形を使う。" },
    { t: "c", q: "When we got to the station, the train ( ).", c: ["has already left", "had already left", "already leaves", "will already leave"], a: 1, ja: "私たちが駅に着いたとき、電車はすでに出発していた。", ex: "「駅に着いた」という過去の時点より前に完了していたことなので過去完了（had + p.p.）。" },
    { t: "c", q: "It ( ) since last night.", c: ["is raining", "rains", "has been raining", "was raining"], a: 2, ja: "昨夜からずっと雨が降っている。", ex: "動作が過去から今まで続いているので現在完了進行形（have been doing）。" },
    { t: "c", q: "I ( ) this report by the time you come back.", c: ["will have finished", "have finished", "had finished", "finish"], a: 0, ja: "あなたが戻るまでには、この報告書を書き終えているでしょう。", ex: "by the time 〜（〜するまでには）で未来のある時点が示されている。その時点までの完了は未来完了。" },
    { t: "c", q: "Have you ever ( ) to Hokkaido?", c: ["been", "gone", "went", "go"], a: 0, ja: "北海道に行ったことがありますか。", ex: "「行ったことがある」（経験）は have been to。have gone to は「行ってしまった」の意味になる。" },
    { t: "o", ja: "私はこんなに美しい夕日を見たことがない。", w: ["I", "have", "never", "seen", "such", "a", "beautiful", "sunset"], ex: "経験の否定は have never + p.p.。such a + 形容詞 + 名詞 の語順にも注意。" },
    { t: "o", ja: "彼は10年間ずっと英語を教えている。", w: ["He", "has", "been", "teaching", "English", "for", "ten years"], ex: "動作の継続は現在完了進行形 has been doing。期間の長さは for で表す。" }
  ]
},

/* ───────── 4. 助動詞 ───────── */
{
  id: "modal", title: "助動詞", level: "標準",
  summary: "義務・推量などの気持ちを加える。「助動詞 + have + 過去分詞」が頻出。",
  points: [
    { h: "義務・必要・禁止",
      d: "must / have to（〜しなければならない）、should / ought to（〜すべきだ）。否定の意味の違いに注意：must not は「〜してはいけない」（禁止）、don't have to は「〜する必要はない」（不必要）。",
      ex: [["You must not park here.", "ここに駐車してはいけない。"], ["You don't have to hurry.", "急ぐ必要はない。"]] },
    { h: "推量を表す助動詞",
      d: "確信の強さの順に、must（〜に違いない）> should（〜のはずだ）> may / might（〜かもしれない）。否定の推量は can't（〜のはずがない）。",
      ex: [["She must be tired.", "彼女は疲れているに違いない。"], ["That can't be true.", "それが本当のはずがない。"]] },
    { h: "助動詞 + have + 過去分詞",
      d: "過去のことについての推量・後悔を表す。must have p.p.（〜したに違いない）/ may have p.p.（〜したかもしれない）/ can't have p.p.（〜したはずがない）/ should have p.p.（〜すべきだったのに）/ need not have p.p.（〜する必要はなかったのに）。",
      ex: [["He must have missed the bus.", "彼はバスに乗り遅れたに違いない。"], ["You should have told me.", "私に言ってくれればよかったのに。"]] },
    { h: "覚えておきたい慣用表現",
      d: "used to do（以前は〜した・〜だった）/ would (often) do（よく〜したものだ）/ had better do（〜したほうがいい、否定は had better not do）/ would rather do（むしろ〜したい）/ cannot 〜 too …（いくら…してもしすぎることはない）/ may well do（〜するのももっともだ）。",
      ex: [["I used to play tennis.", "以前はテニスをしていた。（今はしていない）"], ["You cannot be too careful.", "いくら注意してもしすぎることはない。"]] }
  ],
  qs: [
    { t: "c", q: "You ( ) come tomorrow if you are busy.", c: ["must not", "don't have to", "cannot", "had not better"], a: 1, ja: "忙しいなら明日は来なくてもいいですよ。", ex: "「〜する必要はない」は don't have to。must not は「〜してはいけない」という禁止になる。" },
    { t: "c", q: "He ( ) be hungry. He has just eaten lunch.", c: ["must", "can't", "should", "may"], a: 1, ja: "彼がお腹を空かせているはずがない。昼食を食べたばかりだ。", ex: "「〜のはずがない」という否定の強い推量は can't。" },
    { t: "c", q: "The ground is wet. It ( ) last night.", c: ["must rain", "must have rained", "should have rained", "can't have rained"], a: 1, ja: "地面がぬれている。昨夜雨が降ったに違いない。", ex: "過去のことについての確信ある推量は must have p.p.（〜したに違いない）。" },
    { t: "c", q: "I failed the test. I ( ) harder.", c: ["should study", "must have studied", "should have studied", "may have studied"], a: 2, ja: "テストに落ちた。もっと一生懸命勉強すべきだった。", ex: "should have p.p. は「〜すべきだったのに（しなかった）」という過去への後悔・非難を表す。" },
    { t: "c", q: "There ( ) be a bookstore on this corner, but it's gone now.", c: ["used to", "would", "is used to", "was used to"], a: 0, ja: "以前この角には本屋があったが、今はもうない。", ex: "過去の状態（以前は〜だった）は used to。would は過去の習慣的動作にしか使えない。be used to は「〜に慣れている」。" },
    { t: "c", q: "You ( ) be too careful when you drive.", c: ["cannot", "must not", "should not", "may not"], a: 0, ja: "車を運転するときは、いくら注意してもしすぎることはない。", ex: "cannot 〜 too … で「いくら…してもしすぎることはない」。" },
    { t: "o", ja: "君はすぐに医者に診てもらったほうがいい。", w: ["You", "had", "better", "see", "a doctor", "at once"], ex: "had better + 動詞の原形（〜したほうがいい）。had だが意味は現在。" },
    { t: "o", ja: "彼女は道に迷ったのかもしれない。", w: ["She", "may", "have", "lost", "her", "way"], ex: "may have p.p.（〜したかもしれない）。lose one's way で「道に迷う」。" }
  ]
},

/* ───────── 5. 受動態 ───────── */
{
  id: "passive", title: "受動態", level: "基礎",
  summary: "be + 過去分詞。時制との組み合わせと、句動詞・by 以外の前置詞がポイント。",
  points: [
    { h: "基本形と時制",
      d: "be + p.p.（+ by 〜）で「〜される」。進行形は be being p.p.、完了形は have been p.p.、助動詞付きは 助動詞 + be p.p.。",
      ex: [["The room is cleaned every day.", "その部屋は毎日掃除される。"], ["The road is being repaired.", "その道路は修理されているところだ。"], ["The work must be done today.", "その仕事は今日なされなければならない。"]] },
    { h: "SVOO・SVOC の受動態",
      d: "SVOO は「人」「物」のどちらも主語にできる。SVOC は O を主語にし、C はそのまま残す。",
      ex: [["I was given a watch by my father.", "私は父から時計をもらった。"], ["The baby was named Ken.", "その赤ん坊はケンと名づけられた。"]] },
    { h: "句動詞・知覚動詞・使役動詞の受動態",
      d: "句動詞はひとかたまりで扱い、前置詞を落とさない（be laughed at / be taken care of / be spoken to）。知覚動詞・使役動詞 make の受動態では、原形不定詞が to 不定詞になる。",
      ex: [["He was laughed at by everyone.", "彼はみんなに笑われた。"], ["She was seen to enter the room.", "彼女は部屋に入るのを見られた。"]] },
    { h: "by 以外の前置詞をとる表現",
      d: "be interested in / be surprised at / be satisfied with / be filled with / be covered with / be known to（〜に知られている）/ be made of（材料）・from（原料）など。",
      ex: [["The bottle is filled with water.", "そのびんは水でいっぱいだ。"], ["Wine is made from grapes.", "ワインはブドウから作られる。"]] }
  ],
  qs: [
    { t: "c", q: "This temple ( ) about 500 years ago.", c: ["built", "was built", "has been built", "was building"], a: 1, ja: "この寺は約500年前に建てられた。", ex: "寺は「建てられる」側なので受動態。500 years ago があるので過去形の was built。" },
    { t: "c", q: "A new bridge ( ) now.", c: ["is building", "is being built", "has built", "is been built"], a: 1, ja: "新しい橋が今、建設されているところだ。", ex: "進行形の受動態は be being p.p.（〜されているところだ）。" },
    { t: "c", q: "The baby ( ) by her grandmother.", c: ["was taken care", "was taken care of", "took care of", "was taking care of"], a: 1, ja: "その赤ん坊は祖母に世話をしてもらった。", ex: "take care of を1つの他動詞として受動態にする。of を落とさないこと。" },
    { t: "c", q: "Her eyes were filled ( ) tears.", c: ["with", "by", "of", "in"], a: 0, ja: "彼女の目は涙でいっぱいだった。", ex: "be filled with 〜（〜でいっぱいである）。by 以外の前置詞をとる受動態の表現。" },
    { t: "c", q: "He was made ( ) the room by his mother.", c: ["clean", "to clean", "cleaning", "cleaned"], a: 1, ja: "彼は母親に部屋を掃除させられた。", ex: "使役動詞 make O do の受動態は be made to do。原形不定詞が to 不定詞に変わる。" },
    { t: "c", q: "This problem must ( ) at once.", c: ["solve", "be solved", "be solving", "have solved"], a: 1, ja: "この問題はただちに解決されなければならない。", ex: "助動詞を含む受動態は 助動詞 + be + p.p.。問題は「解決される」側。" },
    { t: "o", ja: "その窓は誰に割られたのですか。", w: ["Who", "was", "the window", "broken", "by"], end: "?", ex: "Who broke the window? の受動態。by の目的語が疑問詞になって文頭に出るので、by が文末に残る。" },
    { t: "o", ja: "彼は友人たちにケンと呼ばれている。", w: ["He", "is", "called", "Ken", "by", "his friends"], ex: "SVOC（call him Ken）の受動態。O を主語にし、補語 Ken は過去分詞の後ろにそのまま残す。" }
  ]
},

/* ───────── 6. 不定詞 ───────── */
{
  id: "infinitive", title: "不定詞", level: "標準",
  summary: "to + 動詞の原形の3用法と、原形不定詞・重要構文を整理する。",
  points: [
    { h: "3つの用法",
      d: "①名詞的用法（〜すること）②形容詞的用法（〜するための・〜すべき）③副詞的用法（目的：〜するために／感情の原因：〜して／結果／判断の根拠）。",
      ex: [["My dream is to be a pilot.", "私の夢はパイロットになることだ。（名詞的）"], ["I have a lot of work to do.", "やるべき仕事がたくさんある。（形容詞的）"], ["I was glad to hear the news.", "その知らせを聞いてうれしかった。（副詞的・感情の原因）"]] },
    { h: "形式主語 it と意味上の主語",
      d: "It is 〜 (for A) to do の形。意味上の主語はふつう for A。ただし kind / nice / careless / foolish / wise など「人の性質」を表す形容詞のときは of A を使う。",
      ex: [["It is difficult for me to solve this problem.", "この問題を解くのは私には難しい。"], ["It was careless of you to forget it.", "それを忘れるなんて君は不注意だった。"]] },
    { h: "SVO + to do と原形不定詞",
      d: "want / tell / ask / allow / enable / expect / advise + O + to do。使役動詞 make / let / have と知覚動詞 see / hear / feel は O + 原形不定詞。不定詞の否定は not to do。",
      ex: [["She told me to wait.", "彼女は私に待つように言った。"], ["Let me introduce myself.", "自己紹介させてください。"]] },
    { h: "重要構文",
      d: "too 〜 to do（〜すぎて…できない）/ 〜 enough to do（…するのに十分〜）/ in order to・so as to do（〜するために）/ 疑問詞 + to do / seem to do / 完了不定詞 to have p.p.（述語動詞より前のことを表す）。",
      ex: [["He is too tired to walk.", "彼は疲れすぎて歩けない。"], ["She seems to have been ill.", "彼女は病気だったようだ。"]] }
  ],
  qs: [
    { t: "c", q: "It is kind ( ) you to help me.", c: ["of", "for", "to", "with"], a: 0, ja: "手伝ってくれるなんて、あなたは親切ですね。", ex: "kind は人の性質を表す形容詞。このとき不定詞の意味上の主語は of A で表す。" },
    { t: "c", q: "My mother made me ( ) my room.", c: ["clean", "to clean", "cleaning", "cleaned"], a: 0, ja: "母は私に部屋を掃除させた。", ex: "使役動詞 make + O + 原形不定詞（O に〜させる）。to は付けない。" },
    { t: "c", q: "This tea is too hot ( ).", c: ["to drink", "to drink it", "drinking", "for drinking it"], a: 0, ja: "このお茶は熱すぎて飲めない。", ex: "too 〜 to do 構文。文の主語 This tea が drink の目的語を兼ねるので、it は付けない。" },
    { t: "c", q: "The teacher told us ( ) in the classroom.", c: ["not to run", "not run", "to not running", "don't run"], a: 0, ja: "先生は私たちに教室で走らないように言った。", ex: "tell O to do の不定詞を否定するときは、to の直前に not を置いて not to do とする。" },
    { t: "c", q: "He seems ( ) rich when he was young.", c: ["to be", "to have been", "being", "having been"], a: 1, ja: "彼は若い頃、金持ちだったようだ。", ex: "「若い頃」は seems（現在）より前のこと。述語動詞より前の時を表すには完了不定詞 to have p.p. を使う。" },
    { t: "c", q: "I don't know ( ) to do next.", c: ["what", "how", "that", "why"], a: 0, ja: "次に何をすればよいかわからない。", ex: "do の目的語が欠けているので、代名詞の働きをする what を入れる。how to do は do の目的語（it など）が必要。" },
    { t: "o", ja: "彼は始発電車に乗るために早く起きた。", w: ["He", "got up", "early", "to", "catch", "the first", "train"], ex: "目的を表す副詞的用法の不定詞（〜するために）。" },
    { t: "o", ja: "彼女は親切にも私に道を教えてくれた。", w: ["She", "was", "kind", "enough", "to", "show", "me", "the way"], ex: "形容詞 + enough to do（…するほど〜だ）。enough は形容詞の後ろに置く。" }
  ]
},

/* ───────── 7. 動名詞 ───────── */
{
  id: "gerund", title: "動名詞", level: "標準",
  summary: "doing で「〜すること」。不定詞との使い分けが最大のポイント。",
  points: [
    { h: "動名詞の働き",
      d: "名詞と同じく、主語・補語・動詞の目的語・前置詞の目的語になる。前置詞の後ろに動詞を置くときは必ず動名詞にする。",
      ex: [["Seeing is believing.", "百聞は一見にしかず。"], ["She is good at playing the piano.", "彼女はピアノを弾くのが得意だ。"]] },
    { h: "目的語に動名詞をとる動詞・不定詞をとる動詞",
      d: "動名詞のみ：enjoy / finish / mind / avoid / give up / stop / deny / admit / consider / practice / put off / suggest。不定詞のみ：want / hope / decide / expect / promise / refuse / manage / pretend。",
      ex: [["I finished writing the report.", "報告書を書き終えた。"], ["He decided to study abroad.", "彼は留学することに決めた。"]] },
    { h: "動名詞と不定詞で意味が変わる動詞",
      d: "remember / forget doing は「（過去に）〜したことを」、to do は「（これから）〜することを」。try doing は「試しに〜してみる」、try to do は「〜しようと努力する」。stop doing は「〜するのをやめる」、stop to do は「〜するために立ち止まる」。",
      ex: [["I'll never forget visiting this place.", "この場所を訪れたことを決して忘れない。"], ["Don't forget to lock the door.", "ドアに鍵をかけるのを忘れないで。"]] },
    { h: "慣用表現",
      d: "look forward to doing（〜を楽しみに待つ）/ be used to doing（〜に慣れている）/ feel like doing（〜したい気がする）/ cannot help doing（〜せずにはいられない）/ be worth doing（〜する価値がある）/ It is no use doing（〜しても無駄だ）/ without doing（〜せずに）。to の後ろが動名詞になる表現に特に注意。",
      ex: [["I'm looking forward to hearing from you.", "お便りを楽しみにしています。"], ["It is no use crying over spilt milk.", "覆水盆に返らず。"]] }
  ],
  qs: [
    { t: "c", q: "Would you mind ( ) the window?", c: ["opening", "to open", "open", "opened"], a: 0, ja: "窓を開けていただけませんか。", ex: "mind は動名詞を目的語にとる動詞。Would you mind doing? で丁寧な依頼を表す。" },
    { t: "c", q: "I'm looking forward to ( ) you again.", c: ["see", "seeing", "have seen", "saw"], a: 1, ja: "またお会いできるのを楽しみにしています。", ex: "look forward to の to は前置詞。後ろには名詞か動名詞が来る。" },
    { t: "c", q: "Remember ( ) the letter on your way to school.", c: ["to mail", "mailing", "mailed", "having mailed"], a: 0, ja: "学校へ行く途中で、忘れずにその手紙を出してね。", ex: "remember to do は「（これから）忘れずに〜する」。まだ行っていない動作なので不定詞。" },
    { t: "c", q: "I remember ( ) him at a party last year.", c: ["meeting", "to meet", "met", "to be met"], a: 0, ja: "去年パーティーで彼に会ったのを覚えている。", ex: "remember doing は「（過去に）〜したことを覚えている」。last year の出来事なので動名詞。" },
    { t: "c", q: "My father is used to ( ) up early.", c: ["get", "getting", "got", "be getting"], a: 1, ja: "父は早起きに慣れている。", ex: "be used to doing（〜に慣れている）の to は前置詞。used to do（以前は〜した）と区別する。" },
    { t: "c", q: "This book is worth ( ) twice.", c: ["reading", "to read", "read", "being read"], a: 0, ja: "この本は2回読む価値がある。", ex: "be worth doing（〜する価値がある）。主語が意味上の目的語になるので、受動形にはしない。" },
    { t: "o", ja: "私は彼の冗談に笑わずにはいられなかった。", w: ["I", "could", "not", "help", "laughing", "at", "his joke"], ex: "cannot help doing（〜せずにはいられない）。laugh at 〜 で「〜を笑う」。" },
    { t: "o", ja: "彼は何も言わずに部屋を出て行った。", w: ["He", "left", "the room", "without", "saying", "anything"], ex: "without doing（〜せずに）。前置詞の後ろの動詞は動名詞にする。" }
  ]
},

/* ───────── 8. 分詞 ───────── */
{
  id: "participle", title: "分詞・分詞構文", level: "標準",
  summary: "現在分詞（能動）と過去分詞（受動）の選択。「する側か、される側か」で判断する。",
  points: [
    { h: "名詞を修飾する分詞",
      d: "現在分詞 doing は「〜している」（能動）、過去分詞 done は「〜された」（受動）。分詞1語なら名詞の前、ほかの語句を伴うときは名詞の後ろに置く。",
      ex: [["Look at the sleeping baby.", "眠っている赤ん坊を見て。"], ["This is a picture painted by my aunt.", "これはおばによって描かれた絵だ。"]] },
    { h: "感情を表す分詞",
      d: "exciting / surprising / boring / interesting は「（物事が人を）〜させるような」、excited / surprised / bored / interested は「（人が）〜させられた → 〜している」。主語が「感情の原因」か「感情を抱く人」かで選ぶ。",
      ex: [["The movie was boring.", "その映画は退屈だった。"], ["I was bored with the movie.", "私はその映画に退屈した。"]] },
    { h: "補語になる分詞（SVOC）",
      d: "see / hear + O + doing（O が〜しているのを見る・聞く）/ keep・leave + O + doing・done / have・get + O + done（O を〜してもらう・〜される）/ make oneself understood（自分の言うことを理解してもらう）。O と分詞の間の「能動・受動」の関係で形を決める。",
      ex: [["I saw him crossing the street.", "彼が通りを渡っているのを見た。"], ["I had my hair cut.", "髪を切ってもらった。"]] },
    { h: "分詞構文",
      d: "分詞が副詞の働きをして、時・理由・付帯状況などを表す。主語が「される」側なら過去分詞で始める。否定は Not doing、主節より前のことは Having p.p.。with + O + 分詞 は「O が〜の状態で」。",
      ex: [["Walking along the street, I met an old friend.", "通りを歩いていると、旧友に出会った。"], ["Written in easy English, the book is good for beginners.", "やさしい英語で書かれているので、その本は初心者向きだ。"]] }
  ],
  qs: [
    { t: "c", q: "The language ( ) in Brazil is Portuguese.", c: ["spoken", "speaking", "speaks", "to speak"], a: 0, ja: "ブラジルで話されている言語はポルトガル語だ。", ex: "言語は「話される」側なので過去分詞。spoken in Brazil が後ろから The language を修飾している。" },
    { t: "c", q: "The game was really ( ).", c: ["exciting", "excited", "excite", "excitement"], a: 0, ja: "その試合は本当にわくわくするものだった。", ex: "主語 The game は人を「興奮させる」側なので exciting。人が主語なら excited。" },
    { t: "c", q: "I had my bike ( ) yesterday.", c: ["stolen", "steal", "stealing", "to steal"], a: 0, ja: "昨日、自転車を盗まれた。", ex: "have + O + 過去分詞 で「O を〜される（被害）」。自転車は「盗まれる」側。" },
    { t: "c", q: "( ) from a distance, the rock looks like a human face.", c: ["Seen", "Seeing", "To see", "Having seen"], a: 0, ja: "遠くから見ると、その岩は人の顔のように見える。", ex: "分詞構文の意味上の主語は主節の主語 the rock。岩は「見られる」側なので過去分詞 Seen。" },
    { t: "c", q: "( ) what to say, I kept silent.", c: ["Not knowing", "Knowing not", "Not known", "Don't knowing"], a: 0, ja: "何と言えばよいかわからなかったので、私は黙っていた。", ex: "分詞構文の否定は、分詞の直前に not を置く（Not doing）。" },
    { t: "c", q: "He sat on the sofa with his eyes ( ).", c: ["closed", "closing", "close", "to close"], a: 0, ja: "彼は目を閉じてソファに座っていた。", ex: "with + O + 分詞 の付帯状況。目は「閉じられる」側なので過去分詞 closed。" },
    { t: "o", ja: "私は英語で自分の言いたいことを伝えられなかった。", w: ["I", "couldn't", "make", "myself", "understood", "in", "English"], ex: "make oneself understood（自分の言うことを相手に理解してもらう）。myself は「理解される」側なので過去分詞。" },
    { t: "o", ja: "あそこで走っている少年は私の弟だ。", w: ["The boy", "running", "over there", "is", "my", "brother"], ex: "分詞がほかの語句（over there）を伴うときは、名詞を後ろから修飾する。" }
  ]
},

/* ───────── 9. 関係詞 ───────── */
{
  id: "relative", title: "関係詞", level: "標準",
  summary: "関係代名詞と関係副詞の区別は「後ろの文が完全か不完全か」で判断する。",
  points: [
    { h: "関係代名詞",
      d: "先行詞が人なら who（主格）/ whose（所有格）/ whom（目的格）、物なら which / whose / which。that は人にも物にも使える。目的格の関係代名詞は省略できる。",
      ex: [["I know a boy who speaks French.", "フランス語を話す少年を知っている。"], ["The book (which) I bought yesterday is interesting.", "昨日買った本は面白い。"]] },
    { h: "関係代名詞 what",
      d: "what は先行詞を含み、「〜すること・もの」（= the thing which）という名詞節を作る。前に先行詞がなく、後ろが不完全な文になる。what is called（いわゆる）/ what I am（今の私）などの慣用表現も重要。",
      ex: [["What I need is time.", "私に必要なのは時間だ。"], ["He is what is called a genius.", "彼はいわゆる天才だ。"]] },
    { h: "関係副詞",
      d: "where（場所）/ when（時）/ why（理由）/ how（方法）。後ろには完全な文が来る。先行詞が場所でも、後ろの文に名詞が欠けていれば関係代名詞を使う。前置詞 + which で書き換えられる（in which = where）。",
      ex: [["This is the town where I grew up.", "ここが私の育った町だ。（後ろは完全な文）"], ["This is the town which I visited last year.", "ここが私が去年訪れた町だ。（visited の目的語が欠けている）"]] },
    { h: "非制限用法と複合関係詞",
      d: "コンマ + 関係詞は、先行詞に補足説明を加える。that と what はこの用法では使えない。, which は前の文全体や一部を受けることもある。whatever / whoever / wherever / however は「〜するものは何でも」「たとえ〜でも」の意味を表す。",
      ex: [["He has two sons, who live in Kobe.", "彼には息子が2人いて、2人とも神戸に住んでいる。"], ["However tired you are, you must do it.", "どんなに疲れていても、それをしなければならない。"]] }
  ],
  qs: [
    { t: "c", q: "This is the house ( ) I was born.", c: ["where", "which", "that", "what"], a: 0, ja: "これが私の生まれた家だ。", ex: "後ろの I was born は欠けた要素のない完全な文。場所を表す先行詞に続く関係副詞 where を使う（= in which）。" },
    { t: "c", q: "This is the house ( ) my grandfather built.", c: ["which", "where", "in which", "what"], a: 0, ja: "これが祖父の建てた家だ。", ex: "built の目的語が欠けている不完全な文なので、関係代名詞 which。先行詞が場所でも where になるとは限らない。" },
    { t: "c", q: "( ) he said was true.", c: ["What", "That", "Which", "It"], a: 0, ja: "彼の言ったことは本当だった。", ex: "先行詞がなく、「〜すること」という名詞節を作るのは関係代名詞 what。What he said が文の主語になっている。" },
    { t: "c", q: "I have a friend ( ) father is a famous doctor.", c: ["whose", "who", "whom", "which"], a: 0, ja: "私には父親が有名な医者である友人がいる。", ex: "「その友人の父親」という所有の関係。直後に名詞 father があるので所有格 whose。" },
    { t: "c", q: "He said he was sick, ( ) was a lie.", c: ["which", "that", "what", "it"], a: 0, ja: "彼は病気だと言ったが、それはうそだった。", ex: "コンマ + which の非制限用法で、前の文の内容全体を受ける。that はこの用法では使えない。" },
    { t: "c", q: "( ) busy he is, he calls his mother every day.", c: ["However", "Whatever", "How", "Whenever"], a: 0, ja: "どんなに忙しくても、彼は毎日母親に電話をする。", ex: "However + 形容詞・副詞 + S V で「たとえどんなに〜でも」という譲歩を表す。" },
    { t: "o", ja: "これが私が先週あなたに話した本です。", w: ["This is", "the book", "I", "told", "you", "about", "last week"], ex: "目的格の関係代名詞（which / that）の省略。tell 人 about 〜 の about が後ろに残る。" },
    { t: "o", ja: "彼は10年前の彼ではない。", w: ["He", "is", "not", "what", "he", "was", "ten years ago"], ex: "what S was（以前の S）/ what S is（今の S）。関係代名詞 what の慣用表現。" }
  ]
},

/* ───────── 10. 比較 ───────── */
{
  id: "comparison", title: "比較", level: "標準",
  summary: "原級・比較級・最上級の基本形と、書き換え・慣用表現をまとめて押さえる。",
  points: [
    { h: "原級を使った比較",
      d: "as + 原級 + as（〜と同じくらい…）、否定は not as (so) 〜 as。倍数は twice / three times などを as の前に置く。数を比べるときは as many + 複数名詞 + as。",
      ex: [["She is as tall as her mother.", "彼女は母親と同じくらいの背の高さだ。"], ["This room is twice as large as mine.", "この部屋は私の部屋の2倍の広さだ。"]] },
    { h: "比較級",
      d: "比較級 + than。比較級を強めるのは much / far / even / still で、very は使えない。2者の比較では the + 比較級 + of the two。The + 比較級 〜, the + 比較級 …（〜すればするほど…）も頻出。",
      ex: [["This is much better than that.", "これはあれよりずっと良い。"], ["The sooner, the better.", "早ければ早いほど良い。"]] },
    { h: "最上級と、最上級の意味を表す書き換え",
      d: "the + 最上級 + in（場所・集団）/ of（複数のもの）。同じ内容を、比較級 + than any other + 単数名詞、No other + 単数名詞 + is as 〜 as …、Nothing is 比較級 than … でも表せる。",
      ex: [["He is the tallest boy in the class.", "彼はクラスで一番背が高い少年だ。"], ["No other boy in the class is as tall as he is.", "クラスで彼ほど背の高い少年はいない。"]] },
    { h: "注意すべき表現",
      d: "no more than（たった〜 = only）/ no less than（〜も = as many/much as）/ not more than（多くても = at most）/ not less than（少なくとも = at least）。prefer A to B、be superior / inferior to など、than ではなく to を使う比較表現もある。",
      ex: [["I have no more than 1,000 yen.", "私は1000円しか持っていない。"], ["I prefer cats to dogs.", "私は犬より猫が好きだ。"]] }
  ],
  qs: [
    { t: "c", q: "This box is three times ( ) that one.", c: ["as heavy as", "heavier as", "heavy than", "as heavier as"], a: 0, ja: "この箱はあの箱の3倍の重さだ。", ex: "倍数表現は 倍数 + as + 原級 + as。as と as の間は原級。" },
    { t: "c", q: "This problem is ( ) more difficult than that one.", c: ["much", "very", "more", "so"], a: 0, ja: "この問題はあの問題よりずっと難しい。", ex: "比較級を強調するのは much / far / even / still。very は比較級を修飾できない。" },
    { t: "c", q: "He is ( ) of the two boys.", c: ["taller", "the taller", "the tallest", "tallest"], a: 1, ja: "彼は2人の少年のうち背の高いほうだ。", ex: "2者の比較で「of the two」があるときは the + 比較級。2者なので最上級は使わない。" },
    { t: "c", q: "Mt. Fuji is higher than ( ) mountain in Japan.", c: ["any other", "all other", "another", "every"], a: 0, ja: "富士山は日本のほかのどの山よりも高い。", ex: "比較級 + than any other + 単数名詞 で最上級の意味を表す。" },
    { t: "c", q: "( ) you practice, the better you will play.", c: ["The more", "More", "The most", "Much more"], a: 0, ja: "練習すればするほど、上手に演奏できるようになる。", ex: "The + 比較級 〜, the + 比較級 …（〜すればするほど、ますます…）。" },
    { t: "c", q: "I prefer reading books ( ) watching TV.", c: ["to", "than", "from", "for"], a: 0, ja: "私はテレビを見るより本を読むほうが好きだ。", ex: "prefer A to B（B より A を好む）。than ではなく to を使う。" },
    { t: "o", ja: "健康ほど大切なものはない。", w: ["Nothing", "is", "more", "important", "than", "health"], ex: "Nothing is + 比較級 + than 〜 で最上級の意味を表す。" },
    { t: "o", ja: "彼は私の2倍の数の本を持っている。", w: ["He", "has", "twice", "as", "many", "books", "as", "I do"], ex: "倍数 + as many + 複数名詞 + as。many と books を離さないこと。" }
  ]
},

/* ───────── 11. 仮定法 ───────── */
{
  id: "subjunctive", title: "仮定法", level: "発展",
  summary: "事実に反する仮定。「時制を1つ過去にずらす」のが基本ルール。",
  points: [
    { h: "仮定法過去",
      d: "現在の事実に反する仮定。If + S + 過去形, S + would / could / might + 原形。be 動詞は主語にかかわらず were を使うのが基本。",
      ex: [["If I had enough money, I could buy the car.", "十分なお金があれば、その車を買えるのに。（実際はお金がない）"], ["If I were you, I would accept the offer.", "もし私があなたなら、その申し出を受けるだろう。"]] },
    { h: "仮定法過去完了",
      d: "過去の事実に反する仮定。If + S + had p.p., S + would / could / might + have p.p.。「過去に〜していたら、今…だろうに」という混合型（if 節は過去完了、主節は would + 原形）もある。",
      ex: [["If I had studied harder, I would have passed the exam.", "もっと勉強していたら、試験に合格していただろうに。"], ["If I had taken the medicine, I would be fine now.", "あの薬を飲んでいたら、今ごろ元気だろうに。"]] },
    { h: "I wish / as if / It is time",
      d: "I wish + 仮定法（〜ならいいのに・〜だったらよかったのに）。as if + 仮定法（まるで〜であるかのように）。It is time + S + 過去形（もう〜してもいい頃だ）。",
      ex: [["I wish I could speak French.", "フランス語が話せたらいいのに。"], ["She looked as if she had seen a ghost.", "彼女はまるで幽霊を見たかのような顔をしていた。"]] },
    { h: "if を使わない仮定法",
      d: "if を省略すると倒置が起こる（Were I 〜 / Had I p.p. 〜 / Should S 〜）。Without / But for 〜（〜がなければ）= If it were not for 〜 / If it had not been for 〜。otherwise（さもなければ）も仮定の意味を含む。",
      ex: [["Had I known that, I would not have gone.", "それを知っていたら、行かなかっただろう。"], ["Without water, nothing could live.", "水がなければ、何も生きられないだろう。"]] }
  ],
  qs: [
    { t: "c", q: "If I ( ) a bird, I could fly to you.", c: ["were", "am", "will be", "have been"], a: 0, ja: "もし私が鳥なら、あなたのところへ飛んで行けるのに。", ex: "主節が could fly なので、現在の事実に反する仮定法過去。if 節の be 動詞は were。" },
    { t: "c", q: "If I had left earlier, I ( ) the train.", c: ["would catch", "would have caught", "caught", "had caught"], a: 1, ja: "もっと早く出発していたら、電車に間に合っただろうに。", ex: "if 節が had left（過去完了）なので仮定法過去完了。主節は would have p.p.。" },
    { t: "c", q: "I wish I ( ) harder when I was a student.", c: ["studied", "had studied", "would study", "have studied"], a: 1, ja: "学生のとき、もっと一生懸命勉強しておけばよかった。", ex: "過去の事実に反する願望は I wish + 仮定法過去完了（had p.p.）。" },
    { t: "c", q: "He talks as if he ( ) everything.", c: ["knew", "will know", "had been known", "is knowing"], a: 0, ja: "彼はまるで何でも知っているかのように話す。", ex: "as if + 仮定法過去で「（実際は違うが）まるで〜であるかのように」。talks と同じ時点のことなので過去形 knew。" },
    { t: "c", q: "( ) I known the truth, I would have told you.", c: ["Had", "If", "Were", "Should"], a: 0, ja: "もし本当のことを知っていたら、あなたに話していただろう。", ex: "If I had known 〜 の if を省略すると、Had I known 〜 と倒置になる。" },
    { t: "c", q: "( ) your help, I would have failed.", c: ["Without", "Unless", "If not", "Except"], a: 0, ja: "あなたの助けがなかったら、私は失敗していただろう。", ex: "Without 〜（〜がなければ・なかったら）は if 節の代わりをする。= But for / If it had not been for your help。" },
    { t: "o", ja: "もう寝る時間ですよ。", w: ["It", "is", "time", "you", "went", "to", "bed"], ex: "It is time + S + 仮定法過去（もう〜してもいい頃だ）。動詞は過去形 went にする。" },
    { t: "o", ja: "もし朝食を食べていたら、今お腹が空いていないだろうに。", w: ["If I", "had eaten", "breakfast,", "I", "would not", "be", "hungry", "now"], ex: "混合型の仮定法。if 節は過去のことなので過去完了、主節は現在のことなので would + 原形。" }
  ]
},

/* ───────── 12. 接続詞 ───────── */
{
  id: "conjunction", title: "接続詞", level: "標準",
  summary: "文と文をつなぐ語。意味だけでなく「後ろに文が来るか、名詞が来るか」に注目する。",
  points: [
    { h: "等位接続詞と相関表現",
      d: "both A and B / either A or B / neither A nor B / not only A but (also) B / not A but B。命令文 + and（〜しなさい、そうすれば）、命令文 + or（〜しなさい、さもないと）。",
      ex: [["Study hard, and you will pass the exam.", "一生懸命勉強しなさい、そうすれば試験に受かる。"], ["He is not a singer but an actor.", "彼は歌手ではなく俳優だ。"]] },
    { h: "名詞節を導く接続詞",
      d: "that（〜ということ）/ whether・if（〜かどうか）/ 疑問詞。間接疑問の語順は「疑問詞 + S + V」。the fact / news / idea + that 〜 は同格（〜という事実・知らせ・考え）。",
      ex: [["I wonder whether he will come.", "彼は来るのだろうか。"], ["Do you know where she lives?", "彼女がどこに住んでいるか知っていますか。"]] },
    { h: "副詞節を導く接続詞",
      d: "時：when / while / before / after / until / as soon as / once。理由：because / since / as。条件：if / unless / as long as / in case。譲歩：though / although / even if / even though。目的・結果：so that S can 〜 / so 〜 that … / such 〜 that …。",
      ex: [["He was so tired that he couldn't walk.", "彼はとても疲れていたので歩けなかった。"], ["I'll go unless it rains.", "雨が降らない限り行きます。"]] },
    { h: "接続詞と前置詞の区別",
      d: "接続詞の後ろには S + V、前置詞の後ろには名詞が来る。because ⇔ because of / while ⇔ during / though・although ⇔ despite・in spite of。",
      ex: [["I stayed home because it rained.", "雨が降ったので家にいた。"], ["I stayed home because of the rain.", "雨のため家にいた。"]] }
  ],
  qs: [
    { t: "c", q: "Hurry up, ( ) you will miss the bus.", c: ["or", "and", "but", "so"], a: 0, ja: "急ぎなさい、さもないとバスに乗り遅れるよ。", ex: "命令文 + or …（〜しなさい、さもないと…）。and なら「そうすれば…」の意味になる。" },
    { t: "c", q: "( ) it was raining, we played soccer.", c: ["Although", "Despite", "Because", "In spite"], a: 0, ja: "雨が降っていたけれども、私たちはサッカーをした。", ex: "後ろに S + V が続くので接続詞が必要。「〜だけれども」は Although。Despite は前置詞で、後ろには名詞が来る。" },
    { t: "c", q: "The game was canceled ( ) the heavy rain.", c: ["because of", "because", "since", "as"], a: 0, ja: "大雨のため試合は中止された。", ex: "後ろが名詞（the heavy rain）なので、前置詞の働きをする because of。because / since / as は接続詞で、後ろに S + V が必要。" },
    { t: "c", q: "He spoke slowly ( ) everyone could understand him.", c: ["so that", "such that", "in order", "so as"], a: 0, ja: "全員が理解できるように、彼はゆっくり話した。", ex: "so that + S + can / could 〜 で「〜できるように」という目的を表す。" },
    { t: "c", q: "It was ( ) a nice day that we went on a picnic.", c: ["such", "so", "very", "too"], a: 0, ja: "とても天気の良い日だったので、私たちはピクニックに出かけた。", ex: "such + a + 形容詞 + 名詞 + that …。so を使う場合は so nice a day の語順になる。" },
    { t: "c", q: "I'll lend you the book ( ) you return it by Friday.", c: ["as long as", "unless", "even though", "as far"], a: 0, ja: "金曜日までに返してくれるなら、その本を貸してあげよう。", ex: "as long as + S + V で「〜する限りは・〜しさえすれば」という条件を表す。" },
    { t: "o", ja: "彼女がなぜ怒っているのか私にはわからない。", w: ["I", "don't", "know", "why", "she", "is", "angry"], ex: "間接疑問は 疑問詞 + S + V の語順。疑問文の語順（why is she）にしない。" },
    { t: "o", ja: "彼は英語だけでなくフランス語も話す。", w: ["He", "speaks", "not only", "English", "but also", "French"], ex: "not only A but also B（A だけでなく B も）。A と B には文法的に同じ形のものを置く。" }
  ]
},

/* ───────── 13. 前置詞 ───────── */
{
  id: "preposition", title: "前置詞", level: "基礎",
  summary: "時・場所・手段を表す基本の前置詞と、紛らわしいペアの使い分け。",
  points: [
    { h: "時を表す前置詞",
      d: "at（時刻・時の一点）/ on（日付・曜日・特定の日の朝や晩）/ in（月・年・季節・午前午後）。by は「〜までに」（期限）、until は「〜までずっと」（継続）。for は期間の長さ（for two weeks）、during は特定の期間（during the vacation）。in は「今から〜後に」、within は「〜以内に」。",
      ex: [["I was born on July 7th.", "私は7月7日に生まれた。"], ["Finish it by noon.", "正午までにそれを終えなさい。"], ["Wait here until noon.", "正午までここで待ちなさい。"]] },
    { h: "場所を表す前置詞",
      d: "at（地点）/ in（空間の中）/ on（接触）。between は2者の間、among は3者以上の間。over（真上・覆って）/ above（上方）/ under（真下）/ below（下方）。",
      ex: [["There is a picture on the wall.", "壁に絵が掛かっている。"], ["She is popular among young people.", "彼女は若者の間で人気がある。"]] },
    { h: "手段・道具など",
      d: "by + 無冠詞の交通・通信手段（by bus / by e-mail）。with + 道具（with a knife）。in + 言語・材料（in English / in ink）。",
      ex: [["I go to school by bike.", "私は自転車で通学している。"], ["Cut it with a knife.", "それをナイフで切りなさい。"]] },
    { h: "群前置詞",
      d: "2語以上で1つの前置詞の働きをする。because of・due to（〜のために）/ in spite of（〜にもかかわらず）/ instead of（〜の代わりに）/ according to（〜によれば）/ thanks to（〜のおかげで）/ in addition to（〜に加えて）/ in front of（〜の前に）。",
      ex: [["Thanks to your help, I succeeded.", "あなたの助けのおかげで成功した。"]] }
  ],
  qs: [
    { t: "c", q: "I was born ( ) the morning of May 5th.", c: ["on", "in", "at", "of"], a: 0, ja: "私は5月5日の朝に生まれた。", ex: "ふつうは in the morning だが、「特定の日の朝」のときは on を使う。" },
    { t: "c", q: "You must hand in the report ( ) Friday.", c: ["by", "until", "in", "for"], a: 0, ja: "金曜日までに報告書を提出しなければならない。", ex: "by は「〜までに」（期限）。until は「〜までずっと」（継続）で、hand in のような1回きりの動作には使えない。" },
    { t: "c", q: "I stayed in London ( ) the summer vacation.", c: ["during", "for", "while", "among"], a: 0, ja: "夏休みの間、ロンドンに滞在した。", ex: "the summer vacation のような特定の期間には during。for は for two weeks のように期間の長さを表す。while は接続詞。" },
    { t: "c", q: "He will be back ( ) an hour.", c: ["in", "after", "at", "on"], a: 0, ja: "彼は1時間後に戻るだろう。", ex: "現在を起点にして「（今から）〜後に」は in で表す。" },
    { t: "c", q: "She wrote the letter ( ) a pencil.", c: ["with", "by", "in", "on"], a: 0, ja: "彼女は鉛筆でその手紙を書いた。", ex: "道具は with + a + 名詞。in を使うなら無冠詞で in pencil となる。by は交通・通信手段。" },
    { t: "c", q: "( ) the weather forecast, it will snow tonight.", c: ["According to", "Thanks to", "Instead of", "In spite of"], a: 0, ja: "天気予報によれば、今夜は雪が降る。", ex: "according to 〜（〜によれば）。情報源を示す群前置詞。" },
    { t: "o", ja: "悪天候にもかかわらず彼らは出かけた。", w: ["They", "went out", "in", "spite", "of", "the bad", "weather"], ex: "in spite of + 名詞（〜にもかかわらず）= despite。" },
    { t: "o", ja: "彼はテレビを見る代わりに本を読んだ。", w: ["He", "read", "a book", "instead", "of", "watching", "TV"], ex: "instead of doing（〜する代わりに）。前置詞 of の後ろなので動名詞にする。" }
  ]
},

/* ───────── 14. 否定・倒置・強調 ───────── */
{
  id: "special", title: "否定・倒置・強調", level: "発展",
  summary: "長文読解でも差がつく特殊構文。形のパターンを覚えてしまうのが近道。",
  points: [
    { h: "部分否定と準否定語",
      d: "not + all / every / always / necessarily / both は「すべてが〜というわけではない」（部分否定）。全否定は none / neither / never / not 〜 any。hardly・scarcely（ほとんど〜ない）/ seldom・rarely（めったに〜ない）/ few・little（ほとんどない）は、それ自体が否定の意味を持つ。",
      ex: [["Not all birds can fly.", "すべての鳥が飛べるわけではない。"], ["I could hardly sleep last night.", "昨夜はほとんど眠れなかった。"]] },
    { h: "否定語を使わない否定表現",
      d: "far from 〜・anything but 〜（決して〜ではない）/ the last + 名詞 + to do（決して〜しない…）/ fail to do（〜しない・できない）/ free from 〜（〜がない）/ beyond description（言葉で表せない）。",
      ex: [["He is far from happy.", "彼は決して幸せではない。"], ["She is the last person to break a promise.", "彼女は決して約束を破るような人ではない。"]] },
    { h: "倒置",
      d: "否定語（句）が文頭に出ると、後ろは疑問文と同じ語順になる。Never have I 〜 / Little did I dream 〜 / Hardly had S p.p. when …（〜するとすぐに…）/ No sooner had S p.p. than … / Not until 〜 did S V。また So + V + S（S もそうだ）/ Neither + V + S（S もそうではない）。",
      ex: [["Never have I heard such a story.", "そんな話は一度も聞いたことがない。"], ["I like tennis. — So do I.", "私はテニスが好きだ。— 私もです。"]] },
    { h: "強調",
      d: "強調構文 It is 〜 that …（…なのは〜だ）は、強調したい語句を It is と that の間に置く。疑問詞の強調は 疑問詞 + is it that 〜?。動詞の強調は do / does / did + 原形。",
      ex: [["It was Tom that broke the window.", "窓を割ったのはトムだ。"], ["I do love you.", "本当にあなたを愛している。"]] }
  ],
  qs: [
    { t: "c", q: "( ) have I seen such a beautiful sight.", c: ["Never", "Ever", "Always", "Once"], a: 0, ja: "こんなに美しい光景は一度も見たことがない。", ex: "後ろが have I seen と倒置になっているので、文頭には否定語が必要。Never + 助動詞 + S + V。" },
    { t: "c", q: "The rich are not ( ) happy.", c: ["always", "never", "hardly", "seldom"], a: 0, ja: "金持ちが必ずしも幸せとは限らない。", ex: "not always は「いつも〜とは限らない」という部分否定。never / hardly / seldom はそれ自体が否定語なので not と重ねない。" },
    { t: "c", q: "I could ( ) hear him because of the noise.", c: ["hardly", "hard", "nearly", "lately"], a: 0, ja: "騒音のせいで、彼の声はほとんど聞こえなかった。", ex: "hardly は「ほとんど〜ない」という準否定語。hard（一生懸命に）と混同しない。" },
    { t: "c", q: "Hardly ( ) the house when it began to rain.", c: ["had I left", "I had left", "did I left", "have I left"], a: 0, ja: "家を出るとすぐに雨が降り始めた。", ex: "Hardly had S p.p. when …（〜するとすぐに…）。否定語 Hardly が文頭にあるので倒置になり、時制は過去完了。" },
    { t: "c", q: "It was in this park ( ) I first met her.", c: ["that", "which", "what", "why"], a: 0, ja: "私が初めて彼女に会ったのはこの公園だった。", ex: "It is 〜 that … の強調構文。副詞句 in this park が強調されている。It was と that を取り除いても文が成り立つ。" },
    { t: "c", q: `"I don't like coffee." "( )."`, c: ["Neither do I", "So do I", "Neither I do", "I don't, too"], a: 0, ja: "「私はコーヒーが好きではない。」「私もです。」", ex: "否定文を受けて「〜もそうではない」は Neither + 助動詞 + S の倒置。So do I は肯定文を受けるときに使う。" },
    { t: "o", ja: "彼は決してうそをつくような人ではない。", w: ["He", "is", "the last", "person", "to", "tell", "a lie"], ex: "the last + 名詞 + to do で「最も〜しそうにない…」→「決して〜しない…」。" },
    { t: "o", ja: "彼が成功するなんて夢にも思わなかった。", w: ["Little", "did", "I", "dream", "that", "he", "would", "succeed"], ex: "否定の副詞 Little が文頭に出て、did I dream と倒置になる。" }
  ]
},

/* ───────── 15. 名詞・代名詞・形容詞・副詞 ───────── */
{
  id: "words", title: "名詞・代名詞・形容詞", level: "標準",
  summary: "不可算名詞、one / it / that、other の仲間、数量表現など、細かいが得点源になる知識。",
  points: [
    { h: "不可算名詞",
      d: "advice / information / news / furniture / baggage / homework / money / work（仕事）などは数えられない名詞。a / an を付けず、複数形にもしない。数えるときは a piece of 〜 を使い、量は much / little / a lot of で表す。",
      ex: [["Let me give you a piece of advice.", "1つ助言をさせてください。"], ["We don't have much information.", "私たちにはあまり情報がない。"]] },
    { h: "代名詞の使い分け",
      d: "it は前に出た「その物そのもの」、one は「同じ種類の不特定の1つ」。比較の文で名詞の繰り返しを避けるときは that（単数）/ those（複数）。another（もう1つ別の）/ the other（残りの1つ）/ others（ほかのいくつか）/ the others（残り全部）。",
      ex: [["I lost my pen, so I bought a new one.", "ペンをなくしたので、新しいのを買った。"], ["Some like summer; others like winter.", "夏が好きな人もいれば、冬が好きな人もいる。"]] },
    { h: "数量を表す語",
      d: "many・few + 可算名詞の複数形、much・little + 不可算名詞。a few / a little は「少しある」（肯定的）、few / little は「ほとんどない」（否定的）。almost は副詞なので、almost all (of) the 〜 または most of the 〜 の形で使う。each / every は単数扱い。",
      ex: [["He has few friends.", "彼には友人がほとんどいない。"], ["Almost all the members agreed.", "ほとんどすべてのメンバーが賛成した。"]] },
    { h: "紛らわしい形容詞・副詞",
      d: "hard（一生懸命に）/ hardly（ほとんど〜ない）、late（遅く）/ lately（最近）、near（近くに）/ nearly（ほとんど）。convenient / possible / necessary はふつう人を主語にしない（× if you are convenient → ○ if it is convenient for you）。",
      ex: [["He works hard.", "彼は一生懸命働く。"], ["He hardly works.", "彼はほとんど働かない。"]] }
  ],
  qs: [
    { t: "c", q: "He gave me ( ) about studying abroad.", c: ["many advices", "a lot of advice", "an advice", "a few advices"], a: 1, ja: "彼は留学についてたくさんの助言をくれた。", ex: "advice は不可算名詞。複数形にせず、a / an や many / a few も付けない。a lot of は可算・不可算のどちらにも使える。" },
    { t: "c", q: "I lost my umbrella, so I have to buy ( ).", c: ["one", "it", "that", "other"], a: 0, ja: "傘をなくしたので、1本買わなければならない。", ex: "なくした傘そのもの（it）ではなく、不特定の「傘を1本」（= an umbrella）なので one。" },
    { t: "c", q: "I have two brothers. One lives in Tokyo, and ( ) lives in Osaka.", c: ["the other", "another", "other", "others"], a: 0, ja: "私には兄弟が2人いる。1人は東京に、もう1人は大阪に住んでいる。", ex: "2つ（2人）のうちの「残りの1つ」は特定されるので the other。" },
    { t: "c", q: "The population of Tokyo is larger than ( ) of Osaka.", c: ["that", "one", "it", "those"], a: 0, ja: "東京の人口は大阪の人口より多い。", ex: "the population の繰り返しを避ける that。the + 単数名詞の代わりで、後ろに of 〜 などの修飾語句を伴う。" },
    { t: "c", q: "There is ( ) milk left in the bottle, so I'll go and buy some.", c: ["little", "few", "a few", "many"], a: 0, ja: "びんに牛乳がほとんど残っていないので、買いに行ってきます。", ex: "milk は不可算名詞なので little。a が付かない little は「ほとんどない」という否定的な意味になる。" },
    { t: "c", q: "( ) the students in this class have a smartphone.", c: ["Almost all", "Almost", "Most", "Almost of"], a: 0, ja: "このクラスのほとんどすべての生徒がスマートフォンを持っている。", ex: "almost は副詞なので名詞を直接修飾できない。almost all (of) the 〜 とする。most を使うなら most of the 〜。" },
    { t: "o", ja: "都合のよいときに私に電話してください。", w: ["Please", "call", "me", "when", "it", "is", "convenient", "for you"], ex: "convenient は人を主語にしない形容詞。it is convenient for + 人 の形で使う。" },
    { t: "o", ja: "私は彼の両親のどちらにも会ったことがない。", w: ["I", "have", "met", "neither", "of", "his", "parents"], ex: "neither of + 複数名詞 で「（2者の）どちらも〜ない」。neither 自体が否定語なので not は不要。" }
  ]
}

];
