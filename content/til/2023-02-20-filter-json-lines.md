+++
date = 2023-02-14
title = "Filter JSON lines"
+++

Today I learnt how to use [jq](https://stedolan.github.io/jq/) to filter [JSON lines](https://jsonlines.org/)
file returning the whole object of each line.

```bash
cat json-lines.json | jq 'if (.name == "something") then . else empty end'
```

I have a love hate relationship with jq. It is so useful for simple things but I find the language so confusing
for more complex use cases and I find the documentation pretty impenetrable.
