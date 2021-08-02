+++
title = "code examples"
draft = true
date = 2021-08-01
+++

## some python code

```python
from . import pico

BASE_URL = "https://api.github.com"


async def search_pulls(session, is_open: bool):
    open_closed = "open" if is_open else "closed"
    params = {
        "q": f"author:robyoung is:{open_closed} is:pr",
        "order": "desc",
        "sort": "updated",
    }
    async with session.get(BASE_URL + "/search/issues", params=params) as resp:
        return await resp.json()


async def search_open_pulls(session):
    return await search_pulls(session, is_open=True)


async def search_closed_pulls(session):
    return await search_pulls(session, is_open=False)


async def get_raw_pull(session, search_result):
    parts = search_result["url"].split("/")
    number = parts[-1]
    repo = parts[-3]
    owner = parts[-4]
    path = f"/repos/{owner}/{repo}/pulls/{number}"

    async with session.get(BASE_URL + path) as resp:
        return await resp.json()
```

## some rust code

```rust
#[async_trait]
pub trait Handler: Send + Sync {
    async fn run(&self, tx: Sender);
}

#[async_trait]
impl<F, R> Handler for F
where
    F: Fn(Sender) -> R + Clone + Sync + Send + 'static,
    R: Future<Output = ()> + Send + 'static,
{
    async fn run(&self, tx: Sender) {
        (self)(tx).await
    }
}

#[derive(Default)]
pub struct Runner {
    handlers: Vec<Box<dyn Handler>>,
}
```
