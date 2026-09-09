import { type SubmitEvent, startTransition, useCallback, useEffect, useRef } from "react";

export function handleSubmit(action: (formData: FormData) => void) {
	return (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			action(formData);
		});
	};
}

/**
 * Wraps a React `useActionState` action so the bound form is reset after the
 * action resolves.
 *
 * @example
 * ```tsx
 * const [formRef, _action] = useActionWithReset(actions.resetPassword.bind(null, locale));
 * const [state, action, isPending] = useActionState(_action, { errors: {} });
 * ```
 */
export function useActionWithReset<FormState>(
	action: (formState: FormState, formData: FormData) => FormState | Promise<FormState>,
) {
	const formRef = useRef<HTMLFormElement>(null);
	const actionRef = useRef(action);

	useEffect(() => {
		actionRef.current = action;
	}, [action]);

	const handleAction = useCallback(async (formState: FormState, formData: FormData) => {
		const newState = await actionRef.current(formState, formData);
		formRef.current?.reset();
		return newState;
	}, []);

	return [formRef, handleAction] as const;
}
