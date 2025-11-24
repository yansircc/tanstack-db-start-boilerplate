import { useId, useState } from "react";
import { usersCollection } from "../../../db/collections/users.collection";
import type { InsertUser } from "../../../db/schemas-zod";

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

	const [formData, setFormData] = useState<Partial<InsertUser>>({
		username: "",
		email: "",
		displayName: "",
		bio: "",
		avatar: "",
	});
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	// CREATE: Insert a new user
	const handleCreateUser = () => {
		if (!formData.username || !formData.email || !formData.displayName) {
			alert("Username, email, and display name are required!");
			return;
		}

		// Use a temporary ID (negative number) - will be replaced when server responds
		const tempId = -Math.floor(Math.random() * 1000000);

		// Insert with optimistic updates (default behavior)
		usersCollection.insert({
			id: tempId,
			username: formData.username,
			email: formData.email,
			displayName: formData.displayName,
			bio: formData.bio || null,
			avatar: formData.avatar || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Reset form
		setFormData({
			username: "",
			email: "",
			displayName: "",
			bio: "",
			avatar: "",
		});

		alert("User created! (optimistically)");
	};

	// UPDATE: Modify an existing user
	const handleUpdateUser = () => {
		if (!selectedUserId) {
			alert("Please select a user first!");
			return;
		}

		// Update with optimistic updates
		usersCollection.update(selectedUserId, (draft) => {
			if (formData.displayName) draft.displayName = formData.displayName;
			if (formData.bio !== "") draft.bio = formData.bio || null;
			if (formData.avatar !== "") draft.avatar = formData.avatar || null;
		});

		alert(`User ${selectedUserId} updated! (optimistically)`);
	};

	// DELETE: Remove a user
	const handleDeleteUser = () => {
		if (!selectedUserId) {
			alert("Please select a user first!");
			return;
		}

		if (confirm(`Are you sure you want to delete user ${selectedUserId}?`)) {
			usersCollection.delete(selectedUserId);
			setSelectedUserId(null);
			alert("User deleted! (optimistically)");
		}
	};

	// Example: Non-optimistic insert
	const handleCreateUserNonOptimistic = async () => {
		if (!formData.username || !formData.email || !formData.displayName) {
			alert("Username, email, and display name are required!");
			return;
		}

		// Use a temporary ID (negative number) - will be replaced when server responds
		const tempId = -Math.floor(Math.random() * 1000000);

		// Insert without optimistic updates
		const tx = usersCollection.insert(
			{
				id: tempId,
				username: formData.username,
				email: formData.email,
				displayName: formData.displayName,
				bio: formData.bio || null,
				avatar: formData.avatar || null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{ optimistic: false },
		);

		try {
			// Wait for server confirmation
			await tx.isPersisted.promise;
			alert("User created on server!");

			// Reset form
			setFormData({
				username: "",
				email: "",
				displayName: "",
				bio: "",
				avatar: "",
			});
		} catch (error) {
			alert(`Failed to create user: ${error}`);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">User Mutations Example</h2>

			{/* Form inputs */}
			<div className="space-y-4 mb-6">
				<div>
					<label
						htmlFor={usernameId}
						className="block text-sm font-medium mb-1"
					>
						Username (required)
					</label>
					<input
						id={usernameId}
						type="text"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="john_doe"
					/>
				</div>

				<div>
					<label htmlFor={emailId} className="block text-sm font-medium mb-1">
						Email (required)
					</label>
					<input
						id={emailId}
						type="email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="john@example.com"
					/>
				</div>

				<div>
					<label
						htmlFor={displayNameId}
						className="block text-sm font-medium mb-1"
					>
						Display Name (required)
					</label>
					<input
						id={displayNameId}
						type="text"
						value={formData.displayName}
						onChange={(e) =>
							setFormData({ ...formData, displayName: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="John Doe"
					/>
				</div>

				<div>
					<label htmlFor={bioId} className="block text-sm font-medium mb-1">
						Bio (optional)
					</label>
					<textarea
						id={bioId}
						value={formData.bio || ""}
						onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="A short bio..."
						rows={3}
					/>
				</div>

				<div>
					<label htmlFor={avatarId} className="block text-sm font-medium mb-1">
						Avatar URL (optional)
					</label>
					<input
						id={avatarId}
						type="url"
						value={formData.avatar || ""}
						onChange={(e) =>
							setFormData({ ...formData, avatar: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="https://example.com/avatar.jpg"
					/>
				</div>

				<div>
					<label
						htmlFor={userIdFieldId}
						className="block text-sm font-medium mb-1"
					>
						Selected User ID (for update/delete)
					</label>
					<input
						id={userIdFieldId}
						type="number"
						value={selectedUserId || ""}
						onChange={(e) =>
							setSelectedUserId(e.target.value ? Number(e.target.value) : null)
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="1"
					/>
				</div>
			</div>

			{/* Action buttons */}
			<div className="grid grid-cols-2 gap-4">
				<button
					type="button"
					onClick={handleCreateUser}
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
				>
					Create User (Optimistic)
				</button>

				<button
					type="button"
					onClick={handleCreateUserNonOptimistic}
					className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
				>
					Create User (Wait for Server)
				</button>

				<button
					type="button"
					onClick={handleUpdateUser}
					className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
					disabled={!selectedUserId}
				>
					Update User
				</button>

				<button
					type="button"
					onClick={handleDeleteUser}
					className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					disabled={!selectedUserId}
				>
					Delete User
				</button>
			</div>

			{/* Documentation */}
			<div className="mt-8 p-4 bg-gray-50 rounded-md">
				<h3 className="font-semibold mb-2">How it works:</h3>
				<ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
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
