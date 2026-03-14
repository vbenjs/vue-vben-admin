---
outline: deep
---

# Vben CountToAnimator

`CountToAnimator` renders animated number transitions.

## Basic Usage

Use `start-val`, `end-val`, and `duration` to control the animation range and timing.

<DemoPreview dir="demos/vben-count-to-animator/basic" />

## Formatting

Use `prefix`, `suffix`, `separator`, and `decimal` to control how the number is displayed.

<DemoPreview dir="demos/vben-count-to-animator/custom" />

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `startVal` | starting value | `number` | `0` |
| `endVal` | ending value | `number` | `2021` |
| `duration` | animation duration in ms | `number` | `1500` |
| `autoplay` | start automatically | `boolean` | `true` |
| `prefix` | value prefix | `string` | `''` |
| `suffix` | value suffix | `string` | `''` |
| `separator` | thousands separator | `string` | `','` |
| `decimal` | decimal separator | `string` | `'.'` |
| `color` | text color | `string` | `''` |
| `useEasing` | enable transition preset easing | `boolean` | `true` |
| `transition` | transition preset name | `keyof typeof TransitionPresets` | `'linear'` |
| `decimals` | decimal places to keep | `number` | `0` |

## Events

| Event        | Description                     | Type         |
| ------------ | ------------------------------- | ------------ |
| `started`    | fired when the animation starts | `() => void` |
| `finished`   | fired when the animation ends   | `() => void` |
| `onStarted`  | deprecated alias of `started`   | `() => void` |
| `onFinished` | deprecated alias of `finished`  | `() => void` |

## Exposed Methods

| Method  | Description                       | Type         |
| ------- | --------------------------------- | ------------ |
| `reset` | reset to `startVal` and run again | `() => void` |
