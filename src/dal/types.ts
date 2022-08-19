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



/*

interface MyKnownError {
  errorMessage: string
  // ...
}
interface UserAttributes {
  id: string
  first_name: string
  last_name: string
  email: string
}

const updateUser = createAsyncThunk<
  // Return type of the payload creator
  MyData,
  // First argument to the payload creator
  UserAttributes,
  // Types for ThunkAPI
  {
    extra: {
      jwt: string
    }
    rejectValue: MyKnownError
  }
>('users/update', async (user, thunkApi) => {
  const { id, ...userData } = user
  const response = await fetch(`https://reqres.in/api/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${thunkApi.extra.jwt}`,
    },
    body: JSON.stringify(userData),
  })
  if (response.status === 400) {
    // Return the known error for future handling
    return thunkApi.rejectWithValue((await response.json()) as MyKnownError)
  }
  return (await response.json()) as MyData
})

*/
