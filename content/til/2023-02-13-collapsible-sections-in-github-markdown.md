+++
date = 2023-02-13
title = "Collapsible sections in GitHub markdown"
[taxonomies]
topics = ["github"]
+++

I didn't learn this trick today and I rarely need it. However, whenever I do 
I have to hunt out an issue or pull request where I have used it before.

## Problem

I want a collapsible section within some GitHub markdown.

<details>
  <summary>like this</summary>

To hide a larger block of text like this. Maybe because it has a big noisy
block of code or maybe because it will only be relevant to some people.
</details>

## Solution

Just drop the same code I used above straight into the text block.

```html
<details>
  <summary>like this</summary>

To hide a larger block of text like this. Maybe because it has a big noisy
block of code or maybe because it will only be relevant to some people.
</details>
```
