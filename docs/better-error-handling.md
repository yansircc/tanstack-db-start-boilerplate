# 更好的错误处理方案

## 问题

当前方案需要在每个删除对话框中都添加错误处理:

```typescript
// ❌ 每个组件都要写相同的代码
const handleDelete = async () => {
  try {
    const tx = collection.delete(id);
    await tx.isPersisted.promise;
  } catch (error) {
    if (error instanceof Error && error.message.includes("FOREIGN KEY")) {
      handleError(new Error("..."), "删除失败");
    } else {
      handleError(error, "删除失败");
    }
  }
};
```

这很麻烦,需要在每个组件中重复相同的逻辑!

## 更好的方案

根据 TanStack DB 文档,可以在 **Collection 的 handler 中统一处理错误**!

### 方案 A: 在 Collection Handler 中处理(推荐)

修改 collection 的 `onDelete` handler,让它抛出友好的错误消息:

```typescript
// src/db/collections/categories.collection.ts
import { handleCollectionError } from "@/lib/collection-error-handler";

export const categoriesCollection = createCollection(
  queryCollectionOptions({
    // ...
    onDelete: async ({ transaction }) => {
      try {
        await Promise.all(
          transaction.mutations.map((mutation) => {
            const original = mutation.original as SelectCategory;
            return deleteCategory({ data: { id: original.id } });
          })
        );
      } catch (error) {
        // 在这里统一处理错误,抛出友好消息
        handleCollectionError(error, "删除分类");
      }
    },
  })
);
```

然后在组件中只需要:

```typescript
// ✅ 组件中非常简单
const { handleError } = useErrorHandler();

const handleDelete = async () => {
  try {
    const tx = categoriesCollection.delete(categoryId);
    await tx.isPersisted.promise;
  } catch (error) {
    // Collection handler 已经转换为友好消息
    handleError(error, "删除失败");
  }
};
```

### 方案 B: 使用 React Query 的 onError(更简单)

TanStack DB 基于 React Query,可以使用 React Query 的全局错误处理:

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';
import { errorHandler } from './error-handler-singleton';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // 全局 mutation 错误处理
      onError: (error) => {
        errorHandler.handleError(error);
      },
    },
  },
});
```

然后在组件中根本不需要 try-catch:

```typescript
// ✅ 最简单 - 完全不需要错误处理代码!
const handleDelete = () => {
  categoriesCollection.delete(categoryId);
  // 错误会自动被全局处理器捕获
};
```

### 方案 C: 自定义 Collection Wrapper

创建一个包装器,自动为所有操作添加错误处理:

```typescript
// src/lib/collection-with-error-handling.ts
export function createCollectionWithErrorHandling<T>(
  collectionOptions: any,
  errorMessages: {
    insert?: string;
    update?: string;
    delete?: string;
  }
) {
  const collection = createCollection(collectionOptions);

  return {
    ...collection,
    delete: async (key: any) => {
      try {
        const tx = collection.delete(key);
        await tx.isPersisted.promise;
      } catch (error) {
        globalErrorHandler.handleError(
          error,
          errorMessages.delete || "删除失败"
        );
        throw error; // 重新抛出让调用者知道失败了
      }
    },
    // insert 和 update 同理...
  };
}
```

## 推荐方案

**方案 B (React Query 全局错误处理)** 是最简单的:

### 步骤 1: 创建错误处理单例

```typescript
// src/lib/error-handler-singleton.ts
class ErrorHandlerSingleton {
  private handler: ((error: unknown, context?: string) => void) | null = null;

  setHandler(handler: (error: unknown, context?: string) => void) {
    this.handler = handler;
  }

  handleError(error: unknown, context?: string) {
    if (this.handler) {
      this.handler(error, context);
    } else {
      console.error("[ErrorHandler] No handler set", error);
    }
  }
}

export const errorHandlerSingleton = new ErrorHandlerSingleton();
```

### 步骤 2: 在 Provider 中注册

```typescript
// src/lib/error-handler.tsx
export function ErrorHandlerProvider({ children }: { children: ReactNode }) {
  // ...

  useEffect(() => {
    // 注册全局处理器
    errorHandlerSingleton.setHandler(handleError);
  }, [handleError]);

  return <ErrorHandlerContext.Provider value={...}>{children}</ErrorHandlerContext.Provider>;
}
```

### 步骤 3: 配置 QueryClient

```typescript
// src/lib/query-client.ts
import { errorHandlerSingleton } from "./error-handler-singleton";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        errorHandlerSingleton.handleError(error);
      },
    },
  },
});
```

### 步骤 4: 组件中无需任何错误处理!

```typescript
// ✅ 最简单!
export function DeleteCategoryDialog({ categoryId, trigger }: Props) {
  const handleDelete = () => {
    categoriesCollection.delete(categoryId);
    // 就这么简单!错误会自动显示为 Toast
  };

  return <ConfirmDialog onConfirm={handleDelete} />;
}
```

## 对比

| 方案 | 优点 | 缺点 |
|-----|------|------|
| **当前方案** | 完全控制 | 每个组件都要写重复代码 |
| **方案 A (Handler)** | 集中处理,可自定义 | 需要修改每个 collection |
| **方案 B (React Query)** | 最简单,零样板代码 | 较难自定义特定错误消息 |
| **方案 C (Wrapper)** | 灵活,可复用 | 需要包装所有 collection |

## 结论

对于你的项目,我推荐 **方案 B (React Query 全局错误处理)**:

1. **最简单** - 组件中完全不需要 try-catch
2. **自动处理** - 所有 mutation 错误都会自动捕获
3. **统一体验** - 所有错误都通过 Toast 显示
4. **易于维护** - 错误处理逻辑集中在一个地方

唯一的代价是:
- 外键错误的特定消息需要在全局处理器中根据操作类型推断
- 或者在 Collection handler 中转换错误消息(结合方案 A)

但这比在每个组件中重复代码要好得多!

## 实施建议

1. **短期**: 保持当前方案(已经很好了)
2. **中期**: 逐步迁移到方案 B,移除组件中的 try-catch
3. **长期**: 如需更细粒度控制,结合方案 A 在 handler 中定制错误

你觉得哪个方案更适合你的项目?
