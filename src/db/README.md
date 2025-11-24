# TanStack DB 正确架构

## 核心概念

### 1. **Collections = 数据库表的客户端镜像**

Collections 直接映射数据库表，数据来自本地数据库（Drizzle ORM），**不涉及 API 调用**。

```typescript
// src/db/collections/articles.collection.ts
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { articles } from "../schema";

export const articlesCollection = createCollection({
  getKey: (item) => String(item.id),
  sync: {
    sync: ({ collection }) => {
      // 从本地数据库读取
      db.select().from(articles).then((data) => {
        collection.utils.writeBatch(() => {
          data.forEach((article) => {
            collection.utils.writeUpsert(article);
          });
        });
      });
    },
  },
});
```

### 2. **Views = SQL 心智的多表联查**

Views 定义 UI 需要的数据形状，使用 `from + join + where + select` 进行多表联查。

```typescript
// src/db/views/article-with-author.view.ts
import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import { articlesCollection, usersCollection, categoriesCollection } from "../collections";

export const articleWithAuthorView = createLiveQueryCollection((q) =>
  q.from({ article: articlesCollection })
   .join(
     { user: usersCollection },
     ({ article, user }) => eq(article.authorId, user.id),
     "left"
   )
   .join(
     { category: categoriesCollection },
     ({ article, category }) => eq(article.categoryId, category.id),
     "left"
   )
   .where(({ article }) => eq(article.status, "published"))
   .select(({ article, user, category }) => ({
     id: article.id,
     title: article.title,
     author: user ? { id: user.id, name: user.displayName } : null,
     category: category ? { id: category.id, name: category.name } : null,
   }))
);
```

### 3. **UI 只订阅 Views**

组件不直接操作 collections，而是订阅 views，自动响应数据变化。

```tsx
// src/features/articles/components/ArticleList.tsx
import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { articleWithAuthorView } from "@/db/views";

function ArticleList() {
  const { data: articles } = useLiveSuspenseQuery(() => articleWithAuthorView);

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <h3>{article.title}</h3>
          <p>作者：{article.author?.name}</p>
          <p>分类：{article.category?.name}</p>
        </li>
      ))}
    </ul>
  );
}
```

## 文件结构

```
src/
├── db/
│   ├── schema.ts                    # Drizzle schema（数据库表定义）
│   ├── schemas-zod.ts               # Zod schemas & TypeScript types
│   ├── index.ts                     # db 实例
│   ├── collections/                 # 表的客户端镜像
│   │   ├── articles.collection.ts
│   │   ├── users.collection.ts
│   │   ├── categories.collection.ts
│   │   └── index.ts
│   └── views/                       # UI 视图（多表联查）
│       ├── article-with-author.view.ts
│       └── index.ts
└── features/                        # 业务功能模块
    └── articles/
        ├── components/              # UI 组件
        │   └── ArticleList.tsx
        └── pages/                   # 页面
            └── ArticlesPage.tsx
```

## 数据流

```
[SQLite 数据库]
      ↓
[Drizzle ORM]
      ↓
[Collections] (表镜像)
      ↓
[Views] (多表联查，SQL 心智)
      ↓
[useLiveSuspenseQuery]
      ↓
[React Components]
```

## 关键点

1. ✅ **Collection = 数据库表镜像**
   - 数据来自本地数据库
   - 不涉及 API 调用
   - 一张表一个 collection

2. ✅ **View = SQL 查询**
   - 用 `from + join + where + select`
   - 多表联查在客户端执行
   - 定义 UI 需要的数据形状

3. ✅ **UI 订阅 View**
   - 不直接操作 collection
   - 自动响应数据变化
   - 类型安全

4. ✅ **没有复杂的 API 层**
   - 不需要 `features/*/api/` 文件夹
   - 不需要 `onInsert/onUpdate/onDelete` handlers
   - 数据操作直接通过 Drizzle ORM

## 示例：完整流程

### 1. 定义数据库 Schema
```typescript
// src/db/schema.ts
export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').notNull(),
  // ...
});
```

### 2. 创建 Collection
```typescript
// src/db/collections/articles.collection.ts
export const articlesCollection = createCollection({
  getKey: (item) => String(item.id),
  sync: { /* ... */ }
});
```

### 3. 创建 View
```typescript
// src/db/views/article-list.view.ts
export const articleListView = createLiveQueryCollection((q) =>
  q.from({ article: articlesCollection })
   .join(...)
   .select(...)
);
```

### 4. UI 订阅 View
```tsx
// src/features/articles/components/ArticleList.tsx
const { data } = useLiveSuspenseQuery(() => articleListView);
```

---

这就是 TanStack DB 的正确用法：**Collections 映射表，Views 定义查询，UI 订阅 Views**。
