# mamaProPix

## Описание проекта

Веб-приложение для поиска специалистов для детей с особенностями развития (инклюзивность).
Целевая аудитория: родители в Казахстане. Стартовые города: Астана и Алматы.
Бэкенда пока нет, он будет добавлен позже.

## Стек и команды

React + TypeScript + Vite, React Router, react-i18next, TanStack Query, CSS Modules (без UI-библиотек), ESLint, Prettier, Vitest.

- `npm run dev` — dev-сервер
- `npm run build` — проверка типов (`tsc -b`) и сборка
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm test` — unit-тесты (Vitest)

## Дизайн-язык (редизайн)

Светлый, спокойный, «бережный» стиль: белый фон страниц, крупные скруглённые блоки, один акцент — красный. Макеты — в `design/` (в git не входит, `.gitignore`). Шрифт — Manrope (`@fontsource-variable/manrope`: latin, cyrillic, cyrillic-ext), запасной — Inter, затем system-ui. Manrope не содержит Ә Ғ Қ Ң Ұ, их посимвольно подставляет Inter (проверено по cmap). Заголовки вес 700, акцентные подписи 600, текст 400–500.

Палитра (`src/styles/tokens.css`): `--color-primary #cd2141` (hover `#b51c38`), `--color-pink #fff4f4`, `--color-green #ecf3f0`, `--color-green-text #386154`, `--color-surface #faf9fa`, `--color-lavender #f1eef5`, `--color-text #302c35`, `--color-text-secondary #706974`, `--color-border #e5e5e6`, `--color-white`. Служебные: `--color-error*`, `--color-warning*`.
Радиусы: герой 28px (мобильные 24px), карточки 20px, поля 14px, кнопки 12px, теги 8px, поиск-«таблетка» 999px. Размеры текста — `clamp()`-токены (`--font-size-hero`, `-page-title`, `-h2`, `-card-title`). Контейнер 1200px, боковые отступы 16px / 32px от 768px.

Правила:

- **Никаких хардкод-цветов** (hex/rgb) вне `tokens.css`; радиусы, отступы, шрифты — только токены. Старые имена (`--color-text-muted`, `--radius-sm` и т. п.) оставлены как алиасы, в новом коде использовать новые.
- Страницы собираются из `components/ui`; свои кнопки и поля не писать.
- Цена: «7 000 ₸» (пробел-разделитель тысяч, ключи `price.*`). Города: только Астана и Алматы. Время: «Астаны · UTC+5».
- Шапка: активная ссылка красная с линией 3px на нижней границе шапки; до 768px — гамбургер + `BottomNav` (Главная, Поиск, Избранное, Помощь). У гостя в шапке «Войти»; у вошедшего круглая аватарка 44px с меню («Профиль ребёнка», «Выйти»), в мобильном меню те же пункты.
- Dev-страница `/_ui` (только `import.meta.env.DEV`) показывает весь UI-кит — обновлять при добавлении компонентов.
- Ключ `_review` в `kk.json` — список ключей казахского перевода, которые должен проверить носитель.

## Структура папок (`src/`)

- `api/` — слой данных: функции доступа к данным и конфигурация TanStack Query. Сейчас реализация на моках/localStorage, позже будет заменена на HTTP.
- `components/ui/` — UI-кит (Button, Input/Select/Textarea/Checkbox/Field, Card, Tag, Chip, Eyebrow, SectionTitle, Notice, Breadcrumbs, PageContainer); `components/layout/` — каркас (Layout, Header, BottomNav, Footer); также LanguageSwitcher, PageStub.
- `features/` — модули по предметным областям (специалисты, избранное, профиль ребёнка и т. д.): компоненты, хуки, специфичные для фичи.
- `i18n/` — инициализация i18next и словари `ru.json`, `kk.json`.
- `mocks/` — моковые данные. Используются только из `src/api`.
- `pages/` — страницы-маршруты (тонкие, собирают компоненты и фичи).
- `styles/` — глобальные стили, шрифты (`fonts.css`) и дизайн-токены (`tokens.css`).
- `types/` — общие TypeScript-типы.
- `config/` — конфигурация приложения (`brand.ts` — название «МамаПро»; логотип — `src/assets/icons/logo.png`, он же favicon (`public/favicon.png`)).

