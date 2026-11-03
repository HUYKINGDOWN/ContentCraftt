import type { WorkspaceData } from '../types'

export const seed: WorkspaceData = {
  brands: [],
  products: [],
  audiences: [],
  contents: [],
  users: [
    {
      id: '1',
      name: 'System Administrator',
      email: 'admin@contentcraft.io',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Nguyễn Văn User (Creator)',
      email: 'user@contentcraft.io',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Brand Director (Owner)',
      email: 'owner@contentcraft.io',
      role: 'BrandOwner',
      status: 'Active',
    },
  ],
}
