export interface LoginResponse {
  msg: string
  token: string
}

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

export interface UserDetail extends User {
  email: string
  age: number
  country: Country | null
  roles: Role[]
}

export interface UserPayload {
  name: string
  age: number
  email: string
  password: string
  country_id: number
}

export interface CreatedResponse {
  id: number
}

export interface MessageResponse {
  msg: string
}

export interface NewUser extends User {
  age: number
}