## Соглашения

- **Mobile-first**: стили пишутся для мобильных, расширяются через `min-width` media queries. Брейкпоинты: 768px и 1024px.
- Строгий TypeScript, без `any`.
- Только функциональные компоненты.
- Стили — CSS Modules; значения (цвета, отступы, радиусы, шрифты) берутся из CSS-переменных `src/styles/tokens.css`.
- Ни одной хардкодной строки в UI: все тексты через i18n (`t()`), обязательно в обоих языках ru и kk. Язык по умолчанию — ru, выбор хранится в localStorage (`lang`).
- Контент специалистов, который хранится в данных, двуязычный: `{ ru: string; kk: string }` (тип `LocalizedText`).
- Идентификаторы кода — на английском, документация — на русском.

## Правило слоя данных

Компоненты не обращаются к localStorage и мокам напрямую — только через функции из `src/api` и хуки TanStack Query. Реализацию `api` позже заменим на HTTP без изменения компонентов.
(Исключение — инфраструктура i18n, хранящая выбранный язык.)

## Модель данных

Типы лежат в `src/types/index.ts`: `LocalizedText`, `City`, `WorkFormat`, `ModerationStatus`, `Specialist` (с `Education`, `SpecialistCase`, `SocialLink`), `Review`, `Child` (с `ChildDocument`), `AccessGrant` (разделы `ChildSection`). Список городов с локализованными названиями — `src/config/cities.ts` (новый город: добавить в тип `City` и в список).

Функции `src/api` (все асинхронные, с искусственной задержкой `apiConfig.delayMs`):

- специалисты: `listSpecialists` (только approved), `getSpecialist`, `createSpecialist` (статус pending), `listPendingSpecialists`, `moderateSpecialist`
- отзывы: `listReviews` (только approved), `addReview` (статус pending)
- избранное: `listFavorites`, `toggleFavorite`
- дети: `getChildren`, `saveChild` (бросает ошибку при переполнении хранилища), `deleteChild` (вместе с доступами и черновиком), `getChildForSpecialist`
- поддержка: `listSupportArticles(category)`, `listRouteSteps`, `getChecklistState`/`toggleChecklistItem`, `getRouteProgress`/`toggleRouteStep`
- сообщество (демо): `listConsultants`/`getConsultant`, `listCommunities`/`getCommunity`/`listCommunityPosts`, `listMemberships`/`toggleMembership`, `listChatMessages`/`sendChatMessage`/`receiveDemoReply`
- модерация: `listPendingSpecialists`/`moderateSpecialist`, `listPendingReviews`/`moderateReview` (пересчитывает `ratingAvg` и `reviewsCount` по одобренным отзывам); черновик формы специалиста: `getSpecialistDraft`/`saveSpecialistDraft`/`clearSpecialistDraft`
- черновики формы ребёнка: `getChildDraft`, `saveChildDraft`, `clearChildDraft`
- доступы: `getAccessGrants`, `saveAccessGrant` (пустой список разделов = отзыв), `revokeAccessGrant`

Хуки TanStack Query — в `src/features/*/hooks.ts` (specialists, reviews, favorites, child, access, moderation). Компоненты используют только их.

Моки (`src/mocks`) — начальное значение, пока в localStorage ничего нет. Изменяемые данные хранятся в localStorage, префикс `mamaProPix:`; ключи определены в `src/api/storage.ts`:

