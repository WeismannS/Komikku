type ob = { id: number; name: string; age: number }

// First, convert the object type to a union of single-property objects
type UnionizeProperties<T> = { 
  [K in keyof T]: { [P in K]: T[P] } 
}[keyof T]

// Type that represents all possible property combinations
type PowerSet<T> = T extends object
  ? T | (Partial<T> & { [K in keyof T]: K extends keyof T ? T[K] : never })
  : T

// Helper type to convert union to intersection
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  ((k: infer I) => void) ? I : never

// Combine properties from a union of objects
type UnionToObject<U> = { [K in keyof UnionToIntersection<U>]: UnionToIntersection<U>[K] }

// Combine multiple single-property types into one object
type Combine<T> = UnionToObject<T>

// Now we can create all possible combinations
type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]
type AtLeastTwo<T> = { 
  [K in keyof T]: { 
    [L in keyof Omit<T, K>]: Pick<T, K | L> 
  }[keyof Omit<T, K>] 
}[keyof T]

export type AllCombinations<T> = 
  T | 
  UnionizeProperties<T> | 
  AtLeastTwo<T>




