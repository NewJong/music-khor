import { API_BASE } from "@/lib/config";

export const fetchData = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  try {
    const url = `${API_BASE}/${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