| Ключ                              | Содержимое                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `mamaProPix:specialists`          | `Specialist[]`                                                                   |
| `mamaProPix:reviews`              | `Review[]`                                                                       |
| `mamaProPix:favorites`            | `string[]` (id специалистов)                                                     |
| `mamaProPix:children`             | `Child[]`                                                                        |
| `mamaProPix:accessGrants`         | `AccessGrant[]`                                                                  |
| `mamaProPix:childDrafts`          | `Record<string, ChildDraft>` (текстовые поля формы; ключ — id ребёнка или `new`) |
| `mamaProPix:supportChecklists`    | `Record<articleId, string[]>` — отмеченные документы статей                      |
| `mamaProPix:routeProgress`        | `string[]` — выполненные этапы маршрута                                          |
| `mamaProPix:communityMemberships` | `string[]` — сообщества, в которые вступил пользователь                          |
| `mamaProPix:chatMessages`         | `Record<consultantId, ChatMessage[]>` — демо-переписка                           |
| `mamaProPix:specialistDraft`      | `SpecialistFormValues` — черновик формы специалиста                              |
| `mamaProPix:users`                | `User[]` (демо-авторизация)                                                      |
| `mamaProPix:session`              | `{ userId }` (localStorage или sessionStorage)                                   |
| `lang`                            | язык интерфейса (`ru` / `kk`), i18n                                              |

## Главная (/)

- Компоненты — `src/features/home/` (`HeroSection`, `DirectionsSection`, `StartSection`, `StepsSection`, `BannerSection`, `FaqSection`), тексты — `home.*` в словарях, ссылки и списки — `content.ts`. Блоки разведены по макету: «Помощь, с которой можно начать» (`#directions`) и баннер «Можно быть мамой…» — только от 768px; «С чего начать?» (сетка 2×2) и кнопка «Найти специалиста» с ссылкой на сообщество — только до 768px. Показ управляется классами `onlyDesktop`/`onlyMobile` в `Home.module.css` (единственное место с `max-width`).
- Панель поиска (десктоп): текст и формат уходят в `/specialists` через `buildSearchUrl` (`searchUrl.ts`, с тестами): `q` и существующий параметр `formats` (онлайн → `online`, «очно» → `clinic,home`).
- Карточки направлений ведут на `/specialists?spec=...`: параметр `spec` теперь список специализаций через запятую (`SpecialistFilters.specializations: string[]`). Если выбрано несколько, в select фильтра показывается неактивный пункт «Выбрано направлений: N». Названия специализаций в `content.ts` — русские, как в данных.
- Шагов четыре (по мобильному макету) на обоих размерах: на десктопе сетка 2×2.
- Тексты FAQ и шагов взяты из макета дословно (включая «Все специалисты проверены нами» — до реальной верификации это нужно пересмотреть).

## Страница /specialists

- Компоненты в `src/features/specialists/`: `SpecialistCard`, `SortBar`, `FiltersPanel` (на мобильных — нижняя панель по кнопке «Фильтры», от 768px — боковая колонка); `FavoriteButton` — в `src/features/favorites/`.
- Фильтры и сортировка хранятся в URL query-параметрах (`q`, `city`, `spec` (список через запятую), `formats`, `priceMin`, `priceMax`, `exp`, `rating`, `sort`, `dir`); значения по умолчанию в URL не пишутся. Разбор/сборка параметров, фильтрация и сортировка — чистые функции в `filtering.ts` (с тестами).
- Специализация в фильтре идентифицируется русским названием (`specialization.ru`); список опций строится из данных.
- Онлайн-специалист без города попадает в выдачу при фильтре по любому городу.
- Склонения («N лет опыта», «N отзывов») — через plural-ключи i18next (`_one/_few/_many/_other`, для kk `_one/_other`); хук `useLang()` из `src/i18n/useLang.ts` даёт текущий язык для выбора `LocalizedText`.

## Страница /specialists/:id

