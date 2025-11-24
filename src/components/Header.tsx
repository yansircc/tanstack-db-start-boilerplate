import { Link } from "@tanstack/react-router";
import { RoleSwitcher } from "./RoleSwitcher";

export default function Header() {
	return (
		<header className="border-b border-gray-200 bg-white shadow-sm">
			<div className="max-w-6xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-900">TanStack DB Test</h1>
					<RoleSwitcher />
				</div>
				<nav className="flex gap-4 text-sm">
					<Link
						to="/dashboard"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						Dashboard
					</Link>
					<Link
						to="/articles"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						文章
					</Link>
					<Link
						to="/users"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						用户
					</Link>
					<Link
						to="/categories"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						分类
					</Link>
					<Link
						to="/tags"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						标签
					</Link>
					<Link
						to="/comments"
						className="px-3 py-2 rounded hover:bg-gray-100 transition"
						activeProps={{
							className: "bg-blue-100 text-blue-700 font-semibold",
						}}
					>
						评论
					</Link>
				</nav>
			</div>
		</header>
	);
}
