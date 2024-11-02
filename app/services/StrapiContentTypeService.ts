// app/services/StrapiService.ts
import type { AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import HttpClientService from './HttpClientService'

class StrapiContentTypeService {
    private static httpClient: HttpClientService | null = null
    private static apiBase = `http://localhost:1337/api` // Set your Strapi API base URL here

    // Initialize the HttpClientService instance if it hasn't been already
    private static initializeHttpClient() {
        if (!StrapiContentTypeService.httpClient) {
            const axiosInstance = Axios.create({ baseURL: this.apiBase })
            StrapiContentTypeService.httpClient =
                HttpClientService.initInstance(axiosInstance)
        }
    }

    // Ensure HttpClientService is initialized
    private static getHttpClient(): HttpClientService {
        if (!StrapiContentTypeService.httpClient) {
            this.initializeHttpClient()
        }
        return StrapiContentTypeService.httpClient!
    }

    // Helper method to format config with query params
    private static getRequestConfig(
        query?: Record<string, any>,
    ): AxiosRequestConfig {
        return query ? { params: query } : {}
    }

    // Get all items from a specific content type
    public static async getAll<T>(
        contentType: string,
        query?: Record<string, any>,
    ): Promise<T[]> {
        const httpClient = this.getHttpClient()
        const config = this.getRequestConfig(query)
        return httpClient
            .get<{ data: T[] }>(`/${contentType}`, config)
            .then((response) => response.data)
            .catch((error) => {
                console.error(
                    `Error fetching all items from ${contentType}:`,
                    error,
                )
                throw error
            })
    }

    // Get a single item by ID from a specific content type
    public static async getById<T>(
        contentType: string,
        id: string | number,
        query?: Record<string, any>,
    ): Promise<T> {
        const httpClient = this.getHttpClient()
        const config = this.getRequestConfig(query)
        return httpClient
            .get<{ data: T }>(`/${contentType}/${id}`, config)
            .then((response) => response.data)
            .catch((error) => {
                console.error(
                    `Error fetching item ${id} from ${contentType}:`,
                    error,
                )
                throw error
            })
    }

    // Create a new item in a specific content type
    public static async create<T>(
        contentType: string,
        data: T,
        query?: Record<string, any>,
    ): Promise<T> {
        const httpClient = this.getHttpClient()
        const config = this.getRequestConfig(query)
        return httpClient
            .post<{ data: T }>(`/${contentType}`, { data }, config)
            .then((response) => response.data)
            .catch((error) => {
                console.error(`Error creating item in ${contentType}:`, error)
                throw error
            })
    }

    // Update an item by ID in a specific content type
    public static async update<T>(
        contentType: string,
        id: string | number,
        data: Partial<T>,
        query?: Record<string, any>,
    ): Promise<T> {
        const httpClient = this.getHttpClient()
        const config = this.getRequestConfig(query)
        return httpClient
            .put<{ data: T }>(`/${contentType}/${id}`, { data }, config)
            .then((response) => response.data)
            .catch((error) => {
                console.error(
                    `Error updating item ${id} in ${contentType}:`,
                    error,
                )
                throw error
            })
    }

    // Delete an item by ID from a specific content type
    public static async delete(
        contentType: string,
        id: string | number,
        query?: Record<string, any>,
    ): Promise<void> {
        const httpClient = this.getHttpClient()
        const config = this.getRequestConfig(query)
        return httpClient
            .delete(`/${contentType}/${id}`, config)
            .then(() => undefined)
            .catch((error) => {
                console.error(
                    `Error deleting item ${id} from ${contentType}:`,
                    error,
                )
                throw error
            })
    }
}

export default StrapiContentTypeService
