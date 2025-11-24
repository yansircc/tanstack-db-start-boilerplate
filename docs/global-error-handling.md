# 全局错误处理实现指南

本文档说明如何使用全局错误处理系统来优雅地处理 TanStack DB 中的各种错误。

## 功能概述

全局错误处理系统提供:
- ✅ **统一的错误处理** - 所有错误通过一个中心化的系统处理
- ✅ **用户友好的错误消息** - 自动将技术错误转换为易懂的消息
- ✅ **Toast 通知** - 错误自动显示为右上角的通知
- ✅ **自动消失** - 3 秒后通知自动消失
- ✅ **错误分类** - 支持 error、warning、info 三种类型
- ✅ **零样板代码** - 在任何地方使用 `useErrorHandler` hook

## 架构

### 1. 错误处理 Context

文件: `/src/lib/error-handler.tsx`

```typescript
export interface ErrorToast {
  id: string;
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  timestamp: Date;
}

interface ErrorHandlerContextValue {
  errors: ErrorToast[];
  addError: (error: ErrorToast) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  handleError: (error: unknown, context?: string) => void;
}
```

**核心功能**:
- `handleError()` - 智能识别错误类型并生成友好消息
- 自动识别 TanStack DB 的所有错误类型
- 支持自定义上下文信息

**支持的错误类型**:
- `SchemaValidationError` - 数据验证失败
- `DuplicateKeyError` - 重复的键
- `UpdateKeyNotFoundError` - 更新的记录不存在
- `DeleteKeyNotFoundError` - 删除的记录不存在
- `CollectionInErrorStateError` - Collection 处于错误状态
- 网络错误 (HTTP, Failed to fetch 等)
- 通用 Error 对象

### 2. Toast 通知组件

文件: `/src/components/ErrorToast.tsx`

```typescript
export function ErrorToast() {
  const { errors, removeError } = useErrorHandler();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error) => (
        <div key={error.id} className="...">
          {/* Icon */}
          {/* Title */}
          {/* Message */}
          {/* Close button */}
        </div>
      ))}
    </div>
  );
}
```

**特点**:
- 固定在右上角
- 根据错误类型显示不同颜色
- 支持手动关闭
- 3 秒后自动消失
- 只在客户端渲染 (避免 SSR 问题)

### 3. Root 集成

文件: `/src/routes/__root.tsx`

```typescript
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorHandlerProvider>
          <Header />
          {children}
          <ErrorToast />
          {/* ... */}
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}
```

**集成点**:
- `ErrorHandlerProvider` 包裹整个应用
- `ErrorToast` 在 body 中渲染
- 所有子组件都可以使用 `useErrorHandler`

## 使用方式

### 基础用法: 在组件中使用

```typescript
import { useErrorHandler } from "@/lib/error-handler";
import { articlesCollection } from "@/db/collections";

function CreateArticleButton() {
  const { handleError } = useErrorHandler();

  const handleCreate = async () => {
    try {
      const tx = articlesCollection.insert({
        id: -Math.floor(Math.random() * 1000000),
        title: "新文章",
        // ...
      });

      // 等待持久化完成
      await tx.isPersisted.promise;

      // 成功!
    } catch (error) {
      // 错误会自动显示为 Toast 通知
      handleError(error, "创建文章");
    }
  };

  return <button onClick={handleCreate}>创建文章</button>;
}
```

### 自动错误消息映射

```typescript
// SchemaValidationError
articlesCollection.insert({ title: 123 });
// 👉 Toast: "数据验证失败: Expected string, received number"

// DuplicateKeyError
articlesCollection.insert({ id: 1, title: "已存在" });
// 👉 Toast: "数据已存在: 该记录已存在,请勿重复添加"

// UpdateKeyNotFoundError
articlesCollection.update("不存在的ID", (draft) => {});
// 👉 Toast: "记录不存在: 要更新的记录不存在,可能已被删除"

// 网络错误
throw new Error("HTTP 500: Internal Server Error");
// 👉 Toast: "网络请求失败: 无法连接到服务器,请检查网络连接"
```

### 使用上下文信息

```typescript
const { handleError } = useErrorHandler();

try {
  await someOperation();
} catch (error) {
  // 添加上下文,让用户知道是哪个操作失败了
  handleError(error, "删除文章");
  // 👉 Toast: "删除文章: 记录不存在,可能已被删除"
}
```

### 在 Collection Handlers 中使用

```typescript
export const articlesCollection = createCollection(
  queryCollectionOptions({
    // ...
    onInsert: async ({ transaction }) => {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: JSON.stringify(transaction.mutations[0].modified),
      });

      if (!response.ok) {
        // 抛出错误,会被全局错误处理器捕获
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  })
);
```

### 高级用法: withErrorHandler

文件: `/src/lib/with-error-handler.ts`

包装异步函数,自动处理错误:

```typescript
import { withErrorHandler } from "@/lib/with-error-handler";
import { useErrorHandler } from "@/lib/error-handler";

function MyComponent() {
  const { handleError } = useErrorHandler();

  // 包装函数,自动添加错误处理
  const createArticle = withErrorHandler(
    async (data) => {
      const tx = articlesCollection.insert(data);
      await tx.isPersisted.promise;
    },
    handleError,
    "创建文章" // 上下文
  );

  return (
    <button onClick={() => createArticle({ title: "测试" })}>
      创建
    </button>
  );
}
```

