import os

LINK = "https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist"

TEMPLATES = {
    "telegram": [
        "🎰 {headline} 🚀\n\n{body}\n\n🔥 Почему выбирают нас:\n{bullets}\n\n🎁 Забирай бонус:\n👉 {link}",
        "💎 Эксклюзив от {brand}!\n\n{body}\n\n✅ {feature1}\n✅ {feature2}\n✅ {feature3}\n\n🔗 Регистрация: {link}"
    ],
    "twitter": [
        "Looking for the best Web3 casino? 🌐\n\n{brand} offers:\n⚡ 360% Bonus\n⚡ Daily Lucky Spin\n⚡ Instant Payouts\n\nJoin now: {link}\n\n#CryptoCasino #BCGame #Web3",
        "Stop losing, start winning with Provably Fair games! 🎲\n\nRegister at BC.Game via {brand} and get up to 5 BTC daily for free!\n\nCheck it out: {link}"
    ]
}

DATA = {
    "brand": "ZHELEZO",
    "link": LINK,
    "headline": "Крути Колесо Фортуны бесплатно каждый день!",
    "body": "BC.Game — лидер крипто-гемблинга с поддержкой 100+ монет и мгновенными выплатами.",
    "bullets": "• Бонус 360% на первые 4 депозита\n• Daily Lucky Spin до 5 BTC\n• Provably Fair (честные игры)\n• VIP-кэшбэк до 20%",
    "feature1": "Мгновенные выплаты",
    "feature2": "Бонус 360%",
    "feature3": "Анонимность 100%"
}

