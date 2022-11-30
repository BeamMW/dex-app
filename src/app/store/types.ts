export interface IDexStore {

}

export interface IDexStoreFactoryWrapper {
    new(...args): IDexStore;
}


export interface IDexStoreAsyncReactionsInit {
    initAsyncReactions?(): void
}

export interface IDexStoreShaderAsyncInit extends IDexStoreAsyncReactionsInit{
    initShaderAsync(): Promise<void>
}