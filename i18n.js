/* интерфейс на двух языках. Шутки, подписи и названия достижений — только на русском: их юмор не переводится дословно. */
function lang(){return ls("ss_lang","ru")}
const EN={
"Интервал смены фото":"Photo interval","1 с":"1 s","1 мин":"1 min",
"Записей":"Entries","Лучшее":"Best","Награды":"Badges",
"Загружаю фотографии…":"Loading photos…","Не удалось загрузить список фотографий. Обновите страницу.":"Could not load the photo list. Refresh the page.",
"Фотографий в коллекции: ":"Photos in the collection: ","Проверить фото":"Check photos",
"Начать":"Start","Календарь":"Calendar","Рекорды":"Records","Статистика":"Statistics","Достижения":"Achievements","Настройки":"Settings","Босс идёт":"Boss is coming",
"Последние записи секундомера":"Recent stopwatch records","Пока пусто — запусти слайд-шоу и нажми «Кончить».":"Nothing yet — start the slideshow and press “Кончить”.",
"← Назад":"← Back","Выйти":"Exit","На весь экран":"Fullscreen","Свернуть":"Collapse","Босс!":"Boss!","Фото":"Photo","Это первая фотография":"This is the first photo",
"Фото закреплено в календаре":"The photo is pinned to the calendar","Вытереться":"Wipe off","Вытерто":"Wiped",
"Поделиться результатом":"Share the result","На главную":"Home","Открыть календарь":"Open calendar","← На главную":"← Home",
"Самые быстрые":"Fastest","Самые долгие":"Longest","Пока нет записей":"No records yet",
"Всего":"Total","Сегодня":"Today","сегодня":"today","За 7 дней":"Last 7 days","Среднее время":"Average time","Всего времени":"Total time","Лучшее время":"Best time","Последние 7 дней":"Last 7 days",
"Любимое фото":"Favorite photo","Выбрано раз: ":"Chosen times: ","Открыто ":"Unlocked "," из ":" of ",
"Голос: мужчина":"Voice: man","Голос: девушка":"Voice: girl","От чьего лица звучат подписи":"Who the captions speak as",
"Перейти в режим для парней":"Switch to the mode for guys","Перейти в режим для девушек":"Switch to the mode for girls",
"Пн":"Mo","Вт":"Tu","Ср":"We","Чт":"Th","Пт":"Fr","Сб":"Sa","Вс":"Su",
"Предыдущий месяц":"Previous month","Следующий месяц":"Next month","есть записи":"has records",
"Записи за ":"Entries for ","Выбери день":"Pick a day","В этот день записей нет.":"No entries on this day.",
"Брызги":"Splash","Показывать брызги":"Show splash","Поделиться":"Share","Открыть":"Open","Удалить":"Delete","Отмена":"Cancel",
"Удалить эту запись?":"Delete this entry?","Запись удалена":"Entry deleted",
"18+":"18+","Сайт содержит шуточный контент для взрослых. Вам есть 18 лет?":"The site has joking adult content. Are you 18 or older?","Мне есть 18":"I am 18+","Мне нет 18":"I am under 18",
"Готово":"Done","Выдержал!":"Held on!","Выдержала!":"Held on!","Не выдержал":"Couldn't hold on","Не выдержала":"Couldn't hold on",
"Обычный":"Regular","Доминантный":"Dominant","Послушный":"Submissive","Доминантная":"Dominant","Послушная":"Submissive",
"Не кончи":"Don't cum","Терпение":"Patience","Команды":"Orders",
"Высокое":"High","Среднее":"Medium","Низкое":"Low",
"Режим игры":"Game mode","Качество эффекта":"Effect quality","Плавающие частицы":"Floating particles",
"Записи":"Records","Экспорт":"Export","Импорт":"Import","Приложение":"App","Установить приложение":"Install app",
"Возраст":"Age","Сбросить подтверждение 18+":"Reset the 18+ confirmation","Подтверждение сброшено":"Confirmation reset",
"Фразы":"Captions","Файл сохранён":"File saved","Файл не подходит":"This file doesn't fit",
"Качество":"Quality","Макс. сторона":"Max. side","Выбрать фото":"Choose photos","Скачать по очереди":"Download one by one","Скачать ZIP":"Download ZIP",
"Сжатие фото":"Photo compression","Нет подходящих файлов":"No suitable files",
"Проверка фото":"Photo check","Проверить":"Check",
"Язык":"Language","Русский":"Russian","Статистика недели":"Week stats","Поделиться итогами недели":"Share the week's summary",
"Текущая серия":"Current streak","Лучшая серия":"Best streak","дней":"days","Активность":"Activity",
"↩ Вернуться":"↩ Back",
};
function T(s){return lang()==="en"&&Object.prototype.hasOwnProperty.call(EN,s)?EN[s]:s}
/* акцентный цвет */
const ACCENTS={purple:["#8b5cf6","#c4b0ff","196,176,255"],pink:["#ec4899","#ffb3d9","255,179,217"],red:["#ef4444","#ffb3b3","255,179,179"],blue:["#3b82f6","#b3d4ff","179,212,255"]};
function applyAccent(){if(fem)return;const a=ACCENTS[ls("ss_accent","purple")]||ACCENTS.purple,r=document.documentElement.style;r.setProperty("--pur",a[0]);r.setProperty("--lil",a[1]);r.setProperty("--pt",a[2])}
applyAccent();
