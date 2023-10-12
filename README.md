# Tally

Proper counting in as small a package as possible

## Supported
- Counts
- Prefix & Suffix 
- Decimals
- Intl.NumberFormatOptions
  - locale
  - usGrouping

## TODO:
- [ ] Testing
- [x] prefix and suffix
- [x] counting down
- [ ] duration - How to test??
- [ ] easing 
- [ ] signDisplay Intl.NumberFormatOptions
- [ ] plugins?


## Unsupported

The list is features that are built in, but will cause issues until they are solved. 

E.g. 
```js
const counter = Tally(el, {
  // Intl.NumberFormat sees this as
  // 1000% and makes calculating the
  // count *weird*
  end: 10, 
  formatterOptions: {
    style: 'percent'
  }
});
```

- formatterOptions.style