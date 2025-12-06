const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type FetchOptions = RequestInit & {
	headers?: Record<string, string>;
};

export async function apiFetch<T>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> {
	const { headers, ...rest } = options;

	const res = await fetch(`${API_URL}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		credentials: "include", // Important for cookies
		...rest,
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Something went wrong");
	}

	return data as T;
}
