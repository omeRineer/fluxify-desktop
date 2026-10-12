import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface HttpOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | string[] };
}

export interface QueryOptions{
    page: number;
    size: number;
    search?: string;
}