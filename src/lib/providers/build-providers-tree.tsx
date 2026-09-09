/**
 * Inspired by https://alexkorep.com/react/react-many-context-providers-tree/
 *
 * A utility function to build a tree of React context providers.
 * This allows for a clean way to compose multiple providers without excessive nesting.
 */

import type { ComponentType, PropsWithChildren, ReactNode } from "react";

// biome-ignore lint/suspicious/noExplicitAny: Provider components can accept any props
type ProviderComponent = ComponentType<PropsWithChildren<any>>;
type ProviderWithProps = [Provider: ProviderComponent, props?: Record<string, unknown>];
type WrappedComponent = ComponentType<PropsWithChildren<unknown>>;

const initialComponent = ({ children }: PropsWithChildren<unknown>): ReactNode => children;

/**
 * Builds a tree of React context providers from an array of providers and their props.
 *
 * @param {ProviderWithProps[]} componentsWithProps - An array of provider components with their props.
 *   Each item in the array is a tuple where:
 *   - The first element is the Provider component (e.g., ThemeProvider, AuthProvider)
 *   - The second element (optional) is an object containing the props for that provider
 *
 * @returns {WrappedComponent} A single component that wraps all providers in the correct order.
 *
 * @example
 * // Basic usage with multiple providers without props
 * const Providers = buildProvidersTree([
 *   [ThemeProvider],
 *   [AuthProvider],
 *   [StoreProvider]
 * ]);
 *
 * // Usage with providers that require props
 * const Providers = buildProvidersTree([
 *   [ThemeProvider, { theme: 'dark' }],
 *   [AuthProvider, { initialLoggedIn: false }],
 *   [StoreProvider, { initialState: { count: 0 } }]
 * ]);
 *
 * // The resulting component tree will be structured as:
 * // <ThemeProvider theme="dark">
 * //   <AuthProvider initialLoggedIn={false}>
 * //     <StoreProvider initialState={{ count: 0 }}>
 * //       {children}
 * //     </StoreProvider>
 * //   </AuthProvider>
 * // </ThemeProvider>
 *
 * // Using the resulting component
 * function App() {
 *   return (
 *     <Providers>
 *       <YourApplication />
 *     </Providers>
 *   );
 * }
 */
export function buildProvidersTree(componentsWithProps: ProviderWithProps[]): WrappedComponent {
	// Start with the initial component
	let result: WrappedComponent = initialComponent;

	// Iterate through the providers in reverse to build the tree from the inside out
	for (let i = 0; i < componentsWithProps.length; i++) {
		const [Provider, props = {}] = componentsWithProps[i];

		// Capture the current result to use in the closure
		const CurrentResult = result;

		const name = Provider.displayName || Provider.name || `Provider${i}`;
		CurrentResult.displayName = `ProviderTree(${name})`;

		// Create a new component that wraps the current result with the provider
		result = ({ children }: PropsWithChildren<unknown>): ReactNode => (
			<CurrentResult key={name}>
				<Provider {...props}>{children}</Provider>
			</CurrentResult>
		);
	}

	return result;
}
