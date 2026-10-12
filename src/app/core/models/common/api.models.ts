export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface ApiDataResponse<TData> extends ApiResponse {
    data: TData;
}