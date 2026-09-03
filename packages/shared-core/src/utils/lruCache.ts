/**
 * MandiKart — High-Performance Memory-Bounded LRU Cache with TTL
 * Sentinel-node doubly-linked list + Hash Map for rock-solid O(1) ops.
 */

interface CacheNode<V> {
  key: string;
  value: V;
  expiresAt: number;
  prev: CacheNode<V> | null;
  next: CacheNode<V> | null;
}

export class FastLRUCache<V> {
  private readonly maxCapacity: number;
  private readonly map = new Map<string, CacheNode<V>>();
  private readonly head: CacheNode<V>;
  private readonly tail: CacheNode<V>;

  constructor(maxCapacity: number = 2000) {
    this.maxCapacity = Math.max(1, maxCapacity);

    // Sentinel dummy nodes to eliminate pointer edge cases
    this.head = { key: '', value: null as any, expiresAt: 0, prev: null, next: null };
    this.tail = { key: '', value: null as any, expiresAt: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: string): V | null {
    const node = this.map.get(key);
    if (!node) return null;

    if (Date.now() > node.expiresAt) {
      this.removeNode(node);
      this.map.delete(key);
      return null;
    }

    this.moveToHead(node);
    return node.value;
  }

  set(key: string, value: V, ttlSeconds: number = 60): void {
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

    const newNode: CacheNode<V> = {
      key,
      value,
      expiresAt,
      prev: null,
      next: null,
    };

    this.addNodeAfterHead(newNode);
    this.map.set(key, newNode);
  }

  delete(key: string): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.removeNode(node);
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size(): number {
    return this.map.size;
  }

  private addNodeAfterHead(node: CacheNode<V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  private removeNode(node: CacheNode<V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  private moveToHead(node: CacheNode<V>): void {
    this.removeNode(node);
    this.addNodeAfterHead(node);
  }
}