### 高级用法: executeWithErrorHandler

不重新抛出错误,只显示 Toast:

```typescript
import { executeWithErrorHandler } from "@/lib/with-error-handler";

async function syncData() {
  const { handleError } = useErrorHandler();

  // 执行操作,如果失败只显示 Toast,不会中断程序
  const result = await executeWithErrorHandler(
    async () => {
      return await fetchData();
    },
    handleError,
    "同步数据"
  );

  if (result === null) {
    // 操作失败,但不会抛出错误
    console.log("同步失败,已显示错误通知");
  }
}
```

## 完整示例: 文章管理

```typescript
import { useErrorHandler } from "@/lib/error-handler";
import { articlesCollection } from "@/db/collections";

function ArticleManager() {
  const { handleError } = useErrorHandler();

  // 创建文章
  const handleCreate = async (data: ArticleData) => {
    try {
      const tx = articlesCollection.insert({
        id: -Math.floor(Math.random() * 1000000),
        ...data,
      });

      // UI 立即更新 (乐观更新)
      // 关闭对话框

      // 等待持久化
      await tx.isPersisted.promise;

      // 成功!
    } catch (error) {
      // 自动显示友好的错误消息
      handleError(error, "创建文章");
      // 乐观更新会自动回滚
    }
  };

  // 更新文章
  const handleUpdate = async (id: number, changes: Partial<Article>) => {
    try {
      const tx = articlesCollection.update(id, (draft) => {
        Object.assign(draft, changes);
      });

      await tx.isPersisted.promise;
    } catch (error) {
      handleError(error, "更新文章");
    }
  };

  // 删除文章
  const handleDelete = async (id: number) => {
    try {
      const tx = articlesCollection.delete(id);
      await tx.isPersisted.promise;
    } catch (error) {
      handleError(error, "删除文章");
    }
  };

  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

## 错误消息定制

### 方式 1: 修改全局映射

编辑 `/src/lib/error-handler.tsx` 中的 `handleError` 函数:

```typescript
const handleError = useCallback((error: unknown, context?: string) => {
  let title = "操作失败";
  let message = "发生了未知错误";

  if (error instanceof SchemaValidationError) {
    title = "数据验证失败";
    // 自定义你的消息
    message = "请检查输入的数据格式";
  }

  // 添加更多错误类型...

  addError({ id: crypto.randomUUID(), title, message, type: "error" });
}, []);
```

### 方式 2: 在使用时自定义

```typescript
try {
  await someOperation();
} catch (error) {
  if (error instanceof DuplicateKeyError) {
    // 自定义处理特定错误
    handleError(
      new Error("这篇文章已经存在,请使用不同的标题"),
      "创建文章"
    );
  } else {
    // 其他错误使用默认处理
    handleError(error, "创建文章");
  }
}
```

## 与 TanStack DB 自动回滚的配合

TanStack DB 的乐观更新会在错误时自动回滚:

```typescript
try {
  // 1. 乐观更新立即生效
  const tx = articlesCollection.insert(newArticle);

  // 2. UI 立即显示新文章

  // 3. 等待持久化
  await tx.isPersisted.promise;

  // 4. 成功 - 乐观状态被服务器状态替换
} catch (error) {
  // 5. 失败 - TanStack DB 自动回滚乐观更新
  // 6. 全局错误处理显示 Toast 通知
  handleError(error, "创建文章");

  // 7. UI 自动恢复到之前的状态 (文章消失)
}
```

这种组合提供了最佳用户体验:
- ✅ 立即响应 (乐观更新)
- ✅ 错误提示 (Toast 通知)
- ✅ 自动恢复 (回滚)
- ✅ 零样板代码

## Best Practices

1. **始终提供上下文** - `handleError(error, "创建文章")` 比 `handleError(error)` 更友好

2. **在关键操作中使用** - 创建、更新、删除等用户操作

3. **不要捕获所有错误** - 让意外错误冒泡到全局处理

4. **组合使用 try-catch** - 对于需要特殊处理的错误使用 try-catch

5. **利用自动回滚** - 不需要手动恢复 UI 状态

## 测试错误处理

创建一个测试按钮来触发各种错误:

```typescript
function ErrorTestButton() {
  const { handleError } = useErrorHandler();

  const testErrors = () => {
    // 测试验证错误
    try {
      articlesCollection.insert({ title: 123 as any });
    } catch (error) {
      handleError(error, "测试验证错误");
    }

    // 测试网络错误
    setTimeout(() => {
      handleError(new Error("HTTP 500: Internal Server Error"), "测试网络错误");
    }, 1000);

    // 测试自定义错误
    setTimeout(() => {
      handleError(new Error("自定义错误消息"), "测试自定义错误");
    }, 2000);
  };

  return <button onClick={testErrors}>测试错误处理</button>;
}
```

## 总结

全局错误处理系统提供:

1. **统一的错误处理** - 所有错误通过一个系统处理
2. **用户友好** - 自动转换技术错误为易懂消息
3. **零样板代码** - 只需 `handleError(error, context)`
4. **完美集成 TanStack DB** - 配合乐观更新和自动回滚
5. **易于扩展** - 可以添加更多错误类型和处理逻辑

这种模式让你的应用更加健壮和用户友好! 🎉
