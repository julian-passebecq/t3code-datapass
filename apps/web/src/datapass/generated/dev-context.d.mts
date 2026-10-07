export declare const DEV_CONTEXT_VERSION: "galaxy.dev-context/1";
export interface DevContext {
    version: typeof DEV_CONTEXT_VERSION;
    project?: string;
    repository?: {
        path?: string;
        remote?: string;
    };
    worktreePath?: string;
    branch?: string;
    revision?: string;
    file?: {
        path: string;
        line?: number;
        column?: number;
    };
    review?: {
        provider: 'github' | 'gitlab' | 'azure';
        id: string;
    };
    thread?: {
        provider: string;
        id: string;
    };
}
export declare function contextForLens(value: unknown): {
    format: "datapass.lens.context";
    version: 1;
    repository: {
        path?: string;
        remote?: string;
    };
    worktree: {
        path: string;
    };
    branch: string;
    revision: string;
    file: string;
    line: number;
    request: {
        provider: "github" | "gitlab" | "azure-devops";
        number: number;
    };
};
/** A bounded navigation pointer, never a database or a claim of ownership. */
export declare function parseDevContext(value: unknown): DevContext;
