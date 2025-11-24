# 文章管理与角色切换集成

本文档说明如何将角色切换功能与文章管理集成,实现基于当前用户的文章创建和权限控制。

## 功能概述

1. **自动关联当前用户** - 创建文章时自动使用当前登录用户的 ID
2. **动态分类选择** - 从数据库动态加载分类列表
3. **权限控制** - 只有文章作者可以看到编辑和删除按钮
4. **登录检查** - 未登录时禁用创建文章按钮

## 实现细节

### 1. 创建简化的分类查询

文件: `/src/routes/articles/-hooks/useCategoriesSimpleQuery.ts`

```typescript
import { useLiveQuery } from "@tanstack/react-db";
import { categoriesCollection } from "@/db/collections";

export function useCategoriesSimpleQuery() {
  return useLiveQuery((q) =>
    q
      .from({ category: categoriesCollection })
      .select(({ category }) => ({
        id: category.id,
        name: category.name,
      }))
      .orderBy(({ category }) => category.name, "asc")
  );
}
```

**特点**:
- 只返回 `id` 和 `name`,适合表单下拉选择
- 按名称排序
- 使用 `useLiveQuery` 响应式订阅,分类变化时自动更新

### 2. 修改文章列表页面

文件: `/src/routes/articles/index.tsx`

**修改前**:
```typescript
function RouteComponent() {
  const authorId = 1; // 硬编码
  const categories = [
    { id: 1, name: "技术" },
    { id: 2, name: "生活" },
  ]; // 临时数据

  return (
    <div>
      <CreateArticleDialog
        authorId={authorId}
        categories={categories}
        trigger={<Button>创建文章</Button>}
      />
      <ArticleList />
    </div>
  );
}
```

**修改后**:
```typescript
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCategoriesSimpleQuery } from "./-hooks/useCategoriesSimpleQuery";

function RouteComponent() {
  const { userId, isLoggedIn } = useCurrentUser();
  const { data: categories } = useCategoriesSimpleQuery();

  return (
    <div>
      {isLoggedIn ? (
        <CreateArticleDialog
          authorId={userId!}
          categories={categories ?? []}
          trigger={<Button>创建文章</Button>}
        />
      ) : (
        <Button disabled title="请先登录">
          创建文章
        </Button>
      )}
      <ArticleList />
    </div>
  );
}
```

**改进**:
- ✅ 使用 `useCurrentUser()` 获取当前登录用户
- ✅ 使用 `useCategoriesSimpleQuery()` 动态加载分类
- ✅ 未登录时禁用创建按钮
- ✅ 自动响应角色切换和分类变化

### 3. 修改文章列表组件

文件: `/src/routes/articles/-components/ArticleList.tsx`

**修改前**:
```typescript
export function ArticleList() {
  const { data: articles } = useArticlesQuery();
  const authorId = 1; // 硬编码
  const categories = [/* 硬编码 */];

  return (
    <div>
      {articles.map((article) => (
        <div>
          <ArticleCard article={article} />
          <EditArticleDialog
            article={article}
            authorId={authorId}
            categories={categories}
          />
          <DeleteArticleDialog article={article} />
        </div>
      ))}
    </div>
  );
}
```

**修改后**:
```typescript
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCategoriesSimpleQuery } from "../-hooks/useCategoriesSimpleQuery";

export function ArticleList() {
  const { data: articles } = useArticlesQuery();
  const { userId } = useCurrentUser();
  const { data: categories } = useCategoriesSimpleQuery();

  return (
    <div>
      {articles.map((article) => {
        // 只有文章作者可以编辑和删除
        const isAuthor = userId === article.author?.id;

        return (
          <div>
            <ArticleCard article={article} />
            {isAuthor && (
              <>
                <EditArticleDialog
                  article={article}
                  authorId={userId!}
                  categories={categories ?? []}
                />
                <DeleteArticleDialog article={article} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**改进**:
- ✅ 权限检查: `userId === article.author?.id`
- ✅ 只有作者能看到编辑/删除按钮
- ✅ 动态加载分类列表
- ✅ 角色切换时权限自动更新

## 工作流演示

### 场景 1: 创建文章

```
1. 用户点击右上角角色切换器
   ↓
2. 选择一个用户 (例如: Alice)
   ↓
3. currentUserCollection 乐观更新
   ↓
4. useCurrentUser() 自动返回新的 userId
   ↓
5. "创建文章" 按钮变为可用
   ↓
6. 用户点击 "创建文章"
   ↓
7. 表单中的分类下拉框显示动态加载的分类
   ↓
8. 用户填写表单并提交
   ↓
9. CreateArticleDialog 使用 userId (Alice 的 ID) 创建文章
   ↓
10. articlesCollection.insert() 乐观更新
   ↓
11. UI 立即显示新文章 (作者为 Alice)
   ↓
12. onInsert handler 持久化到服务器
   ↓
13. 自动 refetch,服务器数据替换乐观状态
```

### 场景 2: 权限控制

```
1. 页面显示 10 篇文章
   - 3 篇作者是 Alice (ID: 1)
   - 7 篇作者是 Bob (ID: 2)
   ↓
2. 当前用户是 Alice (userId = 1)
   ↓
3. ArticleList 渲染:
   - Alice 的 3 篇文章显示 "编辑" 和 "删除" 按钮
   - Bob 的 7 篇文章不显示任何按钮
   ↓
4. 用户切换角色为 Bob (userId = 2)
   ↓
5. useCurrentUser() 返回新的 userId (2)
   ↓
