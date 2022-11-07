export type ResponseTypeAPI<DATA = {}> = {
  messages: string[]
  resultCode: number
  data: DATA
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string | null
}

export type UserType = {
  name: string
  id: number
  uniqueUrlName: string
  photos: {
    small: string
    large: string
  },
  status: string
  followed: boolean
}

export type ProfileType = {
  aboutMe?: string
  userId?: number
  lookingForAJob?: boolean
  lookingForAJobDescription?: string
  fullName?: string
  contacts?: {
    github?: string
    vk?: string
    facebook?: string
    instagram?: string
    twitter?: string
    website?: string
    youtube?: string
    mainLink?: string
  }
  photos?: {
    small?: string
    large?: string
  }
}

export type UpdateProfileModelType = {
  aboutMe?: string
  contacts?: {
    facebook?: string
    github?: string
    instagram?: string
    mainLink?: string
    twitter?: string
    vk?: string
    website?: string
    youtube?: string
  }
  fullName?: string
  lookingForAJob?: boolean
  lookingForAJobDescription?: string
  photos?: {
    large?: string
    small?: string
  }
  userId?: number
}

export type GetUsersParamsType = {
  count: number
  page: number
  term?: string
  friend?: boolean
}
