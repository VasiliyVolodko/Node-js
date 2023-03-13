import { Model, Op, Sequelize, Transaction } from "sequelize";
import { GroupService } from "../GroupServies";
import type { Permission } from '../../validation/groupShema'
import { db } from "../../data/config";

const groups = [
  {
    id: 10,
    name: 'name',
    permissions: ['READ', 'WRITE'] as Array<Permission>
  },
  {
    id: 10,
    name: 'name',
    permissions: ['READ', 'WRITE'] as Array<Permission>
  },
  {
    id: 10,
    name: 'name',
    permissions: ['READ', 'WRITE'] as Array<Permission>
  },
  {
    id: 10,
    name: 'name',
    permissions: ['READ', 'WRITE'] as Array<Permission>
  },
]

jest.mock('sequelize', () => ({
  ...jest.requireActual('sequelize'),
  Sequelize: jest.fn(() => ({
    authenticate: jest.fn(),
    define: jest.fn(),
    transaction: jest.fn(f => f())
  })),
  Model: class {
    static init = jest.fn()
    static belongsToMany = jest.fn()
    static findAll = jest.fn(() => Promise.resolve(groups))
    static findOne = jest.fn(() => Promise.resolve(groups[0]))
    static create = jest.fn()
    static findByPk = jest.fn(() => Promise.resolve(groups[0]))
    static update = jest.fn()
    static destroy = jest.fn()
  }
}))

jest.mock('../../data/config', () => ({
  db: new Sequelize()
}))

describe('User services', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call findAll on getGroups call', async () => {
    await GroupService.getGroups()
    expect(Model.findAll).toBeCalledTimes(1)
  })

  it('should call create on createGroup call', async () => {
    await GroupService.createGroup(groups[0])
    expect(Model.create).nthCalledWith(1, groups[0])
  })

  it('should call findByPk on getGroup call', async () => {
    const id = 3
    await GroupService.getGroup(id)
    expect(Model.findByPk).nthCalledWith(1, id)
  })

  it('should call destroy on deleteGroup call', async () => {
    const id = 3
    await GroupService.deleteGroup(id)
    expect(Model.destroy).nthCalledWith(1, {
      where: {
        id
      }
    })
  })

  it('should call update on updateGroup call', async () => {
    const id = 3
    await GroupService.updateGroup(id, groups[0])
    expect(Model.update).nthCalledWith(1,
      groups[0],
      {
        where: {
          id
        }
      }
    )
  })

  it('should call transaction on addUsersToGroup call', async () => {
    const id = 3
    const usersIds = [1, 3, 4, 5]
    await GroupService.addUsersToGroup(id, usersIds)
    usersIds.map(user_id => {
      expect(Model.create).toBeCalledWith({
        group_id: id,
        user_id: user_id
      })
    })
    expect(Model.create).toBeCalledTimes(usersIds.length)
    expect(db.transaction).toBeCalledTimes(usersIds.length)
  })

  it('should throw error in case of rejected transaction', async () => {
    const id = 3
    const usersIds = [1, 3, 4, 5]
    const error = new Error()
    Model.create = jest.fn()
      .mockImplementationOnce(() => Promise.reject(error))
    console.log = jest.fn()
    await GroupService.addUsersToGroup(id, usersIds)
    expect(console.log).nthCalledWith(1, error)
  })
})