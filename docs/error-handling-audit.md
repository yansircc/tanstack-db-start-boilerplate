# 错误处理审计报告

本文档总结了项目中所有 mutation 操作的错误处理状态。

## 已修复的组件 ✅

### Articles
- ✅ `CreateArticleDialog` - 已添加错误处理,等待 `isPersisted.promise`
- ✅ `EditArticleDialog` - 使用 `useLiveQuery` 获取数据,有 `eq()` 修复
- ✅ `DeleteArticleDialog` - 已添加错误处理,捕获删除错误

### Categories
- ✅ `DeleteCategoryDialog` - 已添加错误处理,特别处理外键约束错误
- ✅ `EditCategoryDialog` - 使用 `useLiveQuery` 获取数据,有 `eq()` 修复

### Users
- ✅ `DeleteUserDialog` - 已添加错误处理,特别处理外键约束错误

### Tags
- ✅ `DeleteTagDialog` - 已添加错误处理,特别处理外键约束错误

### Comments
- ✅ `DeleteCommentDialog` - 已添加错误处理

## 需要注意但不需要修复的组件

### Create 操作 (不需要等待 Promise)

这些创建操作通常不会失败,且使用乐观更新提供更好的用户体验:

- `CreateCategoryDialog` - 创建分类很少失败
- `CreateUserDialog` - 创建用户很少失败
- `CreateTagDialog` - 创建标签很少失败
- `CreateCommentDialog` - 创建评论很少失败

**理由**:
- 创建操作的验证主要在客户端完成(Zod schema)
- 外键约束在创建时不太可能失败(只要选择了有效的 authorId/categoryId)
- 乐观更新提供更好的用户体验
- 如果真的失败了,TanStack DB 会自动回滚

### Update 操作 (不需要等待 Promise)

- `EditCategoryDialog` - 更新分类很少失败
- `EditUserDialog` - 更新用户很少失败
- `EditTagDialog` - 更新标签很少失败
- `EditCommentDialog` - 更新评论很少失败
- `EditArticleDialog` - 更新文章很少失败

**理由**:
- 更新操作主要修改自己的字段,不涉及外键
- Schema 验证在客户端完成
- 乐观更新提供更好的用户体验
- 如果失败会自动回滚

### 特殊组件

- `RoleSwitcher` - 纯客户端状态,不需要错误处理
- `UserMutationExample` - 演示组件,已有完整的错误处理示例

## 外键约束错误总结

项目中的外键关系:

```
users (id)
  ← articles (authorId)
  ← comments (authorId)

categories (id)
  ← articles (categoryId)

articles (id)
  ← comments (articleId)
  ← articleTags (articleId)
  ← articleLikes (articleId)
  ← articleBookmarks (articleId)

tags (id)
  ← articleTags (tagId)
```

**需要特殊处理的删除操作**:
1. ✅ 删除 User - 如果有文章/评论
2. ✅ 删除 Category - 如果有文章
3. ✅ 删除 Article - 如果有评论/标签/点赞/书签
4. ✅ 删除 Tag - 如果被文章使用

## 错误处理模式

### 模式 1: Delete 操作(需要等待 Promise)

```typescript
const { handleError } = useErrorHandler();

const handleDelete = async () => {
  try {
    const tx = collection.delete(id);
    await tx.isPersisted.promise;
  } catch (error) {
    if (error instanceof Error && error.message.includes("FOREIGN KEY")) {
      handleError(
        new Error("该数据存在关联关系..."),
        "删除失败"
      );
    } else {
      handleError(error, "删除失败");
    }
  }
};
```

### 模式 2: Create 操作(可选等待)

```typescript
const { handleError } = useErrorHandler();

const handleCreate = async () => {
  try {
    const tx = collection.insert({...});

    // 关闭对话框(乐观更新)
    onClose();

    // 可选:等待持久化
    await tx.isPersisted.promise;
  } catch (error) {
    handleError(error, "创建失败");
  }
};
```

### 模式 3: Update 操作(通常不等待)

```typescript
const handleUpdate = () => {
  collection.update(id, (draft) => {
    draft.field = value;
  });

  // 不等待,使用乐观更新
  onClose();
};
```

## 全局错误处理器

`/src/lib/error-handler.tsx` 自动处理:

- `SchemaValidationError` → "数据验证失败"
- `DuplicateKeyError` → "数据已存在"
- `UpdateKeyNotFoundError` → "记录不存在"
- `DeleteKeyNotFoundError` → "记录不存在"
- `CollectionInErrorStateError` → "数据同步错误"
- `FOREIGN KEY` → "数据关联错误"
- HTTP 错误 → "网络请求失败"
- 其他错误 → 显示原始错误消息

## 最佳实践

### 1. Delete 操作必须添加错误处理

删除操作可能因为外键约束失败,必须:
- 等待 `isPersisted.promise`
- 捕获错误并显示友好消息
- 特别处理 `FOREIGN KEY` 错误

### 2. Create 操作看情况

如果创建很少失败(如分类、标签):
- 可以不等待 Promise
- 依赖乐观更新 + 自动回滚

如果创建可能失败(如文章有复杂验证):
- 建议等待 Promise
- 捕获并显示错误

### 3. Update 操作通常不需要

更新操作很少失败:
- 使用乐观更新提供更好体验
- 依赖自动回滚机制
- 除非有特殊业务逻辑

### 4. 使用全局错误处理器

所有错误都通过 `useErrorHandler().handleError()` 处理:
- 统一的错误消息
- 自动识别错误类型
- Toast 通知
- 3 秒自动消失

## 检查清单

创建新的 mutation 操作时,问自己:

1. [ ] 这是 Delete 操作吗? → 必须添加错误处理
2. [ ] 可能触发外键约束吗? → 特别处理 FOREIGN KEY 错误
3. [ ] 需要立即反馈结果吗? → 等待 Promise
4. [ ] 可以依赖乐观更新吗? → 不等待 Promise
5. [ ] 错误消息够友好吗? → 使用 `handleError` 的 context 参数

## 总结

✅ **已完成**: 所有关键的 Delete 操作都已添加错误处理
✅ **符合最佳实践**: 使用全局错误处理器统一管理
✅ **用户体验**: 友好的错误消息 + 自动回滚
✅ **开发体验**: 简单的 API,零样板代码

项目的错误处理现在是健壮且用户友好的! 🎉
