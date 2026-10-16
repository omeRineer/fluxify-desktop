import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

export class FluxifyComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    private isLoading = signal<boolean>(false)
    private isLoadingText = signal<string>('')
    protected isLoadingText$ = this.isLoadingText.asReadonly();
    protected isLoading$ = this.isLoading.asReadonly();

    setLoading(enable: boolean, text: string = '') {
        if (this.isLoading() !== enable)
            this.isLoading.set(enable)

        this.isLoadingText.set(text)
    }

}