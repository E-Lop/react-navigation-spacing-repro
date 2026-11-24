# native-stack: `spacing` header item is ignored (missing `index`)

Minimal reproduction for `@react-navigation/native-stack` on iOS.

A `{ type: 'spacing', spacing: 24 }` item declared between two items of
`unstable_headerRightItems` has no effect: the header is pixel-identical with
and without it.

## Run

```sh
npm install
npx expo prebuild --platform ios
npx expo run:ios
```

`App.tsx` is the whole reproduction: one screen with buttons A and B in
`unstable_headerRightItems`, a 24 pt spacing item between them, and a switch
that removes the spacing item.

## What happens

| | |
|---|---|
| `screenshots/1-with-spacing.png` | A, spacing 24, B: A and B share one glass background, adjacent |
| `screenshots/2-without-spacing.png` | A, B: identical |
| `screenshots/3-with-spacing-and-index-fix.png` | A, spacing 24, B, with the one-line fix below: A and B are two separate glass groups |

Measured on the iPhone 17 simulator, iOS 27.2, from the framebuffer (3x):

- with and without the spacing item, the header band (y 130–290 px) is
  identical: same hash, 0 different pixels;
- with the fix, the shared background splits in two, and the distance between
  the `ellipsis` and `plus` glyphs goes from 106 px to 113 px.

## Cause

In `packages/native-stack/src/views/useHeaderConfigProps.tsx`,
`processBarButtonItems` returns `button` and `menu` items with their position
(`{ ...rest, index, ... }`), but the `spacing` branch returns the item as is:

```ts
if (item.type === 'spacing') {
  if (item.spacing == null) {
    throw new Error(/* ... */);
  }

  return item; // no `index`
}
```

react-native-screens reads the position in `RNSScreenStackHeaderConfig.mm`:
without `index`, `dict[@"index"]` is `nil`, `nil.integerValue` is `0`, and the
fixed space is always inserted at the head of the array, where it separates
nothing.

Fix (used for `3-with-spacing-and-index-fix.png`, applied to
`lib/module/views/useHeaderConfigProps.js` in `node_modules` and then reverted):

```diff
-  return item;
+  return { ...item, index };
```

## Versions

- `@react-navigation/native-stack` 7.21.1 (same code on `main`, checked 2026-11-24)
- `@react-navigation/native` 7.5.2
- `react-native-screens` 4.30.1
- `react-native` 0.88.1, Expo SDK 58
- iOS 27.2, iPhone 17 simulator, Xcode 27.2
