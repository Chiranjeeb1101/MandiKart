"use strict";
/**
 * MandiKart — High-Performance Memory-Bounded LRU Cache with TTL
 * Sentinel-node doubly-linked list + Hash Map for rock-solid O(1) ops.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastLRUCache = void 0;
class FastLRUCache {
    maxCapacity;
    map = new Map();
    head;
    tail;
    constructor(maxCapacity = 2000) {
        this.maxCapacity = Math.max(1, maxCapacity);
        // Sentinel dummy nodes to eliminate pointer edge cases
        this.head = { key: '', value: null, expiresAt: 0, prev: null, next: null };
        this.tail = { key: '', value: null, expiresAt: 0, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    get(key) {
        const node = this.map.get(key);
        if (!node)
            return null;
        if (Date.now() > node.expiresAt) {
            this.removeNode(node);
            this.map.delete(key);
            return null;
        }
        this.moveToHead(node);
        return node.value;
    }
    set(key, value, ttlSeconds = 60) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        const existing = this.map.get(key);
        if (existing) {
            existing.value = value;
            existing.expiresAt = expiresAt;
            this.moveToHead(existing);
            return;
        }
        // Evict least recently used if at capacity
        if (this.map.size >= this.maxCapacity) {
            const lruNode = this.tail.prev;
            if (lruNode && lruNode !== this.head) {
                this.removeNode(lruNode);
                this.map.delete(lruNode.key);
            }
        }
        const newNode = {
            key,
            value,
            expiresAt,
            prev: null,
            next: null,
        };
        this.addNodeAfterHead(newNode);
        this.map.set(key, newNode);
    }
    delete(key) {
        const node = this.map.get(key);
        if (!node)
            return false;
        this.removeNode(node);
        return this.map.delete(key);
    }
    clear() {
        this.map.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    get size() {
        return this.map.size;
    }
    addNodeAfterHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        if (this.head.next) {
            this.head.next.prev = node;
        }
        this.head.next = node;
    }
    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
    }
    moveToHead(node) {
        this.removeNode(node);
        this.addNodeAfterHead(node);
    }
}
exports.FastLRUCache = FastLRUCache;
