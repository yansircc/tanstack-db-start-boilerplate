import { useId, useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { usersCollection } from "@/db/collections/users.collection";
import type { InsertUser } from "@/db/schemas-zod";
import { useErrorHandler } from "@/lib/error-handler";

/**
 * Example component demonstrating TanStack DB mutation operations
 * for the users collection (Create, Update, Delete)
 */
export function UserMutationExample() {
	const usernameId = useId();
	const emailId = useId();
	const displayNameId = useId();
	const bioId = useId();
	const avatarId = useId();
	const userIdFieldId = useId();

	const { addError } = useErrorHandler();

	const [formData, setFormData] = useState<Partial<InsertUser>>({
		username: "",
		email: "",
		displayName: "",
		bio: "",
		avatar: "",
	});
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	const resetForm = () => {
		setFormData({
			username: "",
			email: "",
			displayName: "",
			bio: "",
			avatar: "",
		});
	};

	const validateRequiredFields = () => {
		if (!(formData.username && formData.email && formData.displayName)) {
			addError({
				id: crypto.randomUUID(),
				title: "验证失败",
				message: "用户名、邮箱和显示名称是必填项！",
				type: "warning",
				timestamp: new Date(),
			});
			return false;
		}
		return true;
	};

	const validateSelectedUser = () => {
		if (!selectedUserId) {
			addError({
				id: crypto.randomUUID(),
				title: "未选择用户",
				message: "请先选择一个用户！",
				type: "warning",
				timestamp: new Date(),
			});
			return false;
		}
		return true;
	};

	// CREATE: Insert a new user
	const handleCreateUser = () => {
		if (!validateRequiredFields()) {
			return;
		}

		// Use a temporary ID (negative number) - will be replaced when server responds
		const tempId = -Math.floor(Math.random() * 1_000_000);

		// Insert with optimistic updates (default behavior)
		usersCollection.insert({
			id: tempId,
			username: formData.username || "",
			email: formData.email || "",
			displayName: formData.displayName || "",
			bio: formData.bio || null,
			avatar: formData.avatar || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		resetForm();

		addError({
			id: crypto.randomUUID(),
			title: "用户已创建",
			message: "用户创建成功（乐观更新）！",
			type: "info",
			timestamp: new Date(),
		});
	};

	// UPDATE: Modify an existing user
	const handleUpdateUser = () => {
		if (!validateSelectedUser()) {
			return;
		}

		// Update with optimistic updates
		usersCollection.update(selectedUserId, (draft) => {
			if (formData.displayName) {
				draft.displayName = formData.displayName;
			}
			if (formData.bio !== "") {
				draft.bio = formData.bio || null;
			}
			if (formData.avatar !== "") {
				draft.avatar = formData.avatar || null;
			}
		});

		addError({
			id: crypto.randomUUID(),
			title: "用户已更新",
			message: `用户 ${selectedUserId} 更新成功（乐观更新）！`,
			type: "info",
			timestamp: new Date(),
		});
	};

	// DELETE: Remove a user
	const handleDeleteUser = () => {
		usersCollection.delete(selectedUserId as number);
		setSelectedUserId(null);

		addError({
			id: crypto.randomUUID(),
			title: "用户已删除",
			message: "用户删除成功（乐观更新）！",
			type: "info",
			timestamp: new Date(),
		});
	};

	// Example: Non-optimistic insert
	const handleCreateUserNonOptimistic = async () => {
		if (!validateRequiredFields()) {
			return;
		}

		// Use a temporary ID (negative number) - will be replaced when server responds
		const tempId = -Math.floor(Math.random() * 1_000_000);

		// Insert without optimistic updates
		const tx = usersCollection.insert(
			{
				id: tempId,
				username: formData.username || "",
				email: formData.email || "",
				displayName: formData.displayName || "",
				bio: formData.bio || null,
				avatar: formData.avatar || null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{ optimistic: false }
		);

		try {
			// Wait for server confirmation
			await tx.isPersisted.promise;

			addError({
				id: crypto.randomUUID(),
				title: "用户已创建",
				message: "用户在服务器上创建成功！",
				type: "info",
				timestamp: new Date(),
			});

			resetForm();
		} catch (error) {
			addError({
				id: crypto.randomUUID(),
				title: "创建失败",
				message: `创建用户失败: ${error}`,
				type: "error",
				timestamp: new Date(),
			});
		}
	};

	return (
		<div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
			<h2 className="mb-6 font-bold text-2xl">User Mutations Example</h2>

			{/* Form inputs */}
			<div className="mb-6 space-y-4">
				<div>
					<label
						className="mb-1 block font-medium text-sm"
						htmlFor={usernameId}
					>
						Username (required)
					</label>
					<input
						className="w-full rounded-md border px-3 py-2"
						id={usernameId}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						placeholder="john_doe"
						type="text"
						value={formData.username}
					/>
				</div>

				<div>
					<label className="mb-1 block font-medium text-sm" htmlFor={emailId}>
						Email (required)
					</label>
					<input
						className="w-full rounded-md border px-3 py-2"
						id={emailId}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						placeholder="john@example.com"
						type="email"
						value={formData.email}
					/>
				</div>

				<div>
					<label
						className="mb-1 block font-medium text-sm"
						htmlFor={displayNameId}
					>
						Display Name (required)
					</label>
					<input
						className="w-full rounded-md border px-3 py-2"
						id={displayNameId}
						onChange={(e) =>
							setFormData({ ...formData, displayName: e.target.value })
						}
						placeholder="John Doe"
						type="text"
						value={formData.displayName}
					/>
				</div>

				<div>
					<label className="mb-1 block font-medium text-sm" htmlFor={bioId}>
						Bio (optional)
					</label>
					<textarea
						className="w-full rounded-md border px-3 py-2"
						id={bioId}
						onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
						placeholder="A short bio..."
						rows={3}
						value={formData.bio || ""}
					/>
				</div>

				<div>
					<label className="mb-1 block font-medium text-sm" htmlFor={avatarId}>
						Avatar URL (optional)
					</label>
					<input
						className="w-full rounded-md border px-3 py-2"
						id={avatarId}
						onChange={(e) =>
							setFormData({ ...formData, avatar: e.target.value })
						}
						placeholder="https://example.com/avatar.jpg"
						type="url"
						value={formData.avatar || ""}
					/>
				</div>

				<div>
					<label
						className="mb-1 block font-medium text-sm"
						htmlFor={userIdFieldId}
					>
						Selected User ID (for update/delete)
					</label>
					<input
						className="w-full rounded-md border px-3 py-2"
						id={userIdFieldId}
						onChange={(e) =>
							setSelectedUserId(e.target.value ? Number(e.target.value) : null)
						}
						placeholder="1"
						type="number"
						value={selectedUserId || ""}
					/>
				</div>
			</div>

			{/* Action buttons */}
			<div className="grid grid-cols-2 gap-4">
				<button
					className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					onClick={handleCreateUser}
					type="button"
				>
					Create User (Optimistic)
				</button>

				<button
					className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
					onClick={handleCreateUserNonOptimistic}
					type="button"
				>
					Create User (Wait for Server)
				</button>

				<button
					className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
					disabled={!selectedUserId}
					onClick={handleUpdateUser}
					type="button"
				>
					Update User
				</button>

				<ConfirmDialog
					confirmLabel="确认删除"
					description={`确定要删除用户 ${selectedUserId} 吗？此操作无法撤销。`}
					onConfirm={handleDeleteUser}
					title="删除用户"
					trigger={
						<button
							className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!selectedUserId}
							type="button"
						>
							Delete User
						</button>
					}
					variant="destructive"
				/>
			</div>

			{/* Documentation */}
			<div className="mt-8 rounded-md bg-gray-50 p-4">
				<h3 className="mb-2 font-semibold">How it works:</h3>
				<ul className="list-inside list-disc space-y-1 text-gray-700 text-sm">
					<li>
						<strong>Optimistic mutations</strong>: UI updates immediately,
						changes persist in background
					</li>
					<li>
						<strong>Non-optimistic mutations</strong>: Wait for server
						confirmation before UI updates
					</li>
					<li>
						<strong>Auto-rollback</strong>: If server rejects the change,
						optimistic updates are automatically rolled back
					</li>
					<li>
						<strong>Auto-refetch</strong>: QueryCollection automatically
						refetches after mutations complete
					</li>
				</ul>
			</div>
		</div>
	);
}
