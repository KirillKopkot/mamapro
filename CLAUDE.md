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

## Структура папок (`src/`)

- `api/` — слой данных: функции доступа к данным и конфигурация TanStack Query. Сейчас реализация на моках/localStorage, позже будет заменена на HTTP.
- `components/` — переиспользуемые UI-компоненты (Layout, Header, BottomNav, LanguageSwitcher, PageStub).
- `features/` — модули по предметным областям (специалисты, избранное, профиль ребёнка и т. д.): компоненты, хуки, специфичные для фичи.
- `i18n/` — инициализация i18next и словари `ru.json`, `kk.json`.
- `mocks/` — моковые данные. Используются только из `src/api`.
- `pages/` — страницы-маршруты (тонкие, собирают компоненты и фичи).
- `styles/` — глобальные стили и дизайн-токены (`tokens.css`).
- `types/` — общие TypeScript-типы.
- `config/` — конфигурация приложения (`brand.ts` — название и логотип-заглушка).

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
- дети: `getChildren`, `saveChild`
- доступы: `getAccessGrants`, `saveAccessGrant` (пустой список разделов = отзыв), `revokeAccessGrant`

Хуки TanStack Query — в `src/features/*/hooks.ts` (specialists, reviews, favorites, child, access, moderation). Компоненты используют только их.

Моки (`src/mocks`) — начальное значение, пока в localStorage ничего нет. Изменяемые данные хранятся в localStorage, префикс `mamaProPix:`; ключи определены в `src/api/storage.ts`:

| Ключ                      | Содержимое                          |
| ------------------------- | ----------------------------------- |
| `mamaProPix:specialists`  | `Specialist[]`                      |
| `mamaProPix:reviews`      | `Review[]`                          |
| `mamaProPix:favorites`    | `string[]` (id специалистов)        |
| `mamaProPix:children`     | `Child[]`                           |
| `mamaProPix:accessGrants` | `AccessGrant[]`                     |
| `lang`                    | язык интерфейса (`ru` / `kk`), i18n |

## Страница /specialists

- Компоненты в `src/features/specialists/`: `SpecialistCard`, `SortBar`, `FiltersPanel` (на мобильных — нижняя панель по кнопке «Фильтры», от 768px — боковая колонка); `FavoriteButton` — в `src/features/favorites/`.
- Фильтры и сортировка хранятся в URL query-параметрах (`q`, `city`, `spec`, `formats`, `priceMin`, `priceMax`, `exp`, `rating`, `sort`, `dir`); значения по умолчанию в URL не пишутся. Разбор/сборка параметров, фильтрация и сортировка — чистые функции в `filtering.ts` (с тестами).
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

## Страницы и маршруты

| Маршрут             | Страница                |
| ------------------- | ----------------------- |
| `/`                 | Главная                 |
| `/specialists`      | Список специалистов     |
| `/specialists/:id`  | Профиль специалиста     |
| `/favorites`        | Избранное               |
| `/compare`          | Сравнение               |
| `/support`          | Поддержка               |
| `/support/route`    | Маршрут поддержки       |
| `/community`        | Сообщество              |
| `/child`            | Профиль ребёнка         |
| `/specialist/new`   | Регистрация специалиста |
| `/admin/moderation` | Модерация               |

## Приватность

Данные о ребёнке считаются чувствительными: по умолчанию скрыты, доступ выдаётся специалисту явно, по разделам.

## Процесс

После каждого этапа запускать `npm run build` и `npm run lint`, исправлять ошибки, обновлять этот файл при изменении соглашений.

## Статус этапов

- [x] Каркас
- [x] Модель данных и слой api
- [x] Специалисты
- [x] Профиль и отзывы
- [x] Избранное и сравнение
- [ ] Профиль ребёнка
- [ ] Поддержка
- [ ] Сообщество
- [ ] Регистрация и модерация специалистов
- [ ] Полировка
