import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ROLE_IDS, type RoleId } from '@/entities/role'
import { DEMO_ROLE_KEY } from '@/shared/config/appSettings'

function readDemoRole(): RoleId {
  if (typeof localStorage === 'undefined') return 'admin'
  const raw = localStorage.getItem(DEMO_ROLE_KEY)
  if (raw && (ROLE_IDS as readonly string[]).includes(raw)) {
    return raw as RoleId
  }
  return 'admin'
}

type DemoRoleState = {
  role: RoleId
}

const initialState: DemoRoleState = {
  role: readDemoRole(),
}

const demoRoleSlice = createSlice({
  name: 'demoRole',
  initialState,
  reducers: {
    setDemoRole: (state, action: PayloadAction<RoleId>) => {
      state.role = action.payload
      localStorage.setItem(DEMO_ROLE_KEY, action.payload)
    },
  },
})

export const { setDemoRole } = demoRoleSlice.actions
export const demoRoleReducer = demoRoleSlice.reducer
