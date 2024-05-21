const ERROR_MSG = {
  NOT_FOUND: (entity: string) => `${entity} not found!!`,
  ALREADY_EXIST: (entity: string) => `${entity} already exist!!`,
  FAILED_TO_UPDATE: (entity: string) => `Failed to update ${entity}!!`,
  INVALID_PASSWORD: 'Password Invalid!!',
  NO_USER_WITH_ROLE: 'No user found with this role!!',
  NAME_TAKEN: (entity: string) =>
    `${entity} is not available. Try different name.`,
  NO_CONTENT: (entity: string) => `There is not any ${entity}` 
}

const SUCCESS_MSG = {
  DELETE: (entity: string) => `${entity} deleted successfully!!`,
  LOGIN: 'Login Successful!!'
}

export { ERROR_MSG, SUCCESS_MSG }
