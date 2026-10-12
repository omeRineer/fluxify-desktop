export interface DataList<TData>{
    count:number;
    items:TData[];
}

export interface PageDataList<TData>{
    totalCount:number;
    data:TData[];
}