- Секции профиля — в `src/features/specialists/profile/` (`ProfileHeader`, `VideoSection`, `AboutSection`, `CasesSection`, `EducationSection`, `SocialsSection`, обёртка `Section`); секции без данных возвращают `null`. Отзывы — `src/features/reviews/` (`ReviewsSection`, `ReviewForm`).
- Парсинг видео — `parseYoutubeId`/`getYoutubeEmbedUrl` в `features/specialists/youtube.ts` (iframe на youtube-nocookie.com, `loading="lazy"`). Невалидная ссылка — секция скрыта. В форме регистрации специалиста (позже) нужна подсказка: видео не длиннее 3 минут.
- Статистика рейтинга (`reviews/stats.ts`) и валидация отзыва (`reviews/validation.ts`) — чистые функции с тестами. Рейтинг в секции отзывов считается по одобренным отзывам.
- 404 (`NotFoundPage`) показывается для несуществующего id и для специалистов не в статусе approved (проверка в странице, `getSpecialist` статус не фильтрует).
- Отзыв сохраняется со статусом pending, после отправки — сообщение «Отзыв появится после проверки».

## Страницы /favorites и /compare

- `/favorites` (`pages/FavoritesPage.tsx`): `SpecialistCard` с чекбоксом «Выбрать для сравнения» (через проп `footer`). Выбрать можно двух специалистов одной специализации; недоступные чекбоксы отключены с видимой подсказкой. «Сравнить» → `/compare?a=ID&b=ID`. Выбор живёт в состоянии страницы и учитывает только тех, кто ещё в избранном.
- Чистая логика — `features/compare/comparison.ts` (с тестами): `getSelectBlockReason`, `canCompare`, `resolveComparison` (ошибки `missing | same | unavailable | differentSpecialization`), `getBestValues` (больший стаж, меньшая цена, больший рейтинг; у специалиста без отзывов рейтинг не подсвечивается).
- `/compare`: от 768px (`useMediaQuery` + `config/breakpoints.ts`) — общая CSS-сетка из двух колонок, одинаковые разделы в одной строке; на мобильных — аккордеон (открыта одна карточка). Подробные разделы переиспользуют секции профиля (`compareRows` в `features/compare/sections.tsx`). Лучшее значение отмечается иконкой ✓ и текстом «Лучше», а не только цветом.

## Авторизация (демо, без бэкенда)

- `src/api/auth.ts`: `register` (сразу открывает сессию), `login`, `logout`, `getCurrentUser`. Тип `User { id, name, email, passwordHash, createdAt }`; наружу отдаётся `PublicUser` без хэша. Пользователи — `mamaProPix:users`, сессия `{ userId }` — `mamaProPix:session`: в localStorage при «Запомнить меня», иначе в sessionStorage.
- **Пароль хранится как SHA-256 (Web Crypto, e-mail как «соль»). Это НЕ настоящая защита**: хэш лежит в браузере, сессию можно подделать правкой хранилища. Только для демо; заменить на бэкенд (серверное хранение, bcrypt/argon2, токены/cookie).
- Ошибки входа «пользователь не найден» и «неверный пароль» неразличимы (`AuthError('invalidCredentials')`); занятый e-mail — `emailTaken`.
- `features/auth/`: `AuthProvider` + `useAuth()` (user, isLoading, login, register, logout), `RequireAuth`, `AuthShell` (каркас /login и /register), `LoginForm`, `RegisterForm`, `validation.ts` (пароль: ≥ 8 символов, буква и цифра), `redirect.ts` (`safeNext` — только внутренние пути, `loginUrl`). Ошибки под полями текстом, `aria-invalid`, фокус на первом поле с ошибкой.
- Редирект после входа/регистрации — `?next=` или `/`.
- Маршруты: `/child` и `/specialists/:id/booking` (заглушка) обёрнуты в `RequireAuth`. `/favorites` для просмотра открыт, но `FavoriteButton` у гостя ведёт на `/login?next=...`. `/forgot-password` — заглушка «появится позже».
- Данные ребёнка и избранное пока не привязаны к пользователю (общие для браузера) — привязать при появлении бэкенда.

## Профиль ребёнка и модель доступа (/child)