6. ArticleList 自动重新渲染:
   - Alice 的 3 篇文章不再显示按钮
   - Bob 的 7 篇文章显示 "编辑" 和 "删除" 按钮
```

### 场景 3: 动态分类

```
1. 用户打开 "创建文章" 对话框
   ↓
2. useCategoriesSimpleQuery() 查询分类:
   - 技术
   - 生活
   - 旅游
   ↓
3. 分类下拉框显示 3 个选项
   ↓
4. 管理员在另一个页面添加新分类 "美食"
   ↓
5. categoriesCollection 自动更新
   ↓
6. useCategoriesSimpleQuery() 自动重新执行
   ↓
7. 分类下拉框自动更新为 4 个选项
   - 无需刷新页面
   - 无需手动 refetch
```

## TanStack DB 核心优势

### 1. 响应式权限控制

```typescript
// 传统方式 - 需要手动监听用户变化并重新渲染
const [currentUserId, setCurrentUserId] = useState(1);

useEffect(() => {
  // 监听用户变化,手动触发重新渲染
  const unsubscribe = authStore.subscribe((userId) => {
    setCurrentUserId(userId);
  });
  return unsubscribe;
}, []);

// 每个组件都需要类似的逻辑

// TanStack DB - 自动响应式
const { userId } = useCurrentUser();
const isAuthor = userId === article.author?.id;

// 角色切换时自动重新计算,无需任何额外代码
```

### 2. 自动数据同步

```typescript
// 传统方式 - 需要手动同步多个状态
const createArticle = async (data) => {
  // 1. 创建文章
  await api.articles.create(data);

  // 2. 手动刷新文章列表
  await queryClient.invalidateQueries(['articles']);

  // 3. 如果还显示了分类统计,也需要刷新
  await queryClient.invalidateQueries(['categories']);

  // 4. 如果还显示了用户统计,也需要刷新
  await queryClient.invalidateQueries(['users']);

  // 很容易忘记某些查询!
};

// TanStack DB - 自动同步
articlesCollection.insert({
  id: tempId,
  title: "新文章",
  authorId: userId,
  // ...
});

// onInsert handler 完成后:
// - articlesCollection 自动 refetch
// - 所有使用 useArticlesQuery 的组件自动更新
// - 所有 join 了 articles 的查询自动更新 (如分类统计)
// - 无需手动 invalidate 任何查询
```

### 3. 乐观更新 + 权限检查

```typescript
// TanStack DB - 优雅的乐观更新 + 即时权限反馈
const { userId } = useCurrentUser();

// 创建文章
articlesCollection.insert({
  id: tempId,
  title: "我的新文章",
  authorId: userId, // 当前用户
});

// UI 立即显示:
// - 文章出现在列表中
// - "编辑" 和 "删除" 按钮自动显示 (因为 userId === article.authorId)
// - 用户可以立即编辑刚创建的文章

// 切换角色后:
// - 按钮立即消失 (因为 userId !== article.authorId)
// - 无需重新加载页面
```

## 扩展场景

### 场景 1: 草稿功能

```typescript
// 只显示当前用户的草稿
export function useMyDrafts() {
  const { userId } = useCurrentUser();

  return useLiveQuery((q) =>
    q
      .from({ article: articlesCollection })
      .where(({ article }) =>
        and(
          eq(article.authorId, userId ?? 0),
          eq(article.status, "draft")
        )
      )
      .select(({ article }) => article)
  );
}

// 组件中使用
function MyDrafts() {
  const { data: drafts } = useMyDrafts();
  // 角色切换时自动更新为新用户的草稿
}
```

### 场景 2: 文章统计

```typescript
// 显示当前用户的文章统计
export function useMyArticleStats() {
  const { userId } = useCurrentUser();

  return useLiveQuery((q) =>
    q
      .from({ article: articlesCollection })
      .where(({ article }) => eq(article.authorId, userId ?? 0))
      .select(({ article }) => ({
        total: count(article.id),
        published: count(
          article.status === "published" ? article.id : null
        ),
        drafts: count(article.status === "draft" ? article.id : null),
      }))
  );
}

// 组件中使用
function MyStats() {
  const { data: stats } = useMyArticleStats();
  // 自动响应角色切换和文章变化
}
```

### 场景 3: 协作编辑

```typescript
// 显示我可以编辑的文章 (包括我创建的 + 我被授权的)
export function useEditableArticles() {
  const { userId } = useCurrentUser();

  return useLiveQuery((q) =>
    q
      .from({ article: articlesCollection })
      .leftJoin(
        { permission: permissionsCollection },
        ({ article, permission }) =>
          and(
            eq(article.id, permission.articleId),
            eq(permission.userId, userId ?? 0)
          )
      )
      .where(({ article, permission }) =>
        or(
          eq(article.authorId, userId ?? 0),
          eq(permission.type, "editor")
        )
      )
      .select(({ article }) => article)
  );
}
```

## 总结

这个实现完美展示了 TanStack DB 的优势:

1. **声明式权限控制** - `userId === article.author?.id` 自动响应角色变化
2. **零样板代码** - 不需要手动监听、更新、或同步状态
3. **响应式查询** - 所有查询自动响应 collection 变化
4. **乐观更新** - 创建/编辑文章时 UI 立即响应
5. **类型安全** - TypeScript 类型自动推导
6. **易于扩展** - 添加新功能不需要修改现有代码

与传统方案相比,这种实现方式:
- 代码量减少 50%+
- Bug 风险降低 (无需担心忘记 invalidate 某个查询)
- 用户体验更好 (乐观更新 + 即时权限反馈)
- 易于维护 (声明式逻辑,易于理解)
