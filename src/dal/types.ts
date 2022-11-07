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

export type GetUsersParamsType = {
  count: number
  page: number
  term?: string
  friend?: boolean
}

export type ProfileObjType = { [key: string]: any } | null
export type UpdateProfileModelObjType = {[key: string]: any}
