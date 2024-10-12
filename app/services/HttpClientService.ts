// app/services/HttpClientService.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

export default class HttpClientService {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = this.initAxiosInstance() // Initialize in constructor
    }

    // Method to initialize the Axios instance inside the class
    public initAxiosInstance(config?: AxiosRequestConfig): AxiosInstance {
        const instance = axios.create({
            timeout: 10000, // Timeout in milliseconds
            headers: {
                'Content-Type': 'application/json',
            },
            ...config, // Merges in any provided config
        })

        // Optional: Add interceptors
        instance.interceptors.request.use(
            (request) => {
                console.log('Starting request', request)
                return request
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        instance.interceptors.response.use(
            (response) => {
                console.log('Response:', response)
                return response
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        return instance
    }

    // Generic GET method
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.get(
                url,
                config,
            )
            return response.data
        } catch (error) {
            this.handleError(error)
            throw error // Re-throw to allow calling code to handle it as well
        }
    }

    // Generic POST method
    public async post<T>(
        url: string,
        data: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(
                url,
                data,
                config,
            )
            return response.data
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    // Generic PUT method
    public async put<T>(
        url: string,
        data: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(
                url,
                data,
                config,
            )
            return response.data
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    // Generic DELETE method
    public async delete<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.delete(
                url,
                config,
            )
            return response.data
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    // Error handler
    private handleError(error: unknown): void {
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            console.error(`Axios error: ${error.message}`, error.response?.data)
        } else {
            // Handle other unexpected errors
            console.error('Unexpected error', error)
        }
    }
}
