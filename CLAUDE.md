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
- [ ] Специалисты
- [ ] Профиль и отзывы
- [ ] Избранное и сравнение
- [ ] Профиль ребёнка
- [ ] Поддержка
- [ ] Сообщество
- [ ] Регистрация и модерация специалистов
- [ ] Полировка
