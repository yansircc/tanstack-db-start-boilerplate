# 角色切换功能实现指南

本文档说明如何使用 TanStack DB 实现一个"伪登录"的角色切换功能。

## 功能概述

在应用的右上角添加一个 **"当前: xxx"** 按钮,点击后可以从现有用户中选择一个角色进行切换,模拟不同用户登录的场景。这个功能完全基于 TanStack DB 的乐观更新和自动缓存管理实现。

## 核心特性

- ✅ **纯客户端状态管理** - 使用 TanStack DB Collection 管理当前用户状态
- ✅ **自动持久化** - 状态自动保存到 localStorage,刷新页面不丢失
- ✅ **乐观更新** - 切换角色时 UI 立即响应
- ✅ **响应式** - 所有使用 `useCurrentUser` 的组件自动更新
- ✅ **零样板代码** - 不需要手动管理缓存或状态同步

## 实现架构

### 1. CurrentUser Collection

文件位置: `/src/db/collections/currentUser.collection.ts`

```typescript
// 当前用户状态的 schema
const currentUserSchema = z.object({
  id: z.number(),                       // 固定为 1 (单例)
  userId: z.number().nullable(),        // 当前登录用户的 ID
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  avatar: z.string().nullable(),
});

// 创建 Collection
export const currentUserCollection = createCollection(
  queryCollectionOptions({
    schema: currentUserSchema,
    queryKey: ["currentUser"],
    queryFn: async () => {
      // 从 localStorage 读取持久化状态
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        return [JSON.parse(stored)];
      }
      // 默认未登录状态
      return [{ id: 1, userId: null, username: null, displayName: null, avatar: null }];
    },
    queryClient,
    getKey: (item) => item.id,

    // 状态更新时自动保存到 localStorage
    onUpdate: async ({ transaction }) => {
      const mutation = transaction.mutations[0];
      if (mutation?.modified) {
        localStorage.setItem("currentUser", JSON.stringify(mutation.modified));
      }
    },

    // 不需要 onInsert 和 onDelete (单例模式)
    onInsert: async () => {},
    onDelete: async () => {},
  })
);
```

**关键设计**:
- 使用 **单例模式** - 只有一条记录 (id: 1)
- `queryFn` 从 localStorage 读取初始状态
- `onUpdate` handler 将状态保存到 localStorage
- 不需要服务器持久化 - 纯客户端状态

### 2. useCurrentUser Hook

文件位置: `/src/hooks/useCurrentUser.ts`

```typescript
export function useCurrentUser() {
  const { data: currentUserData } = useLiveQuery((q) =>
    q.from({ current: currentUserCollection }).select(({ current }) => ({
      id: current.id,
      userId: current.userId,
      username: current.username,
      displayName: current.displayName,
      avatar: current.avatar,
    }))
  );

  const currentUser = currentUserData?.[0];

  return {
    currentUser,
    isLoggedIn: currentUser?.userId !== null,
    userId: currentUser?.userId ?? null,
    username: currentUser?.username ?? null,
    displayName: currentUser?.displayName ?? "未登录",
    avatar: currentUser?.avatar ?? null,
  };
}
```

**特点**:
- 使用 `useLiveQuery` 响应式订阅当前用户状态
- 返回便利的派生状态 (isLoggedIn, displayName 等)
- 任何使用这个 hook 的组件都会在角色切换时自动更新

### 3. RoleSwitcher 组件

文件位置: `/src/components/RoleSwitcher.tsx`

```typescript
export function RoleSwitcher() {
  // 获取所有用户列表
  const { data: users } = useLiveQuery((q) =>
    q
      .from({ user: usersCollection })
      .orderBy(({ user }) => user.username, "asc")
      .select(({ user }) => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      }))
  );

  // 获取当前用户状态
  const { data: currentUserData } = useLiveQuery((q) =>
    q.from({ current: currentUserCollection }).select(({ current }) => ({
      id: current.id,
      userId: current.userId,
      username: current.username,
      displayName: current.displayName,
      avatar: current.avatar,
    }))
  );

  const currentUser = currentUserData?.[0];

  // 切换用户 - 使用 TanStack DB 的乐观更新
  const switchUser = (userId: number | null) => {
    if (!currentUser) return;

    const selectedUser = users?.find((u) => u.id === userId);

    // 乐观更新 - UI 立即响应
    currentUserCollection.update(currentUser.id, (draft) => {
      draft.userId = userId;
      draft.username = selectedUser?.username ?? null;
      draft.displayName = selectedUser?.displayName ?? null;
      draft.avatar = selectedUser?.avatar ?? null;
    });
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        当前: {currentUser?.displayName || "未登录"}
      </button>

      {isOpen && (
        <div>
          {/* 未登录选项 */}
          <button onClick={() => switchUser(null)}>未登录</button>

          {/* 用户列表 */}
          {users?.map((user) => (
            <button key={user.id} onClick={() => switchUser(user.id)}>
              {user.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**关键实现**:
- `useLiveQuery` 订阅 users 和 currentUser 两个 collection
- `switchUser` 使用 `collection.update()` 触发乐观更新
- TanStack DB 自动触发 `onUpdate` handler 保存到 localStorage
- 所有订阅了 currentUser 的组件自动重新渲染

### 4. 在页面中使用

文件位置: `/src/routes/dashboard/index.tsx`

```typescript
function RouteComponent() {
  const { currentUser, isLoggedIn, displayName } = useCurrentUser();

  return (
    <div>
      <h1>数据面板</h1>

      {/* 当前用户信息卡片 */}
      <div>
        <h2>当前登录状态</h2>
        <div>
          {currentUser?.avatar && <img src={currentUser.avatar} />}
          <div>{displayName}</div>
          {isLoggedIn ? (
            <div>@{currentUser?.username} (ID: {currentUser?.userId})</div>
          ) : (
            <div>请点击右上角切换角色以"伪登录"</div>
          )}
        </div>
      </div>

      {/* 其他内容 */}
    </div>
  );
}
```

## 数据流

```
用户点击切换角色
    ↓
