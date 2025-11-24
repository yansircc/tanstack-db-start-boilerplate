import { Link } from "@tanstack/react-router";
import { RoleSwitcher } from "./RoleSwitcher";
import { useEffect, useState } from "react";

export default function Header() {
	// 只在客户端渲染 RoleSwitcher
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<header className="border-b-2 border-foreground bg-background">
			<div className="max-w-[1280px] mx-auto px-6 py-5">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-primary border-2 border-foreground rounded-full"></div>
						<h1 className="text-2xl font-bold font-mono uppercase tracking-widest text-foreground">
							TanStack DB
						</h1>
					</div>
					{isClient && <RoleSwitcher />}
				</div>
				<nav className="flex gap-1 overflow-x-auto pb-1">
					<NavLink to="/dashboard">Dashboard</NavLink>
					<NavLink to="/articles">Articles</NavLink>
					<NavLink to="/users">Users</NavLink>
					<NavLink to="/categories">Categories</NavLink>
					<NavLink to="/tags">Tags</NavLink>
					<NavLink to="/comments">Comments</NavLink>
				</nav>
			</div>
		</header>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			className="px-4 py-2 rounded-sm font-mono text-sm font-bold uppercase transition-all duration-200 border-2 border-transparent hover:border-foreground hover:bg-muted"
			activeProps={{
				className:
					"bg-secondary border-foreground text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]",
			}}
		>
			{children}
		</Link>
	);
}
