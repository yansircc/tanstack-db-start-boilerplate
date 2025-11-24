import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RoleSwitcher } from "./role-switcher";

export default function Header() {
	// 只在客户端渲染 RoleSwitcher
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<header className="border-foreground border-b-2 bg-background">
			<div className="mx-auto max-w-[1280px] px-6 py-5">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full border-2 border-foreground bg-primary" />
						<h1 className="font-bold font-mono text-2xl text-foreground uppercase tracking-widest">
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
			activeProps={{
				className:
					"bg-secondary border-foreground text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]",
			}}
			className="rounded-sm border-2 border-transparent px-4 py-2 font-bold font-mono text-sm uppercase transition-all duration-200 hover:border-foreground hover:bg-muted"
			to={to}
		>
			{children}
		</Link>
	);
}