switchUser() 调用 currentUserCollection.update()
    ↓
乐观状态立即应用 (UI 立即更新)
    ↓
onUpdate handler 触发
    ↓
状态保存到 localStorage
    ↓
所有使用 useCurrentUser 的组件自动重新渲染
```

## TanStack DB 核心优势体现

### 1. 自动乐观更新

```typescript
// 传统方式 (React Query)
const switchUserMutation = useMutation({
  mutationFn: async (userId) => {
    // 手动更新缓存
    queryClient.setQueryData(['currentUser'], (old) => ({
      ...old,
      userId,
      // ... 手动设置其他字段
    }));

    // 手动保存到 localStorage
    localStorage.setItem('currentUser', JSON.stringify(...));
  }
});

// TanStack DB 方式
currentUserCollection.update(currentUser.id, (draft) => {
  draft.userId = userId;
  // 其他字段自动处理
});
// 乐观更新、localStorage 持久化、组件更新 - 全自动!
```

### 2. 不需要手动管理缓存

```typescript
// 传统方式 - 需要手动 invalidate
queryClient.invalidateQueries(['currentUser']);

// TanStack DB - 自动管理
// collection.update() 触发后,所有订阅者自动更新
// 无需手动 invalidate 或 refetch
```

### 3. 响应式查询

```typescript
// 任何地方都可以使用
const { currentUser } = useCurrentUser();

// 角色切换时,所有使用这个 hook 的组件自动更新
// 不需要手动传递 props 或使用 Context
```

## 扩展用法

### 获取当前用户的文章

```typescript
export function useMyArticles() {
  const { userId } = useCurrentUser();

  return useLiveQuery((q) =>
    q
      .from({ article: articlesCollection })
      .where(({ article }) => eq(article.authorId, userId ?? 0))
      .select(({ article }) => article)
  );
}
```

### 权限控制

```typescript
function ArticleActions({ article }) {
  const { userId } = useCurrentUser();

  const canEdit = article.authorId === userId;
  const canDelete = article.authorId === userId;

  return (
    <div>
      {canEdit && <button>编辑</button>}
      {canDelete && <button>删除</button>}
    </div>
  );
}
```

### 在 Mutation 中使用

```typescript
function useCreateArticle() {
  const { userId } = useCurrentUser();

  return () => {
    if (!userId) {
      alert("请先登录");
      return;
    }

    articlesCollection.insert({
      id: crypto.randomUUID(),
      title: "新文章",
      authorId: userId,  // 使用当前用户 ID
      // ...
    });
  };
}
```

## 与传统方案对比

| 特性 | 传统方案 (React Query + Context) | TanStack DB |
|-----|--------------------------------|-------------|
| 状态管理 | 需要 Context Provider | Collection 自动管理 |
| 乐观更新 | 手动实现 | 默认行为 |
| 缓存同步 | 手动 invalidate | 自动同步 |
| 持久化 | 手动 localStorage | onUpdate handler 自动处理 |
| 订阅更新 | 需要 useContext | useLiveQuery 自动订阅 |
| 类型安全 | 手动定义 types | Zod schema 自动推导 |
| 代码量 | ~100+ 行 | ~50 行 |

## 总结

这个角色切换功能完美展示了 TanStack DB 的核心优势:

1. **Collection 作为状态容器** - 不仅用于服务器数据,也可用于客户端状态
2. **乐观更新自动化** - UI 立即响应,无需手动管理
3. **响应式查询** - 所有订阅者自动更新
4. **零样板代码** - 不需要手动 invalidate、refetch、或管理缓存
5. **类型安全** - Zod schema 提供运行时验证和类型推导

这种模式可以推广到任何需要"全局状态 + 持久化"的场景:
- 主题切换 (dark/light mode)
- 语言切换 (i18n)
- 用户偏好设置
- 购物车状态
- 编辑器草稿

所有这些场景都可以用同样的模式实现,享受 TanStack DB 带来的开发体验提升。
