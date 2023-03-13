+++
date = 2023-02-12
title = "Personal Reference"
[taxonomies]
topics = ["python", "linux"]
+++

I find myself searching for the same bits of documentation again and again. This page
is a collection of the things I find myself looking up most often.

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

## Bash

### Escape single quotes

Since [Bash 2.04 some escapes are allowed in $ strings](https://stackoverflow.com/a/16605140/15720).

```bash

> echo $'foo \'bar\' foo'
foo 'bar' foo
```

