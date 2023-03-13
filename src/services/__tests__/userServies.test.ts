import { Model, Op } from "sequelize";
import { UserService } from "../UserServies";

const users = [
  {
    id: 10,
    login: 'login',
    password: 'password',
    age: 22,
    isDeleted: false
  },
  {
    id: 10,
    login: 'login',
    password: 'password',
    age: 22,
    isDeleted: false
  },
  {
    id: 10,
    login: 'login',
    password: 'password',
    age: 22,
    isDeleted: false
  },
  {
    id: 10,
    login: 'login',
    password: 'password',
    age: 22,
    isDeleted: false
  }
]

jest.mock('sequelize', () => ({
  ...jest.requireActual('sequelize'),
  DataTypes: jest.requireActual('sequelize').DataTypes,
  Sequelize: jest.fn(() => ({
    authenticate: jest.fn(),
    define: jest.fn(),
  })),
  Model: class {
    static init = jest.fn()
    static findAll = jest.fn(() => Promise.resolve(users))
    static findOne = jest.fn(() => Promise.resolve(users[0]))
    static create = jest.fn()
    static findByPk = jest.fn(() => Promise.resolve(users[0]))
    static update = jest.fn()
  }
}))

describe('User services', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call findAll on getUsers call', async () => {
    await UserService.getUsers()
    expect(Model.findAll).nthCalledWith(1, {
      where: {
        isDeleted: false
      }
    })
  })

  it('should call findAll on getAutoSuggestedUsers call with subst and no limit  correctly', async () => {
    const subStr = 'some subStr'
    const data = await UserService.getAutoSuggestedUsers(subStr)
    expect(Model.findAll).nthCalledWith(1, {
      where: {
        login: {
          [Op.substring]: subStr
        }
      }
    })
  })

  it('should call findAll on getAutoSuggestedUsers call without substr and no limit correctly', async () => {
    await UserService.getAutoSuggestedUsers()
    expect(Model.findAll).nthCalledWith(1, { 
      where: { 
        isDeleted: false 
      } 
    })
  })

  it('should return on getAutoSuggestedUsers call with substr and limit correct data', async () => {
    const limit = 2
    const data = await UserService.getAutoSuggestedUsers('some', limit)
    expect(data).toEqual(users.slice(0, limit))
  })
  

  it('should call findOne on getUserByLogin call', async () => {
    const login = 'some login'
    await UserService.getUserByLogin(login)
    expect(Model.findOne).nthCalledWith(1, {
      where: {
        login: {
          [Op.eq]: login
        }
      }
    })
  })

  it('should call create on createUser call correctly', async () => {
    const data = await UserService.createUser(users[0])
    expect(Model.create).nthCalledWith(1, users[0])
  })

  it('should call findByPk on getUser call correctly', async () => {
    const id = 3
    await UserService.getUser(id)
    expect(Model.findByPk).nthCalledWith(1, id)
  })

  it('should call update on deleteUser call correctly', async () => {
    const id = 3
    await UserService.deleteUser(id)
    expect(Model.update).nthCalledWith(1,
      {
        isDeleted: true
      },
      {
        where: {
          id
        }
      })
  })

  it('should call update on updateUser call', async () => {
    const id = 3
    await UserService.updateUser(id, users[1])
    expect(Model.update).nthCalledWith(1,
      users[1],
      {
        where: {
          id
        }
      })  })
})

