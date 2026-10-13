
import { apiConnector } from "../apiConnector"
import { dsaEndpoints } from "../apis"

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})

export async function getDSAProblems(token) {
  const response = await apiConnector(
    "GET",
    dsaEndpoints.GET_PROBLEMS_API,
    null,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(response.data.message || "Could not load problems")
  }

  return response.data.data
}

export async function createDSAProblem(problemData, token) {
  const response = await apiConnector(
    "POST",
    dsaEndpoints.CREATE_PROBLEM_API,
    problemData,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(response.data.message || "Could not add problem")
  }

  return response.data.data
}

export async function updateDSAProblem(id,problemData,token) {
  const response = await apiConnector(
    "PATCH",
    `${dsaEndpoints.UPDATE_PROBLEM_API}/${id}`,
    problemData,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(response.data.message || "Could not update problem")
  }

  return response.data.data
}

export async function deleteDSAProblem(id,token) {
  const response = await apiConnector(
    "DELETE",
    `${dsaEndpoints.DELETE_PROBLEM_API}/${id}`,
    null,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(response.data.message || "Could not delete problem")
  }

  return response.data
}