# 30-дневный контент-план (Texts/CONTENT_STRATEGY.md, раздел 4).
# Каждая запись соответствует теме/CTA из таблицы плана.
CALENDAR = [
    {
        "day": 1, "topic": "Знакомство с брендом ZHELEZO",
        "telegram": f"🎰 Знакомься — ZHELEZO, твой портал в честный крипто-гейминг!\n\nМы отобрали для тебя платформу №1 в нише — BC.Game: 100+ криптовалют, мгновенные выплаты и ежедневное бесплатное колесо фортуны.\n\n✅ Бонус 360% на первые 4 депозита\n✅ Provably Fair — честность подтверждена блокчейном\n✅ Полная анонимность, без KYC\n\n🎁 Забирай бонус и крути Lucky Spin:\n👉 {LINK}\n\n🔞 18+. Играй ответственно.",
        "twitter": f"New here? 👋 Meet ZHELEZO — your gateway to fair crypto gaming on BC.Game.\n\n100+ coins, instant payouts, daily free spins, up to 360% bonus.\n\nJoin now: {LINK}\n\n#CryptoCasino #BCGame 18+"
    },
    {
        "day": 2, "topic": "Инструкция: как крутить Lucky Spin",
        "telegram": f"🎡 Как крутить бесплатный Lucky Spin каждый день — инструкция за 30 секунд:\n\n1️⃣ Регистрируйся по ссылке\n2️⃣ Заходи в раздел «Bonus» → «Lucky Spin»\n3️⃣ Жми «Spin» — колесо крутится раз в 24 часа бесплатно\n4️⃣ Забирай крипту (USDT, TRX, BTC) прямо на баланс\n\nНичего сложного — а призы реальные, вплоть до 5 BTC!\n\n👉 Начни прямо сейчас: {LINK}",
        "twitter": f"Free spin every 24h, no deposit needed. 🎡\n\n1. Register\n2. Open \"Lucky Spin\"\n3. Hit spin\n4. Win real crypto (up to 5 BTC)\n\nTry it: {LINK}\n\n#LuckySpin #BCGame"
    },
    {
        "day": 3, "topic": "Обзор игры Plinko",
        "telegram": f"⚪ Plinko — простая механика, гибкий риск, честный результат.\n\nШарик падает через ряды шипов и попадает в один из множителей — от 0.5x до 1000x. Настраивай уровень риска (Low/Medium/High) и количество рядов под свой стиль игры.\n\nВсё на технологии Provably Fair — каждый дроп можно проверить в блокчейне.\n\n🎯 Пробуй разные стратегии:\n👉 {LINK}",
        "twitter": f"Plinko on BC.Game: drop the ball, pick your risk, chase multipliers up to 1000x. All Provably Fair. 🎯\n\nPlay: {LINK}\n\n#Plinko #ProvablyFair"
    },
    {
        "day": 4, "topic": "Крупный выигрыш дня (Big Win Showcase)",
        "telegram": f"💰 Занос дня! Один из игроков BC.Game сорвал куш в Crash с множителем 87.3x.\n\nТакие моменты — не редкость на платформе с честной механикой Provably Fair. Сегодня повезло ему, завтра можешь оказаться ты.\n\n🔥 Хочешь повторить занос?\n👉 {LINK}",
        "twitter": f"Big win alert 💰 Someone just hit 87.3x on Crash. Your turn next?\n\nPlay fair, play BC.Game: {LINK}\n\n#BigWin #Crash"
    },
    {
        "day": 5, "topic": "Как пополнить баланс в крипте без комиссии",
        "telegram": f"💳 Как пополнить баланс на BC.Game без комиссии — пошагово:\n\n1️⃣ Заходи в раздел «Deposit»\n2️⃣ Выбирай из 100+ криптовалют (BTC, USDT, TRX, SOL и др.)\n3️⃣ Копируй адрес кошелька или сканируй QR\n4️⃣ Отправляй — зачисление за несколько минут, комиссия платформы 0%\n\nПлюс: с первых 4 депозитов действует бонус до 360%.\n\n👉 Пополнить и забрать бонус: {LINK}",
        "twitter": f"Depositing crypto on BC.Game = zero platform fees, 100+ coins supported, funds credited in minutes. 💳\n\nGet your 360% bonus: {LINK}\n\n#CryptoDeposit"
    },
    {
        "day": 6, "topic": "Турниры и гонки с призовым фондом $10,000+",
        "telegram": f"🏆 Еженедельные турниры и гонки на BC.Game — призовой фонд от $10,000!\n\nУчаствуй в любимых слотах или оригинальных играх, набирай очки за ставки и поднимайся в таблице лидеров. Топ игроков получает денежные призы каждую неделю.\n\n🎯 Участие бесплатное для всех зарегистрированных игроков.\n👉 Присоединиться: {LINK}",
        "twitter": f"Weekly races on BC.Game — $10,000+ prize pool. 🏆 Just play your favorite slots to climb the leaderboard.\n\nJoin: {LINK}\n\n#BCGame #Tournament"
    },
    {
        "day": 7, "topic": "Субботний интерактив: угадай Plinko",
        "telegram": f"🔮 Субботний интерактив! Как думаешь, в какой сектор попадёт шарик в следующем дропе Plinko — крайний (шипы, до 1000x) или центральный (стабильный, но ниже)?\n\nПиши свой прогноз в комментариях — самым активным пришлём промокоды на бонусы!\n\n🎲 Проверить свою интуицию в деле:\n👉 {LINK}",
        "twitter": f"Saturday poll: edge multiplier (up to 1000x) or center (safer, lower)? 🔮 Drop your Plinko prediction below.\n\nTest your luck: {LINK}\n\n#Plinko #Poll"
    },
    {
        "day": 8, "topic": "Что такое Provably Fair",
        "telegram": f"🔐 Что такое Provably Fair и почему казино больше не может тебя обмануть?\n\nПеред каждым раундом (Crash, Plinko, Dice) генерируется хэш результата и отправляется в блокчейн — изменить его после уже невозможно. После игры ты можешь взять этот хэш и проверить в независимом валидаторе, что всё было честно ещё до твоего клика.\n\nЭто математическая гарантия честности, а не обещание на словах.\n\n🔍 Проверь сам:\n👉 {LINK}",
        "twitter": f"Provably Fair = math-guaranteed fairness, not a promise. Every round's hash is set BEFORE you play and verifiable on-chain. 🔐\n\nTry it: {LINK}\n\n#ProvablyFair #Web3Gaming"
    },
    {
        "day": 9, "topic": "Обзор игры Crash и базовая стратегия",
        "telegram": f"📈 Crash — одна из самых популярных игр на BC.Game. Правила простые: график растёт и умножает ставку, но может рухнуть в любой момент — твоя задача забрать выигрыш до падения.\n\nБазовая стратегия для старта: ставь автовывод на 1.2x–1.3x — вероятность долёта графика до этой отметки выше 84%.\n\n🚀 Испытай стратегию:\n👉 {LINK}",
        "twitter": f"Crash 101: the multiplier climbs, you cash out before it drops. 📈 Beginner tip — auto cashout at 1.2x-1.3x (84%+ hit rate).\n\nPlay: {LINK}\n\n#Crash #BCGame"
    },
    {
        "day": 10, "topic": "Сравнение с классическими казино",
        "telegram": f"⚖️ BC.Game vs. классическое казино — в чём разница?\n\n❌ Классика: KYC-верификация, вывод от 1 до 5 дней, комиссии на вывод\n✅ BC.Game: без KYC на большинстве уровней, вывод за минуты, 0% комиссии платформы\n\nПлюс — честность каждого раунда можно проверить самому, а не верить на слово.\n\n👉 Регистрируйся анонимно:\n{LINK}",
        "twitter": f"Classic casino: KYC + slow withdrawals. BC.Game: no KYC on most tiers, payouts in minutes. ⚖️\n\nRegister anonymously: {LINK}\n\n#NoKYC #CryptoCasino"
    },
    {
        "day": 11, "topic": "Что такое BCD и стейкинг",
        "telegram": f"🪙 Что такое BCD (BC Dollar) и как на нём зарабатывать?\n\nBCD — внутренняя монета платформы BC.Game. Её можно застейкать и получать пассивный доход, а также использовать в бонусных программах и специальных ивентах для держателей.\n\nЧем дольше держишь и активнее играешь — тем выше твой статус в системе.\n\n💎 Начни копить BCD:\n👉 {LINK}",
        "twitter": f"BCD (BC Dollar) — BC.Game's native coin. Stake it, earn passively, unlock exclusive perks. 🪙\n\nStart here: {LINK}\n\n#BCD #Staking"
    },
    {
        "day": 12, "topic": "Анонс матча Лиги Чемпионов",
        "telegram": f"⚽ Анонс! На этой неделе — топ-матч Лиги Чемпионов с одними из лучших коэффициентов на рынке.\n\nНа BC.Game доступна глубокая линия ставок: основной исход, тоталы, форы, live-ставки прямо по ходу матча.\n\n📊 Смотри аналитику и делай ставку:\n👉 {LINK}",
        "twitter": f"Champions League top match this week — some of the best odds around, live in-play betting available. ⚽\n\nBet now: {LINK}\n\n#ChampionsLeague #Betting"
    },
    {
        "day": 13, "topic": "Розыгрыш промокода среди рефералов",
        "telegram": f"🎁 Розыгрыш для наших рефералов! Среди тех, кто зарегистрировался по ссылке ZHELEZO на этой неделе, разыгрываем эксклюзивный промокод (Shitcode) с мгновенным зачислением монет.\n\nНичего дополнительно делать не нужно — участвуют все активные игроки.\n\n🔑 Ещё не зарегистрирован? Успей:\n👉 {LINK}",
        "twitter": f"Referral giveaway! 🎁 Everyone who joined via ZHELEZO this week is entered to win an exclusive promo code.\n\nJoin now: {LINK}\n\n#Giveaway #PromoCode"
    },
    {
        "day": 14, "topic": "Обзор VIP-клуба и рейкбека",
        "telegram": f"👑 VIP-клуб BC.Game — одна из самых щедрых программ лояльности в индустрии.\n\nЧем активнее играешь, тем выше уровень, а с ним:\n✅ Рейкбек до 20% с каждой ставки (даже проигрышной)\n✅ Еженедельный и ежемесячный кэшбэк\n✅ Личный VIP-менеджер\n\n💎 Получить VIP-статус:\n👉 {LINK}",
        "twitter": f"BC.Game VIP club: up to 20% rakeback on every bet, weekly/monthly cashback, personal manager. 👑\n\nLevel up: {LINK}\n\n#VIPClub #Rakeback"
    },
    {
        "day": 15, "topic": "Анонс пятничного стрима",
        "telegram": f"🎥 Пятничный стрим! Сегодня вечером — трансляция с розыгрышем бонусов среди зрителей в чате.\n\nЗаходи, задавай вопросы, следи за игрой в реальном времени и лови промокоды прямо в эфире.\n\n📺 Ссылка на трансляцию и регистрацию:\n👉 {LINK}",
        "twitter": f"Friday stream tonight 🎥 — live giveaways in chat, real-time gameplay, promo codes dropping live.\n\nWatch & join: {LINK}\n\n#LiveStream #Twitch"
    },
    {
        "day": 16, "topic": "Топ-5 дающих слотов месяца",
        "telegram": f"🎰 Топ-5 самых дающих слотов месяца от Pragmatic Play (по RTP):\n\n1. Gates of Olympus — 96.5%\n2. Sweet Bonanza — 96.5%\n3. Sugar Rush — 96.5%\n4. The Dog House — 96.5%\n5. Wild West Gold — 96.5%\n\nВсе доступны на BC.Game с мгновенным выводом выигрыша.\n\n🎯 Крутить слоты:\n👉 {LINK}",
        "twitter": f"This month's top RTP slots from Pragmatic Play — Gates of Olympus, Sweet Bonanza, Sugar Rush & more. 🎰\n\nSpin now: {LINK}\n\n#Slots #PragmaticPlay"
    },
    {
        "day": 17, "topic": "Безопасный вывод на холодный кошелёк",
        "telegram": f"🔒 Как безопасно вывести выигрыш на холодный кошелёк (Trust Wallet / Ledger):\n\n1️⃣ Раздел «Withdraw» → выбери монету\n2️⃣ Вставь адрес своего холодного кошелька (проверь дважды!)\n3️⃣ Подтверди — большинство выводов проходит за минуты\n\nХолодный кошелёк — лучший способ хранить крупные суммы вне биржи.\n\n👉 Проверить баланс и вывести:\n{LINK}",
        "twitter": f"Safely withdrawing to a cold wallet (Trust Wallet/Ledger): pick coin, paste address, confirm. Done in minutes. 🔒\n\nCheck balance: {LINK}\n\n#ColdWallet #CryptoSecurity"
    },
    {
        "day": 18, "topic": "Лайфхак: установка PWA на мобильный",
        "telegram": f"📱 Лайфхак: играй на BC.Game с мобильного без лагов и рекламы браузера — установи PWA-приложение.\n\n1️⃣ Открой сайт в мобильном браузере\n2️⃣ Нажми «Добавить на главный экран»\n3️⃣ Готово — иконка на рабочем столе, запуск как у нативного приложения\n\nБыстрее, стабильнее, без лишних вкладок.\n\n👉 Установить и зарегистрироваться:\n{LINK}",
        "twitter": f"Mobile lifehack: install BC.Game as a PWA for a lag-free, native-app feel — no browser clutter. 📱\n\nGet started: {LINK}\n\n#PWA #MobileGaming"
    },
    {
        "day": 19, "topic": "Как работает Hash Dice",
        "telegram": f"🎲 Hash Dice — простая математика, мгновенная выплата.\n\nТы задаёшь диапазон чисел (например, «больше 50»), делаешь ставку — и система на основе Provably Fair хэша генерирует результат. Угадал диапазон — забираешь выплату сразу же.\n\nЧем уже диапазон, тем выше множитель.\n\n🎯 Сыграть в Hash Dice:\n👉 {LINK}",
        "twitter": f"Hash Dice: pick a number range, bet, win instantly. Narrower range = higher multiplier. 🎲 Provably Fair, of course.\n\nPlay: {LINK}\n\n#HashDice #ProvablyFair"
    },
    {
        "day": 20, "topic": "Анонс киберспортивного турнира CS2/Dota2",
        "telegram": f"🎮 Анонс! На этой неделе — топовые матчи CS2 и Dota 2 с расширенной линией коэффициентов на BC.Game.\n\nLive-ставки, статистика команд, тоталы по картам и раундам — всё в одном разделе.\n\n📊 Смотри линию и делай ставку:\n👉 {LINK}",
        "twitter": f"Big CS2 & Dota2 matches this week — deep odds, live betting, map/round totals on BC.Game. 🎮\n\nBet now: {LINK}\n\n#Esports #CS2 #Dota2"
    },
    {
        "day": 21, "topic": "Опрос: любимая криптовалюта",
        "telegram": f"🗳️ Опрос: какая твоя любимая криптовалюта для игры на BC.Game?\n\n🟠 BTC\n🔵 ETH\n🟣 SOL\n🟢 USDT\n⚪ TRX\n\nПиши в комментариях и рассказывай, почему именно она!\n\n💳 Пополнить баланс в любимой монете:\n👉 {LINK}",
        "twitter": f"Poll: what's your go-to crypto for gaming — BTC, ETH, SOL, USDT, or TRX? 🗳️ Drop it in the replies.\n\nDeposit here: {LINK}\n\n#CryptoPoll"
    },
    {
        "day": 22, "topic": "Новые релизы слотов Hacksaw Gaming",
        "telegram": f"🆕 Новые релизы от Hacksaw Gaming уже на BC.Game!\n\nФирменная механика студии — высокая волатильность, бонусные покупки и мультипликаторы до x25,000 в отдельных тайтлах. Идеально для тех, кто любит риск ради крупных выплат.\n\n🎰 Протестировать новинки:\n👉 {LINK}",
        "twitter": f"New Hacksaw Gaming releases just dropped on BC.Game — high volatility, bonus buys, multipliers up to 25,000x. 🆕\n\nTry them: {LINK}\n\n#HacksawGaming #NewSlots"
    },
    {
        "day": 23, "topic": "Мифы о казино: очистка кэша",
        "telegram": f"🚫 Миф: «Нужно очистить кэш браузера перед игрой, чтобы повысить шанс выигрыша».\n\nРазоблачаем: результат каждого раунда на BC.Game определяется криптографическим хэшем ДО начала игры и не зависит от твоего браузера, кэша или cookies. Технология Provably Fair делает подобные «лайфхаки» бессмысленными — и это можно проверить самому.\n\n🔍 Убедись сам:\n👉 {LINK}",
        "twitter": f"Myth: \"clear your cache before playing to boost your odds.\" Reality: outcomes are set by a cryptographic hash before you even load the page. 🚫\n\nVerify it yourself: {LINK}\n\n#MythBusted #ProvablyFair"
    },
    {
        "day": 24, "topic": "Как выгодно использовать Bonus Buy",
        "telegram": f"💰 Как использовать функцию «Купить бонус» (Bonus Buy) в слотах с умом:\n\nBonus Buy позволяет сразу зайти в бонусный раунд слота (фриспины, множители), заплатив фиксированную цену вместо ожидания случайного триггера. Это выгодно, когда бонусный раунд слота имеет высокий потенциал выплаты (например, в Gates of Olympus или Sweet Bonanza).\n\nСовет: используй Bonus Buy на слотах с известной высокой волатильностью и заранее определи лимит бюджета.\n\n🎯 Испытать удачу:\n👉 {LINK}",
        "twitter": f"Bonus Buy tip: skip the wait, jump straight into the feature round on high-volatility slots. Set a budget limit first. 💰\n\nTry it: {LINK}\n\n#BonusBuy #Slots"
    },
    {
        "day": 25, "topic": "Розыгрыш $50 в USDT среди крутивших Lucky Spin",
        "telegram": f"🎁 Розыгрыш $50 в USDT! Среди всех, кто крутанул Daily Lucky Spin хотя бы раз за эту неделю, разыгрываем денежный приз.\n\nУчаствовать просто — крути колесо ежедневно, а мы выберем победителя случайным образом в конце недели.\n\n🎡 Ещё не крутил на этой неделе?\n👉 {LINK}",
        "twitter": f"$50 USDT giveaway 🎁 — everyone who spun the Daily Lucky Wheel this week is automatically entered. Winner announced Sunday.\n\nSpin now: {LINK}\n\n#Giveaway #LuckySpin"
    },
    {
        "day": 26, "topic": "Рабочие зеркала и VPN, если сайт заблокирован",
        "telegram": f"🌐 Сайт временно недоступен? Вот что делать:\n\n1️⃣ Проверь актуальное рабочее зеркало в нашем Telegram-канале\n2️⃣ Используй проверенный VPN-сервис для стабильного соединения\n3️⃣ Всегда переходи по ссылке из официального источника (например, отсюда)\n\nТвой аккаунт и баланс при этом никуда не денутся — доступ восстанавливается мгновенно.\n\n👉 Актуальная рабочая ссылка:\n{LINK}",
        "twitter": f"Site blocked in your region? Use a VPN or grab our latest working mirror — your account & balance stay safe either way. 🌐\n\nWorking link: {LINK}\n\n#Mirror #AccessGuide"
    },
    {
        "day": 27, "topic": "Обзор Live-казино (рулетка, блэкджек)",
        "telegram": f"🎥 Live-казино на BC.Game — рулетка и блэкджек с живыми дилерами в 4K-качестве.\n\nПолное ощущение настоящего казино прямо с телефона: живое видео, чат с дилером и другими игроками, ставки в реальном времени.\n\n🃏 Играть с живыми дилерами:\n👉 {LINK}",
        "twitter": f"Live roulette & blackjack in 4K with real dealers — the full casino feel, right from your phone. 🎥\n\nPlay live: {LINK}\n\n#LiveCasino #Roulette"
    },
    {
        "day": 28, "topic": "Как формируется кэшбэк выходного дня",
        "telegram": f"💸 Как формируется кэшбэк выходного дня на BC.Game?\n\nКаждые выходные платформа возвращает часть твоих чистых потерь за неделю — процент зависит от твоего VIP-уровня (от 5% до 20%). Кэшбэк начисляется автоматически, без промокодов и заявок.\n\n📊 Забрать свой кэшбэк:\n👉 {LINK}",
        "twitter": f"Weekend cashback on BC.Game: automatic return on your net losses, 5-20% based on VIP tier — no codes needed. 💸\n\nClaim it: {LINK}\n\n#Cashback #VIP"
    },
    {
        "day": 29, "topic": "Топ заносов недели от сообщества",
        "telegram": f"🔥 Топ заносов недели от игроков нашего сообщества!\n\nСобрали самые жирные выигрыши в Crash, Plinko и слотах за последние 7 дней — реальные скриншоты, реальные множители, реальная крипта на балансах.\n\n🎯 Хочешь оказаться в следующей подборке?\n👉 {LINK}",
        "twitter": f"This week's biggest wins from our community — real screenshots, real multipliers, real crypto. 🔥\n\nWant to be next? {LINK}\n\n#BigWins #CommunityHighlights"
    },
    {
        "day": 30, "topic": "Итоги месяца и финальный Shitcode",
        "telegram": f"🏁 Итоги месяца с ZHELEZO!\n\nЗа этот месяц вместе с вами мы разобрали стратегии Crash и Plinko, честность Provably Fair, VIP-программу и словили немало крупных заносов. Спасибо, что были с нами!\n\nВ честь итогов — финальный эксклюзивный промокод (Shitcode) с мгновенным зачислением бонуса для всех активных игроков.\n\n🎁 Активировать финальный бонус:\n👉 {LINK}\n\nУвидимся в новом месяце с новыми бонусами! 🚀",
        "twitter": f"That's a wrap! 🏁 A month of Crash strategies, Provably Fair deep-dives, VIP perks & big wins with ZHELEZO.\n\nGrab our final exclusive promo code: {LINK}\n\n#Recap #BCGame"
    }
]


def generate_content():
    output_dir = os.path.join(os.path.dirname(__file__), "..", "Texts", "Generated")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    total = 0
    for platform, tpls in TEMPLATES.items():
        for i, tpl in enumerate(tpls):
            content = tpl.format(**DATA)
            file_name = os.path.join(output_dir, f"{platform}_var_{i + 1}.txt")
            with open(file_name, "w", encoding="utf-8") as f:
                f.write(content)
            total += 1

    divider = "\n\n" + "─" * 40 + "\n\n"
    telegram_calendar = divider.join(f"День {d['day']} — {d['topic']}\n\n{d['telegram']}" for d in CALENDAR)
    twitter_calendar = divider.join(f"Day {d['day']} — {d['topic']}\n\n{d['twitter']}" for d in CALENDAR)

    with open(os.path.join(output_dir, "telegram_30day_calendar.txt"), "w", encoding="utf-8") as f:
        f.write(telegram_calendar)
    with open(os.path.join(output_dir, "twitter_30day_calendar.txt"), "w", encoding="utf-8") as f:
        f.write(twitter_calendar)
    total += 2

    print(f"✅ Успешно сгенерировано {total} файлов контента в {output_dir}")


if __name__ == "__main__":
    generate_content()
