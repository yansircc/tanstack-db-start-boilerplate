# 共享 CRUD 组件

这个目录包含可复用的 CRUD 组件，用于简化使用 TanStack DB Mutations 的应用开发。

## 组件概览

### 1. MutationDialog

通用的对话框组件，用于处理 Create 和 Edit 等需要表单的场景。

**特点：**
- ✅ 自动处理打开/关闭状态
- ✅ 灵活的内容渲染（通过 render props）
- ✅ 支持自定义触发器

**使用示例：**

```tsx
import { MutationDialog } from "@/components/shared";
import { usersCollection } from "@/db/collections/users.collection";

// 创建场景
<MutationDialog
  title="创建用户"
  description="填写表单创建新用户"
  trigger={<Button>创建用户</Button>}
>
  {({ onClose }) => (
    <UserForm
      onSubmit={(values) => {
        usersCollection.insert({
          id: -Math.random(),
          ...values,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onClose();
      }}
      onCancel={onClose}
    />
  )}
</MutationDialog>

// 编辑场景
<MutationDialog
  title="编辑文章"
  description="修改文章信息"
  trigger={<Button>编辑</Button>}
>
  {({ onClose }) => (
    <ArticleForm
      article={article}
      onSubmit={(values) => {
        articlesCollection.update(article.id, (draft) => {
          Object.assign(draft, values);
        });
        onClose();
      }}
      onCancel={onClose}
    />
  )}
</MutationDialog>
```

---

### 2. ConfirmDialog

通用的确认对话框组件，用于 Delete 等需要二次确认的操作。

**特点：**
- ✅ 自动处理加载状态
- ✅ 支持异步操作
- ✅ 可自定义按钮文案和样式

**使用示例：**

```tsx
import { ConfirmDialog } from "@/components/shared";
import { usersCollection } from "@/db/collections/users.collection";

<ConfirmDialog
  trigger={<Button variant="destructive">删除</Button>}
  title="删除用户"
  description={
    <>
      确定要删除用户 <strong>{user.displayName}</strong> 吗？此操作无法撤销。
    </>
  }
  confirmLabel="确认删除"
  cancelLabel="取消"
  variant="destructive"
  onConfirm={() => {
    // TanStack DB 自动处理乐观更新和回滚
    usersCollection.delete(user.id);
  }}
/>
```

---

### 3. FormField

通用的表单字段组件，封装 Label + Input/Textarea + Error 的重复结构。

**特点：**
- ✅ 自动处理错误显示
- ✅ 支持必填标记
- ✅ 支持 Input 和 Textarea

**使用示例：**

```tsx
import { useForm } from "@tanstack/react-form";
import { FormField, validators } from "@/components/shared";

function ArticleForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      slug: "",
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* 文本输入 */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.length < 1) return "标题为必填项";
            if (value.length > 200) return "标题不能超过 200 个字符";
            return undefined;
          },
        }}
      >
        {(field) => (
          <FormField
            field={field}
            label="标题"
            required
            placeholder="输入文章标题"
            inputType="input"
          />
        )}
      </form.Field>

      {/* 多行文本 */}
      <form.Field name="content">
        {(field) => (
          <FormField
            field={field}
            label="内容"
            placeholder="输入文章内容"
            inputType="textarea"
            rows={10}
          />
        )}
      </form.Field>

      {/* URL 输入 */}
      <form.Field
        name="slug"
        validators={{
          onChange: ({ value }) => {
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
              return "只能包含小写字母、数字和连字符";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <FormField
            field={field}
            label="Slug"
            type="text"
            placeholder="article-slug"
            inputType="input"
          />
        )}
      </form.Field>

      <Button type="submit">提交</Button>
    </form>
  );
}
```

---

### 4. Validators（验证器辅助函数）

提供常用的表单验证逻辑。

**可用验证器：**
- `validators.required(message?)` - 必填验证
- `validators.minLength(min, message?)` - 最小长度
- `validators.maxLength(max, message?)` - 最大长度
- `validators.email(message?)` - 邮箱格式
- `validators.url(message?)` - URL 格式
- `validators.slug(message?)` - Slug 格式（小写字母、数字、连字符）

**使用示例：**

```tsx
import { validators } from "@/components/shared";

<form.Field
  name="email"
  validators={validators.email()}
>
  {(field) => (
    <FormField
      field={field}
      label="邮箱"
      required
      type="email"
      inputType="input"
    />
  )}
</form.Field>
```

---

## TanStack DB Mutations 最佳实践

### 1. Insert（创建）

```tsx
const tempId = -Math.floor(Math.random() * 1000000);

usersCollection.insert({
  id: tempId,  // 使用临时 ID
  ...values,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 2. Update（更新）

```tsx
articlesCollection.update(article.id, (draft) => {
  // 使用 Immer 语法直接修改 draft
  draft.title = newTitle;
  draft.content = newContent;
});
```

### 3. Delete（删除）

```tsx
commentsCollection.delete(comment.id);
```

### 4. Collection 配置

在 `src/db/collections/*.collection.ts` 中配置：

```tsx
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";

export const articlesCollection = createCollection(
  queryCollectionOptions({
    schema: selectArticleSchema,
    queryKey: ["articles"],
    queryFn: async () => await getArticles(),
    queryClient,
    getKey: (item) => item.id,

    // 创建处理器
    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) =>
          createArticle({ data: mutation.modified })
        )
      );
    },

    // 更新处理器
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) => {
          const original = mutation.original as SelectArticle;
          return updateArticle({
            data: {
              id: original.id,
              changes: mutation.changes,
            },
          });
        })
      );
    },

    // 删除处理器
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) => {
          const original = mutation.original as SelectArticle;
          return deleteArticle({ data: { id: original.id } });
        })
      );
    },
  })
);
```

---

## 完整示例

查看 `src/routes/users/-components/` 中的实现：
- `CreateUserDialog.tsx` - 创建用户
- `EditUserDialog.tsx` - 编辑用户
- `DeleteUserDialog.tsx` - 删除用户
- `UserForm.tsx` - 用户表单

这些组件展示了如何组合使用公共组件来实现完整的 CRUD 功能。