- Модель доступа: по умолчанию данные ребёнка закрыты для всех. Родитель выдаёт `AccessGrant { childId, specialistId, sections }` конкретному специалисту по разделам (`features`, `manifestations`, `whatHelps`, `stressTriggers`, `documents`). Пустой список разделов = нет доступа; доступ отзывается в любой момент.
- `getChildForSpecialist(childId, specialistId)` (`src/api/children.ts`) — единственный способ получить данные ребёнка «глазами специалиста»: без гранта возвращает `null` (не раскрывается ничего), с грантом — `ChildView` только с разрешёнными разделами. **Имя и возраст специалисту не раскрываются никогда.** Фильтрация — чистая `pickSections` (`src/api/childView.ts`), покрыта тестами.
- Удаление ребёнка (`deleteChild`) требует подтверждения в UI и удаляет связанные доступы и черновик.
- Форма: валидация в `features/child/validation.ts` (имя обязательно, возраст 0–18, тексты до 2000 символов, файлы PDF/JPG/PNG до 5 МБ). Автосохранение черновика текстовых полей с задержкой 600 мс; документы в черновик не попадают.
- Документы пока хранятся как dataUrl в localStorage (временное хранилище, в UI есть предупреждение; квота браузера ограничена). При замене на HTTP — загрузка файлов на сервер.
- Приватность: данные ребёнка не попадают в URL (выбранный ребёнок — только состояние компонента), в `console.*` и аналитику. Не добавлять такие вызовы.

## Поддержка (/support, /support/documents, /support/benefits, /support/route)

- Хаб `/support` — карточки трёх разделов. Разделы «Документы» и «Пособия» — страницы со списком статей (раскрываемые карточки: описание, пошаговая инструкция, чек-лист документов с отметками в localStorage). Маршрут — вертикальный список этапов с раскрытием, отметкой «выполнено», прогресс-баром и ссылками на связанные разделы.
- Контент — двуязычные моки в `src/mocks/support/` (`articles.ts`, `route.ts`); читается только через `src/api/support.ts` и хуки `features/support/hooks.ts`.
- Весь контент — **демо**: в начале каждой статьи, списка и маршрута показывается пометка «Демо-контент, информацию нужно проверить в профильных организациях перед публикацией». Перед публикацией содержимое нужно проверить и заменить.

## Сообщество (/community) — ДЕМО

- Вкладки через query `?tab=groups` (по умолчанию «Равные консультанты»). Все профили, сообщения и числа участников выдуманные (`src/mocks/community.ts`); на страницах есть пометки «Демо-режим».
- Чат (`/community/chat/:consultantId`): сообщения пользователя хранятся в localStorage, ответ консультанта — заготовленная реплика через `apiConfig.replyDelayMs` (1,5 с), без реального времени. Баннер «Демо-режим: это не реальный собеседник» обязателен.
- Блок безопасности (`SafetyNotice`) и правила сообщества (`CommunityRules`) показываются на страницах сообщества и чата. Контакт экстренной помощи — `src/config/emergency.ts`.
- Не публиковать выдуманные номера служб: пока `emergencyContact.value` пуст, показывается только общий текст.

## Регистрация и модерация специалистов

- `/specialist/new` (`features/specialistForm/`): мастер из 6 шагов (основное, локация, о себе и видео, образование, кейсы, соцсети) + экран предпросмотра; на каждом шаге один экран, сверху прогресс. Валидация шагов и преобразование в данные — чистые функции в `validation.ts` (с тестами). Для онлайн-специалиста город и адрес необязательны; если адрес начали заполнять — нужны оба языка. Черновик автосохраняется. Подсказка «видео не длиннее 3 минут» — на шаге «О себе и видео». Фото кейсов задаются ссылками (http/https).
- После отправки профиль создаётся со статусом `pending`, в публичные списки не попадает (`listSpecialists` отдаёт только `approved`; покрыто тестом, `src/api/moderation.test.ts`).
- `/admin/moderation` (`features/moderation/`): списки профилей и отзывов со статусом `pending`, полный просмотр (включая тексты на обоих языках), «Одобрить» / «Отклонить». Причина отклонения обязательна на ru и kk (`validation.ts`) и хранится в `rejectionReason`.
- **Доступ к `/admin/moderation` сейчас НЕ защищён** (на странице стоит демо-баннер). Любой пользователь может открыть страницу и модерировать. Это TODO для бэкенда: настоящая авторизация и роли (см. список TODO).

