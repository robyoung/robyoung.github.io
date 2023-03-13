+++
date = 2023-02-12
title = "Personal Python Reference"
[taxonomies]
topics = ["python"]
+++

I use Python most days but often find myself hunting out the same bits of documentation.
The goal of this page is to be a reference of those nuggets so that I can find them more
quickly in future. It's going to start small and either grow (if it's useful) or go away
(if it is not).

## Python

### f-strings

- [f-string cheat sheet](https://fstring.help/cheat/)
- [Lexical analysis: Formatted string literals](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
- [Format specification mini-language](https://docs.python.org/3/library/string.html#formatspec)

### Comprehensions

*Nested comprehensions*
```python
[
  item 
  for inner in outer
  for item in inner
]
```

### Special methods

[Special method names](https://docs.python.org/3/reference/datamodel.html#special-method-names)
