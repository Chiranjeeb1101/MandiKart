/**
 * MandiKart — High-Performance Memory-Bounded LRU Cache with TTL
 * Sentinel-node doubly-linked list + Hash Map for rock-solid O(1) ops.
 */
export declare class FastLRUCache<V> {
    private readonly maxCapacity;
    private readonly map;
    private readonly head;
    private readonly tail;
    constructor(maxCapacity?: number);
    get(key: string): V | null;
    set(key: string, value: V, ttlSeconds?: number): void;
    delete(key: string): boolean;
    clear(): void;
    get size(): number;
    private addNodeAfterHead;
    private removeNode;
    private moveToHead;
}
