import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

export class FluxifyComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    protected isLoading = signal<boolean>(false)

}