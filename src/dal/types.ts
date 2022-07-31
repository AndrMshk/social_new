export type ResponseTypeAPI<DATA = {}> = {
  messages: string[]
  resultCode: number
  data: DATA
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
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
  aboutMe: string
  userId: number
  lookingForAJob: boolean
  lookingForAJobDescription: string
  fullName: string
  contacts: {
    github: string
    vk: string
    facebook: string
    instagram: string
    twitter: string
    website: string
    youtube: string
    mainLink: string
  }
  photos: {
    small: string
    large: string
  }
}

export type getUsersParamsType = {
  currentPage?: number,
  pageSize?: number,
  friend?: boolean
}

export type ttt = {
  items: {
    name: string
    id: number
    photos: {
      small: string
      large: string
    }
    status: string
    followed: boolean
  }
  totalCount: number
  error: string
}

type xxx = {
  count: number

  page: number

  term: string

  friend: boolean
}