## Страницы и маршруты

| Маршрут                    | Страница                      |
| -------------------------- | ----------------------------- |
| `/`                        | Главная                       |
| `/specialists`             | Список специалистов           |
| `/specialists/:id`         | Профиль специалиста           |
| `/favorites`               | Избранное                     |
| `/compare`                 | Сравнение                     |
| `/support`                 | Поддержка (хаб)               |
| `/support/documents`       | Поддержка: документы          |
| `/support/benefits`        | Поддержка: пособия и выплаты  |
| `/support/route`           | Маршрут поддержки             |
| `/community`               | Сообщество                    |
| `/child`                   | Профиль ребёнка (нужен вход)  |
| `/login`                   | Вход                          |
| `/register`                | Регистрация                   |
| `/forgot-password`         | Восстановление (заглушка)     |
| `/specialists/:id/booking` | Запись (заглушка, нужен вход) |
| `/specialist/new`          | Регистрация специалиста       |
| `/admin/moderation`        | Модерация                     |

## Приватность

Данные о ребёнке считаются чувствительными: по умолчанию скрыты, доступ выдаётся специалисту явно, по разделам.

## TODO для бэкенда и релиза

- [ ] **Защитить `/admin/moderation`**: авторизация и роли (модератор/администратор), серверная проверка прав на модерацию. Сейчас страница открыта всем.
- [ ] Серверная валидация формы специалиста, загрузка фото кейсов (сейчас — ссылки), верификация документов специалиста, проверка длительности видео (≤ 3 минут).
- [ ] Уведомлять специалиста о результате модерации (одобрено/отклонено с причиной).
- [ ] Подставить реальные проверенные контакты экстренной помощи в `src/config/emergency.ts`.
- [ ] Реальный чат с консультантами в реальном времени (WebSocket/SSE), вместо `receiveDemoReply`.
- [ ] Модерация чата и сообщества: жалобы, блокировки, фильтрация персональных данных и данных детей, роли модераторов.
- [ ] Верификация консультантов и согласие на публикацию профилей.
- [ ] Модерация отзывов и рейтингов; пересчёт `ratingAvg`/`reviewsCount` на сервере.
- [ ] Замена localStorage на HTTP-реализацию `src/api`, серверное хранение документов ребёнка и контроль доступа (`AccessGrant`) на сервере.
- [ ] Настоящая авторизация на бэкенде вместо демо (SHA-256 в localStorage — не защита), восстановление пароля, подтверждение e-mail.
- [ ] Проверить демо-контент раздела «Поддержка» в профильных организациях.

## Definition of done (для каждого этапа)

1. `npm run build`, `npm run lint`, `npm test` — без ошибок.
2. Проверка вёрстки на 360, 768 и 1440px (без горизонтального скролла, bottom nav до 768px).
3. Сверка с нужными файлами из `design/`.
4. Все строки через i18n, ru и kk; новые kk-ключи добавлены в `_review`.
5. Видимые focus-стили у всех интерактивных элементов, доступные имена у иконок-кнопок.
6. Обновлены статусы этапов и соглашения в этом файле.

## Статус этапов

- [x] Каркас
- [x] Модель данных и слой api
- [x] Специалисты
- [x] Профиль и отзывы
- [x] Избранное и сравнение
- [x] Профиль ребёнка
- [x] Поддержка
- [x] Сообщество (демо)
- [x] Регистрация и модерация специалистов
- [x] Редизайн: фундамент (токены, шрифт, UI-кит, каркас)
- [x] Авторизация (демо): /login, /register, шапка, RequireAuth
- [x] Главная страница (редизайн)
- [ ] Редизайн страниц по макетам `design/` (специалисты, профиль, вход/регистрация, ребёнок и др.)
- [ ] Полировка
