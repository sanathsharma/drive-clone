"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import * as actions from "@/actions/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user-avatar";

const LogoutItem = () => {
	const { locale } = useParams<{ locale: string }>();
	// FIXME: add stansaction spinner or line loader at the top of the viewport
	const [_isPending, startTransition] = useTransition();

	const onClick = () => {
		startTransition(async () => {
			await actions.signOut(locale);
		});
	};

	return <DropdownMenuItem onClick={onClick}>Logout</DropdownMenuItem>;
};

export default function UserDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="focus-visible:c_outline rounded-full"
				render={
					<button type="button">
						<UserAvatar />
					</button>
				}
			/>
			<DropdownMenuContent sideOffset={5}>
				<DropdownMenuGroup>
					<LogoutItem />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
