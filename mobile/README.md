# 📱 Civic Platform — Mobile (React Native / Expo)

Мобилната апликација за платформата на граѓански пријави, направена со Expo + React Native. Ги вклучува следните фукнционалности: пријава/регистрација, поднесување пријава со слика и локација, поднесување на идеи, гласање за истите, нотификации и offline queue синхронизација (за пријавите).

---

## Содржина

- [Технологии](#технологии)
- [Структура на проектот](#структура-на-проектот)
- [Инсталација](#инсталација)
- [Конфигурација / Environment](#конфигурација--environment)
- [Паметни уреди / емулатори](#паметни-уреди--емулатори)
- [Debugging и Troubleshooting](#debugging-и-troubleshooting)
- [Клучни фајлови за проверка](#клучни-фајлови-за-проверка)
- [Корисни команди](#корисни-команди)

---

## Технологии

- Expo (managed workflow) — `expo`
- React Native (`react`, `react-native`)
- Navigation: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- Networking: `axios` (+ `expo-secure-store` за токени)
- State / cache: `@tanstack/react-query`, `zustand`
- Camera / Image: `expo-camera`, `expo-image-picker`
- Location: `expo-location`
- Notifications: `expo-notifications`
- Map view: `react-native-leaflet-view`

Верзии и зависимости се наведени во [mobile/package.json](mobile/package.json#L1).

---

## Структура на проектот

Некои важни патеки и нивната улога:

- `App.tsx` — коренот на апликацијата, поставува `QueryClient`, глобален `ThemeProvider` и `AuthProvider`.
- `src/navigation/` — навигациски стекови (`AppStack`, `AuthStack`) и `AppNavigator`.
- `src/api/client.ts` — `axios` клиент (користи `process.env.EXPO_PUBLIC_API_URL` како `baseURL`) и interceptors за Authorization и 401 обработка.
- `src/context/AuthContext/` — работи со логин/логаут и `token` state (secure storage).
- `src/hooks/useNetworkSync.ts` — offline queue + синхронизација.
- `app.json` — Expo конфигурација (permissions, plugins, Android adaptive icon, Google Maps API key placeholder).

Погледнете целосната структура за подлабоко разбирање.

---

## Инсталација

1. Премини во папката `mobile`:

```bash
cd mobile
```

2. Инсталирај Node.js (LTS препорачано) и Expo CLI ако немаш:

```bash
npm install -g expo-cli
```

3. Инсталирај зависности:

```bash
npm install

```

---

## Конфигурација / Environment

Апликацијата користи `process.env.EXPO_PUBLIC_API_URL` во `src/api/client.ts` како базен URL за Backend API.

Тој треба да се постави местото на променливата при старт:

EXPO_PUBLIC_API_URL = "http://YOUR_IP_ADRESS:8000"
потоа

```bash
npx expo start
```


## Паметни уреди 

- За поврзување со физички Android / iOS уред: телефонот и компјутерот треба да бидат на иста Wi‑Fi мрежа.

---

## Debugging и Troubleshooting

- Ако API повиците не работат: проверете `EXPO_PUBLIC_API_URL` и дали бекенд е слуша на `0.0.0.0`.
- Избриши кеш: `npx expo start -c`.
- Ако апликацијата не ја добива локацијата или камерата, проверете permissions во `app.json` и дали уредот ја одобрил дозволата.
- Notifications: за production потребна е конфигурација на FCM/APNs; за development користете Expo notification tools.

---

## Клучни фајлови за проверка

- [App.tsx](mobile/App.tsx#L1) — entry point
- [src/api/client.ts](mobile/src/api/client.ts#L1) — базен API клиент, интерцептори
- [app.json](mobile/app.json#L1) — Expo конфигурација (permissions, plugins)
- [src/context/AuthContext](mobile/src/context/AuthContext) — логика за логин/логаут и SecureStore
- [src/hooks/useNetworkSync.ts](mobile/src/hooks/useNetworkSync.ts#L1) — offline queue и синхронизација

---

## Корисни команди

```bash
# Инсталирај зависимости
npm install

# Start Expo
npx expo start

# Start Android emulator + Expo
npx expo start --android


# Clear cache
npx expo start -c

# Run web (Expo for web)
npx expo start --web
```

