export interface User {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
}

export interface Country {
  id: number
  name: string
}

export interface NewUser extends User {
  age: number
}

export interface UserDetail extends User {
  email: string
  age: number
  country: Country | null
  roles: Role[]
}
